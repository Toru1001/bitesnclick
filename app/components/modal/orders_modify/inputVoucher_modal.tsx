import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InputVoucherCard from '../../model/input-voucher-card';
import { supabase } from '@/app/lib/supabase';

interface InputVoucherModalProps {
  onClose: () => void;
  onVoucherApply?: (voucherCode: string) => void;
  code?: string;
}

const InputVoucherModal: React.FC<InputVoucherModalProps> = ({ onClose, onVoucherApply, code }) => {
  const [vouchers, setVouchers] = useState<number[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    setSelectedVoucher(code || null);
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase.from('vouchers').select('voucherid');

      if (error) {
        console.error('Error fetching vouchers:', error);
        return;
      }

      const voucherIds = data?.map((voucher) => voucher.voucherid) || [];
      setVouchers(voucherIds);
    } catch (err) {
      console.error('Unexpected error fetching vouchers:', err);
    }
  };

  const handleVoucherSelection = (voucherCode: string) => {
    console.log('Selected Voucher Code:', voucherCode);
    setSelectedVoucher(voucherCode);
  };

  const handleConfirm = async () => {
    if (!selectedVoucher) {
      alert('Please enter or select a voucher code.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('status, end_date')
        .eq('code', selectedVoucher)
        .single();

      if (error) {
        console.error('Error validating voucher:', error);
        alert('Failed to validate voucher. Please try again.');
        return;
      }

      if (!data) {
        alert('Voucher not found.');
        return;
      }

      const { status, end_date } = data;
      const currentDate = new Date();

      if (status !== 'available') {
        alert('This voucher is not available.');
        return;
      }

      if (new Date(end_date) < currentDate) {
        alert('This voucher has expired.');
        return;
      }

      if (onVoucherApply) {
        onVoucherApply(selectedVoucher);
      }
      onClose();
    } catch (err) {
      console.error('Unexpected error validating voucher:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40" onClick={handleOverlayClick}>
        <div
          className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
            onClick={onClose}
          >
            <X className="text-[#240C03] font-bold" />
          </button>
          <div className="flex w-full border-b-3 pb-2 justify-center border-[#E19517]">
            <span className="font-semibold text-xl">Vouchers</span>
          </div>
          {/* Items Start Here */}
          <div className="w-100"></div>
          <form action="" className="px-3">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col py-3 ">
                <span className="text-lg font-semibold">Enter Voucher Code</span>
                <input
                  type="text"
                  placeholder={selectedVoucher || 'Enter voucher code'}
                  value={selectedVoucher || ''}
                  onChange={(e) => setSelectedVoucher(e.target.value)}
                  className="border-1 rounded-md p-2 mt-2"
                />
              </div>
            </div>
            <span>Available Vouchers</span>
            <div className="flex flex-col gap-y-2 my-2 max-h-screen md:max-h-80 overflow-scroll [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none">
              {vouchers.map((voucherId) => (
                <InputVoucherCard key={voucherId} voucherId={voucherId} selected={handleVoucherSelection} />
              ))}
            </div>
            <div className="flex justify-end gap-x-2">
              <button
                type="button"
                onClick={onClose}
                className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-[#E19517] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InputVoucherModal;