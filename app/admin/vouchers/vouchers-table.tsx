import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/app/lib/supabase";
import { ChevronDown } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import EditVoucherModal from "./edit-voucher";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VouchersTable = () => {
  const [search, setSearch] = useState("");
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [editVoucher, setEditVoucher] = useState<boolean>(false);
  const [selectVoucher, setSelectVoucher] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState<boolean>(false);

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      (voucher.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      voucher.percent?.toString().includes(search) ||
      (voucher.code?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      voucher.status?.toString().includes(search);

      const matchesStatus =
      statusFilter === "All" ||
      voucher.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const fetchDiscountedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("vouchers").select("*");

      if (error) {
        alert("Connection timeout");
        console.error("Error fetching products:", error);
        return;
      }

      const mapped = data.map((voucher) => ({
        id: voucher.voucherid,
        name: voucher.name,
        code: voucher.code,
        percent: voucher.percent,
        start_date: voucher.start_date,
        end_date: voucher.end_date,
        status:
          voucher.status.charAt(0).toUpperCase() +
          voucher.status.slice(1).toLowerCase(),
        show: voucher.show_voucher,
        archive: voucher.archive,
      }));
      setVouchers(mapped);
      setLoading(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4 border-1 border-gray-500"
        />
        <span className="text-sm">Availability:</span>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-1/6 border-1 border-gray-400">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-1 border-gray-400">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Used">Used</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading && (
        <div className="inset-0 z-40 bg-white/60 w-full h-100 flex items-center justify-center rounded-lg">
          <ClipLoader color="#E19517" size={50} />
        </div>
      )}
      {!loading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voucher</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Percent</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Show</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredVouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>{voucher.name}</TableCell>
                <TableCell>{voucher.code}</TableCell>
                <TableCell>{voucher.percent}%</TableCell>
                <TableCell>{voucher.start_date}</TableCell>
                <TableCell>{voucher.end_date}</TableCell>
                <TableCell>{voucher.status}</TableCell>
                <TableCell>{voucher.show.toString().toUpperCase()}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setSelectVoucher(voucher);
                      setEditVoucher(true);
                    }}
                    className="flex items-center px-3 py-2 border-1 bg-amber-50 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold rounded cursor-pointer"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editVoucher && (
        <EditVoucherModal
          voucher={selectVoucher}
          onClose={() => setEditVoucher(false)}
        />
      )}
      {/* {confirmation && (
        <ConfirmationModal
          buttonText="Confirm"
          description="Are you sure you want to archive product?"
          title="Archive Product"
          onClose={() => {
            setConfirmation(false);
          }}
          onConfirm={() => {
            handleArchive(selectProduct);
          }}
        />
      )} */}
    </div>
  );
};

export default VouchersTable;
