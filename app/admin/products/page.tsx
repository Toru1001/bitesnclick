
"use client";
import { useRouter } from "next/navigation";
import ViewProduct from "./view-products";

export default function Products() {
  const router = useRouter();
    return (
      <div className="flex flex-col mx-auto mt-25 ml-64">
        <div className="mx-6">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Products
        </span>
        <div className="flex justify-end">
          <button className=" border-2 border-[#E19517] text-[#E19517] hover:bg-[#E19517] hover:text-white font-semibold py-2 px-4 text-sm rounded-lg mt-5 mr-5 cursor-pointer" onClick={() => {router.push("/admin/products/add-product")}}>
            Add Product
          </button>
        </div>
        </div>
        <div className="p-6">
        <ViewProduct/>
        </div>
      
    </div>
    );
  }
  