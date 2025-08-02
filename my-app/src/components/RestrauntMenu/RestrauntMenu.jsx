import React, { useEffect, useState } from "react";
import Shimmer from "../Body/Shimmer";
import "./RestaurantMenu.css";
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
      <div className="shimmer-container">
        <Shimmer />
        <p className="loading-text">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => fetchMenu(Menu_API + resId)} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-menu">
      <div className="restaurant-header">
        <h1 className="restaurant-name">{name}</h1>
        <div className="restaurant-meta">
          {cuisines && (
            <p className="cuisines">{Array.isArray(cuisines) ? cuisines.join(", ") : cuisines}</p>
          )}
          <p className="cost-for-two">{costForTwoMessage}</p>
          <div className="rating-container">
            <span className="rating">⭐ {avgRating}</span>
            <span className="total-ratings">({totalRatingsString})</span>
          </div>
        </div>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Items
        </button>
        <button 
          className={`filter-btn veg ${activeFilter === 'veg' ? 'active' : ''}`}
          onClick={() => setActiveFilter('veg')}
        >
          <span className="veg-indicator small veg">
            <span className="indicator-inner"></span>
          </span>
          Veg Only
        </button>
        <button 
          className={`filter-btn non-veg ${activeFilter === 'non-veg' ? 'active' : ''}`}
          onClick={() => setActiveFilter('non-veg')}
        >
          <span className="veg-indicator small non-veg">
            <span className="indicator-inner"></span>
          </span>
          Non-Veg Only
        </button>
      </div>
      
      <h2 className="menu-title">Menu</h2>
      <div className="menu-items">
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
              <div key={id} className="menu-item">
                <div className="item-details">
                  <div className="item-header">
                    <div className={`veg-indicator ${isVegetarian ? 'veg' : 'non-veg'}`}>
                      <div className="indicator-inner"></div>
                    </div>
                    <h3 className="item-name">{name || 'Item Name'}</h3>
                  </div>
                  <p className="item-price">
                    ₹{displayPrice ? (displayPrice / 100).toFixed(2) : 'N/A'}
                  </p>
                  {description && <p className="item-description">{description}</p>}
                </div>
                {imageId && (
                  <div className="item-image">
                    <img 
                      src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/${imageId}`} 
                      alt={name || 'Menu item'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button className="add-button">Add +</button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-items">No menu items available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default RestaurantMenu;
