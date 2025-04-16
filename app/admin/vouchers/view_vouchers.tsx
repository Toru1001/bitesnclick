'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FaEdit } from 'react-icons/fa';

const ViewVouchers = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);

  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);
  const [voucherName, setVoucherName] = useState('');
  const [code, setCode] = useState('');
  const [voucherPercent, setVoucherPercent] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchVouchers = async () => { //fetching from database
    const { data, error } = await supabase.from('vouchers').select('*');
    if (error) {
      console.error('Error fetching vouchers:', error.message);
    } else {
      setVouchers(data || []);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleEdit = (voucher: any) => { 
    setSelectedVoucher(voucher);
    setVoucherName(voucher.name);
    setCode(voucher.code);
    setVoucherPercent(voucher.percent);
    setStartDate(voucher.start_date);
    setEndDate(voucher.end_date);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleUpdate = async (e: React.FormEvent) => {  //editing logic
    e.preventDefault();

    if (!voucherName || isNaN(voucherPercent)) {
      setErrorMessage('Please fill out all fields correctly.');
      return;
    }

    const { error } = await supabase
      .from('vouchers')
      .update({
        name: voucherName,
        code,
        percent: voucherPercent,
        start_date: startDate,
        end_date: endDate,
      })
      .eq('voucherid', selectedVoucher.voucherid);

    if (error) {
      setErrorMessage('Error updating voucher: ' + error.message);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Voucher successfully updated!');
      setErrorMessage('');
      setSelectedVoucher(null);
      setVoucherName('');
      setVoucherPercent(0);
      setStartDate('');
      setEndDate('');
      await fetchVouchers(); // Refresh the list
    }
  };

  const generateCode = () => {  //generating random code 
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const prefix = voucherName.replace(/\s/g, '').slice(0, 4).toUpperCase();
    setCode(`${prefix}${random}`);
  };

  const getStatus = (start: string, end: string) => {   // calculating status based on the date 
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (now < s) return 'Upcoming';
    if (now >= s && now <= e) return 'Active';
    return 'Expired';
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Available Vouchers</h2>
      <table className="min-w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Percent</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher.voucherid} className="text-center border-t">
              <td className="px-4 py-2">{voucher.name}</td>
              <td className="px-4 py-2">{voucher.code}</td>
              <td className="px-4 py-2">{voucher.percent}%</td>
              <td className="px-4 py-2">{voucher.start_date}</td>
              <td className="px-4 py-2">{voucher.end_date}</td>
              <td className="px-4 py-2">{getStatus(voucher.start_date, voucher.end_date)}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleEdit(voucher)} className="text-blue-600 hover:text-blue-800">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVoucher && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Edit Voucher</h2>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Voucher Name</label>
              <input
                type="text"
                value={voucherName}
                onChange={(e) => setVoucherName(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label>Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="text-blue-600 text-sm underline"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label>Discount Percent</label>
              <input
                type="number"
                value={voucherPercent}
                onChange={(e) => setVoucherPercent(Number(e.target.value))}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="col-span-2 flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedVoucher(null);
                  setVoucherName('');
                  setVoucherPercent(0);
                  setStartDate('');
                  setEndDate('');
                }}
                className="px-4 py-2 border border-red-400 text-red-500 rounded hover:bg-red-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update Voucher
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewVouchers;
