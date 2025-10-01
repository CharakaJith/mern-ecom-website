import type { Order } from '@/types/order';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const OrderHistory: React.FC = () => {
  const [orderList, setOrderList] = useState<Order[] | null>([]);
  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();

  // fetch all orders
  const fetchAllOrders = async (accessToken: string) => {
    try {
      // send request
      const { data } = await api.get('/api/v1/order', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });

      if (data.success) {
        setOrderList(data.response.data.orders);
        setIsError(false);
        setError([]);
      } else {
        setError([data.response.data.message || 'Failed to fetch all orders']);
        setIsError(true);
      }
    } catch (error: any) {
      setError([error.message || 'Failed to fetch all orders']);
      setIsError(true);
    }
  };

  // go to details page
  const goToDetails = (orderId: string) => {
    navigate(`/order/details/${orderId}`);
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) fetchAllOrders(accessToken);
  }, []);

  return (
    <div className="flex justify-center items-start pt-15 md:pt-24 pb-10 px-4 cursor-default">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[1200px] flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">Your Orders</h1>

        {/* error boxes */}
        {isError && error.length > 0 && (
          <div className="bg-red-500 text-white rounded-md p-4 mb-4">
            {error.map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}

        {/* no orders */}
        {orderList && orderList.length === 0 && !isError && <p className="text-gray-600 italic text-center">You have no past orders.</p>}

        {/* order list */}
        {orderList?.map((order) => (
          <div key={order._id} className="flex flex-col gap-3 border rounded-lg p-4 shadow-sm bg-gray-100 cursor-pointer hover:bg-gray-200">
            {/* order summary */}
            <div
              onClick={() => {
                goToDetails(order._id);
              }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <p>
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-semibold">Order Date:</span> {new Date(order.orderDate).toLocaleDateString('en-GB')}
              </p>
              <p>
                <span className="font-semibold">Total Price:</span> LKR {order.totalPrice.toLocaleString()}.00
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
