import { faCartPlus, faClipboardCheck, faMugHot, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RefreshCcwDot } from 'lucide-react';
import React from 'react'

interface StatusProps {
    status: string;
}

const Status : React.FC <StatusProps> = (status) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
          case "Pending":
            return (
             <div className="flex gap-x-3 items-center">
                <FontAwesomeIcon
                icon={faCartPlus}
                className="text-[#E19517] text-sm"
              />
                <span className="text-[#E19517] text-sm">Pending</span>
             </div>
            );
          case "Processing":
            return <RefreshCcwDot className="text-[#E19517] text-lg" />;
          case "Brewing":
            return (
              <FontAwesomeIcon icon={faMugHot} className="text-[#E19517] text-lg" />
            );
          case "Shipped":
            return (
              <FontAwesomeIcon
                icon={faTruckFast}
                className="text-[#E19517] text-lg"
              />
            );
          case "Order Complete":
            return (
              <FontAwesomeIcon
                icon={faClipboardCheck}
                className="text-[#E19517] text-lg"
              />
            );
          default:
            return (
              <FontAwesomeIcon
                icon={faCartPlus}
                className="text-[#E19517] text-lg"
              />
            );
        }
      };
  return (
    <div>Status</div>
  )
}

export default Status