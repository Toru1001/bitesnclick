import { X } from 'lucide-react';
import React, { useState } from 'react';

interface PaymentMethodModalProps {
    onClose: () => void;
    onSelectPaymentMethod: (method: string) => void;
    method: string;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ onClose, onSelectPaymentMethod, method }) => {
    const [selectedMethod, setSelectedMethod] = useState<string | null>(method || null);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleMethodClick = (method: string) => {
        setSelectedMethod(method);
        onSelectPaymentMethod(method); 
        onClose();
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
                    <div className="flex w-full justify-center border-b-3 pb-2 border-[#E19517]">
                        <span className="font-semibold text-xl">Payment Method</span>
                    </div>
                    {/* Items Start Here */}
                    <div className="flex flex-col gap-y-2 mt-5 w-100">
                        <div
                            className={`flex flex-col px-5 rounded-lg border-1 border-gray-500 py-3 cursor-pointer ${
                                selectedMethod === 'Cash On Delivery' ? 'bg-[#E19517] text-amber-50' : ''
                            }`}
                            onClick={() => handleMethodClick('Cash On Delivery')}
                        >
                            <span className="text-lg font-semibold">Cash On Delivery</span>
                            <span>Pay upon delivery.</span>
                        </div>
                        <div
                            className={`flex flex-col px-5 border-1 rounded-lg border-gray-500 py-3 cursor-pointer ${
                                selectedMethod === 'GCASH' ? 'bg-[#E19517] text-amber-50' : ''
                            }`}
                            onClick={() => handleMethodClick('GCASH')}
                        >
                            <span className="text-lg font-semibold">GCASH</span>
                            <span>Process online payment.</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentMethodModal;