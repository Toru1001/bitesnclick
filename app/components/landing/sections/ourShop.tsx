import React from "react";
import Image from "next/image";
const OurShop: React.FC = () => {
  return (
    <div className="flex flex-col h-fit mt-10 md:mt-30 mb-10 px-6 md:px-30">
      <div className="flex flex-col-reverse md:flex-row w-full items-center justify-center md:justify-between">
        <div className="">
          <Image
            className="hidden md:block"
            src="/assets/beanheart.png"
            alt="Beans"
            width={250}
            height={250}
          />
          <Image
            className="block md:hidden mt-10"
            src="/assets/beanheart.png"
            alt="Beans"
            width={150}
            height={150}
          />
        </div>
        <div className="flex flex-col items-center md:items-end">
          <span className="font-bold text-4xl md:text-7xl text-[#240C03] text-end">
            Our Shop
          </span>
          <span className="font-bold text-2xl md:text-5xl text-[#240C03] text-end">
            Our dream gallery
          </span>
          <span className="font-light text-xs md:text-base pt-2 md:pt-5 text-[#240C03] w-80 md:w-110 text-center md:text-end">
            Experience the perfect brew at our coffee shop, where every cup is
            crafted with passion and the finest beans. Fresh, flavorful, and
            made just for you!
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row mt-10 w-full gap-5 justify-center">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Image
              className="rounded-2xl object-cover w-130 h-40 md:h-50"
              src="/assets/productimg2.png"
              alt="Cake"
              width={250}
              height={250}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-center mt-4 gap-y-5 md:gap-x-5">
          <Image
              className="rounded-2xl object-cover w-full md:w-80 h-40 md:h-50"
              src="/assets/interior.png"
              alt="Interior"
              width={250}
              height={250}
            />
            <Image
              className="rounded-2xl object-cover w-full h-40 md:h-50"
              src="/assets/productimg.png"
              alt="Drinks"
              width={250}
              height={250}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            className="rounded-2xl object-cover h-40 md:h-105 md:w-full"
            src="/assets/homebites.png"
            alt="Home Bites Sign"
            width={500}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default OurShop;
