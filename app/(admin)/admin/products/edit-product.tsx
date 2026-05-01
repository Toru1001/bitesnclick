"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface EditProductProps {
  onClose: () => void;
  product: any;
}
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_NAME_LENGTH = 100;
const MAX_DESC_LENGTH = 1000;

const EditProduct: React.FC<EditProductProps> = ({ onClose, product }) => {
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(product.price);
  const [productDescription, setProductDescription] = useState(product.description);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(product.categoryid);
  const [categories, setCategories] = useState<
    { categoryid: number; name: string }[]
  >([]);
  const [lastImage] = useState<string>(product.img);
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
      productPrice: productPrice === "" || isNaN(Number(productPrice)),
      productDescription: !trimmedDesc,
      categoryId: false,
      productImage: false,
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

    const updateData: any = {
      name: trimmedName,
      price: price,
      description: trimmedDesc,
      categoryid: Number(categoryId),
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
      alert("Failed to update product.");
    } else {
      alert("Product updated successfully");
      window.location.reload();
      onClose();
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

        {/* 🔽 UI unchanged below */}
        <div className="flex flex-col md:flex-row gap-x-10 mt-5 justify-between">
          <form onSubmit={handleSubmit} className="flex flex-col justify-between w-full h-fit">
            <div className="flex justify-between space-x-4">
              <div className="flex flex-col justify-end gap-y-2 w-90">

                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className={`p-2 border rounded ${
                      fieldErrors.productName ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Price</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className={`p-2 border rounded ${
                      fieldErrors.productPrice ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="p-2 border rounded"
                  >
                    <option value="">{product.category}</option>
                    {categories.map((category) => (
                      <option key={category.categoryid} value={category.categoryid}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-y-2">
                  <label className="font-semibold">Product Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="p-2 border rounded" />
                </div>

                <div className="flex justify-center mt-2 relative">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-32 h-32 object-cover rounded-2xl" />
                  ) : (
                    <img src={lastImage} className="w-32 h-32 object-cover rounded-2xl" />
                  )}
                </div>

              </div>

              <div className="flex flex-col gap-y-2">
                <label className="font-semibold">Product Description</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className={`h-60 w-90 p-2 border rounded ${
                    fieldErrors.productDescription ? "border-red-500" : "border-gray-400"
                  }`}
                />
              </div>
            </div>

            <div className="w-full flex justify-end gap-x-5 mt-4">
              <button onClick={(e) => { e.preventDefault(); onClose(); }} className="border px-4 py-2">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-[#E19517] text-white px-4 py-2 rounded">
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