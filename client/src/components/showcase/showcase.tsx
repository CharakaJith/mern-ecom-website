import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import Filter, { type FilterState } from '../filter/filter';
import { type ClothingItem } from '@/types/clothingItem';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const ShowCase: React.FC = () => {
  const limit = 6; // items per page

  const navigate = useNavigate();

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    size: '',
    minPrice: '',
    maxPrice: '',
  });

  // get clothing items
  const fetchClothingItems = async (pageNum: number = 1) => {
    try {
      setLoading(true);

      const params: any = { page: pageNum, limit };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.size) params.size = filters.size;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await api.get('/api/v1/item', { params });
      const response = data;

      if (response.success) {
        setItems(response.response.data.items);
        setTotalPages(response.response.data.totalPages);
        setPage(response.response.data.currentPage);
      } else {
        setError(response.response.data.message || 'Failed to fetch items');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  // go to details page
  const goToDetails = (itemId: string) => {
    navigate(`/item/${itemId}`);
  };

  useEffect(() => {
    fetchClothingItems(page);

    // scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page, filters]);

  return (
    <div className="flex justify-center items-start pt-24 pb-5 px-4">
      {/* showcase section */}
      <div className="bg-white pb-8 px-4 rounded-xl shadow-lg w-full max-w-full md:max-w-[90%]">
        {/* filter section */}
        <div className="text-center">
          <Filter
            onFilterChange={(updatedFilters) => {
              setFilters(updatedFilters);
              setPage(1);
            }}
          />
        </div>

        {/* section heading */}
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-center cursor-default">Featured Collection</h1>

        {/* message section */}
        <div>
          {/* loading message */}
          {loading && <p className="text-center">Loading...</p>}

          {/* no items available message */}
          {!loading && !error && items.length === 0 && (
            <p className="text-center text-gray-500 italic text-lg mt-6">No items available for the selected filters.</p>
          )}

          {/* error messages */}
          {error && (
            <div className="text-center text-red-500">
              <p className="italic text-sm md:text-lg">{error}</p>
              <Button className="mt-2 px-7 md:px-10 py-4 md:py-6 cursor-pointer text-base md:text-xl" onClick={() => fetchClothingItems(page)}>
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* item display section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item) => (
            // item card
            <div key={item._id} className="border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 flex flex-col">
              {/* item image */}
              <img src={`${apiUrl}${item.imageUrls[0]}`} alt={item.name} className="w-full h-140 object-cover rounded-t-lg" />

              {/* item content */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-lg md:text-2xl mb-2 cursor-pointer inline-block relative group">
                  <span className="relative" onClick={() => goToDetails(item._id)}>
                    {item.name}
                    <span className="absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 w-0 group-hover:w-full"></span>
                  </span>
                </h2>

                <p className="text-sm text-gray-600 flex-grow cursor-default">
                  {item.description.length > 150 ? item.description.slice(0, 150) + '... ' : item.description}
                  {item.description.length > 150 && (
                    <button className="text-blue-500 hover:underline cursor-pointer" onClick={() => goToDetails(item._id)}>
                      see more
                    </button>
                  )}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-bold cursor-default">Rs. {item.price.toLocaleString()}.00</p>
                  <Button className="bg-gray-700 hover:bg-gray-900 cursor-pointer" onClick={() => goToDetails(item._id)}>
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* pagination section */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button className="bg-gray-700 hover:bg-gray-900 cursor-pointer" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="flex items-center px-3 cursor-default">
              {page} / {totalPages}
            </span>
            <Button
              className="bg-gray-700 hover:bg-gray-900 cursor-pointer"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCase;
