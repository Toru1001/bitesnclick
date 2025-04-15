import CreateDiscountForm from "./create_discounts";
import ViewDiscounts from "./view_discounts";

export default function Home() {
    return (
      <div className="max-w-lg mx-auto mt-10">
      <CreateDiscountForm />
      <ViewDiscounts />
    </div>
    );
  }
  