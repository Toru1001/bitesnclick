"use client";
import React, { useEffect, useState }  from "react";
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
import ViewProduct from "../products/view-product";
import EditProduct from "../products/edit-product";
import ConfirmationModal from "@/app/components/modal/confirmation_modal";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

const ArchivesTable = () => {
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

    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`*, categoryid(name)`)
        .eq("isarchive", true);

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



  const handleUnarchive = async (product: any) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ isarchive: false })
        .eq("productid", product.id);

      if (error) {
        throw error;
      }
      alert("Product unarchived.");
      fetchProducts();
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
                      className="text-[#E19517]"
                        onClick={() => {
                          setSelectProduct(product);
                          setConfirmation(true);
                        }}
                      >
                        Unarchive
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
          onChange={() => {
            setViewProduct(false);
            setEditProduct(true);
          }}
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
          description="Are you sure you want to unarchive product?"
          title="Unarchive Product"
          onClose={() => {
            setConfirmation(false);
          }}
          onConfirm={() => {
            handleUnarchive(selectProduct);
          }}
        />
      )}
    </div>
  );
};

export default ArchivesTable;
