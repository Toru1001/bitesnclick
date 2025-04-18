"use client";
import { useEffect, useState } from "react";
import CartProductsCard from "../components/model/carts-products-card";
import { supabase } from "../lib/supabase";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";

export default function Home() {
  const [cartItemsId, setCartItemsId] = useState<string[] | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showtotalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchCartData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data: cartData, error: cartError } = await supabase
          .from("cart")
          .select("cartid")
          .eq("customerid", user?.id)
          .single();

        if (cartError) {
          console.error("Error fetching cart:", cartError);
          setCartItemsId(null);
          return;
        }

        if (cartData) {
          setCartId(cartData.cartid);
          const { data: itemsData, error: itemsError } = await supabase
            .from("cart_items")
            .select("cart_itemsid")
            .eq("cartid", cartData.cartid);

          if (itemsError) {
            console.error("Error fetching cart items:", itemsError);
            setCartItemsId(null);
            return;
          }

          if (itemsData && itemsData.length > 0) {
            setCartItemsId(itemsData.map((item) => item.cart_itemsid));
          } else {
            setCartItemsId(null);
          }
        } else {
          setCartItemsId(null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setCartItemsId(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCartData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#E19517" size={50} />
      </div>
    );
  }

  const handleTotalPriceChange = (totalPrice: number) => {
    console.log("Total price updated:", totalPrice);
    setTotalPrice(totalPrice);
  };

  return (
    <>
      <div className="mt-5 mx-6 md:mx-30 relative overflow-hidden">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Cart
        </span>
        <div className="flex mt-5 py-5 px-10 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <span className="w-150">Product</span>
          <div className="flex justify-between w-full">
            <span>Unit Price</span>
            <span>Quantity</span>
            <span>Total Price</span>
            <span>Actions</span>
          </div>
        </div>
        <div className="mt-5 h-[calc(100vh-380px)] overflow-y-auto">
          {cartItemsId && cartItemsId.length > 0 ? (
            cartItemsId.map((id) => (
              <CartProductsCard key={id} cartitemsId={id} cartid={cartId || ""}  onTotalPriceChange={handleTotalPriceChange}/>
            ))
          ) : (
            <span className="flex justify-center text-gray-500">No items added to cart.</span>
          )}
        </div>
        {/* footer for checkout */}
        <div className="left-0 w-full flex gap-x-5 justify-end my-5 bg-white px-6 py-5 shadow-[0px_-4px_16px_rgba(17,17,26,0.1)]">
          <div className="flex flex-col items-end">
            <span className="text-gray-950">Order Total:</span>
            <span className="text-2xl text-[#E19517] font-semibold">₱ {showtotalPrice}.00</span>
          </div>
          <button className="border-2 border-[#E19517] bg-[#E19517] px-5 py-3 rounded-lg cursor-pointer text-amber-50 font-medium" onClick={() => router.push("/cart/checkout")}>
            Check Out
          </button>
        </div>
      </div>
    </>
  );
}