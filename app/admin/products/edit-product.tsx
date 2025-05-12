import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
interface EditProductProps {
  onClose: () => void;
  product: any;
}

const EditProduct: React.FC<EditProductProps> = ({ onClose, product }) => {
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(product.price);
  const [productDescription, setProductDescription] = useState(product.description);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(product.categoryid);
  const [categories, setCategories] = useState<
    { categoryid: number; name: string }[]
  >([]);
  const [lastImage, setLastImage] = useState<string>(product.img);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState({
    productName: false,
    productPrice: false,
    productDescription: false,
    categoryId: false,
    productImage: false,
  });

  const router = useRouter();
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("category")
        .select("categoryid, name");
      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
  
    const errors = {
      productName: !productName.trim(),
      productPrice: productPrice === "" || isNaN(Number(productPrice)),
      productDescription: !productDescription.trim(),
      categoryId: false,
      productImage: false,
    };
  
    setFieldErrors(errors);
  
    if (Object.values(errors).some(Boolean)) {
      alert("Please fill in the empty fields.");
      setLoading(false);
      return;
    }
  
    let imageUrl = null;
  
    if (productImage) {
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(`products/${Date.now()}-${productImage.name}`, productImage);
  
      if (error) {
        console.error("Image upload error:", error.message);
        setLoading(false);
        return;
      }
  
      imageUrl = data?.path
        ? `https://imdktcworfdyqonfdoev.supabase.co/storage/v1/object/public/product-images/${data.path}`
        : null;
    }
  
    const updateData: any = {
      name: productName,
      price: parseFloat(productPrice),
      description: productDescription,
      categoryid: categoryId,
    };
  
    if (imageUrl) {
      updateData.img = imageUrl;
    }
  
    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("productid", product.id);
  
    if (error) {
      console.error("Supabase error:", error.message);
    } else {
      alert("Product updated successfully");
      window.location.reload();
      onClose();
    }
  
    setLoading(false);
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">Edit Product</span>
        </div>

        <div className="flex flex-col md:flex-row gap-x-10 mt-5 justify-between">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between w-full h-fit"
          >
            <div className="flex justify-between space-x-4">
              <div className="flex flex-col justify-end gap-y-2 w-90">
                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Product Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className={`p-2 border rounded ${
                      fieldErrors.productName
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="price" className="font-semibold">
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Product Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className={`p-2 border rounded ${
                      fieldErrors.productPrice
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="category" className="font-semibold">
                    Category
                  </label>
                  <select
                    value={product.categoryid}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className={`p-2 border rounded cursor-pointer ${
                      fieldErrors.categoryId
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  >
                    <option value="">{product.category}</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryid}
                        value={category.categoryid}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label htmlFor="description" className="font-semibold">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`p-2 border rounded ${
                      fieldErrors.productImage
                        ? "border-red-500"
                        : "border-gray-400"
                    }`}
                  />
                </div>
                <div className="flex justify-center mt-2 relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                      <div className="absolute top-0 w-32 h-32 bg-gray-400/50 rounded-2xl flex items-center justify-center text-white text-center">
                        Preview
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-500 rounded-2xl flex items-center justify-center text-white text-center">
                      <img
                        src={lastImage}
                        alt="Product Preview"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                      <div className="absolute top-0 w-32 h-32 bg-gray-400/50 rounded-2xl flex items-center justify-center text-white text-center">
                        Preview
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="description" className="font-semibold">
                  Product Description
                </label>
                <textarea
                  placeholder="Enter text here..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className={`h-60 w-90 p-2 border rounded ${
                    fieldErrors.productDescription
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                />
              </div>
            </div>
            <div className="w-full flex justify-end gap-x-5 mt-4">
              <button
                className="border border-[#E19517] text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-[#E19517] text-white px-4 py-2 rounded hover:bg-[#E19517]/80 ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Edit Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
