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
  const [errors, setErrors] = useState({
    selectedProduct: false,
    discountPercent: false,
    startDate: false,
    endDate: false,
  });

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
    if (!isNaN(productPrice) && !isNaN(discountPercent)) {
      const discounted = productPrice - productPrice * (discountPercent / 100);
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

    const newErrors = {
      selectedProduct: selectedProduct === "",
      discountPercent: discountPercent <= 0 || discountPercent > 100,
      startDate: startDate === "",
      endDate: endDate === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((val) => val);
    if (hasError) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert("End date cannot be before start date.");
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
      setSuccessMessage("Discount successfully created!");
      setSelectedProduct("");
      setProductPrice(0);
      setDiscountPercent(0);
      setNewPrice(0);
      setStartDate("");
      setEndDate("");
      setErrors({
        selectedProduct: false,
        discountPercent: false,
        startDate: false,
        endDate: false,
      });
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
                className={`border p-2 rounded ${errors.selectedProduct ? "border-red-500" : "border-gray-400"}`}
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  list="discount-options"
                  placeholder="Discount"
                  value={discountPercent || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,3}$/.test(val)) {
                      const num = parseFloat(val);
                      setDiscountPercent(val === "" ? 0 : num);
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`border p-2 rounded w-50 ${
                    errors.discountPercent ? "border-red-500" : "border-gray-500"
                  }`}
                />
                <datalist id="discount-options">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>
                <span>%</span>
              </div>
              {errors.discountPercent && (
                <span className="text-red-600 text-sm">
                  Discount must be between 1 and 100.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`border p-2 rounded ${errors.startDate ? "border-red-500" : "border-gray-400"}`}
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
                className={`border p-2 rounded ${errors.endDate ? "border-red-500" : "border-gray-400"}`}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-x-5 justify-end mt-4">
          <div className="col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="border-1 border-[#E19517] text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#E19517] text-white px-4 py-2 rounded hover:bg-[#E19517]/80 cursor-pointer"
            >
              Set Discount
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscountForm;
