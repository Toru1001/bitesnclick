import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/app/lib/supabase";
import { ChevronDown } from "lucide-react";
import ViewProduct from "./view-product";
import EditProduct from "./edit-product";
import ConfirmationModal from "@/app/components/modal/confirmation_modal";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

const ProductsTable = () => {
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [viewProduct, setViewProduct] = useState<boolean>(false);
  const [selectProduct, setSelectProduct] = useState<any>(null);
  const [editProduct, setEditProduct] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      product.price?.toString().includes(search) ||
      (product.category?.toLowerCase().includes(search.toLowerCase()) ??
        false) ||
      (product.availability?.toLowerCase().includes(search.toLowerCase()) ??
        false);

    const matchesAvailability =
      availabilityFilter === "All" ||
      product.availability === availabilityFilter;

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;

    return matchesSearch && matchesAvailability && matchesCategory;
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`*, categoryid(name)`)
        .eq("isarchive", false);

      if (error) {
        alert("Connection timeout");
        console.error("Error fetching products:", error);
        return;
      }

      const mapped = data.map((product) => ({
        id: product.productid,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.categoryid?.name,
        categoryid: product.categoryid?.categoryid,
        availability: product.availability ? "Available" : "Unavailable",
        isArchive: product.isarchive,
        img: product.img,
      }));

      const categoryList = Array.from(
        new Set(mapped.map((p) => p.category).filter(Boolean))
      );

      setProducts(mapped);
      setCategories(categoryList);
      setLoading(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setLoading(false);
    }
  };

  const handleAvailabilityUpdate = async (
    productId: number,
    newAvailability: string
  ) => {
    try {
      const updated = await supabase
        .from("products")
        .update({
          availability: newAvailability === "Available" ? true : false,
        })
        .eq("productid", productId);

      if (updated.error) {
        throw updated.error;
      }

      fetchProducts();
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating product.");
    }
  };

  const handleArchive = async (product: any) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ isarchive: !product.archive })
        .eq("productid", product.id);

      if (error) {
        throw error;
      }
      alert("Product archived.");
      router.replace("/admin/archives");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4 border-1 border-gray-500"
        />
        <span className="text-sm">Availability:</span>
        <Select
          value={availabilityFilter}
          onValueChange={setAvailabilityFilter}
        >
          <SelectTrigger className="w-1/6 border-1 border-gray-400">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className="border-1 border-gray-400">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm">Category:</span>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-1/6 border-1 border-gray-400">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="border-1 border-gray-400">
            <SelectItem value="All">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading && (
          <div className="inset-0 z-40 bg-white/60 w-full h-100 flex items-center justify-center rounded-lg">
            <ClipLoader color="#E19517" size={50} />
          </div>
        )}
        {!loading && (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
          
        </TableHeader>
        
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.description.length > 25
                    ? `${product.description.slice(0, 30)}...`
                    : product.description}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₱ {product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={product.availability}
                    onValueChange={(newStatus) =>
                      handleAvailabilityUpdate(product.id, newStatus)
                    }
                  >
                    <SelectTrigger
                      className={`w-35 ${
                        product.availability === "Available"
                          ? "bg-yellow-50 text-black"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <SelectValue placeholder={product.availability} />
                    </SelectTrigger>
                    <SelectContent className="border-1 border-gray-400">
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-1 py-2 border-1 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold text-sm rounded cursor-pointer">
                      Action
                      <ChevronDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-1 border-gray-400">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectProduct(product);
                          setViewProduct(true);
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectProduct(product);
                          setEditProduct(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectProduct(product);
                          setConfirmation(true);
                        }}
                      >
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
        )}

      {viewProduct && (
        <ViewProduct
          onClose={() => setViewProduct(false)}
          product={selectProduct}
        />
      )}
      {editProduct && (
        <EditProduct
          product={selectProduct}
          onClose={() => setEditProduct(false)}
        />
      )}
      {confirmation && (
        <ConfirmationModal
          buttonText="Confirm"
          description="Are you sure you want to archive product?"
          title="Archive Product"
          onClose={() => {
            setConfirmation(false);
          }}
          onConfirm={() => {
            handleArchive(selectProduct);
          }}
        />
      )}
    </div>
  );
};

export default ProductsTable;
