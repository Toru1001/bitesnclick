"use client";
import React from "react";
import Image from "next/image";
import { Facebook, Instagram, MailIcon } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <div className="relative h-120 md:h-120">
      <Image
        className="object-cover h-full w-full absolute z-0"
        src="/assets/footer.jpg"
        alt="Beans"
        width={300}
        height={300}
      />
      <div className="bg-[#240C03] w-full h-full absolute opacity-80 z-10">
        .
      </div>
      <div className="flex flex-col px-6 md:px-30 justify-center absolute z-20">
        <div className="flex mt-15">
          <span className=" text-lg md:text-6xl text-amber-50 text-center">
            You can't buy happiness, but you can buy coffee, and that's pretty
            close.
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-y-5 mt-5 md:mt-15 justify-center items-center md:justify-evenly border-1 rounded-md p-10 border-[#E19517]">
          <div className="flex flex-row gap-x-10 w-fit">
            <div className="flex">
              <Image
                className="object-cover h-15 w-15"
                src="/assets/time.svg"
                alt="Beans"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col text-amber-50 font-light text-sm">
              <span>Our Opening Time</span>
              <span>Everyday: </span>
              <span>11:30 AM - 7:00 PM</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center gap-x-5 w-50 md:border-l-1 md:border-r-1 border-[#E19517]">
            <button className="group bg-transparent p-2 h-fit w-fit rounded-full border border-gray-200 cursor-pointer hover:bg-amber-50 transition duration-300" onClick={() => window.open("https://www.facebook.com/homebitesdavao")}>
              <Facebook
                className="text-amber-50 group-hover:text-[#7B5137] transition duration-300"
                size={20}
              />
            </button>
            <button className="group bg-transparent p-2 h-fit w-fit rounded-full border border-gray-200 cursor-pointer hover:bg-amber-50 transition duration-300" onClick={() => window.open("https://www.instagram.com/homebitesdvo/")}>
              <Instagram
                className="text-amber-50 group-hover:text-[#7B5137] transition duration-300"
                size={20}
              />
            </button>
            <button className="group bg-transparent p-2 h-fit w-fit rounded-full border border-gray-200 cursor-pointer hover:bg-amber-50 transition duration-300 " onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=homebitesdavao@gmail.com")}>
              <MailIcon
                className="text-amber-50 group-hover:text-[#7B5137] transition duration-300"
                size={20}
              />
            </button>
          </div>
          <div className="flex flex-row gap-x-5 w-fit justify-center items-center">
            <div className="flex w-fit">
              <Image
                className="object-cover h-15 w-15"
                src="/assets/compas.svg"
                alt="Beans"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col text-amber-50 w-50 md:w-80 font-light text-sm">
              <span>Door 8 Gahol bldg., DMSF Drive, Bajada, Davao City, Davao City, Philippines, 8000</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col text-amber-50 items-center font-light text-xs md:text-sm mt-5 md:mt-10">
              <span>© Copyright 2025, All Rights Reserved by Home Bites Davao</span>
            </div>
      </div>
    </div>
  );
};

export default Footer;
