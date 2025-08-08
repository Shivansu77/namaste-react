import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [btnName, setbtnName] = useState('Login');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className='bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center'>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" 
              className='h-12 w-auto' 
              alt="Logo" 
            />
            <span className='ml-3 text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent'>
              FoodVilla
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='flex items-center space-x-1'>
              {/* Status Indicator */}
              <div className='flex items-center mr-6 bg-black/20 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm'>
                <span 
                  className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                    isOnline ? 'bg-green-400' : 'bg-red-400'
                  } ${isOnline ? 'animate-pulse' : ''}`}
                ></span>
                <span className='text-sm font-medium text-gray-200'>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Navigation Links */}
              <nav className='flex items-center space-x-1'>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  end
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  About Us
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  Contact Us
                </NavLink>
                <NavLink 
                  to="/cart" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  Cart
                </NavLink>
                <NavLink 
                  to="/grocery" 
                  className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  Grocery
                </NavLink>
                <button
                  onClick={() => setbtnName(btnName === 'Login' ? 'Logout' : 'Login')}
                  className='ml-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-colors'
                >
                  {btnName}
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              <svg className='block h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className='md:hidden' id='mobile-menu'>
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800'>
          <div className='flex items-center px-3 py-2 text-sm font-medium text-gray-300'>
            <span 
              className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                isOnline ? 'bg-green-400' : 'bg-red-400'
              } ${isOnline ? 'animate-pulse' : ''}`}
            ></span>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          <NavLink 
            to="/" 
            className='block px-3 py-2 rounded-md text-base font-medium text-white bg-slate-700'
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white'
          >
            About Us
          </NavLink>
          <NavLink 
            to="/contact" 
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white'
          >
            Contact Us
          </NavLink>
          <NavLink 
            to="/cart" 
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white'
          >
            Cart
          </NavLink>
          <NavLink 
            to="/grocery" 
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white'
          >
            Grocery
          </NavLink>
          <button
            onClick={() => setbtnName(btnName === 'Login' ? 'Logout' : 'Login')}
            className='w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
          >
            {btnName}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
