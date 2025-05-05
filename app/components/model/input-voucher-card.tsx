import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

interface InputVoucherCardProps {
  key?: string | number;
  voucherId: number;
  selected?: (voucher: string) => void;
}

const InputVoucherCard: React.FC<InputVoucherCardProps> = ({ voucherId, selected }) => {
  const [voucher, setVoucher] = useState<any>(null);

  const fetchVouchersDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('voucherid', voucherId)
        .single();

      if (error) {
        console.error('Error fetching vouchers:', error);
        return;
      }
      setVoucher(data || null);
    } catch (err) {
      console.error('Unexpected error fetching vouchers:', err);
    }
  };

  const handleSelected = (voucherCode: string) => {
    if (selected) {
      selected(voucherCode);
    }
  };

  useEffect(() => {
    fetchVouchersDetails();
  }, []);

  const isExpired = voucher && new Date(voucher.end_date) < new Date();
  const isUsed = voucher && voucher.status === 'used';

  return (
    <>
      {voucher && (
        <div
          className={`flex flex-col px-4 py-2 border-1 rounded-lg ease-in-out duration-200 ${
            isExpired || isUsed
              ? 'bg-gray-500/40 border-gray-300 cursor-not-allowed'
              : 'border-gray-400   hover:bg-[#E19517] hover:text-amber-50 hover:[&_*]:text-white cursor-pointer'
          }`}
          onClick={() => !isExpired && !isUsed && handleSelected(voucher.code)}
        >
          <div className="flex justify-between font-semibold text-lg">
            <span>{voucher.name}</span>
            <span>{voucher.percent}% Off</span>
          </div>
          <span className={`text-gray-500 ease-in-out duration-200 ${isExpired || isUsed ? 
            'line-through' : 'hover:text-inherit'}`}>
            Code: {voucher.code}
          </span>
          <span className={`text-gray-500 ease-in-out text-[12px] duration-200 ${isExpired || isUsed ? 
            'line-through' : 'hover:text-inherit'}`}>
            Valid from: {new Date(voucher.start_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            -{' '}
            {new Date(voucher.end_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {(isExpired || isUsed) && (
            <span className="text-red-500 font-semibold text-sm">
              {isExpired ? 'Expired' : 'Used'}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default InputVoucherCard;