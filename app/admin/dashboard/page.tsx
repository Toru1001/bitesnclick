"use client"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col mx-auto mt-25 ml-64">
        <div className="mx-6">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Dashboard
        </span>
        </div>
        <div className="p-6">
        {/* <ViewOrdersTable/> */}
        </div>
    </div>
  );
}

  