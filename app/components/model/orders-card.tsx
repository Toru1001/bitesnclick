import React, { useEffect, useState } from "react";
import { faCreditCard, faCartPlus, faTruckFast, faMugHot, faClipboard, faClipboardCheck} from "@fortawesome/free-solid-svg-icons";
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
      <div className="flex flex-col w-full py-5 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
        <div className="flex justify-between px-5 py-5 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
          <span>
            Order ID: <span className="text-gray-500">#{orderId}</span>
          </span>
          <div className="flex w-fit justify-evenly gap-x-3">
            <div className="flex items-center px-2 gap-x-2 border-r-1 border-gray-500">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="text-[#E19517] text-2xl"
              />
              <span>{orders.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-x-2">
            {getStatusIcon(orders.order_status)}
              
              <span className="text-[#E19517]">{orders.order_status}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-5"></div>
        {/* Order Items */}
        {orderItems.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between px-5 py-5 items-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
          >
            <div className="flex gap-x-5">
              <div className="flex w-250">
                <Image
                  src={item.products?.img}
                  alt={item.products?.name}
                  width={300}
                  height={200}
                  className="w-20 h-15 md:h-20 object-cover rounded-2xl"
                />
                <div className="flex flex-col justify-between ml-5">
                  <div className="flex flex-col">
                    <span className=" font-medium text-gray-950">
                      {item.products?.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Quantity: x{item.quantity}
                    </span>
                  </div>
                  <span className="bg-[#D4A373] text-[#7B5137] px-3 py-1 rounded-lg text-xs font-semibold">
                    {item.products?.category?.name}
                  </span>
                </div>
              </div>
            </div>
            <span>₱ {(item.price).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center px-5 pt-5">
          <button
            className="bg-amber-50 text-[#E19517] border-1 border-[#E19517] hover:bg-[#E19517] hover:text-white px-5 py-2 font-semibold rounded-lg cursor-pointer"
            onClick={() => router.push(`/orders/${orderId}`)}
          >
            Order Details
          </button>
          <div className="flex gap-x-5">
            <span className="font-semibold text-lg">Order Total:</span>
            <span className="font-semibold text-lg text-[#E19517]">
              ₱ {(orders.order_price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default OrdersCard;
