import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
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
import { useRouter } from "next/navigation";

const ViewTables = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [orderDetails, setOrderDetails] = useState<any>();
  const router = useRouter();

  const filteredOrders = (orderDetails || []).filter((order: any) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search) ||
      order.date.includes(search) ||
      order.address.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*,customers(first_name, last_name)")
        .order("orderid", { ascending: true });

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      if (data) {
        const mappedOrders = data.map((order) => ({
          id: order.orderid,
          customerName: `${order.customers?.first_name} ${order.customers?.last_name}`,
          address: order.delivery_address,
          date: order.order_date,
          price: order.order_price,
          status: order.order_status,
        }));
        setOrderDetails(mappedOrders);
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
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search by customer name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 border-1 border-gray-500"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-1/4 border-1 border-gray-400">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
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
              Order Complete
            </SelectItem>
            <SelectItem value="Cancelled" className="cursor-pointer">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Delivery Address</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                {order.address.length > 25
                  ? `${order.address.slice(0, 30)}...`
                  : order.address}
              </TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>₱ {order.price.toFixed(2)}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(newStatus) => {
                    handleStatusUpdate(order.id, newStatus);
                  }}
                >
                  <SelectTrigger
                    className={`w-35 ${
                      order.status === "Pending"
                        ? "bg-yellow-50 text-black"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Brewing"
                        ? "bg-yellow-900/30 text-yellow-900"
                        : order.status === "Shipped"
                        ? "bg-green-200 text-green-800"
                        : order.status === "Order Complete"
                        ? "bg-green-400 text-green-950"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <SelectValue placeholder={order.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Pending"
                      className="cursor-pointer"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="Processing"
                      className="cursor-pointer"
                    >
                      Processing
                    </SelectItem>
                    <SelectItem
                      value="Brewing"
                      className="cursor-pointer"
                    >
                      Brewing
                    </SelectItem>
                    <SelectItem
                      value="Shipped"
                      className="cursor-pointer"
                    >
                      Shipped
                    </SelectItem>
                    <SelectItem
                      value="Order Complete"
                      className="cursor-pointer"
                    >
                      Complete
                    </SelectItem>
                    <SelectItem
                      value="Cancelled"
                      className="cursor-pointer"
                    >
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-1 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold  text-xs rounded cursor-pointer"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewTables;
