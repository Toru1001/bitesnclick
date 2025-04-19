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
    cartid
}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [product, setProduct] = useState<{
        name: string;
        price: number;
        image: string;
        productid: string;
        category: string;
    } | null>(null);

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

                setProduct({
                    name: productData.name,
                    price: productData.price,
                    image: productData.img,
                    productid: cartItem.productid,
                    category: productData.category?.name,
                });
                setQuantity(cartItem.quantity);
            } catch (error) {
                console.error("Error fetching cart item or product:", error);
            }
        };

        fetchCartItem();
    }, [cartid, cartitemsId]);

    if (!product) {
        return <div></div>;
    }

    return (
        <div className="flex justify-center border-b-1 border-gray-300 items-center px-10 py-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            {/* Product Details */}
            <div className="flex w-250">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-25 h-15 md:h-25 object-cover rounded-2xl"
                />
                <div className="flex flex-col justify-center ml-5">
                    <span className="text-lg font-medium text-gray-950">
                        {product.name}
                    </span>
                    <span className="bg-[#D4A373] text-[#7B5137] px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
                        {product.category}
                    </span>
                </div>
            </div>
            {/* Others */}
            <div className="flex justify-between w-full">
                <span className="text-lg font-medium text-gray-950">
                    ₱ {product.price.toFixed(2)}
                </span>
                <span className="text-lg font-medium text-gray-950">x{quantity}</span>
                <span className="text-lg font-medium text-gray-950">
                    ₱ {(product.price * quantity).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default OrderedProductsCard;