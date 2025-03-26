import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-auto md:h-160 bg-[#7B5137] px-6 md:px-30 py-10 md:py-0 text-center md:text-left">
      <div className="flex flex-col gap-5 md:gap-10 w-full md:w-200 items-center md:items-start">
        <div className="flex flex-col gap-2 md:gap-5">
          <div className="font-bold text-amber-50 text-3xl md:text-6xl">Enjoy Your Coffee</div>
          <div className="font-bold text-amber-50 text-3xl md:text-6xl">Before Your Activity</div>
        </div>
        <div className="text-amber-50 w-full text-sm md:text-base md:w-140 px-4 md:px-0">
          Boost your productivity and build your mood with a short break in the most comfortable place in Davao. Enjoy your coffee like never before.
        </div>
        <div className="flex items-center gap-4">
          <button className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-2 px-4 cursor-pointer text-amber-50 font-medium w-fit">
            Order Now
          </button>
          <div className="absolute w-[100px] h-[100px] right-10 block md:hidden">
        <Image className='absolute top-6 left-2 z-0' src="/assets/beans.png" alt="Beans" width={100} height={100} />
        <Image className='absolute top-0 left-0 z-10' src="/assets/coffee.png" alt="Coffee" width={100} height={100} />
      </div>
        </div>
      </div>
      
      <div className="relative w-[600px] h-[600px] hidden md:block">
        <Image className='absolute top-35 left-10 z-0' src="/assets/beans.png" alt="Beans" width={500} height={500} />
        <Image className='absolute top-0 left-0 z-10' src="/assets/coffee.png" alt="Coffee" width={600} height={600} />
      </div>
    </div>
  );
};

export default Hero;