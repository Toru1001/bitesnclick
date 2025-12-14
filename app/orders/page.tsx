"use client";
import { useState } from "react";
import OngoingTab from "./ongoing_tab";
import CompletedTab from "./completed_tab";
import CancelledTab from "./cancelled_tab";

export default function Home() {
    const [activeTab, setActiveTab] = useState("ongoing");

    return (
        <div className="w-full overflow-x-hidden">
            <div className="mt-5 mx-3 sm:mx-6 md:mx-30">
                <span className="font-bold text-xl sm:text-2xl md:text-4xl text-[#240C03]">
                    Check Orders
                </span>
                <div className="flex gap-x-0 sm:gap-x-1 md:gap-x-2 mt-5 w-full rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <div
                        className={`flex justify-center items-center flex-1 min-w-0 py-3 cursor-pointer transition-colors ${
                            activeTab === "ongoing" 
                                ? "border-b-3 border-[#E19517] bg-[#E19517]/5" 
                                : "border-b-3 border-transparent hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("ongoing")}
                    >
                        <span className={`text-[10px] sm:text-sm md:text-base text-center px-1 sm:px-2 font-medium ${
                            activeTab === "ongoing" ? "text-[#E19517]" : "text-gray-600"
                        }`}>Ongoing Orders</span>
                    </div>
                    <div
                        className={`flex justify-center items-center flex-1 min-w-0 py-3 cursor-pointer transition-colors ${
                            activeTab === "completed" 
                                ? "border-b-3 border-[#E19517] bg-[#E19517]/5" 
                                : "border-b-3 border-transparent hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("completed")}
                    >
                        <span className={`text-[10px] sm:text-sm md:text-base text-center px-1 sm:px-2 font-medium ${
                            activeTab === "completed" ? "text-[#E19517]" : "text-gray-600"
                        }`}>Completed</span>
                    </div>

                    <div
                        className={`flex justify-center items-center flex-1 min-w-0 py-3 cursor-pointer transition-colors ${
                            activeTab === "cancelled" 
                                ? "border-b-3 border-[#E19517] bg-[#E19517]/5" 
                                : "border-b-3 border-transparent hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("cancelled")}
                    >
                        <span className={`text-[10px] sm:text-sm md:text-base text-center px-1 sm:px-2 font-medium ${
                            activeTab === "cancelled" ? "text-[#E19517]" : "text-gray-600"
                        }`}>Cancelled</span>
                    </div>
                </div>
                {/* Dynamic Pages */}
                <div className="w-full mt-5">
                    {activeTab === "ongoing" && (
                        <OngoingTab />
                    )}
                    {activeTab === "completed" && (
                        <CompletedTab />
                    )}
                    {activeTab === "cancelled" && (
                        <CancelledTab />
                    )}
                </div>
            </div>
        </div>
    );
}