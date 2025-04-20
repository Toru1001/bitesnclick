import React from 'react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



const PopUpForm : React.FC = () => {
  return (
    <div>
        <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-lg border-b-2 border-gray-400 pb-2'>View Product</DialogTitle>
            </DialogHeader>
            <div className="w-fit">
                
            </div>
          </DialogContent>
    </div>
  )
}

export default PopUpForm;