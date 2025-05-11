"use client";
import { CreditCard, Eye, MessageCircleMore } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import OrderTable from "./order-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const OrderDetails: React.FC = () => {
  const id = Number(useParams().id);
  const [orderDetails, setOrderDetails] = useState<any>();
  const [subtotal, setSubtotal] = useState<number>(0);
  const [status, setStatus] = useState("Pending");

  const handleData = (subTotal: number) => {
    setSubtotal(subTotal);
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, customers(first_name, last_name, mobile_num), vouchers(name, percent)"
        )
        .eq("orderid", id);

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      if (data) {
        const mappedOrders = data ? data : null;
        setOrderDetails(mappedOrders);
        console.log(mappedOrders);
      }
    } catch (err) {
      console.error("Unexpected error fetching orders:", err);
    }
  };

  const handleStatusUpdate = async (orderid: number, status: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ order_status: status })
        .eq("orderid", orderid)
        .select();

      if (error) {
        console.error("Error updating status:", error);
        alert("Failed to update order status. Please try again.");
        return;
      }

      if (data) {
        console.log("Order status updated successfully:", data);
        fetchOrders();
      }
    } catch (err) {
      console.error("Unexpected error updating status:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  };


  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    orderDetails && (
      <div className="flex flex-col">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-x-3 text-lg">
            <span>Status: </span>
            <Select
              value={orderDetails[0].order_status}
              onValueChange={(newStatus) => {
                handleStatusUpdate(id, newStatus);
              }}
            >
              <SelectTrigger
                className={`w-35 border-2 ${
                  orderDetails[0].order_status === "Pending"
                    ? "bg-yellow-50 text-black"
                        : orderDetails[0].order_status === "Processing"
                        ? "bg-yellow-200 text-yellow-800"
                        : orderDetails[0].order_status === "Brewing"
                        ? "bg-yellow-900/30 text-yellow-900"
                        : orderDetails[0].order_status === "Shipped"
                        ? "bg-orange-200 text-orange-800"
                        : orderDetails[0].order_status === "Order Complete"
                        ? "bg-[#E19517] text-amber-50"
                        : "text-amber-50 bg-red-600"
                }`}
              >
                <SelectValue placeholder={orderDetails[0].order_status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending" className="cursor-pointer">
                  Pending
                </SelectItem>
                <SelectItem value="Processing" className="cursor-pointer">
                  Processing
                </SelectItem>
                <SelectItem value="Brewing" className="cursor-pointer">
                  Brewing
                </SelectItem>
                <SelectItem value="Shipped" className="cursor-pointer">
                  Shipped
                </SelectItem>
                <SelectItem value="Order Complete" className="cursor-pointer">
                  Complete
                </SelectItem>
                <SelectItem value="Cancelled" className="cursor-pointer">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-3">
            <Dialog>
              <DialogTrigger
                className={`${
                  orderDetails[0].paymentMethod !== "GCASH"
                    ? "hidden"
                    : "flex items-center gap-x-2 px-2 border-1 border-[#E19517] text-white bg-[#E19517] hover:text-amber-50 hover:bg-[#E19517]/80 font-semibold text-xs rounded cursor-pointer"
                }`}
              >
                <Eye /> View Payment
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-lg border-b-1 border-gray-400 pb-1">
                    Payment
                  </DialogTitle>
                </DialogHeader>
                <div className="w-fit">
                  {orderDetails[0].payment_img && (
                    <img
                      src={orderDetails[0].payment_img}
                      alt="Product Preview"
                      className="w-100 max-h-125 object-cover rounded-2xl"
                    />
                  )}
                  <div className="flex w-full justify-end mt-3">
                    <a
                      href={orderDetails[0].payment_img}
                      target={orderDetails[0].payment_img}
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="border-1 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold text-xs rounded cursor-pointer"
                      >
                        View Full Image
                      </Button>
                    </a>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="border-1 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold  text-xs rounded cursor-pointer"
            >
              Print Receipt
            </Button>
          </div>
        </div>
        <OrderTable onData={handleData} />
        <div className="flex flex-col w-full shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <div className="flex flex-row">
            <div className="flex flex-col border-r-1 border-gray-300 w-full text-sm">
              <div className="flex justify-between items-center border-b-1 border-gray-300">
                <div className="flex items-center gap-x-2 w-fit py-5 px-5">
                  <CreditCard className="text-[#E19517] w-6 h-6" />
                  <span className="text-lg">Customer Details</span>
                </div>
              </div>
              <div className="flex justify-between mx-10 mt-2">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-5">
                    <span className="text-gray-900">Name: </span>
                    <span className="text-gray-500">
                      {orderDetails[0]?.customers
                        ? `${orderDetails[0].customers.first_name} ${orderDetails[0].customers.last_name}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-x-5">
                    <span className="text-gray-900">Contact: </span>
                    <span className="text-gray-500">
                      {orderDetails[0]?.customers?.mobile_num || "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-x-5 w-80">
                    <span className="text-gray-900">Address: </span>
                    <span className="text-gray-500">
                      {orderDetails[0]?.delivery_address || "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-x-5">
                    <span className="text-gray-900">Method: </span>
                    <span className="text-gray-500">
                      {orderDetails[0]?.paymentMethod || "N/A"}
                    </span>
                  </div>
                  <div className="flex gap-x-5">
                    <span className="text-gray-900">Voucher: </span>
                    <span className="text-gray-500">
                      {orderDetails[0]?.vouchers?.name ?? "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-gray-600">
                      ₱ {subtotal.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Delivery fee:</span>
                    <span className="text-gray-600">₱ 40.0</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span>Voucher:</span>
                    <span className="border-b-1 text-right w-30 border-gray-500 text-gray-600">
                      {orderDetails[0]?.vouchers?.percent ?? "0"} %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-2xl">Total:</span>
                    <span className="text-2xl text-[#E19517] font-semibold">
                      ₱ {(orderDetails[0].order_price).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-x-2 w-150 py-5 px-5 border-b-1 border-gray-300">
                <MessageCircleMore className="text-[#E19517] w-6 h-6" />
                <span className="text-lg">Message from customer:</span>
              </div>
              <div className="mt-2 mx-10">
                <textarea
                  className="w-full h-40 text-sm p-2 border border-gray-300 rounded-lg focused:outline-none"
                  placeholder={
                    orderDetails[0]?.message || "No message provided"
                  }
                  readOnly
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderDetails;
