import React, { useState } from 'react';


  interface SetAvailabilityModalProps {
    isOpen: boolean;
    product: {
      productid: number;
      name: string;
      isarchive: boolean;
    };
    onClose: () => void;
    onSet: (isArchive: boolean) => void;
    currentStatus: boolean;
  }
  
const SetAvailabilityModal: React.FC<SetAvailabilityModalProps> = ({
  isOpen,
  product,
  onClose,
  onSet,
  currentStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus ? 'unavailable' : 'available');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
        <h2 className="text-lg font-semibold mb-4">Set Product Availability</h2>
        
        <div className="mb-4">
          <label className="flex items-center mb-2">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={selectedStatus === 'available'}
              onChange={() => setSelectedStatus('available')}
              className="mr-2"
            />
            Available
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="unavailable"
              checked={selectedStatus === 'unavailable'}
              onChange={() => setSelectedStatus('unavailable')}
              className="mr-2"
            />
            Unavailable
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSet(selectedStatus === 'unavailable'); 
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetAvailabilityModal;
