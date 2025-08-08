import React from 'react';

const Grocery = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Grocery Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-slate-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-40 bg-slate-600 rounded-md mb-3"></div>
              <h3 className="text-lg font-medium text-white">Grocery Item {item}</h3>
              <p className="text-gray-300 text-sm">Category: Grocery</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-yellow-400 font-medium">${(Math.random() * 20 + 5).toFixed(2)}</span>
                <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grocery;
