import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const RestaurantCard = ({ name, cuisine, rating, cloudinaryImageId, isPromoted = false }) => {
  const { isDarkMode } = useTheme();
  const imageUrl = `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/${cloudinaryImageId}`;
  
  return (
    <div className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col relative ${
      isDarkMode 
        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
        : 'bg-white hover:bg-gray-50 border border-gray-200'
    }`}>
      {isPromoted && (
        <div className='absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-10'>
          Promoted
        </div>
      )}
      <div className='relative pb-3/4 mb-3 overflow-hidden rounded-md'>
        <img
          src={imageUrl}
          alt={`${name} restaurant`}
          className='w-full h-40 object-cover rounded-md hover:scale-105 transition-transform duration-300'
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2R8ZW58MHx8MHx8fDA%3D';
          }}
        />
      </div>
      <div className='flex-grow'>
        <h2 className={`text-lg font-semibold mb-1 line-clamp-1 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{name}</h2>
        <p className={`text-sm mb-2 line-clamp-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>{cuisine}</p>
        <div className='flex items-center mt-auto'>
          <span className='bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center'>
            <span className='text-yellow-500 dark:text-yellow-400 mr-1'>★</span> {rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
