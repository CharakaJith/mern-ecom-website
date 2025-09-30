import React, { useState } from 'react';
import { EyeIcon, EyeClosedIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sizes } from '@/constants/clothingSizes';
import { Categories } from '@/constants/clothingCategory';
import { Input } from '../ui/input';

export interface FilterState {
  search: string;
  category: string;
  size: string;
  minPrice: number | '';
  maxPrice: number | '';
}

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    size: '',
    minPrice: '',
    maxPrice: '',
  });

  const [showExtraFilters, setShowExtraFilters] = useState(false);

  const handleChange = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    const resetFilters: FilterState = { search: '', category: '', size: '', minPrice: '', maxPrice: '' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center text-center">
      {/* extra filter section */}
      <div
        className={`flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center w-full ${showExtraFilters ? 'block' : 'hidden'} md:flex`}
      >
        {/* category filter */}
        <div className="flex flex-col items-center w-full sm:w-auto">
          <label className="text-sm font-medium mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto cursor-pointer"
          >
            <option value="">All</option>
            {Categories.values.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* size filter */}
        <div className="flex flex-col items-center w-full sm:w-auto">
          <label className="text-sm font-medium mb-1">Size</label>
          <select
            value={filters.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto cursor-pointer"
          >
            <option value="">All</option>
            {Sizes.values.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* price filter */}
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
          {/* min amount */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium mb-1">Min Price</label>
            <Input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value ? parseInt(e.target.value) : '')}
              placeholder="0.00"
              className="border rounded px-3 py-2 w-full sm:w-24 cursor-pointer"
            />
          </div>

          {/* max amount */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium mb-1">Max Price</label>
            <Input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value ? parseInt(e.target.value) : '')}
              placeholder="0.00"
              className="border rounded px-3 py-2 w-full sm:w-24 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        <Input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search products..."
          className="border rounded px-3 py-2 w-full sm:w-[300px] cursor-pointer"
        />
      </div>

      {/* buttons section */}
      <div className="w-full sm:w-auto flex justify-center gap-2">
        {/* reset button */}
        <Button className="bg-gray-700 hover:bg-gray-900 px-6 py-2 cursor-pointer" onClick={handleReset}>
          Reset
        </Button>

        {/* search button */}
        <Button className="bg-green-400 hover:bg-green-600 text-black px-6 py-2 cursor-pointer" onClick={handleSearch}>
          Search
        </Button>

        {/* toggle filters button */}
        <Button
          className="bg-blue-400 hover:bg-blue-600 text-black px-6 py-2 cursor-pointer md:hidden"
          onClick={() => setShowExtraFilters((prev) => !prev)}
        >
          {showExtraFilters ? <EyeClosedIcon size={18} /> : <EyeIcon size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default Filter;
