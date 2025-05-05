"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import ConfirmationModal from "../modal/confirmation_modal";

interface CartProductsCardProps {
    cartitemsId: string;
    cartid: string;
    onTotalPriceChange?: (totalPrice: number) => void; // New prop
}

const CartProductsCard: React.FC<CartProductsCardProps> = ({
    cartitemsId,
    cartid,
    onTotalPriceChange,
}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [showRemoveConfirmationModal, setShowRemoveConfirmationModal] = useState(false);
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
                    category: productData.category?.name,
                    productid: cartItem.productid,
                });
                setQuantity(cartItem.quantity);
            } catch (error) {
                console.error("Error fetching cart item or product:", error);
            }
        };

        fetchCartItem();
        calculateTotalPrice();
    }, [cartid, cartitemsId]);

    const updateQuantity = async (newQuantity: number) => {
        if (!product) return;

        try {
            const totalPrice = product.price * newQuantity;

            const { error } = await supabase
                .from("cart_items")
                .update({ quantity: newQuantity, total_price: totalPrice })
                .eq("cart_itemsid", cartitemsId);

            if (error) throw error;

            setQuantity(newQuantity);
            calculateTotalPrice();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const calculateTotalPrice = async () => {
        try {
            const { data: cartItems, error } = await supabase
                .from("cart_items")
                .select("total_price")
                .eq("cartid", cartid);

            if (error) throw error;

            const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);

            console.log("Total Price:", totalPrice);
            if (onTotalPriceChange) {
                onTotalPriceChange(totalPrice);
            }
        } catch (error) {
            console.error("Error calculating total price:", error);
        }
    };

    const removeItem = async () => {
        try {
            const { error } = await supabase
                .from("cart_items")
                .delete()
                .eq("cart_itemsid", cartitemsId);

            if (error) throw error;

            setShowRemoveConfirmationModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    if (!product) {
        return <div></div>;
    }

    return (
        <div className="flex justify-center items-center px-10 py-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            {/* Product Details */}
            <div className="flex w-150">
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
                    <span className="bg-[#E19517] text-amber-50 w-fit px-3 py-1 rounded-lg text-xs md:text-sm font-semibold">
                        {product.category}
                    </span>
                </div>
            </div>
            {/* Others */}
            <div className="flex justify-between w-full mt-5">
                <span className="text-lg font-medium text-gray-950">
                    ₱ {product.price.toFixed(2)}
                </span>
                <div className="flex justify-center gap-x-2">
                    <button
                        onClick={() => quantity > 1 && updateQuantity(quantity - 1)}
                        className="text-amber-50 h-7 bg-[#E19517] hover:bg-yellow-600 rounded-sm cursor-pointer"
                    >
                        <Minus />
                    </button>
                    <input
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!isNaN(value) && value > 0) {
                                updateQuantity(value);
                            }
                        }}
                        value={quantity}
                        type="text"
                        className="border-1 border-gray-300 rounded-xs w-10 h-7 text-center text-sm"
                    />
                    <button
                        onClick={() => updateQuantity(quantity + 1)}
                        className="text-amber-50 h-7 bg-[#E19517] hover:bg-yellow-600 rounded-sm cursor-pointer"
                    >
                        <Plus />
                    </button>
                </div>
                <span className="text-lg font-medium text-gray-950">
                    ₱ {(product.price * quantity).toFixed(2)}
                </span>
                <button
                    className="border-2 border-[#E19517] rounded-lg py-1 px-2 cursor-pointer text-[#E19517] text-sm font-medium"
                    onClick={() => setShowRemoveConfirmationModal(true)}
                >
                    Remove
                </button>
            </div>
            {showRemoveConfirmationModal && (
                <ConfirmationModal
                    onClose={() => setShowRemoveConfirmationModal(false)}
                    onConfirm={removeItem}
                    buttonText="Remove"
                    title="Remove Item"
                    description="Are you sure you want to remove item on cart?"
                />
            )}
        </div>
    );
};

export default CartProductsCard;