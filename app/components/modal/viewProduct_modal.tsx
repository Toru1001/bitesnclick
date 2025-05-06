import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { supabase } from '@/app/lib/supabase';

interface ViewProductModalProps {
  onClose: () => void;
  productId: number;
  onMessage?: (message: string) => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ onClose, productId, onMessage }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, category(name)')
        .eq('productid', productId)
        .single();

      if (error) {
        console.error('Error fetching product details:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [productId]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = async () => {
    try {
      const {
              data: { user },
            } = await supabase.auth.getUser();
      // Fetch the user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('cartid')
        .eq('customerid', user?.id)
        .single();

      if (cartError && cartError.code !== 'PGRST116') {
        console.error('Error fetching cart:', cartError);
        return;
      }

      let cartId = cartData?.cartid;

      // If no cart exists, create a new one
      if (!cartId) {
        const { data: newCart, error: newCartError } = await supabase
          .from('cart')
          .insert({ customerid: user?.id })
          .select('cartid')
          .single();

        if (newCartError) {
          console.error('Error creating cart:', newCartError);
          return;
        }

        cartId = newCart.cartid;
      }

      // Insert product into cart_items
      const totalPrice = quantity * product.price;
      const { error: cartItemError } = await supabase.from('cart_items').insert({
        cartid: cartId,
        productid: product.productid,
        quantity,
        total_price: totalPrice,
      });

      if (cartItemError) {
        console.error('Error adding item to cart:', cartItemError);
      } else {
        console.log('Item added to cart successfully');
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40" onClick={handleOverlayClick}>
      <div className="relative bg-white rounded-2xl p-5 h-full w-full md:h-fit md:w-fit overflow-scroll md:overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute flex cursor-pointer items-center justify-center top-4 right-4 w-10 h-10"
          onClick={onClose}
        >
          <X className="text-[#240C03] font-bold" />
        </button>
        <div className="flex w-full border-b-3 pb-2 border-[#E19517]">
          <span className="font-semibold text-xl">View Product</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center  w-150 h-90">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#E19517] border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-x-10 mt-5 justify-between">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={product.img}
                alt={product.name || 'Product Image'}
                width={200}
                height={200}
                className="w-90 h-60 md:h-100 object-cover rounded-2xl"
              />
            </div>

            <div className="flex flex-col mt-5 md:mt-0 w-80 justify-between items-center h-110 md:h-auto">
              <div>
                <div className="flex flex-col">
                  <span className="font-light text-gray-500">{product.category?.name}</span>
                  <span className="font-semibold text-2xl">{product.name}</span>
                  <span className="font-bold text-2xl mt-5">
                    <span className="font-extralight text-3xl">₱</span> {product.price}.00
                  </span>
                </div>
                <div className="pt-5 text-xs text-justify px-5 overflow-scroll line-clamp-8 [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-none ">
                  <span>{product.description}</span>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <span className="font-semibold">Quantity</span>
                  <div className="flex justify-between gap-x-5">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="text-amber-50 bg-[#E19517] hover:bg-yellow-600 rounded-sm cursor-pointer"
                    >
                      <Minus />
                    </button>
                    <input
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      value={quantity}
                      type="text"
                      className="border-1 border-gray-500 rounded-xs w-15 text-center text-sm"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-amber-50 bg-[#E19517] hover:bg-yellow-600 rounded-sm cursor-pointer"
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
                <div className="flex justify-center my-5">
                  <button className="flex gap-x-2 items-center text-xl text-amber-50 bg-[#E19517] rounded-lg px-5 py-2 cursor-pointer" onClick={() =>{handleAddToCart(); onMessage?.("Item added to cart")}}>
                    <span>Add to cart</span>
                    <FontAwesomeIcon icon={faCartPlus} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>  
    </div>
  );
};

export default ViewProductModal;
