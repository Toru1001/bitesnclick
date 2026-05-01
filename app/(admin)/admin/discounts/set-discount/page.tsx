import CreateDiscountForm from "./create_discounts";


export default function SetDiscount() {
    return (
      <div className="flex flex-col mx-auto mt-25 ml-64">
        <div className="mx-6">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          New Discount
        </span>
        </div>
        <div className="mx-8 p-5">
        <CreateDiscountForm />
        </div>
      
    </div>
    );
  }
  