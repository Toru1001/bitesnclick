import { Circle, CircleCheck } from 'lucide-react';
import React from 'react'

interface SuccessModalProps {
    onClose: () => void;
  }
const SuccessModal : React.FC <SuccessModalProps> = ({ onClose }) => {

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      };

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40" onClick={handleOverlayClick}>
      <div className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold justify-center text-xl">Order Processed</span>
        </div>
        {/* Items Start Here */}
        <div className="flex flex-col justify-center w-100">
            <CircleCheck className="text-[#E19517] w-20 h-20 mx-auto mt-4" />
            <span className="text-center text-lg font-semibold mt-4">Your order has been successfully placed!</span>
        </div>
        
        </div>
      </div>
    </>
  )
}

export default SuccessModal