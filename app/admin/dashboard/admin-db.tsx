"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Dummy data
const discountedProducts = [
  { id: 1, name: "Espresso", price: 150, discounted: 120 },
  { id: 2, name: "Latte", price: 180, discounted: 150 },
]

const archivedProducts = [
  { id: 3, name: "Mocha", price: 170 },
]

const totalProducts = 15
const incomingOrders = 8

const weeklySalesData = [
  { day: "Mon", sales: 200 },
  { day: "Tue", sales: 400 },
  { day: "Wed", sales: 300 },
  { day: "Thu", sales: 500 },
  { day: "Fri", sales: 700 },
  { day: "Sat", sales: 1000 },
  { day: "Sun", sales: 800 },
]

const monthlySalesData = [
  { month: "Jan", sales: 5000 },
  { month: "Feb", sales: 4500 },
  { month: "Mar", sales: 6000 },
  { month: "Apr", sales: 7000 },
  { month: "May", sales: 7500 },
  { month: "Jun", sales: 8000 },
]

export default function AdminDashboard() {
  return (
    <div className="p-6">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Total Products</h2>
          <p className="text-2xl font-semibold">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Incoming Orders</h2>
          <p className="text-2xl font-semibold">{incomingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Discounted Products</h2>
          <p className="text-2xl font-semibold">{discountedProducts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm text-gray-500">Archived Products</h2>
          <p className="text-2xl font-semibold">{archivedProducts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Weekly Sales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklySalesData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlySalesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Discounted Products</h2>
          <ul className="space-y-2">
            {discountedProducts.map(product => (
              <li key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span className="text-green-600 font-medium">
                  ₱{product.discounted} <span className="line-through text-gray-400 ml-2">₱{product.price}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Archived Products</h2>
          <ul className="space-y-2">
            {archivedProducts.map(product => (
              <li key={product.id} className="flex justify-between">
                <span>{product.name}</span>
                <span className="text-gray-500">₱{product.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
