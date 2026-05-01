"use client";

import { CreditCard, Eye, MessageCircleMore } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
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
import InvoiceModal from "../../invoice/invoice-modal";

// 🔒 Allowed statuses (prevents injection / invalid updates)
const ALLOWED_STATUSES = [
  "Pending",
  "Processing",
  "Brewing",
  "Shipped",
  "Order Complete",
  "Cancelled",
];

// 🔒 basic text sanitizer (XSS prevention)
const safeText = (v: any) =>
  typeof v === "string" ? v.replace(/</g, "&lt;").replace(/>/g, "&gt;") : v;

const OrderDetails: React.FC = () => {
  const rawId = useParams().id;
  const id = Number(rawId);

  const [orderDetails, setOrderDetails] = useState<any>();
  const [subtotal, setSubtotal] = useState<number>(0);
  const [invoice, viewInvoice] = useState(false);

  const handleData = (subTotal: number) => {
    setSubtotal(subTotal);
  };

  const fetchOrders = async () => {
    if (!Number.isFinite(id)) return;

    const { data, error } = await supabase
      .from("orders")
      .select(
        "*, customers(first_name, last_name, mobile_num), vouchers(name, percent)",
      )
      .eq("orderid", id);

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    setOrderDetails(data || null);
  };

  const handleStatusUpdate = async (orderid: number, status: string) => {
    if (!ALLOWED_STATUSES.includes(status)) return;

    const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("orderid", orderid);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status.");
      return;
    }

    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!orderDetails || !orderDetails[0]) return null;

  const order = orderDetails[0];

  const safeImage =
    typeof order.payment_img === "string" ? order.payment_img : "";

  const safePrice = Number(order.order_price) || 0;
  const safePaymentMethod = safeText(order.paymentMethod) || "N/A";
  const safeVoucherName = safeText(order.vouchers?.name) || "N/A";
  const hasVoucher =
    order?.vouchers?.percent !== null &&
    order?.vouchers?.percent !== undefined &&
    order?.vouchers?.name &&
    order.vouchers.name !== "N/A";

  const safeVoucherPercent = hasVoucher ? Number(order.vouchers.percent) : 0;

  return (
    <div className="flex flex-col">
      {/* STATUS */}
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-x-3 text-lg">
          <span>Status: </span>

          <Select
            value={order.order_status}
            onValueChange={(newStatus) => handleStatusUpdate(id, newStatus)}
          >
            <SelectTrigger className="w-35 border-2">
              <SelectValue placeholder={order.order_status} />
            </SelectTrigger>

            <SelectContent>
              {ALLOWED_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PAYMENT DIALOG */}
        <div className="flex gap-x-3">
          <Dialog>
            <DialogTrigger
              className={
                order.paymentMethod !== "GCASH"
                  ? "hidden"
                  : "flex items-center gap-x-2 px-2 border-1 border-[#E19517] text-white bg-[#E19517] hover:text-amber-50 hover:bg-[#E19517]/80 font-semibold text-xs rounded cursor-pointer"
              }
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
                {safeImage && (
                  <img
                    src={safeImage}
                    alt="Payment"
                    className="w-100 max-h-125 object-cover rounded-2xl"
                  />
                )}

                <div className="flex w-full justify-end mt-3">
                  <a href={safeImage} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border-1 border-[#E19517] text-[#E19517]"
                    >
                      View Full Image
                    </Button>
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={() => viewInvoice(true)} variant="outline">
            Print Receipt
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <OrderTable onData={handleData} />

      {/* DETAILS */}
      <div className="flex flex-col w-full rounded-md shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
        <div className="flex flex-row">
          {/* CUSTOMER INFO */}
          <div className="flex flex-col border-r-1 border-gray-300 w-full text-sm">
            <div className="flex justify-between items-center border-b-1 border-gray-300">
              <div className="flex items-center gap-x-2 w-fit py-5 px-5">
                <CreditCard className="text-[#E19517]" />
                <span className="text-lg">Customer Details</span>
              </div>
            </div>

            <div className="flex justify-between mx-10 mt-2">
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-5">
                  <span>Name:</span>
                  <span>
                    {safeText(order.customers?.first_name)}{" "}
                    {safeText(order.customers?.last_name)}
                  </span>
                </div>

                <div className="flex gap-x-5">
                  <span>Contact:</span>
                  <span>{safeText(order.customers?.mobile_num) || "N/A"}</span>
                </div>

                <div className="flex gap-x-5 w-80">
                  <span>Address:</span>
                  <span>{safeText(order.delivery_address) || "N/A"}</span>
                </div>

                <div className="flex gap-x-5">
                  <span>Voucher:</span>
                  <span>{safeVoucherName}</span>
                </div>

                <div className="flex gap-x-5">
                  <span>Method:</span>
                  <span>{safePaymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col gap-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₱ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₱ 40.00</span>
                </div>

                {hasVoucher && (
                  <div className="flex justify-between">
                    <span>Voucher:</span>
                    <span className="border-b-1 text-right w-30 border-gray-500 text-gray-600">
                      {safeVoucherPercent} %
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="text-[#E19517] font-semibold">
                    ₱ {safePrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGE */}
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2 w-150 py-5 px-5 border-b-1 border-gray-300">
              <MessageCircleMore className="text-[#E19517]" />
              <span>Message from customer:</span>
            </div>

            <div className="mt-2 mx-10">
              <textarea
                className="w-full h-40 text-sm p-2 border border-gray-300 rounded-lg"
                readOnly
                value={safeText(order.message) || "No message provided"}
              />
            </div>
          </div>
        </div>
      </div>

      {invoice && (
        <InvoiceModal onClose={() => viewInvoice(false)} orderid={id} />
      )}
    </div>
  );
};

export default OrderDetails;
