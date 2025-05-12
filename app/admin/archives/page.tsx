import ArchivedProducts from "./archived-products";
import ArchivesTable from "./archives-table";

export default function Home() {
    return (
      <div className="flex flex-col mx-auto mt-25 ml-64">
      <div className="mx-6">
      <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
        Archived Products
      </span>
      </div>
      <div className="p-6">
      <ArchivesTable />
      </div>
    
  </div>
    );
  }