"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const PageHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center h-20 bg-[#7B5137] px-6 md:px-30 relative">
      {/* Mobile Header */}
      <div className="md:hidden flex w-full justify-between items-center">
        {/* Menu Button */}
        <button
          className="text-amber-50 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <Image src="/assets/logos.png" alt="Logo" width={100} height={40} />
        </Link>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center gap-x-7">
        <Link href="/">
          <Image src="/assets/logos.png" alt="Logo" width={100} height={40} />
        </Link>
        <nav className="flex items-center gap-x-7">
          <Link href="/" className="text-amber-50 font-light">
            Home
          </Link>
          <Link href="/about" className="text-amber-50 font-light">
            About Us
          </Link>
          <Link href="/products" className="text-amber-50 font-light">
            Products
          </Link>
          <Link href="/contact" className="text-amber-50 font-light">
            Contact Us
          </Link>
        </nav>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex gap-x-3">
        <button className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium">
          Log In
        </button>
        <button className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium">
          Sign Up
        </button>
      </div>

      {/* Mobile Dropdown Menu with Animation */}
      <div
        className={`absolute top-20 left-0 w-full bg-[#7B5137] flex flex-col items-center py-4 space-y-3 md:hidden transition-transform duration-300 ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <Link href="/" className="text-amber-50 font-light" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/about" className="text-amber-50 font-light" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>
        <Link href="/products" className="text-amber-50 font-light" onClick={() => setMenuOpen(false)}>
          Products
        </Link>
        <Link href="/contact" className="text-amber-50 font-light" onClick={() => setMenuOpen(false)}>
          Contact Us
        </Link>

        {/* Mobile Buttons */}
        <button className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium w-3/4">
          Log In
        </button>
        <button className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium w-3/4">
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
