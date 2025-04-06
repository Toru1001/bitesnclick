import React from 'react'
import Image from 'next/image'
const Banner2 : React.FC = () => {
  return (
    <div className='flex justify-evenly items-center h-13 md:h-20 bg-[#E19517] px-6 relative'>
            <Image className='hidden md:block' src="/assets/miniBeans.png" alt="Logo" width={60} height={60} />
            <Image className='block md:hidden' src="/assets/miniBeans.png" alt="Logo" width={30} height={30} />
            <div className="text-lg md:text-2xl font-semibold text-amber-50">Cappuccino</div>
            <Image className='hidden md:block' src="/assets/miniBeans.png" alt="Logo" width={60} height={60} />
            <Image className='block md:hidden' src="/assets/miniBeans.png" alt="Logo" width={30} height={30} />
            <div className="text-2xl hidden md:block font-semibold text-amber-50">Espresso</div>
            <Image className='hidden md:block' src="/assets/miniBeans.png" alt="Logo" width={60} height={60} />
            <div className="text-2xl hidden md:block font-semibold text-amber-50">Mocha</div>
            <Image className='hidden md:block' src="/assets/miniBeans.png" alt="Logo" width={60} height={60} />
            <div className="text-2xl hidden md:block font-semibold text-amber-50">Americano</div>
            <Image className='hidden md:block' src="/assets/miniBeans.png" alt="Logo" width={60} height={60} />
        </div>
  )
}

export default Banner2