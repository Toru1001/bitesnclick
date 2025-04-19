import { CircleUserRoundIcon } from "lucide-react";
import React from "react";

const AdminHeader: React.FC = () => {
    return (
        <header className="flex justify-end items-center h-fit pt-5 fixed top-0 left-0 w-full border-b-1 bg-amber-50 border-amber-50 shadow-md z-50">
            <div className="relative w-fit px-4 py-4">
                <span className="bg-[#F2AA6B] pl-3 pr-9 mt-2 py-2 mr-6 rounded-xl z-0">Good Day, Admin!</span>
                <div className="flex justify-center items-center absolute h-12 w-12 top-0 right-6 z-10 bg-gray-300 rounded-full">
                <CircleUserRoundIcon className="text-xl text-gray-600 w-full h-full p-1"></CircleUserRoundIcon>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;