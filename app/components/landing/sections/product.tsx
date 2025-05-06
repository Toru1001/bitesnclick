import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "../../model/product-card";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import ViewProductModal from "../../modal/viewProduct_modal";
import { toast, ToastContainer } from "react-toastify";

const ProductSection: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [showViewProductModal, setViewProductModal] = useState(false);
  const [viewProduct, setViewproduct] = useState<number>(0);
  const notify = (message: string) => toast.success(message);
  
    const handleOnMessage = (message: string) => {
      console.log(message);
      notify(message);
    };

  useEffect(() => {
      const fetchProducts = async () => {
            const { data, error } = await supabase
              .from('products')
              .select('*, category(categoryid,name)')
              .order('productid', { ascending: false })
              .limit(4);
      
            if (error) {
              console.error("Error fetching products:", error);
            } else {
              setProducts(data);
            }
          };
          fetchProducts();
  }, []);
  
  return (
    <div className="flex flex-col relative h-fit px-6 md:px-30 mb-5">
      <Image
        className="hidden md:block absolute top-0 right-0 z-0"
        src="/assets/topbeans.png"
        alt="Beans"
        width={450}
        height={450}
      />
      <Image
        className="block md:hidden absolute top-0 right-0 z-0"
        src="/assets/topbeans.png"
        alt="Beans"
        width={150}
        height={150}
      />

      {/* Heading Section */}
      <div className="flex h-40 md:h-80 w-full items-end justify-between z-10">
        <div className="flex-row">
          <div className="font-bold text-2xl md:text-3xl md:text-7xl text-[#240C03]">
            The Coffee
          </div>
          <div className="font-bold text-2xl md:text-3xl md:text-7xl text-[#240C03]">
            we work with
          </div>
          <div className="font-light text-xs md:text-base pt-2 md:pt-5 text-[#240C03] w-60 md:w-70 md:w-110">
            We deliver freshly roasted, high-quality coffee straight to your
            doorstep for a rich and flavorful experience.
          </div>
        </div>
        <div>
          <button className="border-2 border-[#E19517] rounded-lg py-2 px-4 cursor-pointer text-[#E19517] font-medium z-10" onClick={() => {router.push("/products")}}>
            See All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-visible scrollbar-hide h-full w-full pb-3 pt-10 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none">
        <div className="flex gap-4 flex-nowrap scroll-smooth scroll-snap-x-mandatory">
          {products.map((product) => (
                      <ProductCard
                        key={product.productid}
                        productId={product.productid}
                        className="w-full max-w-xs"
                        category={product.category.name}
                        onClicked={() => {setViewProductModal(true); setViewproduct(product.productid);}}
                      />
                    ))}
        </div>
      </div>
      {showViewProductModal && (
                <ViewProductModal 
                  onClose={() => setViewProductModal(false)} 
                  productId={viewProduct} 
                  onMessage={(message) => {
                    handleOnMessage(message);
                    setViewProductModal(false);
                  }}
                />
              )}
              <ToastContainer theme="light" position="bottom-right" />
    </div>
  );
};

export default ProductSection;
