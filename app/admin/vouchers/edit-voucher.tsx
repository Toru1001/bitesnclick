import { supabase } from "@/app/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface EditProductProps {
  onClose: () => void;
  voucher: any;
}

const EditVoucherModal: React.FC<EditProductProps> = ({ onClose, voucher }) => {
  const [name, setName] = useState<string>(voucher.name);
  const [percent, setPercent] = useState<string>(voucher.percent.toString());
  const [status, setStatus] = useState<string>(voucher.status);
  const [startDate, setStartDate] = useState(voucher.start_date);
  const [endDate, setEndDate] = useState(voucher.end_date);
  const [isShown, setIsShown] = useState(voucher.show);
  const [errors, setErrors] = useState<{
    name?: boolean;
    code?: boolean;
    percent?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    dateOrder?: boolean;
  }>({});

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const num = parseFloat(percent);
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = true;
    if (!percent.trim()) newErrors.percent = true;
    if (!startDate) newErrors.startDate = true;
    if (!endDate) newErrors.endDate = true;
    if (
      !isNaN(Date.parse(startDate)) &&
      !isNaN(Date.parse(endDate)) &&
      new Date(startDate) > new Date(endDate)
    ) {
      newErrors.dateOrder = true;
    }

    if (isNaN(num) || num < 1 || num > 100) {
      newErrors.percent = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in empty fields");
      return;
    }

    const { data, error } = await supabase
      .from("vouchers")
      .update([
        {
          name: name.trim(),
          percent: num,
          status: status.toLowerCase(),
          start_date: startDate,
          end_date: endDate,
          show_voucher: isShown
        },
      ])
      .eq("voucherid", voucher.id);

    if (error) {
      console.error("Error updating voucher:", error);
    } else {
      alert("Voucher updated successfully!");
      onClose();
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">Edit Voucher</span>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-white">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between w-full h-80"
          >
            <div className="flex justify-between space-x-4 items-start">
              <div className="flex flex-col justify-end gap-y-4 w-90">
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="name" className="font-semibold">
                    Voucher Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Voucher Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border p-2 rounded ${
                      errors.name ? "border-red-500" : "border-gray-500"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Voucher Code</label>
                  <input
                    type="text"
                    value={voucher.code}
                    readOnly
                    className={`flex-grow border p-2 rounded ${
                      errors.code ? "border-red-500" : "border-gray-500"
                    }`}
                  />
                </div>

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
                          if (!isNaN(num) && (num < 1 || num > 100)) {
                            setErrors((prev) => ({ ...prev, percent: true }));
                          } else {
                            setErrors((prev) => ({ ...prev, percent: false }));
                          }
                        }
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className={`border p-2 rounded w-50 ${
                        errors.percent ? "border-red-500" : "border-gray-500"
                      }`}
                    />
                    <datalist id="discount-options">
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(
                        (value) => (
                          <option key={value} value={value} />
                        )
                      )}
                    </datalist>
                    <span>%</span>
                  </div>
                  {errors.percent && (
                    <span className="text-red-600 text-sm">
                      Percent must be between 1 and 100.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-end gap-y-4 w-90">
                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full border p-2 rounded ${
                      errors.startDate || errors.dateOrder
                        ? "border-red-500"
                        : "border-gray-500"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full border p-2 rounded ${
                      errors.endDate || errors.dateOrder
                        ? "border-red-500"
                        : "border-gray-500"
                    }`}
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

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="border-1 border-[#E19517] text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#E19517] text-white px-4 py-2 rounded hover:bg-[#E19517]/80 cursor-pointer"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVoucherModal;
