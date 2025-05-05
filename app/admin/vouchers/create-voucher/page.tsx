"use client";
import CreateVoucherForm from './create_vouchers';

export default function CreateVoucher() {
    return (
      <div className="flex flex-col mx-auto mt-25 ml-64">
        <div className="mx-6">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Create Voucher
        </span>
        </div>
        <div className="mx-8 p-5 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
        <CreateVoucherForm />
        </div>
      
    </div>
    );
  }
  