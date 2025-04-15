"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface EditDiscountProps {
  discount: any;
  onClose: () => void;
  onUpdate: () => void;
  fetchDiscounts: () => void;
  products: any[];
}

const EditDiscount = ({
  discount,
  onClose,
  onUpdate,
  fetchDiscounts,
  products,
}: EditDiscountProps) => {
  const [selectedProduct, setSelectedProduct] = useState(discount.products?.name || "");
  const [productPrice, setProductPrice] = useState<number>(discount.products?.price || 0);
  const [discountPercent, setDiscountPercent] = useState<number>(discount.discount_percent || 0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(discount.newprice || 0);
  const [startDate, setStartDate] = useState<string>(discount.start_date?.split("T")[0] || "");
  const [endDate, setEndDate] = useState<string>(discount.end_date?.split("T")[0] || "");
  const [selectedProductId, setSelectedProductId] = useState(discount.productid || "");

  // Log product info for debugging
  console.log("Initial discount product:", discount.products);
  console.log("Initial selectedProductId:", selectedProductId);

  useEffect(() => {
    // Log products array to check its contents
    console.log("Products array:", products);
    const found = products.find((p) => p.name === selectedProduct);
    if (found) {
      setProductPrice(found.price);
      console.log("Found product in products array:", found);
    }
  }, [selectedProduct, products]);

  useEffect(() => {
    const newPrice = productPrice - productPrice * (discountPercent / 100);
    if (!isNaN(newPrice)) {
      setDiscountedPrice(Number(newPrice.toFixed(2)));
    } else {
      setDiscountedPrice(0);
    }
  }, [productPrice, discountPercent]);

  const handleUpdate = async () => {
    console.log("Selected Product ID:", selectedProductId);  // Log selectedProductId
    console.log("Products array for update:", products);

    // Cast to string if needed to handle type mismatches
    const product = products.find((p) => String(p.productid) === String(selectedProductId));
    console.log("Matching Product:", product);  // Log matching product result

    if (!product) {
      console.error("Product not found in products array");
      return alert("Product not found");
    }

    console.log("Found Product:", product);

    const { error } = await supabase
      .from("discount")
      .update({
        productid: product.productid,
        discount_percent: discountPercent,
        newprice: discountedPrice,
        start_date: startDate,
        end_date: endDate,
      })
      .eq("discountid", discount.discountid);

    if (error) {
      console.error("Update error:", error.message);
      alert("Failed to update discount");
    } else {
      await fetchDiscounts();
      onUpdate();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Discounted Product</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Product</label>
            <select
  value={selectedProductId}
  onChange={(e) => {
    const selectedId = e.target.value;
    setSelectedProductId(selectedId);
    const foundProduct = products.find((p) => String(p.productid) === selectedId);
    if (foundProduct) {
      setSelectedProduct(foundProduct.name);
      setProductPrice(foundProduct.price);
    }
  }}
  className="w-full border rounded px-3 py-2"
>
  {products.map((product) => (
    <option key={product.productid} value={product.productid}>
      {product.name}
    </option>
  ))}
</select>



            <label className="block mt-4 text-sm font-semibold mb-1">Product Price</label>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
              <span className="mr-2">PHP</span>
              <input
                type="text"
                value={productPrice.toFixed(2)}
                readOnly
                className="bg-transparent w-full outline-none"
              />
            </div>

            <label className="block mt-4 text-sm font-semibold mb-1">Discount</label>
            <div className="flex items-center border rounded px-3 py-2">
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full outline-none"
              />
              <span className="ml-2">%</span>
            </div>

            <label className="block mt-4 text-sm font-semibold mb-1">Discounted Price</label>
            <div className="flex items-center border rounded px-3 py-2 bg-gray-100">
              <span className="mr-2">PHP</span>
              <input
                type="text"
                value={discountedPrice.toFixed(2)}
                readOnly
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <label className="block mt-4 text-sm font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDiscount;
