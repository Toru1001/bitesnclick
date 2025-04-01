import React from "react";
import Image from "next/image";
import ProductCard from "../model/product-card";

const ProductSection: React.FC = () => {
  return (
    <div className="flex flex-col relative h-fit px-6 md:px-30 mb-5">
      {/* Background Images */}
      <Image
        className="hidden md:block absolute top-0 right-0 z-0"
        src="/assets/topbeans.png"
        alt="Beans"
        width={450}
        height={450}
      />
      <Image
        className="block md:hidden absolute top-0 right-0 z-0"
        src="/assets/topbeans.png"
        alt="Beans"
        width={150}
        height={150}
      />

      {/* Heading Section */}
      <div className="flex h-40 md:h-80 w-full items-end justify-between z-10">
        <div className="flex-row">
          <div className="font-bold text-2xl md:text-3xl md:text-7xl text-[#240C03]">
            The Coffee
          </div>
          <div className="font-bold text-2xl md:text-3xl md:text-7xl text-[#240C03]">
            we work with
          </div>
          <div className="font-light text-xs md:text-base pt-2 md:pt-5 text-[#240C03] w-60 md:w-70 md:w-110">
            We deliver freshly roasted, high-quality coffee straight to your
            doorstep for a rich and flavorful experience.
          </div>
        </div>
        <div>
          <button className="border-2 border-[#E19517] rounded-lg py-2 px-4 cursor-pointer text-[#E19517] font-medium z-10">
            See All
          </button>
        </div>
      </div>

      {/* Product Cards Section (Scrollable on Small Screens) */}
      <div className="overflow-x-auto overflow-visible scrollbar-hide h-full w-full pb-3 pt-10 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none">
        <div className="flex gap-4 flex-nowrap scroll-smooth scroll-snap-x-mandatory">
          <ProductCard
            price={110}
            category="Espresso"
            image="/assets/coffee1.png"
            itemName="Americano"
            description="Boost your productivity and build your mood with a short."
          />
          <ProductCard
            price={110}
            category="Espresso"
            image="/assets/matcha.png"
            itemName="Matcha Einspanner"
            description="Boost your productivity and build your mood with a short."
          />
          <ProductCard
            price={110}
            category="Espresso"
            image="/assets/coffee3.png"
            itemName="Pink Milk + Espresso"
            description="Boost your productivity and build your mood with a short."
          />
          <ProductCard
            price={110}
            category="Espresso"
            image="/assets/coffee2.png"
            itemName="Matcha Einspanner"
            description="Boost your productivity and build your mood with a short."
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
