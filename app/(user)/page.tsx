"use client";

import Hero from "@/app/components/landing/sections/hero";
import Banner from "@/app/components/landing/sections/banner";
import Section2 from "@/app/components/landing/sections/section2";
import Banner2 from "@/app/components/landing/sections/banner2";
import ProductSection from "@/app/components/landing/sections/product";
import OurShop from "@/app/components/landing/sections/ourShop";
import AboutUs from "@/app/components/landing/sections/aboutUs";
import Footer from "@/app/components/landing/sections/footer";
import Chatbot from "@/app/components/chatbot/chatbot";

export default function Home() {
  

  return (
    <div className="relative">
      <Hero />
      <Banner />
      <Section2 />
      <Banner2 />
      <ProductSection />
      <div id="about"><OurShop /></div>
      <AboutUs />
      <div id="footer"><Footer /></div>

    </div>
  );
}
