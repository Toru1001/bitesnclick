import { supabase } from "@/lib/supabase/client";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Product {
  discountid: number;
  name: string;
  price: number;
  percent: number;
  discountedPrice: number;
  start_date: string;
  end_date: string;
}

interface EditProductProps {
  onClose: () => void;
  product: Product;
}

const isValidNumber = (value: any) =>
  typeof value === "number" && Number.isFinite(value);

const sanitizePercent = (value: number) => {
  if (!isValidNumber(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

const isValidDateRange = (start: string, end: string) => {
  if (!start || !end) return true;
  return new Date(end) >= new Date(start);
};

const EditDiscountModal: React.FC<EditProductProps> = ({ onClose, product }) => {
  const [productPrice] = useState<number>(product.price);
  const [discountPercent, setDiscountPercent] = useState<number>(product.percent);
  const [newPrice, setNewPrice] = useState<number>(product.discountedPrice);
  const [startDate, setStartDate] = useState<string>(product.start_date);
  const [endDate, setEndDate] = useState<string>(product.end_date);
  const [errors, setErrors] = useState<{ discountPercent?: string }>({});

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const safePercent = sanitizePercent(discountPercent);
    const safePrice = isValidNumber(productPrice) ? productPrice : 0;

    const discounted = safePrice - safePrice * (safePercent / 100);
    setNewPrice(Number(discounted.toFixed(2)));
  }, [productPrice, discountPercent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const safePercent = sanitizePercent(discountPercent);

    const newErrors: typeof errors = {};

    if (safePercent < 1 || safePercent > 100) {
      newErrors.discountPercent = "Discount must be between 1 and 100.";
    }

    if (!isValidDateRange(startDate, endDate)) {
      newErrors.discountPercent = "Invalid date range.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const computedPrice =
      productPrice - productPrice * (safePercent / 100);

    const { data, error } = await supabase
      .from("discount")
      .update({
        discount_percent: safePercent,
        newprice: Number(computedPrice.toFixed(2)),
        start_date: startDate,
        end_date: endDate,
      })
      .eq("discountid", Number(product.discountid));

    if (error) {
      console.error("Error updating discount:", error);
    } else {
      alert("Discount updated successfully!");
      onClose();
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={onClose}
        >
          <X className="text-[#240C03]" />
        </button>

        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">Edit Discount</span>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col h-90 justify-between">
            <div className="flex justify-between space-x-4">
              <div className="flex flex-col w-90 gap-y-5">
                <div className="flex flex-col gap-y-2">
                  <label>Select Product</label>
                  <input
                    type="text"
                    value={product.name}
                    readOnly
                    className="border p-2 rounded border-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label>Discount</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={discountPercent || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,3}$/.test(val)) {
                          setDiscountPercent(val === "" ? 0 : Number(val));
                        }
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className={`border p-2 rounded w-50 ${
                        errors.discountPercent ? "border-red-500" : "border-gray-500"
                      }`}
                    />
                    <span>%</span>
                  </div>
                  {errors.discountPercent && (
                    <span className="text-red-600 text-sm">
                      {errors.discountPercent}
                    </span>
                  )}
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

              <div className="flex flex-col w-90 gap-y-5">
                <div className="flex flex-col gap-y-2">
                  <label>Product Price</label>
                  <input
                    type="number"
                    value={productPrice}
                    readOnly
                    className="border p-2 rounded border-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label>Discounted Price</label>
                  <input
                    type="text"
                    value={`₱ ${newPrice.toFixed(2)}`}
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

            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#E19517] text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDiscountModal;