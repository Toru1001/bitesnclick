import Link from "next/link";
import PageHeader from "./components/header/pageHeader";
import Hero from "./components/landing/hero";
import Banner from "./components/landing/banner";
import Section2 from "./components/landing/section2";
import Banner2 from "./components/landing/banner2";

export default function Home() {
  return (
    <>
    <PageHeader/>
    <Hero/>
    <Banner/>
    <Section2/>
    <Banner2/>
    </>
  );
}
