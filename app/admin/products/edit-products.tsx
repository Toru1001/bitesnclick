'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave: () => void;
}

const EditProductModal = ({ product, onClose, onSave }: EditProductModalProps) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category?.name || '');
  const [categories, setCategories] = useState<{ categoryid: number; name: string }[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.img || '');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('categoryid, name');
      if (error) {
        console.error('Error fetching categories:', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    let newImageUrl = imagePreview;
    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`products/${product.productid}-${image.name}`, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message);
      } else {
        newImageUrl = `https://imdktcworfdyqonfdoev.supabase.co/storage/v1/object/public/product-images/${data.path}`;
      }
    }

    const { error } = await supabase
      .from('products')
      .update({
        name,
        price,
        description,
        categoryid: categories.find((cat) => cat.name === category)?.categoryid,
        img: newImageUrl,
      })
      .eq('productid', product.productid);

    if (error) {
      console.error('Error updating product:', error.message);
    } else {
      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[700px] rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-lg font-semibold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <div className="mb-4">
          <label className="block font-semibold text-sm mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-sm mb-2">Product Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-sm mb-2">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-sm mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryid} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-sm mb-2">Product Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Product Preview" className="w-32 h-32 object-cover" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
