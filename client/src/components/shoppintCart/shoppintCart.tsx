import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type User } from '@/types/user';
import { useCart } from '@/context/cartContext';
import { Button } from '../ui/button';
import { PlusIcon, MinusIcon, TrashIcon } from 'lucide-react';
import { ERROR } from '@/common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const ShoppingCart: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();
  const { cart, decrementFromCart, addToCart, clearCart } = useCart();

  // calculate total
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // fetch user details
  const fetchUserDetails = async (accessToken: string) => {
    try {
      const { data } = await api.get('/api/v1/user', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });
      const response = data;

      if (response.success) {
        setUser(data.response.data.user);
      } else {
        setError(response.response.data.message || 'Failed to fetch user details');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user details');
    }
  };

  // handle checkout click
  const handleCheckout = async () => {
    const itemsDetails = cart.map((item) => ({
      itemId: item._id,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
    }));

    // send request
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const res = await api.post(
          '/api/v1/purchase',
          {
            items: itemsDetails,
          },
          {
            headers: {
              Authorization: `"${accessToken}"`,
            },
          },
        );
        if (res.data.success) {
          const purchaseId = res.data.response.data.purchase._id;

          clearCart();
          setIsError(false);
          setError([]);

          // go to purchase details page
          navigate(`/purchase/details/${purchaseId}`, {
            state: { showOrderPlaced: true },
          });
        }
      }
    } catch (error: any) {
      const responseData = error.response?.data?.response?.data;
      if (Array.isArray(responseData)) {
        setError(responseData.map((err) => err.message).filter(Boolean));
      } else if (responseData?.message) {
        setError([responseData.message]);
      } else {
        setError([ERROR.UNEXPECTED]);
      }
      setIsError(true);
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserDetails(accessToken);
    }
  }, []);

  return (
    <div className="flex justify-center items-start pt-20 pb-10 px-4 w-full cursor-default">
      {/* card display */}
      <div className="bg-gray-100 p-4 sm:p-6 md:p-10 rounded-2xl shadow-lg w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl flex flex-col gap-6">
        {/* card heading */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-0 md:mb-4">
          <h1 className="text-xl sm:text-3xl font-bold text-center sm:text-left">Shopping Cart</h1>
          <span className="text-base sm:text-lg text-gray-600 font-semibold mt-2 sm:mt-0 italic">
            {user ? `Mr/Mrs.  ${user.name}` : 'Please login to continue'} ({cart.length} items in cart)
          </span>
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center italic">Your cart is empty</p>
        ) : (
          <>
            {/* cart items */}
            <div className="flex flex-col gap-4">
              {cart.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
                  {/* product details */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-base sm:text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-gray-700 text-sm sm:text-base">Rs. {item.price.toLocaleString()}.00</p>
                  </div>

                  {/* quantity section */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    {/* quantity controls */}
                    <div className="flex items-center gap-2">
                      {/* remove one */}
                      <Button
                        onClick={() => decrementFromCart(item._id, item.size)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-900 cursor-pointer"
                      >
                        <MinusIcon size={16} />
                      </Button>

                      {/* quantity */}
                      <span className="px-2 font-bold">{item.quantity}</span>

                      {/* add one */}
                      <Button onClick={() => addToCart(item, item.size, 1)} className="p-2 bg-green-700 rounded-lg hover:bg-green-900 cursor-pointer">
                        <PlusIcon size={16} />
                      </Button>
                    </div>

                    {/* remove item */}
                    <Button
                      onClick={() => decrementFromCart(item._id, item.size)}
                      className="p-2 bg-red-700 hover:bg-red-900 rounded-lg cursor-pointer"
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* error boxes */}
            {isError &&
              error.map((msg, index) => (
                <div key={index} className="w-full py-2 bg-red-500 text-white rounded-md text-sm text-center">
                  {msg}
                </div>
              ))}

            {/* total section */}
            <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* total */}
              <h2 className="text-lg sm:text-xl font-bold">Total: Rs. {totalPrice.toLocaleString()}.00</h2>

              {/* button section */}
              <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                {/* clear button */}
                <Button
                  onClick={clearCart}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 cursor-pointer"
                >
                  Clear Cart
                </Button>
                <Button
                  disabled={!user}
                  onClick={handleCheckout}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg cursor-pointer 
                    ${user ? 'bg-green-700 hover:bg-green-900 text-white' : 'bg-gray-900 text-white cursor-not-allowed'}`}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
