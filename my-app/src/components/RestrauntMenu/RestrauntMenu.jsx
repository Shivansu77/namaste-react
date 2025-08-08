import React, { useEffect, useState } from "react";
import Shimmer from "../Body/Shimmer";
import { useParams } from "react-router-dom";
import { Menu_API } from "../../utils/constants";

function RestaurantMenu() {
  const [resInfo, setResInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const { resId } = useParams(); // Get restaurant ID from URL params
  useEffect(() => {
    fetchMenu(Menu_API + resId);
  }, []);

  const fetchMenu = async (url) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching menu from:', url);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('text/html') !== -1) {
        const errorText = await response.text();
        console.error('Received HTML instead of JSON:', errorText.substring(0, 200) + '...');
        throw new Error('The server returned an error page. Please try again later.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.status} ${response.statusText}`);
      }
      
      const json = await response.json();
      console.log('API Response:', json);
      
      // Handle the new response structure
      if (!json || !json.data) {
        console.error('Unexpected API response structure:', json);
        throw new Error('The menu data is not in the expected format.');
      }
      
      // If the API returns a non-success status code
      if (json.statusCode !== 0) {
        throw new Error(json.message || 'Failed to load menu. Please try again later.');
      }
      
      // The actual menu data is in the data property
      setResInfo(json.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
      
      // More specific error messages based on error type
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.message.includes('Failed to fetch menu')) {
        setError('The server is not responding. Please try again later.');
      } else {
        setError(err.message || 'Failed to load menu. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Extract restaurant info safely - updated to handle the new response structure
  const restaurantInfo = resInfo?.cards?.[0]?.card?.card?.info || 
                        resInfo?.cards?.[2]?.card?.card?.info || {};
  
  // Updated path to access menu items - more flexible to handle different response structures
  let menuItems = [];
  
  // Try different possible paths to find menu items
  const possibleMenuPaths = [
    // New structure
    resInfo?.cards?.[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards,
    resInfo?.cards?.[3]?.groupedCard?.cardGroupMap?.REGULAR?.cards,
    // Old structure
    resInfo?.cards?.[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards,
    resInfo?.cards?.[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards
  ];
  
  // Find the first valid menu items array
  const menuCards = possibleMenuPaths.find(cards => Array.isArray(cards)) || [];
  
  // Find the recommended items or use the first available menu section
  const recommendedMenu = menuCards.find(
    card => card?.card?.card?.title?.toLowerCase() === "recommended"
  ) || menuCards[0];
  
  // Extract menu items
  if (recommendedMenu?.card?.card?.itemCards) {
    menuItems = recommendedMenu.card.card.itemCards.map(item => item.card);
  }
  
  const { name, cuisines, costForTwoMessage, avgRating, totalRatingsString } = restaurantInfo;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => fetchMenu(Menu_API + resId)} 
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Restaurant Header */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            {cuisines && (
              <p className="text-sm">{Array.isArray(cuisines) ? cuisines.join(", ") : cuisines}</p>
            )}
            <span className="text-gray-300">•</span>
            <p className="text-sm font-medium">{costForTwoMessage}</p>
          </div>
          
          <div className="flex items-center bg-green-50 text-green-700 w-fit px-3 py-1 rounded-full">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span className="font-medium">{avgRating}</span>
            <span className="text-xs ml-1">({totalRatingsString})</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-3">
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all' 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveFilter('all')}
        >
          All Items
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            activeFilter === 'veg' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveFilter('veg')}
        >
          <span className="w-3 h-3 rounded-full border-2 border-green-600 flex items-center justify-center">
            {activeFilter === 'veg' && <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>}
          </span>
          Veg Only
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            activeFilter === 'non-veg' 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setActiveFilter('non-veg')}
        >
          <span className="w-3 h-3 rounded-full border-2 border-red-600 flex items-center justify-center">
            {activeFilter === 'non-veg' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
          </span>
          Non-Veg Only
        </button>
      </div>
      
      {/* Menu Items */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems
            .filter(item => {
              if (activeFilter === 'all') return true;
              const isVeg = item?.info?.isVeg !== undefined 
                ? item.info.isVeg 
                : item?.info?.itemAttribute?.vegClassifier === 'VEG';
              return activeFilter === 'veg' ? isVeg : !isVeg;
            })
            .length > 0 ? (
            menuItems
              .filter(item => {
                if (activeFilter === 'all') return true;
                const isVeg = item?.info?.isVeg !== undefined 
                  ? item.info.isVeg 
                  : item?.info?.itemAttribute?.vegClassifier === 'VEG';
                return activeFilter === 'veg' ? isVeg : !isVeg;
              })
              .map((item) => {
                const { id, name, description, price, defaultPrice, imageId, isVeg, itemAttribute } = item?.info || {};
                const displayPrice = price || defaultPrice;
                const isVegetarian = isVeg !== undefined ? isVeg : itemAttribute?.vegClassifier === 'VEG';
                
                return (
                  <div key={id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                    <div className="p-5 flex-grow">
                      <div className="flex items-start gap-3 mb-2">
                        <span className={`inline-block w-3 h-3 mt-1.5 rounded-full border-2 flex-shrink-0 ${
                          isVegetarian ? 'border-green-600' : 'border-red-600'
                        }`}>
                          {isVegetarian && <span className="w-1.5 h-1.5 rounded-full bg-green-600 m-0.5"></span>}
                          {!isVegetarian && <span className="w-1.5 h-1.5 rounded-full bg-red-600 m-0.5"></span>}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{name || 'Item Name'}</h3>
                      </div>
                      
                      <p className="text-gray-700 font-medium mb-3">
                        ₹{displayPrice ? (displayPrice / 100).toFixed(2) : 'N/A'}
                      </p>
                      
                      {description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                          {description}
                        </p>
                      )}
                    </div>
                    
                    {imageId && (
                      <div className="relative h-40 bg-gray-100">
                        <img 
                          className="w-full h-full object-cover"
                          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/${imageId}`} 
                          alt={name || 'Menu item'}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                          }}
                        />
                        <button className="absolute bottom-3 right-3 bg-white text-red-500 px-4 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
                          Add +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No menu items available at the moment.</p>
              <button 
                onClick={() => setActiveFilter('all')}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Show All Items
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantMenu;
