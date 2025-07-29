import React from 'react';
import '../../index.css';

const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="shimmer-card">
          <div className="shimmer-img"></div>
          <div className="shimmer-title"></div>
          <div className="shimmer-cuisines"></div>
          <div className="shimmer-rating"></div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;
