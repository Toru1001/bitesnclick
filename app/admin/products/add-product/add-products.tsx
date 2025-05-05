"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

const NewProduct = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<
    { categoryid: number; name: string }[]
  >([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>("");

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

    if (!productName || !productPrice || !productDescription || !categoryId) {
      console.error("One or more required fields are missing!");
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

    const { error } = await supabase.from("products").insert([
      {
        name: productName,
        price: parseFloat(productPrice),
        description: productDescription,
        categoryid: categoryId,
        img: imageUrl,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error.message);
    } else {
      setSuccessMessage("Product added successfully!");
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setCategoryId("");
      setProductImage(null);
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="mx-auto bg-white p-6 rounded shadow-md">
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col justify-between w-full h-fit">
        <div className="flex justify-between space-x-4">
        <div className="flex flex-col justify-end gap-y-2 w-125">
          <div className="flex flex-col gap-y-2">
          <label className="font-semibold">Product Name</label>
          <input
            type="text"
            placeholder="Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="p-2 border rounded border-gray-400"
          />
          </div>
          <div className="flex flex-col gap-y-2">
          <label htmlFor="price" className="font-semibold">Price</label>
          <input
            type="number"
            placeholder="Product Price"
            value={parseFloat(productPrice) > 0 ? productPrice : 0}
            onChange={(e) => setProductPrice(e.target.value)}
            className="p-2 border rounded border-gray-400"
          />
          </div>
          <div className="flex flex-col gap-y-2">
          <label htmlFor="category" className="font-semibold">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="p-2 border rounded border-gray-400 cursor-pointer"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.categoryid} value={category.categoryid}>
                {category.name}
              </option>
            ))}
          </select>
          </div>
          <div className="flex flex-col gap-y-2 border-gray-400">
          <label htmlFor="description" className="font-semibold">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setProductImage(e.target.files[0]);
                handleImageChange(e);
              }
            }}
            className="p-2 border rounded border-gray-400"
          />
          </div>
            <div className="flex justify-center mt-2 relative">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover rounded-2xl" />
                <div className="absolute top-0 w-32 h-32 bg-gray-400/50 rounded-2xl flex items-center justify-center text-white text-center">Preview</div>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-500 rounded-2xl flex items-center justify-center text-white text-center">
              No image selected
              </div>
            )}
            </div>
        </div>
        <div className="flex flex-col gap-y-2">
        <label htmlFor="description" className="font-semibold">Product Description</label>
        <textarea
          placeholder="Enter text here..."
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className=" h-60 w-125 p-2 border border-gray-400 rounded"
        />
        </div>
        </div>
        <div className="w-full flex justify-end gap-x-5">
          <button className="border-1 border-[#E19517]  text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer" onClick={(event) => {event.preventDefault(); router.back()}}>
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-[#E19517] text-white px-4 py-2 rounded hover:bg-[#E19517]/80 ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button> 
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
