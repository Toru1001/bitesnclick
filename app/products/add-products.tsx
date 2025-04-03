"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const NewProduct = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ categoryid: number; name: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("category").select("categoryid, name");
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

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setProductImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.categoryid} value={category.categoryid}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
