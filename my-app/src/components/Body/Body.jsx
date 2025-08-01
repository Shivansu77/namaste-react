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
          id: item.info.id || Math.random().toString(36).substr(2, 9),
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
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="body">
      <div className="filter-container">
        <div className="search">
          <input
            type="text"
            placeholder="cafe"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            className="search-btn"
            onClick={() => {
              const filtered = listOfRestaurants.filter((restaurant) =>
                restaurant.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              );
              if (filtered.length === 0) {
                alert('No restaurants found with that name');
              }
              setFilteredRestaurants(filtered);
              setSearchText('');
            }}
          >
            Search
          </button>
        </div>
        <button
          className="filter-btn"
          onClick={filterTopRated}
          disabled={isLoading || error}
        >
          Top Rated Restaurants
        </button>
        <button
          className="filter-btn show-all"
          onClick={showAllRestaurants}
          disabled={isLoading || error}
        >
          Show All
        </button>
      </div>

      <div className="res-container">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} to={"restaurant/"+restaurant.id}><RestaurantCard
              name={restaurant.name}
              cuisine={
                restaurant.cuisines?.join(', ') || 'Various cuisines'
              }
              rating={restaurant.avgRating}
              cloudinaryImageId={restaurant.cloudinaryImageId}
            /></Link>
          ))
        ) : (
          <div className="no-restaurants">
            No restaurants found. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
