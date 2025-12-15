import { CircleUserRoundIcon } from "lucide-react";
import { Menu } from "@headlessui/react";
import React from "react";
import EditAdminAccountModal from "./edit-admin-account";
import { useRouter } from "next/navigation";

const AdminHeader: React.FC = () => {
  const router = useRouter();
  const [editAdminModalOpen, setEditAdminModalOpen] = React.useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("admin_id");
    router.replace("/login/admin");
  };
  return (
    <header className="flex justify-end items-center h-fit pt-5 fixed top-0 left-0 w-full border-b-1 bg-amber-50 border-amber-50 shadow-md z-50">
      <div className="relative w-fit px-4 py-4">
        <Menu as="div" className="relative inline-block text-left w-fit">
          <div>
            <Menu.Button className="relative cursor-pointer">
              <span className="absolute right-1 w-60 bg-[#F2AA6B] pl-3 pr-9 mt-1 py-2 mr-6 rounded-xl z-0">
                Good Day, Admin!
              </span>
              <div className="flex justify-center items-center absolute h-12 w-12 top-0 right-5 z-10 bg-gray-300 rounded-full">
                <CircleUserRoundIcon className="text-xl text-gray-600 w-full h-full p-1"></CircleUserRoundIcon>
              </div>
            </Menu.Button>
          </div>

          <Menu.Items
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <div className="py-1">
              <Menu.Item>
                <a
                  onClick={() => {setEditAdminModalOpen(true)}}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-[#E19517]/30 data-focus:text-[#E19517] data-focus:outline-hidden"
                >
                  Account Settings
                </a>
              </Menu.Item>
              <Menu.Item>
                <button
                onClick={handleLogout}
                  className="block w-full cursor-pointer px-4 py-2 text-left text-sm  text-gray-700 data-focus:bg-[#E19517]/30 data-focus:text-[#E19517] data-focus:outline-hidden"
                >
                  Sign out
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      {editAdminModalOpen && <EditAdminAccountModal onClose={() => setEditAdminModalOpen(false)} />}
    </header>
  );
};

export default AdminHeader;
