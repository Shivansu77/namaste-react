import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, cloudinaryImageId }) => {
  const imageUrl = `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/${cloudinaryImageId}`;
  
  return (
    <div className='res-card' style={{ backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "8px", width: "250px" }}>
      <img
        src={imageUrl}
        alt={`${name} restaurant`}
        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if the fallback also fails
          e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2R8ZW58MHx8MHx8fDA%3D';
        }}
      />
      <h2>{name}</h2>
      <h3>{cuisine}</h3>
      <h4>{rating} ⭐</h4>
    </div>
  );
};

export default RestaurantCard;
