import React, { useEffect, useState } from 'react'
import OrdersCard from '../components/model/orders-card'
import { supabase } from '../lib/supabase'
import { ClipLoader } from 'react-spinners';

const CancelledTab: React.FC = () => {
  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('orderid')
          .in('order_status', ['Cancelled'])
          .eq('customerid', user?.id);

        if (error) throw error;

        const orderIds = data?.map(order => order.orderid) || [];
        setOrderIds(orderIds);
        console.log(orderIds);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className='flex flex-col mt-5 mb-5 w-full'>
      <div className=''>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#E19517" size={50} />
        </div>
        ) : orderIds.length === 0 ? (
          <p className='flex justify-center items-center text-lg text-gray-500'>No cancelled orders yet.</p>
        ) : (
          orderIds.map((orderId) => (
            <OrdersCard key={orderId} orderId={orderId} />
          ))
        )}
      </div>
    </div>
  );
};

export default CancelledTab;