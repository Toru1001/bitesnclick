import CreateVoucher from "./create_vouchers";
import ViewVouchers from "./view_vouchers";

export default function ViewVouchersPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <CreateVoucher />
      <ViewVouchers />
    </div>
  );
}

  