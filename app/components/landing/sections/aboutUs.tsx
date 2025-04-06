import React from 'react'
import Image from 'next/image'

const AboutUs : React.FC = () => {
  return (
    <div className="relative">
         <Image
                    className="hidden md:block absolute top-0 right-0 z-0"
                    src="/assets/aboutimg.png"
                    alt="Beans"
                    width={300}
                    height={300}
                  />
                  <Image
                    className="block md:hidden absolute top-0 right-0 z-0"
                    src="/assets/aboutimg.png"
                    alt="Beans"
                    width={150}
                    height={150}
                  />
        <div className='flex flex-col mb-5 mx-6 md:mx-30'>
        <div className="flex h-5 md:h-20 items-end">
            <span className='font-bold text-3xl md:text-5xl text-[#240C03] text-end'>
                About Us
            </span>
        </div>
        <div className="flex flex-col md:flex-row items-center mt-10">
            <div className="flex flex-col items-center p-5 bg-[#F6E0BA] rounded-3xl border-4 border-[#240C03] h-70 md:h-fit w-60 md:w-130 z-10">
                <Image
                              className="rounded-3xl object-cover md:h-70 md:w-70"
                              src="/assets/mision.png"
                              alt="Cake"
                              width={180}
                              height={180}
                            />
                <span className='font-bold pt-3 text-sm md:text-lg text-[#240C03]'>
                    Mission
                    </span>
                    <span className='font-light text-xs md:text-sm text-[#240C03]'>
                    Home Bites Davao
                    </span>
            </div>
            <div className="hidden md:block flex relative bg-[#7B5137] w-full h-fit md:h-60 px-10 md:px-15 py-5 mt-3 md:pt-10 z-10 rounded-tr-3xl rounded-br-3xl">
                <span className='text-amber-50 w-fit text-md text-center md:text-left md:text-xl'>
                Home Bites Davao seeks to serve exceptional coffee and pastries in a welcoming space, creating a homey atmosphere for customers.
                </span>
                <Image
                    className="hidden md:block absolute bottom-10 right-10 text-[#99662E] z-0"
                    src="/assets/quotation.svg"
                    alt="Beans"
                    width={80}
                    height={80}
                  />
            </div>
            <div className="block md:hidden flex relative bg-[#7B5137] w-full h-fit md:h-60 px-10 md:px-15 py-5 mt-3 md:pt-10 z-10 rounded-3xl">
                <span className='text-amber-50 w-fit text-md text-center md:text-left md:text-xl'>
                Home Bites Davao seeks to serve exceptional coffee and pastries in a welcoming space, creating a homey atmosphere for customers.
                </span>
                <Image
                    className="hidden md:block absolute bottom-10 right-10 text-[#99662E] z-0"
                    src="/assets/quotation.svg"
                    alt="Beans"
                    width={80}
                    height={80}
                  />
            </div>

        </div>
        <div className="flex flex-col-reverse md:flex-row items-center mt-10">
        <div className="hidden md:block flex relative bg-[#7B5137] w-full h-fit md:h-60 px-10 md:px-15 py-5 mt-3 md:pt-10 z-10 rounded-tl-3xl rounded-bl-3xl">
                <span className='text-amber-50 w-fit text-md text-center md:text-left md:text-xl'>
                Home Bites Davao envisions becoming Davao’s favorite coffee spot, known for its quality, affordable, and warmth, bringing coffee lovers together.                </span>
                <Image
                    className="hidden md:block absolute bottom-10 right-10 text-[#99662E] z-0"
                    src="/assets/quotation.svg"
                    alt="Beans"
                    width={80}
                    height={80}
                  />
            </div>
            <div className="block md:hidden flex relative bg-[#7B5137] w-full h-fit md:h-60 px-10 md:px-15 py-5 mt-3 md:pt-10 z-10 rounded-3xl">
                <span className='text-amber-50 w-fit text-md text-center md:text-left md:text-xl'>
                Home Bites Davao envisions becoming Davao’s favorite coffee spot, known for its quality, affordable, and warmth, bringing coffee lovers together.                </span>
                <Image
                    className="hidden md:block absolute bottom-10 right-10 text-[#99662E] z-0"
                    src="/assets/quotation.svg"
                    alt="Beans"
                    width={80}
                    height={80}
                  />
            </div>
            <div className="flex flex-col items-center p-5 bg-[#F6E0BA] rounded-3xl border-4 border-[#240C03] h-70 md:h-fit w-60 md:w-130">
                <Image
                              className="rounded-3xl object-cover md:h-70 md:w-70"
                              src="/assets/vision.png"
                              alt="Cake"
                              width={150}
                              height={150}
                            />
                <span className='font-bold pt-3 text-sm md:text-lg text-[#240C03]'>
                    Vision
                    </span>
                    <span className='font-light text-xs md:text-sm text-[#240C03]'>
                    Home Bites Davao
                    </span>
            </div>

        </div>
    </div>
    </div>
    
  )
}

export default AboutUs