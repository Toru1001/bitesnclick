import React from 'react';
import Image from 'next/image';

const Section2: React.FC = () => {
  return (
    <div className='relative flex flex-col gap-10 pt-20 justify-items-center mb-10'>
      {/* Background Image */}
      <Image
        className='hidden md:block absolute top-10 left-0 z-0'
        src='/assets/leftbeans.png'
        alt='Beans'
        width={450}
        height={450}
      />
      <Image
        className='block md:hidden absolute top-5 left-0 z-0'
        src='/assets/leftbeans.png'
        alt='Beans'
        width={150}
        height={150}
      />

      {/* Content */}
      <div className='relative flex flex-col items-center text-center z-10'>
        <div className='font-bold text-3xl md:text-7xl text-[#240C03]'>We Provide</div>
        <div className='font-bold text-2xl md:text-5xl text-[#240C03]'>Quality coffee for delivery</div>
        <div className='font-light text-xs md:text-base pt-5 text-[#240C03] w-70 md:w-150'>
          Enjoy the rich aroma and exceptional taste of our carefully crafted coffee, freshly brewed and delivered
          straight to your doorstep—because great coffee should come with convenience.
        </div>
      </div>

      {/* Coffee Images */}
      <div className='block mb:hidden mt-5'>
        <div className='flex gap-x-5 place-items-center justify-center'>
          {['katsu', 'darkcoffee', 'matcha'].map((item, index) => (
            <a key={index} href=''>
              <Image
                className='rounded-3xl transition-transform duration-300 hover:scale-110'
                src={`/assets/${item}.png`}
                alt='Coffee'
                width={index === 1 ? 350 : 300}
                height={index === 1 ? 350 : 300}
              />
            </a>
          ))}
        </div>
      </div>

      <div className='flex hidden mb:block mt-5'>
        <div className='flex place-items-center'>
          {['katsu', 'darkcoffee', 'matcha'].map((item, index) => (
            <a key={index} href=''>
              <Image
                className='rounded-3xl transition-transform duration-300 hover:scale-110'
                src={`/assets/${item}.png`}
                alt='Coffee'
                width={index === 1 ? 100 : 50}
                height={index === 1 ? 100 : 50}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section2;
