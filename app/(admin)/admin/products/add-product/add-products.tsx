"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_NAME_LENGTH = 100;
const MAX_DESC_LENGTH = 1000;

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
  const [imagePreview, setImagePreview] = useState<string>("");

  const [fieldErrors, setFieldErrors] = useState({
    productName: false,
    productPrice: false,
    productDescription: false,
    categoryId: false,
    productImage: false,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const router = useRouter();

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
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    const trimmedName = productName.trim();
    const trimmedDesc = productDescription.trim();

    const errors = {
      productName: !trimmedName,
      productPrice: !productPrice.trim(),
      productDescription: !trimmedDesc,
      categoryId: !categoryId,
      productImage: !productImage,
    };

    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      alert("Please fill in the empty fields.");
      setLoading(false);
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      alert("Product name is too long.");
      setLoading(false);
      return;
    }

    if (trimmedDesc.length > MAX_DESC_LENGTH) {
      alert("Description is too long.");
      setLoading(false);
      return;
    }
    const price = parseFloat(productPrice);
    if (isNaN(price) || price < 0) {
      alert("Invalid price.");
      setLoading(false);
      return;
    }

    let imageUrl = null;

    if (productImage) {
      if (!productImage.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        setLoading(false);
        return;
      }
      if (productImage.size > MAX_IMAGE_SIZE) {
        alert("Image must be less than 2MB.");
        setLoading(false);
        return;
      }
      const safeFileName = productImage.name.replace(/[^a-zA-Z0-9.-]/g, "_");

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(`products/${Date.now()}-${safeFileName}`, productImage);

      if (error) {
        console.error("Image upload error:", error.message);
        alert("Image upload failed.");
        setLoading(false);
        return;
      }

      imageUrl = data?.path
        ? `${supabaseUrl}/storage/v1/object/public/product-images/${data.path}`
        : null;
    }

    const { error } = await supabase.from("products").insert([
      {
        name: trimmedName,
        price: price,
        description: trimmedDesc,
        categoryid: Number(categoryId), // 🔒 enforce correct type
        img: imageUrl,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error.message);
      alert("Failed to add product.");
    } else {
      setSuccessMessage("Product added successfully!");
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setCategoryId("");
      setProductImage(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview("");

      setFieldErrors({
        productName: false,
        productPrice: false,
        productDescription: false,
        categoryId: false,
        productImage: false,
      });

      router.push('/admin/products');
    }

    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image must be less than 2MB.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));
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
                className={`p-2 border rounded ${
                  fieldErrors.productName ? "border-red-500" : "border-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="price" className="font-semibold">Price</label>
              <input
                type="number"
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className={`p-2 border rounded ${
                  fieldErrors.productPrice ? "border-red-500" : "border-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="category" className="font-semibold">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`p-2 border rounded cursor-pointer ${
                  fieldErrors.categoryId ? "border-red-500" : "border-gray-400"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryid} value={category.categoryid}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="description" className="font-semibold">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`p-2 border rounded ${
                  fieldErrors.productImage ? "border-red-500" : "border-gray-400"
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
              className={`h-60 w-125 p-2 border rounded ${
                fieldErrors.productDescription ? "border-red-500" : "border-gray-400"
              }`}
            />
          </div>
        </div>
        <div className="w-full flex justify-end gap-x-5 mt-4">
          <button
            className="border border-[#E19517] text-[#E19517] px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
            onClick={(event) => {
              event.preventDefault();
              router.back();
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
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
