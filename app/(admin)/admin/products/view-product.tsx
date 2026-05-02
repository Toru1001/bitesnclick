"use client";

import React from "react";
import Image from "next/image";
import { PenLine, X } from "lucide-react";

interface ViewProductProps {
  onClose: () => void;
  product: any;
  onChange: () => void;
}

const safeText = (value: any) =>
  typeof value === "string" ? value.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";

const ViewProduct: React.FC<ViewProductProps> = ({ onClose, product, onChange }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const safeImage = typeof product?.img === "string" ? product.img : "";
  const safeName = safeText(product?.name);
  const safeCategory = safeText(product?.category);
  const safeDescription = safeText(product?.description);
  const safeAvailability = product?.availability ?? "Unknown";
  const safePrice = Number(product?.price) || 0;

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
          className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>

        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">View Product</span>
        </div>

        <div className="flex flex-col md:flex-row gap-x-10 mt-5 justify-between">
          
          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden">
            <Image
              src={safeImage || "/placeholder.png"}
              alt={safeName || "Product Image"}
              width={200}
              height={200}
              className="w-90 h-60 md:h-100 object-cover rounded-2xl"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col mt-5 md:mt-0 w-80 justify-between items-center h-110 md:h-auto">
            <div>
              <div className="flex flex-col">
                <span className="font-light text-gray-500">
                  {safeCategory}
                </span>

                <span className="font-semibold text-2xl">
                  {safeName}
                </span>

                <span className="font-bold text-2xl mt-5">
                  <span className="font-extralight text-3xl">₱</span>{" "}
                  {safePrice}.00
                </span>

                <div className="flex gap-3 mt-2 text-sm">
                  <span
                    className={
                      safeAvailability === "Available"
                        ? "px-2 py-1 rounded-2xl border-1 border-[#E19517] bg-[#E19517] text-amber-50 "
                        : "px-2 py-1 rounded-2xl border-1 border-[#E19517] bg-amber-50 text-[#E19517]"
                    }
                  >
                    {safeAvailability}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-5 text-xs text-justify overflow-scroll line-clamp-8 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none ">
                <span className="text-gray-500 text-sm">Description:</span>
                <span>{safeDescription}</span>
              </div>
            </div>

            <div className="flex justify-center my-5">
              <button
                className="flex gap-x-2 items-center text-lg border-1 border-[#E19517] text-amber-50 bg-[#E19517] hover:bg-amber-50 hover:text-[#E19517] rounded-lg px-5 py-2 cursor-pointer"
                onClick={onChange}
              >
                <span>Edit</span>
                <PenLine size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;