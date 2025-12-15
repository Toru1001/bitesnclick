"use client";
import OrderDetailsCard from "@/app/components/model/order-details-card";
import {
  faCartPlus,
  faClipboardCheck,
  faMugHot,
  faTruckFast,
  faXmark,
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
          .select(
            "*, customers(first_name, last_name, mobile_num), vouchers(name, percent)"
          )
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
        return <FontAwesomeIcon icon={faCartPlus} className={`${color}`} />;
      case "Processing":
        return <RefreshCcwDot className={`${color}`} />;
      case "Brewing":
        return <FontAwesomeIcon icon={faMugHot} className={`${color}`} />;
      case "Shipped":
        return <FontAwesomeIcon icon={faTruckFast} className={`${color}`} />;
      case "Order Complete":
        return (
          <FontAwesomeIcon icon={faClipboardCheck} className={`${color}`} />
        );
      case "Cancelled":
        return (
          <FontAwesomeIcon icon={faXmark} className="text-[#E19517] text-2xl" />
        );
      default:
        return <FontAwesomeIcon icon={faCartPlus} className={`${color}`} />;
    }
  };

  const getProgressIcon = (status: string, color: string) => {
    switch (status) {
      case "Order Placed":
        return <FontAwesomeIcon icon={faCartPlus} className={`${color}`} />;
      case "Payment info confirmed":
        return <RefreshCcwDot className={`${color}`} />;
      case "Brewing":
        return <FontAwesomeIcon icon={faMugHot} className={`${color}`} />;
      case "On Delivery":
        return <FontAwesomeIcon icon={faTruckFast} className={`${color}`} />;
      case "Order Complete":
        return (
          <FontAwesomeIcon icon={faClipboardCheck} className={`${color}`} />
        );
      default:
        return <FontAwesomeIcon icon={faCartPlus} className={`${color}`} />;
    }
  };
  return (
    <div>
      <div className="mt-3 sm:mt-5 mx-3 sm:mx-6 md:mx-30">
        <span className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#240C03] text-end">
          Order Details
        </span>
        <div className="flex flex-col items-center justify-between gap-y-3 mt-2 sm:mt-3 w-full">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 w-full px-3 sm:px-5 py-3 sm:py-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <span
              className="text-sm sm:text-base md:text-lg text-gray-500 cursor-pointer"
              onClick={() => router.back()}
            >
              {"< Back"}
            </span>
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-2">
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 pr-3 sm:pr-5 border-r-1 border-gray-600">
                Order ID: #{id}
              </span>
              <div className="flex items-center gap-x-2 sm:gap-x-3">
                {getStatusIcon(orders?.order_status, "text-[#E19517] text-base sm:text-lg md:text-xl")}
                <span className="text-xs sm:text-sm md:text-base lg:text-lg text-[#E19517]">
                  {orders?.order_status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-lg sm:rounded-xl md:rounded-2xl my-3 sm:my-5 w-full shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
            <div className="border-b-1 border-gray-300 rounded-2xl">
              <div className="flex gap-x-2 sm:gap-x-3 md:gap-x-5 w-full py-3 sm:py-4 md:py-5 px-3 sm:px-6 md:px-10">
                <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-medium flex-1">Products Ordered</span>
                <div className="flex justify-between gap-x-2 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 min-w-[180px] sm:min-w-[240px] md:min-w-[280px] text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-medium items-center">
                  <span className="text-center w-[50px] sm:w-[60px]">Unit Price</span>
                  <span className="text-center w-[50px] sm:w-[60px]">Quantity</span>
                  <span className="text-right w-[60px] sm:w-[80px] md:w-[100px]">Total Price</span>
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
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-col w-full lg:flex-1">
                <div className="flex items-center gap-x-2 w-full py-3 sm:py-4 md:py-5 px-3 sm:px-5 border-b-1 border-gray-300">
                  <MessageCircleMore className="text-[#E19517] w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">Message for seller:</span>
                </div>
                <div className="mt-2 mx-3 sm:mx-6 md:mx-10">
                  <textarea
                    className="w-full h-40 sm:h-50 p-2 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focused:outline-none"
                    placeholder={orders?.message}
                    readOnly
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-col border-t-1 lg:border-t-0 lg:border-l-1 border-gray-300 w-full lg:flex-1">
                <div className="flex justify-between items-center border-b-1 border-gray-300">
                  <div className="flex items-center gap-x-2 w-fit py-3 sm:py-4 md:py-5 px-3 sm:px-5">
                    <CreditCard className="text-[#E19517] w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">Method of Payment</span>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:justify-between mx-4 sm:mx-5 md:mx-10 my-3 sm:my-4 lg:mt-2 gap-4 sm:gap-5 lg:gap-4">
                  <div className="flex flex-col gap-y-3">
                    <div className="flex gap-x-4 sm:gap-x-5">
                      <span className="text-xs sm:text-sm md:text-base text-gray-900 font-medium">Method: </span>
                      <span className="text-xs sm:text-sm md:text-base text-gray-500">
                        {orders?.paymentMethod}
                      </span>
                    </div>
                    <div className="flex gap-x-4 sm:gap-x-5">
                      <span className="text-xs sm:text-sm md:text-base text-gray-900 font-medium">Voucher: </span>
                      <span className="text-xs sm:text-sm md:text-base text-gray-500">{orders?.voucher}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-3 sm:gap-y-4">
                    <div className="flex justify-between gap-x-8 sm:gap-x-10 md:gap-x-12">
                      <span className="text-xs sm:text-sm md:text-base">Product subtotal:</span>
                      <span className="text-xs sm:text-sm md:text-base text-gray-600">
                        ₱ {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-x-8 sm:gap-x-10 md:gap-x-12">
                      <span className="text-xs sm:text-sm md:text-base">Delivery fee:</span>
                      <span className="text-xs sm:text-sm md:text-base text-gray-600">₱ 40.00</span>
                    </div>
                    <div className="flex justify-between items-end gap-x-8 sm:gap-x-10 md:gap-x-12">
                      <span className="text-xs sm:text-sm md:text-base">Voucher:</span>
                      <span className="text-xs sm:text-sm md:text-base border-b-1 text-right w-20 sm:w-24 md:w-30 border-gray-500 text-gray-600">
                        {orders?.voucher_percent} %
                      </span>
                    </div>
                    <div className="flex justify-between gap-x-8 sm:gap-x-10 md:gap-x-12 pt-2">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Total:</span>
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#E19517] font-bold">
                        ₱ {orders?.order_price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="relative w-full p-3 sm:p-4 md:p-6 mb-3 sm:mb-5 border-b-1 border-gray-300 rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
            <div className="absolute inset-0 border-dashed border-t-[3px] sm:border-t-[4px] border-transparent z-[-1] border-gradient-dash rounded-xl"></div>
            <div className="flex flex-col md:flex-row md:items-start rounded-xl gap-3 sm:gap-4 md:gap-x-5">
              <div className="flex flex-col h-full md:pr-5 pb-3 sm:pb-4 md:pb-0 border-b-1 md:border-b-0 md:border-r-1 border-gray-500">
                <div className="flex items-center gap-x-2">
                  <MapPin className="text-[#E19517] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span className="font-medium text-[#E19517] text-sm sm:text-base md:text-lg lg:text-xl">
                    Delivery Address
                  </span>
                </div>
                <div className="flex flex-col pl-6 sm:pl-7 md:pl-8 mt-2 font-semibold text-xs sm:text-sm md:text-base">
                  <span>{orders?.name}</span>
                  <span>{orders?.mobile_num}</span>
                </div>
                <span className="text-gray-500 text-xs sm:text-sm md:text-base pl-6 sm:pl-7 md:pl-8 mt-2 md:w-60">
                  {orders?.delivery_address}
                </span>
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                {[
                  "Order Placed",
                  "Payment info confirmed",
                  "Brewing",
                  "On Delivery",
                  "Order Complete",
                ].map((status, index) => {
                  const statusOrder = [
                    "Pending",
                    "Processing",
                    "Brewing",
                    "Shipped",
                    "Order Complete",
                  ];
                  const currentStatusIndex = statusOrder.indexOf(
                    orders?.order_status || ""
                  );
                  const isHighlighted = index <= currentStatusIndex;

                  return (
                    <div key={status} className="flex items-center gap-x-2">
                      {getProgressIcon(
                        status,
                        isHighlighted
                          ? "text-[#E19517] text-lg md:text-xl"
                          : "text-gray-500 text-lg md:text-xl"
                      )}
                      <span
                        className={`text-sm md:text-base ${
                          isHighlighted ? "text-[#E19517]" : "text-gray-500"
                        }`}
                      >
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
