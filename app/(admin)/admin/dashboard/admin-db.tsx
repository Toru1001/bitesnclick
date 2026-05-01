"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

interface Product {
  productid: number;
  name: string;
  price: number;
  is_archived: boolean;
}

interface Discount {
  newprice: any;
  products: any;
  discountid: number;
  productid: number;
  discount_percent: number;
  new_price: number;
  start_date: string;
  end_date: string;
  product: Product;
}

const safeNumber = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const safeText = (v: any) =>
  typeof v === "string" ? v.replace(/</g, "&lt;").replace(/>/g, "&gt;") : v;

const safeDate = (v: any) => {
  const d = new Date(v);
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString();
};

export default function AdminDashboard() {
  const [discountedProducts, setDiscountedProducts] = useState<Discount[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [incomingOrders, setIncomingOrders] = useState<number>(0);
  const [weeklySales, setWeeklySales] = useState<any[]>([]);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: discountsData, error: discountsError } = await supabase
        .from("discount")
        .select("*, products:products(productid, name, price)")
        .gte("end_date", new Date().toISOString().split("T")[0]);

      if (discountsError) {
        console.error(
          "Error fetching discounted products:",
          discountsError.message,
        );
      } else {
        const today = new Date();

        const activeDiscounts = (discountsData || []).filter(
          (discount: any) => {
            const end = new Date(discount.end_date);
            const start = new Date(discount.start_date || 0);

            return end >= today && start <= today;
          },
        );

        setDiscountedProducts(activeDiscounts);
      }

      const { data: archivedData, error: archivedError } = await supabase
        .from("products")
        .select("*")
        .eq("isarchive", true);

      if (!archivedError) {
        setArchivedProducts(archivedData || []);
      }

      const { count: totalCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      setTotalProducts(Number(totalCount) || 0);

      const { data: incomingOrdersData } = await supabase
        .from("orders")
        .select("*")
        .in("order_status", ["Pending", "Processing", "Brewing", "Shipped"]);

      setIncomingOrders(incomingOrdersData?.length || 0);

      const { data: weeklyData } = await supabase.rpc("get_weekly_sales");
      setWeeklySales(weeklyData || []);

      const { data: monthlyData } = await supabase.rpc("get_monthly_sales");
      setMonthlySales(monthlyData || []);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-t-5 border-[#E19517] p-4 rounded-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <h2 className="text-lg">Total Products</h2>
          <p className="text-2xl font-semibold">{totalProducts}</p>
        </div>

        <div className="bg-white p-4 border-t-5 border-[#E19517] rounded-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <h2 className="text-lg">Incoming Orders</h2>
          <p className="text-2xl font-semibold">{incomingOrders}</p>
        </div>

        <div className="bg-white p-4 border-t-5 border-[#E19517] rounded-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <h2 className="text-lg">Discounted Products</h2>
          <p className="text-2xl font-semibold">{discountedProducts.length}</p>
        </div>

        <div className="bg-white p-4 border-t-5 border-[#E19517] rounded-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
          <h2 className="text-lg">Archived Products</h2>
          <p className="text-2xl font-semibold">{archivedProducts.length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Discounted Products</h2>
        <table className="w-full table-auto">
          <tbody>
            {discountedProducts.map((d) => (
              <tr key={d.discountid}>
                <td className="px-4 py-2">{safeText(d.products?.name)}</td>
                <td className="px-4 py-2">
                  ₱{safeNumber(d.products?.price).toFixed(2)}
                </td>
                <td className="px-4 py-2">{safeNumber(d.discount_percent)}%</td>
                <td className="px-4 py-2">
                  ₱{safeNumber(d.newprice).toFixed(2)}
                </td>
                <td className="px-4 py-2">{safeDate(d.start_date)}</td>
                <td className="px-4 py-2">{safeDate(d.end_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Archived Products</h2>
        <table className="w-full table-auto">
          <tbody>
            {archivedProducts.map((p) => (
              <tr key={p.productid}>
                <td className="px-4 py-2">{safeText(p.name)}</td>
                <td className="px-4 py-2">₱{safeNumber(p.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklySales}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_sales" fill="#E19517" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySales}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="total_sales" stroke="#E19517" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
