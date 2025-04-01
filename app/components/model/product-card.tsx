import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

type ProductCardProps = {
  image: string;
  itemName: string;
  description: string;
  category: string;
  price: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  itemName,
  description,
  category,
  price,
}) => {
  return (
    <div className="w-75 bg-[#7B5137] rounded-2xl p-4 shadow-lg text-white transform transition duration-300 hover:scale-105">
      <div className="rounded-2xl overflow-hidden">
        <Image
          src={image}
          alt={itemName}
          width={300}
          height={200}
          className="w-full h-25 md:h-50 object-cover rounded-2xl"
        />
      </div>
      <div className="mt-3 px-2">
        <div className="flex justify-between gap-x-1 items-center">
          <h3 className="text-xs md:text-lg font-semibold leading-tight">
            {itemName}
          </h3>
          <div>
            <span className="text-sm md:text-lg rounded-md border-1 px-1 py-0.5 font-medium whitespace-nowrap">
              ₱ {price.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-[10px] md:text-sm text-gray-200 mt-1">
          {description}
        </p>
        <div className="flex justify-between items-end mt-3">
          <span className="bg-[#D4A373] text-[#7B5137] px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
            {category}
          </span>
          <button className="group bg-transparent p-2 rounded-full border border-gray-200 cursor-pointer hover:bg-amber-50 transition duration-300">
            <ShoppingCart
              className="text-amber-50 group-hover:text-[#7B5137] transition duration-300"
              size={18}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
