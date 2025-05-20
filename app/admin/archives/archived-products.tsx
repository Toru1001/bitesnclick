'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

interface Product {
  productid: number;
  name: string;
  price: number;
  description: string;
  img: string | null;
  category: { name: string };
  isarchive: boolean;
}

const ArchivedProducts = () => {
  const [archivedProducts, setArchivedProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivedProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        productid,
        name,
        price,
        description,
        img,
        category:categoryid(name),
        isarchive
      `)
      .eq('isarchive', true);

    if (error) {
      console.error('Error fetching archived products:', error.message);
      setError('Failed to load archived products');
    } else {
      setArchivedProducts(data);
    }
  };

  const unarchiveProduct = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ isarchive: false })
      .eq('productid', product.productid);

    if (error) {
      console.error('Error unarchiving product:', error.message);
    } else {
      fetchArchivedProducts();
    }
  };

  useEffect(() => {
    fetchArchivedProducts();
  }, []);

  return (
    <div className="flex justify-center mt-5">
      <div className="bg-white rounded shadow-md w-full">
        {error && <p className="text-red-500">{error}</p>}

        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map((product) => (
              <tr key={product.productid} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  {product.description.length > 50
                    ? product.description.slice(0, 50) + '...'
                    : product.description}
                </td>
                <td className="px-4 py-2">{product.category?.name || 'Uncategorized'}</td>
                <td className="px-4 py-2">₱{product.price.toFixed(2)}</td>
                <td className="px-4 py-2 relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId(dropdownOpenId === product.productid ? null : product.productid)
                    }
                    className="text-gray-600 hover:text-black focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} className="text-lg" />
                  </button>

                  {dropdownOpenId === product.productid && (
                    <div className="absolute z-10 right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setDropdownOpenId(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setDropdownOpenId(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          unarchiveProduct(product);
                          setDropdownOpenId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50"
                      >
                        Unarchive
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={fetchArchivedProducts}
          />
        )} */}

        {selectedProduct && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[700px] rounded-lg shadow-lg p-6 relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-lg font-semibold"
              >
                ×
              </button>
              <div className="flex gap-8">
                <div className="flex flex-col items-center justify-start">
                  {selectedProduct.img ? (
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      className="w-32 h-32 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full mb-2" />
                  )}
                  <h3 className="text-lg font-bold mt-2">{selectedProduct.name}</h3>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Product Name</h2>
                  <p className="text-gray-700 mb-4">{selectedProduct.name}</p>

                  <h2 className="text-xl font-bold mb-2">Product Price</h2>
                  <p className="text-gray-700 mb-4">₱{selectedProduct.price.toFixed(2)}</p>

                  <h2 className="text-xl font-bold mb-2">Category</h2>
                  <p className="text-gray-700 mb-4">{selectedProduct.category?.name}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-gray-700">{selectedProduct.description}</p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedProducts;
