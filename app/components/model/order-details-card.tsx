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
                    .select("*, products(name, img, price, category(name))")
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
            <div className="flex flex-col justify-center border-b-1 border-gray-300 items-center px-10 py-3">
                {/* Product Details */}
                {orderItems.map((item: any) => (
                    <div key={item.id} className="flex items-center w-full">
                        <div className="flex w-250">
                            <Image
                                src={item.products.img}
                                alt={item.products.name}
                                width={300}
                                height={200}
                                className="w-25 h-15 md:h-25 object-cover rounded-2xl"
                            />
                            <div className="flex flex-col justify-center ml-5">
                                <span className="text-lg font-medium text-gray-950">
                                    {item.products.name}
                                </span>
                                <span className="bg-[#E19517] text-amber-50 w-fit px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
                                    {item.products.category.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <span className="text-lg font-medium text-gray-950">₱{item.products.price}</span>
                            <span className="text-lg font-medium text-gray-950">x{item.quantity}</span>
                            <span className="text-lg font-medium text-gray-950">₱{item.price.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        )
    );
};

export default OrderDetailsCard;
