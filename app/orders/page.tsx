"use client";
import { useState } from "react";
import OngoingTab from "./ongoing_tab";
import CompletedTab from "./completed_tab";
import CancelledTab from "./cancelled_tab";

export default function Home() {
    const [activeTab, setActiveTab] = useState("ongoing");

    return (
        <div>
            <div className="mt-5 mx-6 md:mx-30">
                <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
                    Check Orders
                </span>
                <div className="flex gap-y-3 mt-5 w-full px-5 py-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                    <div
                        className={`flex justify-center w-80 pb-1 cursor-pointer ${
                            activeTab === "ongoing" ? "border-b-2 border-[#E19517]" : ""
                        }`}
                        onClick={() => setActiveTab("ongoing")}
                    >
                        <span>Ongoing Orders</span>
                    </div>
                    <div
                        className={`flex justify-center w-80 pb-1 cursor-pointer ${
                            activeTab === "completed" ? "border-b-2 border-[#E19517]" : ""
                        }`}
                        onClick={() => setActiveTab("completed")}
                    >
                        <span>Completed</span>
                    </div>

                    <div
                        className={`flex justify-center w-80 pb-1 cursor-pointer ${
                            activeTab === "cancelled" ? "border-b-2 border-[#E19517]" : ""
                        }`}
                        onClick={() => setActiveTab("cancelled")}
                    >
                        <span>Cancelled</span>
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