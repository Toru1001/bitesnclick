"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const CreateDiscountForm = () => {
  const [products, setProducts] = useState<
    { id: number; name: string; price: number }[]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("productid, name, price");

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        const formattedProducts = data.map((product) => ({
          id: product.productid,
          name: product.name,
          price: product.price,
        }));
        setProducts(formattedProducts);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const price = productPrice;
    const discount = discountPercent;

    if (!isNaN(price) && !isNaN(discount)) {
      const discounted = price - price * (discount / 100);
      setNewPrice(parseFloat(discounted.toFixed(2)));
    } else {
      setNewPrice(0);
    }
  }, [productPrice, discountPercent]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    const selected = products.find((p) => p.id === parseInt(productId));
    if (selected) {
      setProductPrice(selected.price);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(discountPercent)) {
      console.error("Invalid discount percentage");
      return;
    }

    const { data, error } = await supabase.from("discount").insert([
      {
        productid: parseInt(selectedProduct),
        discount_percent: discountPercent,
        newprice: newPrice,
        start_date: startDate,
        end_date: endDate,
      },
    ]);

    if (error) {
      console.error("Error creating discount:", error);
    } else {
      console.log("Data returned:", data);
      setSuccessMessage("Discount successfully created!");
      setSelectedProduct("");
      setProductPrice(0);
      setDiscountPercent(0);
      setNewPrice(0);
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      {successMessage && (
        <p className="text-green-600 mb-2">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col h-100 justify-between">
        <div className="flex justify-between space-x-4">
          <div className="flex flex-col w-125 gap-y-5">
            <div className="flex flex-col gap-y-2">
              <label>Select Product</label>
              <select
                value={selectedProduct}
                onChange={handleProductChange}
                className="border p-2 rounded border-gray-400"
              >
                <option value="">-- Choose Product --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-y-2">
              <label>Discount</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={discountPercent || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDiscountPercent(val === "" ? 0 : Number(val));
                  }}
                  placeholder="Discount %"
                  className="border p-2 rounded border-gray-400"
                />

                <span className="ml-2">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded border-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col w-125 gap-y-5">
            <div className="flex flex-col gap-y-2">
              <label>Product Price</label>
              <input
                type="number"
                placeholder="Product Price"
                value={productPrice || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setProductPrice(val === "" ? 0 : parseFloat(val));
                }}
                className="border p-2 rounded border-gray-400"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label>Discounted Price</label>
              <input
                type="text"
                value={`₱ ${!isNaN(newPrice) ? newPrice.toFixed(2) : "0.00"}`}
                disabled
                className="border p-2 rounded bg-gray-100 border-gray-400"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-x-5 justify-end mt-4">
          <div className="col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault(); 
                router.back();
              }}
              className="border-1 border-[#E19517]  text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#E19517] text-white px-4 py-2 rounded hover:bg-[#E19517]/80 cursor-pointer"
            >
              Create New Discount
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscountForm;
