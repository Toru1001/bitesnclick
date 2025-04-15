"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { MoreHorizontal } from "lucide-react";// Import the modal component
import EditDiscount from "./edit_discounts";

const ViewDiscounts = () => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);

  const fetchDiscounts = async () => {
    const { data, error } = await supabase
      .from("discount")
      .select("*, products(productid, name, price)")


    if (error) {
      console.error("Error fetching discounts:", error.message);
    } else {
      setDiscounts(data);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const uniqueProducts = Array.from(
    new Map(
      discounts
        .filter(item => item.products) 
        .map(item => [item.products.productid, item.products])
    ).values()
  );
  

  return (
    <div className="bg-white p-6 rounded shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Discount List</h2>

      <table className="table-fixed w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left w-[100px]">Product</th>
            <th className="border px-4 py-2 text-left w-[100px]">Discount</th>
            <th className="border px-4 py-2 text-left w-[100px]">Price</th>
            <th className="border px-4 py-2 text-left w-[120px]">Discounted Price</th>
            <th className="border px-4 py-2 text-left w-[200px]">Start Date</th>
            <th className="border px-4 py-2 text-left w-[200px]">End Date</th>
            <th className="border px-4 py-2 text-left w-[100px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((item) => (
            <tr key={item.discountid} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-left w-[100px]">
                {item.products?.name}
              </td>
              <td className="border px-4 py-2 text-left w-[100px]">
                {item.discount_percent}%
              </td>
              <td className="border px-4 py-2 text-left w-[100px]">
                ₱ {item.products?.price?.toFixed(2)}
              </td>
              <td className="border px-4 py-2 text-left w-[120px]">
                ₱ {item.newprice?.toFixed(2)}
              </td>
              <td className="border px-4 py-2 text-left w-[200px]">
                {formatDate(item.start_date)}
              </td>
              <td className="border px-4 py-2 text-left w-[200px]">
                {formatDate(item.end_date)}
              </td>
              <td className="border px-4 py-2 text-left w-[100px]">
                <button className="relative group">
                  <MoreHorizontal className="w-5 h-5" />
                  <div className="absolute hidden group-hover:block bg-white border rounded shadow p-2 right-0 mt-1 z-10">
                    <ul className="space-y-1">
                      <li
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => {
                          setSelectedDiscount({
                            product: item.products?.name,
                            productPrice: Number(item.products?.price),
                            discountPercent: item.discount_percent,
                            discountedPrice: Number(item.newprice),
                            startDate: item.start_date,
                            endDate: item.end_date,
                          });
                          setViewModalOpen(true);
                        }}
                      >
                        View
                      </li>
                      <li
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => {
                          setEditingDiscount(item);
                          setEditModalOpen(true);
                        }}
                      >
                        Edit
                      </li>
                    </ul>
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Modal */}
      {viewModalOpen && selectedDiscount && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">View Discounted Product</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Product</p>
                  <p className="text-base text-gray-900">{selectedDiscount.product}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Product Price</p>
                  <p className="text-base text-gray-900">₱ {selectedDiscount.productPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Discount</p>
                  <p className="text-base text-gray-900">{selectedDiscount.discountPercent} %</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Discounted Price</p>
                  <p className="text-base text-gray-900">₱ {selectedDiscount.discountedPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Start Date</p>
                  <p className="text-base text-gray-900">{formatDate(selectedDiscount.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">End Date</p>
                  <p className="text-base text-gray-900">{formatDate(selectedDiscount.endDate)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setEditingDiscount(discounts.find(d => d.products?.name === selectedDiscount.product));
                  setEditModalOpen(true);
                }}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
              >
                Edit Discount
              </button>
            </div>
          </div>
        </div>
      )}

{editModalOpen && editingDiscount && (
  <EditDiscount
    discount={editingDiscount}
    onClose={() => setEditModalOpen(false)}
    onUpdate={() => {
      fetchDiscounts(); 
      setEditModalOpen(false);
    }}
    fetchDiscounts={fetchDiscounts}
    products={uniqueProducts}
  />
)}


    </div>
  );
};

export default ViewDiscounts;
