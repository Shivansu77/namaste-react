import React , { useState,useEffect, use } from 'react';
import RestaurantCard from '../RestaurantCard/RestaurantCard';

const Body = () => {
  // Set initial state with all restaurants
  const [listOfRestaurants, setListOfRestaurants] = useState([]);

  useEffect(() => {
   fetchData();
  }
, []);
  const fetchData = async () => {
    try {
      // Using a different CORS proxy
      const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';
      const apiUrl = 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING';
      
      const response = await fetch(proxyUrl + apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Origin': 'http://localhost:3000',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        // Add credentials if needed
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Try to find restaurant data in common response structures
      let restaurants = [];
      
      // Check different possible paths where restaurants might be
      if (data?.data?.cards?.length) {
        for (const card of data.data.cards) {
          if (card?.card?.card?.gridElements?.infoWithStyle?.restaurants) {
            restaurants = card.card.card.gridElements.infoWithStyle.restaurants;
            break;
          }
        }
      }
      
      if (restaurants.length > 0) {
        // Transform the data to match our expected format
        const formattedRestaurants = restaurants.map(item => ({
          ...item.info,
          id: item.info.id || Math.random().toString(36).substr(2, 9)
        }));
        
        setListOfRestaurants(formattedRestaurants);
      } else {
        console.warn('No restaurants found in the response. Using local data.');
        setListOfRestaurants(resObj.restaurants || []);
      }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

  return (
    <div className='body'>
      <div className='filter'>
        <button
          className='filter-btn'
          onClick={() => {
            const filtered = listOfRestaurants.restaurants.filter(
              (restaurant) => restaurant.avgRating > 4.0
            );
            setListOfRestaurants(filtered); // Update the state
          }}
        >
          Top Rated Restaurant
        </button>
      </div>

      <div className='res-container'>
        {listOfRestaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant.id}
            name={restaurant.name}
            cuisine={restaurant.cuisines.join(', ')}
            rating={restaurant.avgRating}
            cloudinaryImageId={restaurant.cloudinaryImageId}
          />
        ))}
      </div>
    </div>
  );
};

export default Body;


