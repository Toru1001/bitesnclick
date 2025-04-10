"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const CreateVoucher = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Create Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Voucher Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Voucher Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-grow border p-2 rounded"
          />
          <button type="button" onClick={generateCode} className="text-blue-600 text-sm underline">
            Generate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Discount"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="border p-2 rounded w-24"
          />
          <span>%</span>
        </div>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setName("");
              setCode("");
              setPercent("");
              setStartDate("");
              setEndDate("");
              setSuccessMsg("");
            }}
            className="px-4 py-2 bg-red-100 text-red-600 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>

        {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}
      </form>
    </div>
  );
};

export default CreateVoucher;
