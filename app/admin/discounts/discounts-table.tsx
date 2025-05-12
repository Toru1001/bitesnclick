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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/app/lib/supabase";
import { ChevronDown } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import ViewDiscount from "./view-discount";
import EditDiscountModal from "./edit-discount";

const DiscountsTable = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [viewDiscount, setViewDiscount] = useState<boolean>(false);
  const [editDiscount, setEditDiscount] = useState<boolean>(false);
  const [selectProduct, setSelectProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      product.price?.toString().includes(search) ||
      product.discountedPrice?.toString().includes(search) ||
      product.percent?.toString().includes(search) 

    return matchesSearch;
  });

  const fetchDiscountedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
      .from("discount")
      .select("*, products(productid, name, price, img)")

      if (error) {
        alert("Connection timeout");
        console.error("Error fetching products:", error);
        return;
      }

      const mapped = data.map((product) => ({
        discountid: product.discountid,
        productid: product.productid,
        name: product.products.name,
        price: product.products.price,
        discountedPrice: product.newprice,
        percent: product.discount_percent,
        start_date: product.start_date,
        end_date: product.end_date,
        img: product.products.img
      }));
      setProducts(mapped);
      setLoading(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountedProducts();
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
            <TableHead>Discount</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discounted Price</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
          
        </TableHeader>
        
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.discountid}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.percent}%</TableCell>
                <TableCell>₱ {product.price.toFixed(2)}</TableCell>
                <TableCell>₱ {product.discountedPrice.toFixed(2)}</TableCell>
                <TableCell>{product.start_date}</TableCell>
                <TableCell>{product.end_date}</TableCell>
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
                          setViewDiscount(true);
                        }}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectProduct(product);
                          setEditDiscount(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </Table>
        )}

      {viewDiscount && (
        <ViewDiscount
          onClose={() => setViewDiscount(false)}
          product={selectProduct}
        />
      )}
      {editDiscount && (
        <EditDiscountModal
          product={selectProduct}
          onClose={() => setEditDiscount(false)}
        />
      )}
      {/* {confirmation && (
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
      )} */}
    </div>
  );
};

export default DiscountsTable;
