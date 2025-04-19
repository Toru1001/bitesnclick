"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const CreateVoucherForm = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const generateCode = () => {
    const random = Math.random().toString(36).substring(2, 8);
    setCode(`${name.replace(/\s/g, "").slice(0, 4)}${random}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("vouchers").insert([
      {
        name,
        code,
        percent: parseFloat(percent),
        start_date: startDate,
        end_date: endDate,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error.message);
    } else {
      setSuccessMsg("Voucher created successfully!");
      setName("");
      setCode("");
      setPercent("");
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between w-full h-100"
      >
        <div className="flex justify-between space-x-4 items-start">
          <div className="flex flex-col justify-end gap-y-4 w-125">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold">
                Voucher Name
              </label>
              <input
                type="text"
                placeholder="Enter Voucher Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">Voucher Code</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Voucher Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-grow border p-2 rounded"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="text-[#E19517] text-sm underline cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">Discount Percent</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Discount"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="border p-2 rounded w-30"
                />
                <span>%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-y-4 w-125">
            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={(event) => {
              setName("");
              setCode("");
              setPercent("");
              setStartDate("");
              setEndDate("");
              setSuccessMsg("");
              event.preventDefault();
              router.back();
            }}
            className="border-1 border-[#E19517]  text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-[#E19517] text-white px-4 py-2 rounded hover:bg-[#E19517]/80 cursor-pointer"
          >
            Create
          </button>
        </div>

        {successMsg && (
          <p className="text-green-600 font-medium">{successMsg}</p>
        )}
      </form>
    </div>
  );
};

export default CreateVoucherForm;
