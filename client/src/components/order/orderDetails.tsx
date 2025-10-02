import { useLocation } from 'react-router-dom';
import MessagePopup from '@/components/popups/messagePopup';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const orderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);

  // fetch order details
  const fetchorderDetails = async (accessToken: string) => {
    try {
      // send request
      const { data } = await api.get(`/api/v1/order/${orderId}`, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });

      if (data.success) {
        setOrder(data.response.data.order);
        setIsError(false);
        setError([]);
      } else {
        setError([data.response.data.message || 'Failed to fetch order']);
        setIsError(true);
      }
    } catch (error: any) {
      setError([error.message || 'Failed to fetch order']);
      setIsError(true);
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) fetchorderDetails(accessToken);
  }, [orderId]);

  useEffect(() => {
    if (location.state?.showOrderPlaced) {
      setShowOrderPlaced(true);
    }
  }, [location.state]);

  return (
    <div className="flex justify-center items-start pt-15 md:pt-24 pb-10 px-4 cursor-default">
      {/* order display card */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[1200px] flex flex-col gap-6">
        {/* card heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">order Details</h1>

        {/* error boxes */}
        {isError && error.length > 0 && (
          <div className="bg-red-500 text-white rounded-md p-4 mb-4">
            {error.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        )}

        {order ? (
          <>
            {/* order details */}
            <div className="flex flex-col gap-1 mb-2">
              <p>
                <span className="font-semibold text-base md:text-lg">Order ID:</span> {order.displayId}
              </p>
              <p>
                <span className="font-semibold text-base md:text-lg">Name:</span>{' '}
                {typeof order.userId === 'object' ? order.userId.name : 'Unknown User'}
              </p>
              <p>
                <span className="font-semibold text-base md:text-lg">Order date:</span> {new Date(order.orderDate).toLocaleDateString('en-GB')}
              </p>
            </div>

            {/* order items */}
            <h2 className="text-base font-semibold mb-2 md:text-xl">Items</h2>
            <div className="flex flex-col gap-4">
              {order.cartId.items.map((item: any) => (
                <div key={item._id} className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg shadow-sm gap-2 bg-gray-100">
                  {/* left panel- item information */}
                  <div className="flex flex-col">
                    <p>
                      <span className="font-semibold">Item Name:</span> {typeof item.itemId === 'object' ? item.itemId.name : 'Unknown Item'}
                    </p>
                    <p>
                      <span className="font-semibold">Size:</span> {item.size}
                    </p>
                  </div>

                  {/* right panel - price */}
                  <div className="flex flex-col text-right mt-2 sm:mt-0">
                    <p>
                      <span className="font-semibold">Quantity:</span> {item.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> LKR {item.price.toLocaleString()}.00
                    </p>
                    <p>
                      <span className="font-semibold">Subtotal:</span> LKR {(item.price * item.quantity).toLocaleString()}.00
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-green-300 rounded-lg font-bold text-lg">
              <span>Total</span>
              <span>LKR {order.cartId?.totalPrice?.toLocaleString()}.00</span>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center italic">Loading order details...</p>
        )}
      </div>

      {showOrderPlaced && <MessagePopup message="Your order has been placed successfully!" />}
    </div>
  );
};

export default orderDetails;
