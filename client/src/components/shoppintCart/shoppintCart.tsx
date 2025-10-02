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
  const [activeCart, setActiveCart] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();
  const { cart, decrementFromCart, addToCart, clearCart, removeFromCart } = useCart();

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

  // fetch cart for user
  const fetchUserCart = async (accessToken: string) => {
    try {
      const { data } = await api.get('/api/v1/cart', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });
      const response = data;

      if (response.success) {
        const savedCart = data.response.data.cart;

        // clear and save current cart
        if (savedCart.items && savedCart.items.length > 0) {
          clearCart();
          setActiveCart(savedCart);
          savedCart.items.forEach((item: any) => addToCart(item, item.size, item.quantity));
        }
      } else {
        setError(response.response.data.message || 'Failed to fetch user cart');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user cart');
    }
  };

  // perform cart action
  const performCartAction = async (action: string, objectId: string) => {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) return;

    try {
      const requestData = {
        cartId: activeCart._id,
        objectId: objectId,
      };

      const { data } = await api.put(`/api/v1/cart?action=${action}`, requestData, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });

      const response = data;

      if (response.success) {
        const savedCart = data.response.data.cart;

        // clear and save current cart
        if (savedCart.items && savedCart.items.length > 0) {
          clearCart();
          setActiveCart(savedCart);
          savedCart.items.forEach((item: any) => addToCart(item, item.size, item.quantity));
        }
      } else {
        setError(response.response.data.message || 'Failed to perform cart action');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to perform cart action');
    }
  };

  // handle plus click
  const handlePlusClick = async (item: any, size: string, objectId: string) => {
    addToCart(item, size, 1);

    performCartAction('add', objectId);
  };

  // handle minus click
  const handleMinusClick = async (itemId: string, size: string, objectId: string) => {
    decrementFromCart(itemId, size);

    performCartAction('remove', objectId);
  };

  // handle delete click
  const handleDeleteClick = async (itemId: string, size: string, objectId: string) => {
    removeFromCart(itemId, size);

    performCartAction('delete', objectId);
  };

  // handle clear click
  const handleClearCart = async () => {
    const accessToken = sessionStorage.getItem('accessToken');

    // only clear session cart
    if (!activeCart || !accessToken) {
      clearCart();
      return;
    }

    // send request
    try {
      const res = await api.delete(`/api/v1/cart/${activeCart._id}`, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });

      if (res.status === 200 || res.status === 204) {
        clearCart();
        setActiveCart(null);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to remove user cart');
    }
  };

  // handle checkout click
  const handleCheckout = async () => {
    const itemsDetails = cart.map((item) => ({
      itemId: item._id,
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
    }));

    // send request
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const res = await api.post(
          '/api/v1/order',
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
          const orderId = res.data.response.data.order._id;

          clearCart();
          setIsError(false);
          setError([]);

          // go to order details page
          navigate(`/order/details/${orderId}`, {
            state: { showOrderPlaced: true },
          });
        }
      }
    } catch (error: any) {
      const responseData = error.response?.data?.response?.data;
      if (Array.isArray(responseData)) {
        setError(responseData.map((error) => error.message).filter(Boolean));
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
      fetchUserCart(accessToken);
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
                    <p className="text-gray-700 text-sm sm:text-base">LKR {(item.price ?? 0).toLocaleString()}.00</p>
                  </div>

                  {/* quantity section */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    {/* quantity controls */}
                    <div className="flex items-center gap-2">
                      {/* remove one */}
                      <Button
                        onClick={() => handleMinusClick(item._id, item.size, item._id)}
                        className="p-2 bg-gray-700 rounded-lg hover:bg-gray-900 cursor-pointer"
                      >
                        <MinusIcon size={16} />
                      </Button>

                      {/* quantity */}
                      <span className="px-2 font-bold">{item.quantity}</span>

                      {/* add one */}
                      <Button
                        onClick={() => handlePlusClick(item, item.size, item._id)}
                        className="p-2 bg-green-700 rounded-lg hover:bg-green-900 cursor-pointer"
                      >
                        <PlusIcon size={16} />
                      </Button>
                    </div>

                    {/* remove item */}
                    <Button
                      onClick={() => handleDeleteClick(item._id, item.size, item._id)}
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
              <h2 className="text-lg sm:text-xl font-bold">Total: LKR {totalPrice.toLocaleString()}.00</h2>

              {/* button section */}
              <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                {/* clear button */}
                <Button
                  onClick={() => {
                    handleClearCart();
                  }}
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
