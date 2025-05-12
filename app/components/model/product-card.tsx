import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [discountData, setDiscountData] = useState<any>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*, category(name)')
        .eq('productid', productId)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        return;
      }

      const { data: discountData, error: discountError } = await supabase
        .from('discount')
        .select('*')
        .eq('productid', productId)
        .single();

      const now = new Date();

      if (discountData) {
        const startDate = new Date(discountData.start_date);
        const endDate = new Date(discountData.end_date);
        if (now >= startDate && now <= endDate) {
          setDiscountData(discountData);
        }
      }

      setProduct(productData);
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return (
      <div
        className={`${className} w-75 bg-[#7B5137] rounded-2xl p-4 shadow-lg text-white transform transition duration-300 hover:scale-105`}
      >
        <div className="rounded-2xl overflow-hidden">
          <div className="w-full h-25 md:h-50 bg-yellow-950 flex items-center justify-center rounded-2xl">
            <ClipLoader color="#E19517" size={50} />
          </div>
        </div>
        <div className="mt-3 px-2">
          <div className="flex justify-between gap-x-1 items-center">
            <h3 className="text-xs md:text-lg font-semibold leading-tight"></h3>
            <div>
              <span className="text-sm md:text-lg rounded-md border-1 px-1 py-0.5 font-medium whitespace-nowrap">
                ₱ 0.00
              </span>
            </div>
          </div>
          <p className="text-[10px] md:text-sm text-gray-200 mt-1"></p>
          <div className="flex justify-between items-end mt-3">
            <span className="bg-[#D4A373] text-[#7B5137] px-3 py-1 rounded-lg text-xs h-5 w-15 md:text-sm font-semibold"></span>
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
  }

  const imageUrl = product.img || null;
  const validImageUrl = imageUrl ? imageUrl.replace(/#/g, "%23") : null;

  const discountedPrice = discountData
    ? product.price - (product.price * discountData.percentage) / 100
    : null;

  return (
    <div
      className={`${className} w-75 bg-[#7B5137] rounded-2xl p-4 shadow-lg text-white transform transition duration-300 hover:scale-105 ${
        product.availability ? "cursor-pointer" : "cursor-not-allowed opacity-70"
      }`}
      onClick={product.availability ? onClicked : undefined}
    >
      <div className="relative rounded-2xl overflow-hidden">
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
        {!product.availability && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Unavailable</span>
          </div>
        )}
        {discountData && (
          <div className="absolute top-2 left-2 bg-[#E19517] text-white text-xs px-2 py-1 rounded-md shadow">
            {discountData.discount_percent}% OFF
          </div>
        )}
      </div>

      <div className="mt-3 px-2">
        <div className="flex justify-between gap-x-1 items-center">
          <h3 className="text-xs md:text-[17px] w-40 font-semibold leading-tight">
            {product.name}
          </h3>
          <div className="text-right">
            {discountData ? (
              <>
                <span className="text-xs md:text-xs line-through block text-gray-300">
                  ₱ {product.price.toFixed(2)}
                </span>
                <span className="text-sm md:text-lg font-bold text-amber-300">
                  ₱ {discountData.newprice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm md:text-lg font-medium">
                ₱ {product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <p className="text-[10px] mt-2 md:text-sm text-gray-200 h-15 line-clamp-3">
          {product.description}
        </p>

        <div className="flex justify-between items-end mt-3">
          <span className="bg-[#D4A373] text-[#7B5137] px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
            {category}
          </span>
          <button
            className="group bg-transparent p-2 rounded-full border border-gray-200 cursor-pointer hover:bg-amber-50 transition duration-300"
            disabled={!product.availability}
          >
            <ShoppingCart
              className={`${
                product.availability
                  ? "text-amber-50 group-hover:text-[#7B5137]"
                  : "text-gray-400"
              } transition duration-300`}
              size={18}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
