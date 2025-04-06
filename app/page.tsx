"use client";

import Hero from "./components/landing/sections/hero";
import Banner from "./components/landing/sections/banner";
import Section2 from "./components/landing/sections/section2";
import Banner2 from "./components/landing/sections/banner2";
import ProductSection from "./components/landing/sections/product";
import OurShop from "./components/landing/sections/ourShop";
import AboutUs from "./components/landing/sections/aboutUs";
import Footer from "./components/landing/sections/footer";

export default function Home() {
  

  return (
    <>
      <Hero />
      <Banner />
      <Section2 />
      <Banner2 />
      <ProductSection />
      <div id="about"><OurShop /></div>
      <AboutUs />
      <div id="footer"><Footer /></div>
    </>
  );
}
