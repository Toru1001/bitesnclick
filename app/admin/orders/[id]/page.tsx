"use client";
import { useParams } from 'next/navigation';
import React from 'react'
import OrderDetails from './order-details';
import OrderTable from './order-table';

const ViewOrderPage : React.FC = () => {
    const id = Number(useParams().id);
  return (
    <div className="flex flex-col mx-auto mt-25 ml-64">
        <div className="mx-6">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Order Details
        </span>
        </div>
        <div className="p-6 text-xl">
            <OrderDetails/>
        </div>
    </div>
  )
}

export default ViewOrderPage