import React, { useState, useEffect } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import Shimmer from './Shimmer';

// Mock data for fallback
const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'Burger King',
    cuisines: ['Burgers', 'American'],
    avgRating: 4.2,
    cloudinaryImageId: 'e33e1d3ba7d6b2bb0d45e1001e7314cf'
  },
  {
    id: '2',
    name: 'Pizza Hut',
    cuisines: ['Pizzas', 'Italian'],
    avgRating: 4.0,
    cloudinaryImageId: '2b4f62d606d1b2bfba9ba9e5386fabb7'
  },
  // Add more mock data as needed
];

const Body = () => {
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch from the API first
      try {
        const response = await fetch('https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Find the restaurant data in the response
        const restaurantData = data?.data?.cards?.find(
          card => card?.card?.card?.gridElements?.infoWithStyle?.restaurants
        )?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];
        
        if (restaurantData.length > 0) {
          const formattedRestaurants = restaurantData.map(item => ({
            ...item.info,
            id: item.info.id || Math.random().toString(36).substr(2, 9)
          }));
          
          setListOfRestaurants(formattedRestaurants);
          setFilteredRestaurants(formattedRestaurants);
          setUsingMockData(false);
          return;
        }
      } catch (apiError) {
        console.warn('API request failed, using mock data:', apiError);
        // Continue to use mock data if API fails
      }
      
      // If we get here, either the API request failed or no data was returned
      setListOfRestaurants(MOCK_RESTAURANTS);
      setFilteredRestaurants(MOCK_RESTAURANTS);
      setUsingMockData(true);
      
      // If we reach here, we're using mock data
      console.log('Using mock data');
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      
      // Fallback to mock data in case of error
      setListOfRestaurants(MOCK_RESTAURANTS);
      setFilteredRestaurants(MOCK_RESTAURANTS);
      setUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTopRated = () => {
    const filtered = listOfRestaurants.filter(
      (restaurant) => restaurant.avgRating > 4.45
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
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className='body'>
      {usingMockData && (
        <div className='mock-warning'>
          ⚠️ Using mock data. Some features may be limited.
        </div>
      )}
      
      <div className='filter'>
        <button
          className='filter-btn'
          onClick={filterTopRated}
          disabled={isLoading || error}
        >
          Top Rated Restaurants
        </button>
        <button
          className='filter-btn show-all'
          onClick={showAllRestaurants}
          disabled={isLoading || error}
        >
          Show All
        </button>
      </div>

      <div className='res-container'>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id}
              name={restaurant.name}
              cuisine={restaurant.cuisines?.join(', ') || 'Various cuisines'}
              rating={restaurant.avgRating}
              cloudinaryImageId={restaurant.cloudinaryImageId}
            />
          ))
        ) : (
          <div className="no-restaurants">No restaurants found. Please try again later.</div>
        )}
      </div>
    </div>
  );
};

export default Body;


