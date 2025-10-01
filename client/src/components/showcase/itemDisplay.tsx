import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { type ClothingItem } from '@/types/clothingItem';
import { useCart } from '@/context/cartContext';
import MessagePopup from '../popups/messagePopup';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const ItemDisplay: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();

  const [item, setItem] = useState<ClothingItem>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const { addToCart } = useCart();

  // fetch item details
  const fetchItemDetails = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/api/v1/item/details/${itemId}`);
      const response = data;

      if (response.success) {
        setItem(response.response.data.item);
        setSelectedImage(`${apiUrl}${response.response.data.item.imageUrls[0]}`);
      } else {
        setError(response.response.data.message || 'Failed to fetch item');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch item');
    } finally {
      setLoading(false);
    }
  };

  // handla quantity on change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // handle add to cart
  const handleAddToCart = () => {
    if (!item || !selectedSize) {
      setPopupMessage('Please select a size!');
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    addToCart(item, selectedSize);
    setPopupMessage('Item added to cart!');
    setTimeout(() => setPopupMessage(null), 3000);
  };

  useEffect(() => {
    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;
  if (!item) return null;

  return (
    <div className="flex justify-center items-start pt-24 pb-10 px-4 cursor-default">
      {/* item display section */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[1200px] flex flex-col md:flex-row gap-10">
        {/* left panel - item images */}
        <div className="flex-1 flex flex-col items-center">
          {/* main image */}
          <img src={selectedImage} alt={item.name} className="w-full max-h-140 object-cover rounded-lg shadow-md" />

          {/* thumbnails */}
          <div className="flex gap-3 mt-4">
            {item.imageUrls.map((img, idx) => (
              <img
                key={idx}
                src={`${apiUrl}${img}`}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === `${apiUrl}${img}` ? 'border-black' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(`${apiUrl}${img}`)}
              />
            ))}
          </div>
        </div>

        {/* right panel - item info */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
          <p className="text-gray-700 mb-6">{item.description}</p>

          {/* sizes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Available Sizes:</h3>
            <div className="flex gap-3 mb-3">
              {item.sizes.map((size, idx) => (
                <span
                  key={idx}
                  className={`px-4 py-2 border rounded-lg cursor-pointer ${
                    selectedSize === size ? 'bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>

            {/* quantity */}
            <div>
              <label className="font-semibold mr-2">Quantity:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={handleQuantityChange}
                className="w-20 px-2 py-1 border rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <p className="text-2xl font-bold mb-6">LKR {item.price.toLocaleString()}.00</p>

          {/* add to cart */}
          <Button className="bg-gray-700 hover:bg-gray-900 w-fit px-8 py-4 text-lg cursor-pointer" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>

      {popupMessage && <MessagePopup message={popupMessage} />}
    </div>
  );
};

export default ItemDisplay;
