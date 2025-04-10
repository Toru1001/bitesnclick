import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type ProductCardProps = {
  productId: number;
  className: string;
  category: string;
  onClicked: () => void | Promise<void>;
};

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  className,
  category,
  onClicked,
}) => {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category(name)')
        .eq('productid', productId)
        .single();

      if (error) {
        console.error("Error fetching product details:", error);
      } else {
        console.log("Fetched product data:", data);
        setProduct(data);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <>
    <div className={`${className} w-75 bg-[#7B5137] rounded-2xl p-4 shadow-lg text-white transform transition duration-300 hover:scale-105`}>
      <div className="rounded-2xl overflow-hidden">
          <div className="w-full h-25 md:h-50 bg-gray-300 flex items-center justify-center rounded-2xl">
            <span className="text-gray-500">Loading...</span>
          </div>
      </div>
      <div className="mt-3 px-2">
        <div className="flex justify-between gap-x-1 items-center">
          <h3 className="text-xs md:text-lg font-semibold leading-tight">
            
          </h3>
          <div>
            <span className="text-sm md:text-lg rounded-md border-1 px-1 py-0.5 font-medium whitespace-nowrap">
              ₱ 
            </span>
          </div>
        </div>
        <p className="text-[10px] md:text-sm text-gray-200 mt-1">
          
        </p>
        <div className="flex justify-between items-end mt-3">
          <span className="bg-[#D4A373] text-[#7B5137] px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
            
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
    </>; 
  }
  const imageUrl = product.img || null;
  const validImageUrl = imageUrl ? imageUrl.replace(/#/g, '%23') : null;
  return (
    <div className={`${className} w-75 bg-[#7B5137] rounded-2xl p-4 shadow-lg text-white transform transition duration-300 hover:scale-105 cursor-pointer`} onClick={onClicked}>
      <div className="rounded-2xl overflow-hidden">
        {validImageUrl ? (
          <Image
            src={validImageUrl}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-25 md:h-50 object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-25 md:h-50 bg-gray-300 flex items-center justify-center rounded-2xl">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
      </div>
      <div className="mt-3 px-2">
        <div className="flex justify-between gap-x-1 items-center">
          <h3 className="text-xs md:text-lg font-semibold leading-tight">
            {product.name}
          </h3>
          <div>
            <span className="text-sm md:text-lg rounded-md border-1 px-1 py-0.5 font-medium whitespace-nowrap">
              ₱ {product.price.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-[10px] mt-2 md:text-sm text-gray-200 h-15 line-clamp-3">
          {product.description}
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