"use client";
import OrderDetailsCard from "@/app/components/model/order-details-card";
import {
  faCartPlus,
  faClipboardCheck,
  faMugHot,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CreditCard,
  MapPin,
  MessageCircleMore,
  RefreshCcwDot,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const OrderDetails: React.FC = () => {
  const id = Number(useParams().id);
  const [orders, setOrders] = useState<any>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from("orders")
          .select("*, customers(first_name, last_name, mobile_num), vouchers(name, percent)")
          .eq("orderid", id)
          .eq("customerid", user?.id)
          .single();

        const orders = data
          ? {
              order_status: data.order_status,
              paymentMethod: data.paymentMethod,
              order_price: data.order_price,
              order_date: data.order_date,
              message: data.message,
              delivery_address: data.delivery_address,
              voucher: data.vouchers?.name ?? "Not Applied",
              voucher_percent: data.vouchers?.percent ?? 0,
              name: `${data.customers?.first_name} ${data.customers?.last_name}`,
              mobile_num: data.customers?.mobile_num,
            }
          : null;

        setOrders(orders);

        if (error) throw error;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleTotalPrice = (price: number) => {
    setSubtotal(price);
  };

  const getStatusIcon = (status: string, color: string) => {
    switch (status) {
      case "Pending":
        return (
          <FontAwesomeIcon
            icon={faCartPlus}
            className={`${color}`}
          />
        );
      case "Processing":
        return <RefreshCcwDot className={`${color}`} />;
      case "Brewing":
        return (
          <FontAwesomeIcon icon={faMugHot} className={`${color}`} />
        );
      case "Shipped":
        return (
          <FontAwesomeIcon
            icon={faTruckFast}
            className={`${color}`}
          />
        );
      case "Order Complete":
        return (
          <FontAwesomeIcon
            icon={faClipboardCheck}
            className={`${color}`}
          />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faCartPlus}
            className={`${color}`}
          />
        );
    }
  };

  const getProgressIcon = (status: string, color: string) => {
    switch (status) {
      case "Order Placed":
        return (
          <FontAwesomeIcon
            icon={faCartPlus}
            className={`${color}`}
          />
        );
      case "Payment info confirmed":
        return <RefreshCcwDot className={`${color}`} />;
      case "Brewing":
        return (
          <FontAwesomeIcon icon={faMugHot} className={`${color}`} />
        );
      case "On Delivery":
        return (
          <FontAwesomeIcon
            icon={faTruckFast}
            className={`${color}`}
          />
        );
      case "Order Complete":
        return (
          <FontAwesomeIcon
            icon={faClipboardCheck}
            className={`${color}`}
          />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faCartPlus}
            className={`${color}`}
          />
        );
    }
  };
  return (
    <div>
      <div className="mt-5 mx-6 md:mx-30">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Order Details
        </span>
        <div className="flex flex-col items-center justify-between gap-y-3 mt-3 w-full">
          <div className="flex items-center justify-between gap-y-3 w-full px-5 py-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <span className="text-lg text-gray-500 cursor-pointer" onClick={() => router.back()}>{"< Back"}</span>
            <div className="flex gap-x-5">
              <span className="text-lg text-gray-500 pr-5 border-r-1 border-gray-600">
                Order ID: #{id}
              </span>
              <div className="flex items-center gap-x-3">
                {getStatusIcon(orders?.order_status, "text-[#E19517] text-lg")}
                <span className="text-lg text-[#E19517]">
                  {orders?.order_status}
                </span>
              </div>
            </div>
          </div>

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
                {id ? (
                  <OrderDetailsCard
                    orderId={id}
                    onTotalPrice={handleTotalPrice}
                  />
                ) : (
                  <span>Invalid Order ID</span>
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
                    className="w-full h-50 p-2 border border-gray-300 rounded-lg focused:outline-none"
                    placeholder={orders?.message}
                    readOnly
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-col border-l-1 border-gray-300 w-full">
                <div className="flex justify-between items-center border-b-1 border-gray-300">
                  <div className="flex items-center gap-x-2 w-fit py-5 px-5">
                    <CreditCard className="text-[#E19517] w-6 h-6" />
                    <span className="text-lg">Method of Payment</span>
                  </div>
                </div>
                <div className="flex justify-between mx-10 mt-2">
                  <div className="flex flex-col gap-y-2">
                    <div className="flex gap-x-5">
                      <span className="text-gray-900">Method: </span>
                      <span className="text-gray-500">
                        {orders?.paymentMethod}
                      </span>
                    </div>
                    <div className="flex gap-x-5">
                      <span className="text-gray-900">Voucher: </span>
                      <span className=" text-gray-500">{orders?.voucher}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between gap-x-10">
                      <span>Product subtotal:</span>
                      <span className="text-gray-600">
                        ₱ {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery fee:</span>
                      <span className="text-gray-600">₱ 40.00</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span>Voucher:</span>
                      <span className="border-b-1 text-right w-30 border-gray-500 text-gray-600">
                        {orders?.voucher_percent} %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-2xl">Total:</span>
                      <span className="text-2xl text-[#E19517] font-semibold">
                        ₱ {orders?.order_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="relative w-full p-6 mb-5 border-b-1 border-gray-300 rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
            <div className="absolute inset-0 border-dashed border-t-[4px] border-transparent z-[-1] border-gradient-dash rounded-xl"></div>
            <div className="flex items-start rounded-xl gap-x-5 ">
              <div className="flex flex-col h-full pr-5 border-r-1 border-gray-500">
                <div className="flex items-center gap-x-2">
                  <MapPin className="text-[#E19517] w-6 h-6" />
                  <span className="font-medium text-[#E19517] text-xl">
                    Delivery Address
                  </span>
                </div>
                <div className="flex flex-col pl-8 mt-2 font-semibold">
                    <span>{orders?.name}</span>
                    <span>{orders?.mobile_num}</span>
                </div>
                <span className="text-gray-500 pl-8 mt-2 w-60">
                    {orders?.delivery_address}
                </span>
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                {["Order Placed", "Payment info confirmed", "Brewing", "On Delivery", "Order Complete"].map((status, index) => {
                    const statusOrder = ["Pending", "Processing", "Brewing", "Shipped", "Order Complete"];
                    const currentStatusIndex = statusOrder.indexOf(orders?.order_status || "");
                    const isHighlighted = index <= currentStatusIndex;

                    return (
                        <div key={status} className="flex items-center gap-x-2">
                        {getProgressIcon(status, isHighlighted ? "text-[#E19517] text-xl" : "text-gray-500 text-xl")}
                        <span className={isHighlighted ? "text-[#E19517]" : "text-gray-500"}>
                            {status}
                        </span>
                        </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
