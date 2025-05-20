'use client';

import { supabase } from '@/app/lib/supabase';
import { useEffect, useState } from 'react';

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
} from 'recharts';

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

interface Order {
  id: number;
  status: string;
  created_at: string;
  total_amount: number;
}


export default function AdminDashboard() {
  const [discountedProducts, setDiscountedProducts] = useState<Discount[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [incomingOrders, setIncomingOrders] = useState<number>(0);
  const [weeklySales, setWeeklySales] = useState<any[]>([]);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch discounted products
      const { data: discountsData, error: discountsError } = await supabase
        .from('discount')
        .select('*, products:products(productid, name, price)');

      if (discountsError) {
        console.error('Error fetching discounted products:', discountsError.message);
      } else {
        console.log(discountsData);
        setDiscountedProducts(discountsData || []);
      }

      // Fetch archived products
      const { data: archivedData, error: archivedError } = await supabase
        .from('products')
        .select('*')
        .eq('isarchive', true);

      if (archivedError) {
        console.error('Error fetching archived products:', archivedError.message);
      } else {
        setArchivedProducts(archivedData || []);
      }

      // Fetch total products count
      const { count: totalCount, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error fetching total products count:', totalError.message);
      } else {
        setTotalProducts(totalCount || 0);
      }

      // Fetch incoming orders count
      const { data: incomingOrdersData, error: incomingOrdersError } = await supabase
      .from("orders")
      .select("*")
      .in("order_status", ["Pending", "Processing", "Brewing", "Shipped"])
      .order("order_date", { ascending: false });

    if (incomingOrdersError) {
      console.error("Error fetching incoming orders:", incomingOrdersError.message);
    } else {
      setIncomingOrders(incomingOrdersData?.length || 0);
    }
      

      // Fetch weekly sales data
      const { data: weeklyData, error: weeklyError } = await supabase.rpc('get_weekly_sales');

      if (weeklyError) {
        console.error('Error fetching weekly sales data:', weeklyError.message);
      } else {
        setWeeklySales(weeklyData || []);
      }

      // Fetch monthly sales data
      const { data: monthlyData, error: monthlyError } = await supabase.rpc('get_monthly_sales');

      if (monthlyError) {
        console.error('Error fetching monthly sales data:', monthlyError.message);
      } else {
        // console.log(discountedProductsdiscountid)
        setMonthlySales(monthlyData || []);
      }
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

      {/* Discounted Products Table */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Discounted Products</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Original Price</th>
              <th className="px-4 py-2 text-left">Discount %</th>
              <th className="px-4 py-2 text-left">New Price</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {discountedProducts.map((discount) => (
              <tr key={discount.productid}>
                <td className="px-4 py-2">{discount.products.name}</td>
                <td className="px-4 py-2">₱{discount.products.price?.toFixed(2)}</td>
                <td className="px-4 py-2">{discount.discount_percent}%</td>
                <td className="px-4 py-2">₱{discount.newprice?.toFixed(2)}</td>
                <td className="px-4 py-2">{new Date(discount.start_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(discount.end_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Archived Products Table */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Archived Products</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map((product) => (
              <tr key={product.productid}>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">₱{product.price?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weekly Sales Bar Chart */}
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

      {/* Monthly Sales Line Chart */}
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
