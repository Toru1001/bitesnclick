"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

interface OrderDetailsCardProps {
    orderId: number;
    onTotalPrice: (totalPrice: number) => void;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ orderId, onTotalPrice}) => {
    const [orderItems, setOrderItems] = useState<any>(null);

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const { data, error } = await supabase
                    .from("orderdetails")
                    .select("*, products(name, img, category(name))")
                    .eq("orderid", orderId);

                if (error) throw error;
                const totalPrice = data.reduce(
                    (acc: number, item: any) => acc + item.price,
                    0
                );
                const orderItems = data ? data : null;
                setOrderItems(orderItems);
                onTotalPrice(totalPrice);
            } catch (error) {
                console.error("Error fetching order items:", error);
            }
        };
        fetchOrderItems();
    }, [orderId, onTotalPrice]);

    return (
        orderItems && (
            <div className="flex flex-col gap-y-2 sm:gap-y-3 border-b border-gray-200">
                {/* Product Details */}
                {orderItems.map((item: any) => (
                    <div key={item.id} className="flex gap-x-2 sm:gap-x-3 md:gap-x-5 w-full px-3 sm:px-6 md:px-10 py-2 sm:py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-x-2 sm:gap-x-3 md:gap-x-5 flex-1">
                            <div className="flex-shrink-0">
                                <Image
                                    src={item.products.img}
                                    alt={item.products.name}
                                    width={300}
                                    height={200}
                                    className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-y-1">
                                <span className="text-xs sm:text-sm md:text-base font-medium text-gray-950">
                                    {item.products.name}
                                </span>
                                <span className="bg-[#E19517] text-amber-50 w-fit px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-semibold">
                                    {item.products.category.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between gap-x-2 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 min-w-[180px] sm:min-w-[240px] md:min-w-[280px] items-center">
                            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-950 text-center w-[50px] sm:w-[60px]">₱{(item.prod_price).toFixed(2)}</span>
                            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-950 text-center w-[50px] sm:w-[60px]">x{item.quantity}</span>
                            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#E19517] text-right w-[60px] sm:w-[80px] md:w-[100px]">₱{item.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    );
};

export default OrderDetailsCard;
