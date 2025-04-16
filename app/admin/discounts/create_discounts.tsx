'use client';

import { useEffect, useState } from 'react';    
import { supabase } from "../../lib/supabase";

const CreateDiscountForm = () => {
  const [products, setProducts] = useState<{ id: number; name: string; price: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0); 
  const [newPrice, setNewPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('productid, name, price');

      if (error) {
        console.error('Error fetching products:', error.message);
      } else {
        const formattedProducts = data.map((product) => ({
          id: product.productid,
          name: product.name,
          price: product.price,
        }));
        setProducts(formattedProducts);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const price = productPrice;
    const discount = discountPercent;
  
    if (!isNaN(price) && !isNaN(discount)) {
      const discounted = price - price * (discount / 100);
      setNewPrice(parseFloat(discounted.toFixed(2)));
    } else {
      setNewPrice(0);
    }
  }, [productPrice, discountPercent]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setSelectedProduct(productId);

    const selected = products.find((p) => p.id === parseInt(productId));
    if (selected) {
      setProductPrice(selected.price);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isNaN(discountPercent)) {
      console.error("Invalid discount percentage");
      return;
    }
  
    const { data, error } = await supabase.from("discount").insert([
      {
        productid: parseInt(selectedProduct),
        discount_percent: discountPercent, 
        newprice: newPrice,
        start_date: startDate,
        end_date: endDate,
      },
    ]);
  
    if (error) {
      console.error("Error creating discount:", error);
    } else {
      console.log("Data returned:", data); 
      setSuccessMessage("Discount successfully created!");
      setSelectedProduct("");
      setProductPrice(0);
      setDiscountPercent(0);
      setNewPrice(0);
      setStartDate("");
      setEndDate("");
    }
  };
  
  


  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Create New Discount</h2>
      {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label>Select Product</label>
          <select value={selectedProduct} onChange={handleProductChange} className="border p-2 rounded">
            <option value="">-- Choose Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label>Product Price</label>
          <input
  type="number"
  placeholder="Product Price"
  value={productPrice || ''} 
  onChange={(e) => {
    const val = e.target.value;
    setProductPrice(val === '' ? 0 : parseFloat(val));
  }}
  className="border p-2 rounded"
/>

        </div>

        <div className="flex flex-col">
          <label>Discount</label>
          <div className="flex items-center">
          <input
  type="number"
  value={discountPercent || ''}
  onChange={(e) => {
    const val = e.target.value;
    setDiscountPercent(val === '' ? 0 : Number(val));
  }}
  placeholder="Discount %"
  className="border p-2 rounded"
/>


            <span className="ml-2">%</span>
          </div>
        </div>

        <div className="flex flex-col">
          <label>Discounted Price</label>
          <input
            type="text"
            value={`₱ ${!isNaN(newPrice) ? newPrice.toFixed(2) : '0.00'}`}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />
        </div>

        <div className="col-span-2 flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={() => {
              setSelectedProduct('');
              setProductPrice(0);
              setDiscountPercent(0);
              setNewPrice(0);
              setStartDate('');
              setEndDate('');
              setSuccessMessage('');
            }}
            className="px-4 py-2 border border-red-400 text-red-500 rounded hover:bg-red-100"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create New Discount
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscountForm;
