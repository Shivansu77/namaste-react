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
  
  const { name, cuisines, costForTwoMessage, avgRating, totalRatingsString, areaName, city } = restaurantInfo;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Restaurant Header Shimmer */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          
          {/* Filters Shimmer */}
          <div className="flex gap-3 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            ))}
          </div>
          
          {/* Menu Items Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchMenu(Menu_API + resId)} 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{name}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
                  {cuisines && (
                    <p className="text-lg">{Array.isArray(cuisines) ? cuisines.join(", ") : cuisines}</p>
                  )}
                  <span className="text-gray-300 text-xl">•</span>
                  <p className="text-lg font-medium">{costForTwoMessage}</p>
                </div>
                
                {areaName && city && (
                  <p className="text-gray-500 mb-4">
                    📍 {areaName}, {city}
                  </p>
                )}
              </div>
              
              <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
                <span className="text-yellow-500 mr-2 text-xl">⭐</span>
                <div className="text-center">
                  <div className="font-bold text-lg">{avgRating}</div>
                  <div className="text-xs text-green-600">({totalRatingsString})</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter Menu</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All Items
            </button>
            <button 
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeFilter === 'veg' 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => setActiveFilter('veg')}
            >
              <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                {activeFilter === 'veg' && <span className="w-2 h-2 rounded-full bg-current"></span>}
              </span>
              Veg Only
            </button>
            <button 
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeFilter === 'non-veg' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => setActiveFilter('non-veg')}
            >
              <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                {activeFilter === 'non-veg' && <span className="w-2 h-2 rounded-full bg-current"></span>}
              </span>
              Non-Veg Only
            </button>
          </div>
        </div>
        
        {/* Menu Items */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Menu</h2>
            <p className="text-gray-600">
              {menuItems.filter(item => {
                if (activeFilter === 'all') return true;
                const isVeg = item?.info?.isVeg !== undefined 
                  ? item.info.isVeg 
                  : item?.info?.itemAttribute?.vegClassifier === 'VEG';
                return activeFilter === 'veg' ? isVeg : !isVeg;
              }).length} items available
            </p>
          </div>
          
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
                    <div key={id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      {imageId && (
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <img 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/${imageId}`} 
                            alt={name || 'Menu item'}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                          <button className="absolute bottom-4 right-4 bg-white text-red-600 px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                            Add +
                          </button>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <span className={`inline-block w-4 h-4 mt-1 rounded-full border-2 flex-shrink-0 ${
                            isVegetarian ? 'border-green-600' : 'border-red-600'
                          }`}>
                            {isVegetarian && <span className="w-2 h-2 rounded-full bg-green-600 m-0.5"></span>}
                            {!isVegetarian && <span className="w-2 h-2 rounded-full bg-red-600 m-0.5"></span>}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                            {name || 'Item Name'}
                          </h3>
                        </div>
                        
                        <p className="text-2xl font-bold text-red-600 mb-3">
                          ₹{displayPrice ? (displayPrice / 100).toFixed(2) : 'N/A'}
                        </p>
                        
                        {description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">No menu items match your current filter criteria.</p>
                  <button 
                    onClick={() => setActiveFilter('all')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Show All Items
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantMenu;
