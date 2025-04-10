import React from 'react';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  buttonText: string;
  title: string;
  description: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  onClose, 
  onConfirm, 
  buttonText, 
  description, 
  title 
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40">
      <div className="bg-white rounded-lg p-5 max-w-md w-full">
        <div className="px-5 border-b border-[#E19517] py-2 mb-4">
          <span className='text-xl font-semibold'>{title}</span>
        </div>
        <div className="px-5 mb-6">
          <span className=''>{description}</span>
        </div>
        <div className="flex justify-end gap-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-[#E19517] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;