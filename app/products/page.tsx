"use client";
import { useEffect, useState } from "react";
import FilterButtons from "../components/model/filter-buttons";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/model/product-card";
import ViewProductModal from "../components/modal/viewProduct_modal";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [categories, setCategories] = useState<{ categoryid: number; name: string }[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showViewProductModal, setViewProductModal] = useState(false);
  const [productId, setProductId] = useState<number>(0);

  // Function to handle filter
  const handleFilter = (filterName: string) => {
    setActiveFilter(filterName);

    if (filterName === "All") {
      setFilteredProducts(products);
    } else {
      const selectedCategory = categories.find(category => category.name === filterName);
      if (selectedCategory) {
        const filtered = products.filter(product => product.category.categoryid === selectedCategory.categoryid);
        setFilteredProducts(filtered);
      }
    }
  };

  useEffect(() => {
    // Fetch categories from the category table
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('category')
        .select('categoryid, name');

      if (error) {
        console.error("Error fetching categories:", error);
      } else {
        setCategories(data);
      }
    };
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category(categoryid,name)')
        .order('categoryid', { ascending: true });;

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
        setFilteredProducts(data); 
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <>
      <div className="mt-5 mx-6 md:mx-30">
        <span className="font-bold text-2xl md:text-4xl text-[#240C03] text-end">
          Menu
        </span>
        <div className="flex gap-x-2 my-5 overflow-scroll [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none">
          {/* Filter Buttons */}
          <FilterButtons
            text="All"
            onClick={() => handleFilter("All")}
            isActive={activeFilter === "All"}
          />
          {categories.map((category) => (
            <FilterButtons
              key={category.categoryid}
              text={category.name}
              onClick={() => handleFilter(category.name)}
              isActive={activeFilter === category.name}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 px-0 py-0">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productid}
              productId={product.productid}
              className="w-full max-w-xs"
              category={product.category.name}
              onClicked={() => {setViewProductModal(true); setProductId(product.productid)}}
            />
          ))}
        </div>
        {showViewProductModal && (
                <ViewProductModal onClose={() => setViewProductModal(false)} productId={productId}/>
              )}
      </div>
    </>
  );
}
