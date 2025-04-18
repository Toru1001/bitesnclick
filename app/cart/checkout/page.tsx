"use client";
import ChangeAddressModal from "@/app/components/modal/changeAddress_modal";
import OrderedProductsCard from "@/app/components/model/ordered-products-card";
import { MapPin, MessageCircleMore, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import ClipLoader from "react-spinners/ClipLoader";
import PaymentMethodModal from "@/app/components/modal/payment_method_modal";


export default function Home() {
  const [changeAdress, setChangeAddress] = useState(false);
  const [showPaymentMethodModal, setPaymentMethodModal] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [cartItemsId, setCartItemsId] = useState<string[] | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showtotalPrice, setTotalPrice] = useState<number>(0);
  const [address, setAddress] = useState<{
    street: string;
    barangay: string;
    city: string;
    zipcode: string;
  } | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("customerid", user?.id)
        .single();

      if (error) {
        console.error("Error fetching customer data:", error);
        return null;
      }
      setCustomerData(data);
      setAddress({
        street: data.street_address,
        barangay: data.barangay,
        city: data.city,
        zipcode: data.zipcode,
      });
      return data;
    };
    
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
            setCartId(cartData.cartid);
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
    fetchCustomerData();
    calculateTotalPrice();
  }, []);

const calculateTotalPrice = async () => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.warn("User not authenticated");
            return;
        }

        const { data: cartData, error: cartError } = await supabase
            .from("cart")
            .select("cartid")
            .eq("customerid", user.id)
            .single();

        if (cartError || !cartData) {
            console.warn("Cannot calculate total price: cartId not found");
            return;
        }

        const cartId = cartData.cartid;
        console.log("Calculating total price for cart ID:", cartId);

        const { data: cartItems, error: itemsError } = await supabase
            .from("cart_items")
            .select("total_price")
            .eq("cartid", cartId);

        if (itemsError) throw itemsError;

        const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);

        console.log("Total Price:", totalPrice);
        setTotalPrice(totalPrice);
    } catch (error) {
        console.error("Error calculating total price:", error);
    }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#E19517" size={50} />
      </div>
    );
  }

  const handleAddressChange = (newAddress: any) => {
    setAddress(newAddress);
  };

  const handlePaymentMethodChange = (method: string) => {
    console.log("Selected payment method:", method);
    setPaymentMethod(method);
  }

  return (
    <>
      <div className="mt-5 mx-6 md:mx-30 relative overflow-hidden">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Place Order
        </span>
        <div className="relative p-6 mt-5 border-b-1 border-gray-300 rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <div className="absolute inset-0 border-dashed border-t-[4px] border-transparent z-[-1] border-gradient-dash rounded-xl"></div>
          <div className="flex flex-col rounded-xl gap-y-2 ">
            <div className="flex items-center gap-x-2">
              <MapPin className="text-[#E19517] w-6 h-6" />
              <span className="font-medium text-[#E19517] text-xl">
                Delivery Address
              </span>
            </div>
            <div className="flex justify-between mx-10">
              <div className="flex flex-col">
                <span className="text-[#240C03] font-semibold">
                  {customerData?.first_name} {customerData?.last_name}
                </span>
                <span className="text-[#240C03]">
                  {customerData?.mobile_num}
                </span>
              </div>
              <span>
                {address?.street}, {address?.barangay}, {address?.city}, Davao
                Del Sur, {address?.zipcode}
              </span>
              <button
                className="border-2 border-[#E19517] rounded-lg h-fit py-2 px-5 hover:bg-[#E19517] hover:text-amber-50 cursor-pointer text-[#E19517] text-sm font-medium ease-in-out duration-200"
                onClick={() => setChangeAddress(true)}
              >
                Change
              </button>
            </div>
          </div>
        </div>
        {/* Products ordered */}
        <div className="flex flex-col rounded-2xl my-5 w-full shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <div className="border-b-1 border-gray-300 rounded-2xl">
            <div className="flex py-5 px-10">
              <span className="w-250">Products Ordered</span>
              <div className="flex justify-between w-full">
                <span>Unit Price</span>
                <span>Quantity</span>
                <span>Total Price</span>
              </div>
            </div>
            <div className="">
              {cartItemsId && cartItemsId.length > 0 ? (
                cartItemsId.map((id) => (
                  <OrderedProductsCard
                    key={id}
                    cartitemsId={id}
                    cartid={cartId || ""}
                  />
                ))
              ) : (
                <span className="flex justify-center text-gray-500">
                  No items selected.
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="flex items-center gap-x-2 w-150 py-5 px-5 border-b-1 border-gray-300">
                <MessageCircleMore className="text-[#E19517] w-6 h-6" />
                <span className="text-lg">Message for seller:</span>
              </div>
              <div className="mt-2 mx-10">
                <textarea
                  className="w-full h-50 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E19517]"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col border-l-1 border-gray-300 w-full">
              <div className="flex justify-between items-center border-b-1 border-gray-300">
                <div className="flex items-center gap-x-2 w-fit py-5 px-5">
                  <CreditCard className="text-[#E19517] w-6 h-6" />
                  <span className="text-lg">Method of Payment</span>
                </div>
                <button className="border-2 border-[#E19517] rounded-lg h-fit py-2 px-5 hover:bg-[#E19517] hover:text-amber-50 cursor-pointer text-[#E19517] text-sm font-medium ease-in-out duration-200" onClick={() => setPaymentMethodModal(true)}>
                  Select
                </button>
              </div>
              <div className="px-5 py-1 flex justify-end bg-[#E19517]/30 cursor-pointer">
                <span className="text-sm text-gray-700 font-light">
                  {"Add Voucher >>"}
                </span>
              </div>
              <div className="flex justify-between mx-10 mt-2">
                <div className="flex gap-x-5">
                  <span className="text-lg">Method: </span>
                  <span className="text-lg text-gray-500">{paymentMethod}</span>
                </div>
                <div className="flex flex-col gap-y-4">
                  <div className="flex justify-between gap-x-10">
                    <span>Product subtotal:</span>
                    <span className="text-gray-600">₱ {showtotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery fee:</span>
                    <span className="text-gray-600">₱ 40.00</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span>Voucher:</span>
                    <span className="border-b-1 text-right w-30 border-gray-500 text-gray-600">
                      40 %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-2xl">Total:</span>
                    <span className="text-2xl text-[#E19517] font-semibold">
                      ₱ 40.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end my-5">
          <button className="flex gap-x-2 items-center text-2xl font-semibold text-amber-50 bg-[#E19517] rounded-lg px-5 py-2 cursor-pointer mt-5">
            Place Order
          </button>
        </div>
      </div>
      {changeAdress && (
        <ChangeAddressModal
          onClose={() => setChangeAddress(false)}
          onAddressChange={handleAddressChange}
          name={`${customerData?.first_name} ${customerData?.last_name}`}
          phone={customerData?.mobile_num}
          address={`${address?.street}, ${address?.barangay}, ${address?.city}, Davao
                Del Sur, ${address?.zipcode}`}
        />
      )}
      {showPaymentMethodModal && (
        <PaymentMethodModal
                  onClose={() => setPaymentMethodModal(false)} onSelectPaymentMethod={handlePaymentMethodChange} method={paymentMethod || ""}/>
      )}
    </>
  );
}
