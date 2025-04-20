import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/lib/supabase";
import { useParams, useRouter } from "next/navigation";

interface OrderTableProps{
    onData: (data: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ onData }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<any>([]);
  const id = Number(useParams().id);
  const [subtotal, setSubtotal] = useState<number>(0);


  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orderdetails")
        .select("id,quantity, price,products(name,price, category(name))")
        .eq("orderid" , id)

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
        onData(totalPrice);
        setOrderDetails(mappedOrders);
      }
    } catch (err) {
      console.error("Unexpected error fetching orders:", err);
    }
  };



  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <div className="h-fit my-5 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Product Name</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-center">Final Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderDetails.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell className="text-center">{order.products?.name}</TableCell>
              <TableCell className="text-center">
                {order.products?.category?.name}
              </TableCell>
              <TableCell className="text-center">{order.products?.price.toFixed(2)}</TableCell>
              <TableCell  className="text-center">{order.quantity}x</TableCell>
              <TableCell className="text-center">₱ {order.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          
        </TableBody>
        <TableFooter>
        <TableRow>
            <TableCell colSpan={3}></TableCell>
          <TableCell className="text-center">Total:</TableCell>
          <TableCell className="text-center">₱ {subtotal.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
      </Table>
      </div>
      
    </div>
  );
};

export default OrderTable;
