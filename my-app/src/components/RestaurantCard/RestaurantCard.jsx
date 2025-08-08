import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, cloudinaryImageId }) => {
  const imageUrl = `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/${cloudinaryImageId}`;
  
  return (
    <div className='bg-slate-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-slate-600 h-full flex flex-col'>
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
        <h2 className='text-lg font-semibold text-white mb-1 line-clamp-1'>{name}</h2>
        <p className='text-gray-300 text-sm mb-2 line-clamp-2'>{cuisine}</p>
        <div className='flex items-center mt-auto'>
          <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center'>
            <span className='text-yellow-500 mr-1'>★</span> {rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
