"use client";

import Link from "next/link";
import React, { startTransition, useEffect } from "react";
import Image from "next/image";
import {
  MenuIcon,
  X,
  ShoppingCart,
  Truck,
  CircleUserRoundIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginModal from "../modal/login_modal";
import SignUpModal from "../modal/signup_modal";
import { Session } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface PageHeaderProps {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ session, setSession }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const modalType = searchParams.get("modal");

  const supabase = createClientComponentClient();

  const closeModal = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    router.push(url.pathname + url.search);
  };

  const openModal = (type: "login" | "signup") => {
    const url = new URL(window.location.href);
    url.searchParams.set("modal", type);
    router.push(url.pathname + url.search);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    localStorage.clear();
  };

  const renderAuthButtons = () => {
    if (session) {
      return (
        <>
          <div className="flex gap-x-5">
            <button className="cursor-pointer text-amber-50 hover:text-[#E19517]">
              <ShoppingCart size={32}> </ShoppingCart>
            </button>
            <button className="cursor-pointer text-amber-50 hover:text-[#E19517]">
              <Truck size={32}></Truck>
            </button>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="cursor-pointer text-amber-50 hover:text-[#E19517]">
                  <CircleUserRoundIcon size={32}></CircleUserRoundIcon>
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href={"/account"}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-[#E19517]/30 data-focus:text-[#E19517] data-focus:outline-hidden"
                    >
                      Account Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm  text-gray-700 data-focus:bg-[#E19517]/30 data-focus:text-[#E19517] data-focus:outline-hidden cursor-pointer"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </>
      );
    } else {
      return (
        <>
          <button
            className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium"
            onClick={() => openModal("login")}
          >
            Log In
          </button>
          <button
            className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium"
            onClick={() => openModal("signup")}
          >
            Sign Up
          </button>
        </>
      );
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      startTransition(() => {
        router.push("/");
        setTimeout(() => {
          const target = document.getElementById(id);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }, 300); 
      });
    }
  };

  return (
    <>
      <header className="flex justify-between items-center h-20 bg-[#7B5137] px-6 md:px-30 relative z-20">
        {/* Mobile Header */}
        <div className="md:hidden flex w-full justify-between items-center">
          <button
            className="text-amber-50 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={30} /> : <MenuIcon size={30} />}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <Image src="/assets/logos.png" alt="Logo" width={100} height={40} />
          </Link>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-x-7">
          <Link href="/">
            <Image src="/assets/logos.png" alt="Logo" width={100} height={40} />
          </Link>
          <nav className="flex items-center gap-x-7">
            <button
              onClick={() => router.push("/")}
              className="text-amber-50 hover:text-[#E19517] font-light cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/products')}
              className="text-amber-50 hover:text-[#E19517] font-light cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-amber-50 hover:text-[#E19517] font-light cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("footer")}
              className="text-amber-50 hover:text-[#E19517] font-light cursor-pointer"
            >
              Contact Us
            </button>
          </nav>
        </div>

        {/* Desktop Auth/Profile Buttons */}
        <div className="hidden md:flex gap-x-3">{renderAuthButtons()}</div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`absolute top-20 left-0 w-full bg-[#7B5137] flex flex-col items-center py-4 space-y-3 md:hidden transition-transform duration-300 z-20 ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0 pointer-events-none"
          }`}
        >
           {[
            { label: "Home", id: "" },
            { label: "Products", id: "products" },
            { label: "About Us", id: "about" },
            { label: "Contact Us", id: "footer" },
          ].map(({ label, id }, i) => (
            <button
              key={i}
              className="text-amber-50 font-light cursor-pointer"
              onClick={() => {
                setMenuOpen(false);
                if (id === "products") router.push("/products");
                else scrollToSection(id);
              }}
            >
              {label}
            </button>
            ))}

          {session ? (
            <>
              <Link href={"/cart"} className="text-amber-50 font-light">
                Cart
              </Link>
              <Link href={"/orders"} className="text-amber-50 font-light">
                Orders
              </Link>
              <Link href={"/account"} className="text-amber-50 font-light">
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium w-3/4 z-20 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="border-2 border-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium w-3/4 z-20"
                onClick={() => {
                  setMenuOpen(false);
                  openModal("login");
                }}
              >
                Log In
              </button>
              <button
                className="border-2 border-[#E19517] bg-[#E19517] rounded-lg py-1 px-4 cursor-pointer text-amber-50 font-medium w-3/4 z-20"
                onClick={() => {
                  setMenuOpen(false);
                  openModal("signup");
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Render modals based on URL */}
      {modalType === "login" && (
        <LoginModal
          onClose={closeModal}
          onSwitchToSignUp={() => {
            openModal("signup");
          }}
        />
      )}

      {modalType === "signup" && (
        <SignUpModal
          onClose={closeModal}
          onSwitchToLogin={() => {
            openModal("login");
          }}
        />
      )}
    </>
  );
};

export default PageHeader;
