import React, { useState, useEffect } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import Shimmer from './Shimmer';
import { Link } from 'react-router-dom';

const Body = () => {
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        'https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const restaurantData =
        data?.data?.cards?.find(
          (card) =>
            card?.card?.card?.gridElements?.infoWithStyle?.restaurants
        )?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];

      if (restaurantData.length > 0) {
        const formattedRestaurants = restaurantData.map((item) => ({
          ...item.info,
          id: item.info.id || Math.random().toString(36).substring(2, 9),
        }));

        setListOfRestaurants(formattedRestaurants);
        setFilteredRestaurants(formattedRestaurants);
      } else {
        // No restaurant array found in expected shape
        setListOfRestaurants([]);
        setFilteredRestaurants([]);
      }
    } catch (fetchError) {
      console.error('Error fetching data:', fetchError);
      setError(fetchError.message);
      setListOfRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTopRated = () => {
    const filtered = listOfRestaurants.filter(
      (restaurant) => Number(restaurant.avgRating) > 4.45
    );
    setFilteredRestaurants(filtered);
  };

  const showAllRestaurants = () => {
    setFilteredRestaurants([...listOfRestaurants]);
  };

  if (isLoading) {
    return <Shimmer />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Discover Restaurants</h1>
          <span className="text-sm text-gray-400">{filteredRestaurants.length} results</span>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 015.364 10.848l3.519 3.519a.75.75 0 11-1.06 1.06l-3.52-3.518A6.75 6.75 0 1110.5 3.75zm0 1.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search for restaurants..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const filtered = listOfRestaurants.filter((restaurant) =>
                        restaurant.name.toLowerCase().includes(searchText.toLowerCase())
                      );
                      setFilteredRestaurants(filtered);
                    }
                  }}
                  className="w-full pl-10 pr-10 p-2.5 border border-gray-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {searchText && (
                  <button
                    type="button"
                    onClick={() => setSearchText('')}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-gray-200"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  const filtered = listOfRestaurants.filter((restaurant) =>
                    restaurant.name.toLowerCase().includes(searchText.toLowerCase())
                  );
                                      setFilteredRestaurants(filtered);
                }}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm active:scale-[0.98]"
              >
                Search
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={filterTopRated}
              disabled={isLoading || error}
              className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Top Rated Restaurants
            </button>
            <button
              onClick={showAllRestaurants}
              disabled={isLoading || error}
              className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Show All
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link 
                key={restaurant.id} 
                to={"restaurant/"+restaurant.id}
                className="block hover:scale-105 transition-transform duration-200 hover:z-10"
              >
                <RestaurantCard
                  name={restaurant.name}
                  cuisine={restaurant.cuisines?.join(', ') || 'Various cuisines'}
                  rating={restaurant.avgRating}
                  cloudinaryImageId={restaurant.cloudinaryImageId}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-200">No restaurants found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria</p>
            <button
              onClick={showAllRestaurants}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
            >
              Show All Restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
