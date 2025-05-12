"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const CreateVoucherForm = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isShown, setIsShown] = useState(true);
  const [errors, setErrors] = useState({
    name: false,
    code: false,
    percent: false,
    startDate: false,
    endDate: false,
    dateOrder: false,
  });

  const router = useRouter();

  const generateCode = () => {
    const random = Math.random().toString(36).substring(2, 8);
    setCode(`${name.replace(/\s/g, "").slice(0, 4)}${random}`);
  };

  const validateEndDate = (dateStr: string): boolean => {
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time
    return selected >= today;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      name: name.trim() === "",
      code: code.trim() === "",
      percent:
        percent === "" ||
        isNaN(parseFloat(percent)) ||
        parseFloat(percent) < 1 ||
        parseFloat(percent) > 100,
      startDate: startDate === "",
      endDate: endDate === "",
      dateOrder: false,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!validationErrors.endDate && !validateEndDate(endDate)) {
      alert("End date should not be before today.");
      return;
    }

    if (!validationErrors.startDate && !validationErrors.endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        alert("End date should not be before start date.");
        return;
      }
    }

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((err) => err);
    if (hasErrors) {
      alert("Please fill in empty fields.");
      return;
    }

    const { error } = await supabase.from("vouchers").insert([
      {
        name,
        code,
        percent: parseFloat(percent),
        start_date: startDate,
        end_date: endDate,
        show_voucher: isShown,
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
      setErrors({
        name: false,
        code: false,
        percent: false,
        startDate: false,
        endDate: false,
        dateOrder: false,
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col justify-between w-full h-100">
        <div className="flex justify-between space-x-4 items-start">
          <div className="flex flex-col justify-end gap-y-4 w-125">
            {/* Voucher Name */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="font-semibold">Voucher Name</label>
              <input
                type="text"
                placeholder="Enter Voucher Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border p-2 rounded ${errors.name ? "border-red-500" : "border-gray-500"}`}
              />
            </div>

            {/* Voucher Code */}
            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">Voucher Code</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Voucher Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`flex-grow border p-2 rounded ${errors.code ? "border-red-500" : "border-gray-500"}`}
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

            {/* Discount Percent */}
            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">Discount Percent</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  list="discount-options"
                  placeholder="Discount"
                  value={percent}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,3}$/.test(val)) {
                      setPercent(val);
                      const num = parseFloat(val);
                      setErrors((prev) => ({
                        ...prev,
                        percent: isNaN(num) || num < 1 || num > 100,
                      }));
                    }
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`border p-2 rounded w-50 ${errors.percent ? "border-red-500" : "border-gray-500"}`}
                />
                <datalist id="discount-options">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>
                <span>%</span>
              </div>
              {errors.percent && (
                <span className="text-red-600 text-sm">Percent must be between 1 and 100.</span>
              )}
            </div>
          </div>

          {/* Dates and Toggle */}
          <div className="flex flex-col justify-end gap-y-4 w-125">
            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full border p-2 rounded ${errors.startDate ? "border-red-500" : "border-gray-500"}`}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="font-semibold">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!validateEndDate(val)) {
                    alert("End date should not be before today.");
                    return;
                  }
                  setEndDate(val);
                }}
                className={`w-full border p-2 rounded ${errors.endDate ? "border-red-500" : "border-gray-500"}`}
              />
            </div>

            <div className="flex flex-row gap-x-2">
              <Checkbox
                id="hide"
                className="border-1 border-gray-400"
                checked={!isShown}
                onCheckedChange={(checked) => setIsShown(!checked)}
              />
              <label
                htmlFor="hide"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hide voucher from customer
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
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
              setErrors({
                name: false,
                code: false,
                percent: false,
                startDate: false,
                endDate: false,
                dateOrder: false,
              });
              event.preventDefault();
              router.back();
            }}
            className="border-1 border-[#E19517] text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
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
      </form>
    </div>
  );
};

export default CreateVoucherForm;
