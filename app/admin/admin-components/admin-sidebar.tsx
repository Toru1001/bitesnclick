"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaGift,
  FaArchive,
  FaClipboardList,
} from "react-icons/fa";
import AdminHeader from "./admin-header";
import Image from "next/image";

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    {
      name: "Incoming Orders",
      path: "/admin/orders",
      icon: <FaClipboardList />,
    },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Discounts", path: "/admin/discounts", icon: <FaTags /> },
    { name: "Vouchers", path: "/admin/vouchers", icon: <FaGift /> },
    { name: "Archives", path: "/admin/archives", icon: <FaArchive /> },
  ];

  return (
    <div className="">
      <AdminHeader />
      <aside className="h-screen w-64 bg-[#7B5137] text-white flex flex-col fixed top-0 z-50">
        <div className="flex justify-center border-b-1 border-amber-50">
          <Image src="/assets/logos.png" alt="Logo" width={160} height={80} />
        </div>

        <nav className="flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="border-b border-amber-50">
                <Link href={item.path}>
                  <span
                    className={`flex pl-5 items-center gap-2.5 p-5 ${
                      pathname === item.path
                        ? "bg-[#E19517]"
                        : "hover:bg-[#E19517]/40"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSidebar;
