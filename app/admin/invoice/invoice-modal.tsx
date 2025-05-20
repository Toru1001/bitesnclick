import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Invoice2 from './invoice';
import { supabase } from '@/app/lib/supabase';
import { useParams } from 'next/navigation';

interface InvoiceModalProps {
    onClose: () => void;
    orderid: number;
  }
const InvoiceModal : React.FC <InvoiceModalProps> = ({ onClose, orderid }) => {
    const [orderDetails, setOrderDetails] = useState<any>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [orders, setOrders] = useState<any>([]);
      
    const fetchOrders = async () => {
        try {
          const { data, error } = await supabase
            .from("orderdetails")
            .select("*,products(name,price, category(name))")
            .eq("orderid" , orderid)
    
          if (error) {
            console.error("Error fetching orders:", error);
            return;
          }
    
          if (data) {
            const totalPrice = data.reduce(
                (acc: number, item: any) => acc + item.price,
                0
            );
            setSubtotal(totalPrice);
            const mappedOrders = data ? data : null;
            setOrderDetails(mappedOrders);
            console.log("Mapped Orders:", mappedOrders);
          }
        } catch (err) {
          console.error("Unexpected error fetching orders:", err);
        }
      };

      const fetchOrderDetails = async () => {
          try {
            const { data, error } = await supabase
              .from("orders")
              .select(
                "*, customers(first_name, last_name, mobile_num), vouchers(name, percent)"
              )
              .eq("orderid", orderid);
      
            if (error) {
              console.error("Error fetching orders:", error);
              return;
            }
      
            if (data) {
              const mappedOrders = data ? data : null;
              setOrders(mappedOrders);
            }
          } catch (err) {
            console.error("Unexpected error fetching orders:", err);
          }
        };
    
    
    
      useEffect(() => {
        fetchOrders();
        fetchOrderDetails();
      }, []);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      };

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-90" onClick={handleOverlayClick}>
      <div className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">Invoice</span>
        </div>
        {/* Items Start Here */}
        <Invoice2 orderDetails={orderDetails} subTotal={subtotal} orders={orders}/>
        </div>
      </div>
    </>
  )
}

export default InvoiceModal