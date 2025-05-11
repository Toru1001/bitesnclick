"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

interface OrderedProductsCardProps {
  cartitemsId: string;
  cartid: string;
}

const OrderedProductsCard: React.FC<OrderedProductsCardProps> = ({
  cartitemsId,
  cartid,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<{
    name: string;
    price: number;
    image: string;
    productid: string;
    category: string;
    availability: boolean;
  } | null>(null);

  const [discount, setDiscount] = useState<{
    newprice: number;
    start_date: string;
    end_date: string;
    discount_percent: number;
  } | null>(null);

  const [isDiscountActive, setIsDiscountActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const { data: cartItem, error: cartItemError } = await supabase
          .from("cart_items")
          .select("productid, quantity")
          .eq("cartid", cartid)
          .eq("cart_itemsid", cartitemsId)
          .single();

        if (cartItemError) throw cartItemError;

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*, category(name)")
          .eq("productid", cartItem.productid)
          .single();

        if (productError) throw productError;

        const productDetails = {
          name: productData.name,
          price: productData.price,
          image: productData.img,
          category: productData.category?.name,
          productid: cartItem.productid,
          availability: productData.availability,
        };

        setProduct(productDetails);
        setQuantity(cartItem.quantity);

        // Fetch discount
        const { data: discountData, error: discountError } = await supabase
          .from("discount")
          .select("*")
          .eq("productid", cartItem.productid)
          .single();

        if (discountError && discountError.code !== "PGRST116") {
          console.error("Error fetching discount:", discountError);
        } else if (discountData) {
          const now = new Date();
          const startDate = new Date(discountData.start_date);
          const endDate = new Date(discountData.end_date);
          const active = now >= startDate && now <= endDate;
          setIsDiscountActive(active);
          if (active) {
            setDiscount({
              newprice: discountData.newprice,
              start_date: discountData.start_date,
              end_date: discountData.end_date,
              discount_percent: discountData.discount_percent,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching cart item or product:", error);
      }
    };

    fetchCartItem();
  }, [cartid, cartitemsId]);

  if (!product) {
    return <div></div>;
  }

  const price = isDiscountActive && discount ? discount.newprice : product.price;
  const total = price * quantity;

  return (
    <div className="flex justify-center border-b-1 border-gray-300 items-center px-10 py-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      {/* Product Details */}
      <div className="flex w-250 relative">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={200}
          className="w-25 h-15 md:h-25 object-cover rounded-2xl"
        />
        {!product.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center w-25 justify-center rounded-2xl">
            <span className="text-white text-xs font-bold">Unavailable</span>
          </div>
        )}
        <div className="flex flex-col justify-center ml-5">
          <span className="text-lg font-medium text-gray-950">
            {product.name}
          </span>
          <span className="bg-[#E19517] w-fit text-amber-50 px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
            {product.category}
          </span>
        </div>
      </div>

      {/* Price, Quantity, and Total */}
      <div className="flex justify-between w-full">
        <span className="text-lg font-medium text-gray-950">
          ₱ {price.toFixed(2)}
        </span>
        <span className="text-lg font-medium text-gray-950">
          x{quantity}
        </span>
        <span className="text-lg font-medium text-gray-950">
          ₱ {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderedProductsCard;
