//Test

import React, { useState } from "react";

const RangeSlider = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handleMinPriceChange = (e) => {
    setMinPrice(parseInt(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseInt(e.target.value));
  };
  return (
    <div className="p-4">
      <div className="relative mb-4">
        <input
          type="range"
          className="absolute z-20 mt-1 block w-full cursor-pointer rounded-md opacity-0"
          value={minPrice}
          onChange={handleMinPriceChange}
        />
        <input
          type="range"
          className="absolute z-20 mt-1 block w-full cursor-pointer rounded-md opacity-0"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
        <div className="relative z-10 h-2">
          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 rounded-md bg-gray-200"></div>

          <div
            className="absolute top-0 bottom-0 z-20 rounded-md bg-green-300"
            style={{ right: `${minPrice}%`, left: `${maxPrice}%` }}
          ></div>

          <div
            className="absolute top-0 left-0 z-30 -mt-2 h-6 w-6 rounded-full bg-green-300"
            style={{ left: `${minPrice}%` }}
          ></div>

          <div
            className="absolute top-0 right-0 z-30 -mt-2 h-6 w-6 rounded-full bg-green-300"
            style={{ right: `${maxPrice}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between space-x-4 pt-5 text-sm text-gray-700">
          <div>
            <input
              type="text"
              maxLength={5}
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center focus:border-yellow-400 focus:outline-hidden"
            />
          </div>
          <div>
            <input
              type="text"
              maxLength={5}
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center focus:border-yellow-400 focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
