import React, { useEffect, useState } from "react";
import { faCreditCard, faCartPlus, faTruckFast, faMugHot, faClipboard, faClipboardCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { RefreshCcwDot } from "lucide-react";

interface OrdersCardProps {
  key: string | number;
  orderId: number;
}

const OrdersCard: React.FC<OrdersCardProps> = ({ orderId }) => {
  const [orders, setOrders] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("order_status, paymentMethod, order_price")
          .eq("orderid", orderId)
          .eq("customerid", user?.id)
          .single();

        const orders = data
          ? {
              order_status: data.order_status,
              paymentMethod: data.paymentMethod,
              order_price: data.order_price,
            }
          : null;
        setOrders(orders);
        console.log(orders);
        if (error) throw error;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchOrderItems = async () => {
      try {
        const { data, error } = await supabase
          .from("orderdetails")
          .select("*, products(name, img, category(name))")
          .eq("orderid", orderId);

        if (error) throw error;
        const orderItems = data ? data : null;
        setOrderItems(orderItems);
        console.log(data);
      } catch (error) {
        console.error("Error fetching order items:", error);
      }
    };
    fetchOrderItems();
    fetchOrderDetails();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <FontAwesomeIcon
        icon={faCartPlus}
        className="text-[#E19517] text-2xl"
      />
      case "Processing":
        return <RefreshCcwDot className="text-[#E19517] text-2xl" />
      case "Brewing":
        return <FontAwesomeIcon
        icon={faMugHot}
        className="text-[#E19517] text-2xl"
      />
      case "Shipped":
        return <FontAwesomeIcon
        icon={faTruckFast}
        className="text-[#E19517] text-2xl"
      />
      case "Order Complete":
        return <FontAwesomeIcon
        icon={faClipboardCheck}
        className="text-[#E19517] text-2xl"
      />
      case "Cancelled":
        return <FontAwesomeIcon
        icon={faXmark}
        className="text-[#E19517] text-2xl"
      />
      default:
        return <FontAwesomeIcon
        icon={faCartPlus}
        className="text-[#E19517] text-2xl"
      />
    }
  };

  return (
    orders &&
    orderItems && (
      <div className="flex flex-col w-full py-3 sm:py-5 rounded-lg border border-gray-200 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 sm:px-5 py-3 sm:py-5 border-b border-gray-200">
          <span className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
            Order ID: <span className="text-gray-500">#{orderId}</span>
          </span>
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3">
            <div className="flex items-center gap-x-1 sm:gap-x-2 pr-2 sm:pr-3 border-r border-gray-300">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-[#E19517] text-base sm:text-lg md:text-2xl"
              />
              <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">{orders.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-x-1 sm:gap-x-2">
            {getStatusIcon(orders.order_status)}
              
              <span className="text-[#E19517] text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">{orders.order_status}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5"></div>
        {/* Order Items */}
        {orderItems.map((item: any) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between gap-y-3 px-3 sm:px-5 py-3 sm:py-5 items-start sm:items-center border-b border-gray-200 last:border-b-0"
          >
            <div className="flex gap-x-3 sm:gap-x-5 w-full sm:w-auto">
              <div className="flex flex-shrink-0">
                <Image
                  src={item.products?.img}
                  alt={item.products?.name}
                  width={300}
                  height={200}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl"
                />
              </div>
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-950 text-sm sm:text-base">
                      {item.products?.name}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      Quantity: x{item.quantity}
                    </span>
                  </div>
                  <span className="bg-[#E19517] text-amber-50 w-fit px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-semibold">
                    {item.products?.category?.name}
                  </span>
                </div>
            </div>
            <span className="font-semibold text-sm sm:text-base sm:ml-auto">₱ {(item.price).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-y-3 px-3 sm:px-5 pt-3 sm:pt-5 pb-3 sm:pb-5 border-t border-gray-200 bg-gray-50">
          <button
            className="bg-amber-50 text-[#E19517] border-1 border-[#E19517] hover:bg-[#E19517] hover:text-white px-4 sm:px-5 py-2 font-semibold rounded-lg cursor-pointer text-sm sm:text-base transition-colors"
            onClick={() => router.push(`/orders/${orderId}`)}
          >
            Order Details
          </button>
          <div className="flex justify-between sm:justify-end gap-x-3 sm:gap-x-5 items-center">
            <span className="font-semibold text-base sm:text-lg text-gray-700">Order Total:</span>
            <span className="font-semibold text-base sm:text-lg text-[#E19517]">
              ₱ {(orders.order_price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default OrdersCard;
