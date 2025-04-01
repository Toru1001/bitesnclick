import Link from "next/link";
import PageHeader from "./components/header/pageHeader";
import Hero from "./components/landing/hero";
import Banner from "./components/landing/banner";
import Section2 from "./components/landing/section2";
import Banner2 from "./components/landing/banner2";
import ProductSection from "./components/landing/product";
import OurShop from "./components/landing/ourShop";
import AboutUs from "./components/landing/aboutUs";
import Footer from "./components/landing/footer";

export default function Home() {
  return (
    <>
    <PageHeader/>
    <Hero/>
    <Banner2/>
    <Section2/>
    <Banner2/>
    </>
  );
}
