import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaShoppingCart, FaHome, FaUser, FaEnvelope, FaLeaf } from 'react-icons/fa';

const Header = () => {
  const [btnName, setbtnName] = useState('Login');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

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

  const navItems = [
    { to: "/", label: "Home", icon: <FaHome className="w-4 h-4" /> },
    { to: "/about", label: "About Us", icon: <FaUser className="w-4 h-4" /> },
    { to: "/contact", label: "Contact Us", icon: <FaEnvelope className="w-4 h-4" /> },
    { to: "/cart", label: "Cart", icon: <FaShoppingCart className="w-4 h-4" /> },
    { to: "/grocery", label: "Grocery", icon: <FaLeaf className="w-4 h-4" /> },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-700 text-white' 
        : 'bg-white/95 border-gray-200 text-gray-900'
    }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center group'>
            <div className='relative'>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" 
                className='h-12 w-auto transition-transform duration-300 group-hover:scale-110' 
                alt="Logo" 
              />
            </div>
            <span className='ml-3 text-2xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent'>
              GoogleFoods
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:block'>
            <div className='flex items-center space-x-2'>
              {/* Status Indicator */}
              <div className={`flex items-center mr-6 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600' 
                  : 'bg-gray-100/50 border-gray-300'
              }`}>
                <span 
                  className={`inline-block w-2.5 h-2.5 rounded-full mr-2 transition-all duration-300 ${
                    isOnline ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
                  } ${isOnline ? 'animate-pulse' : ''}`}
                ></span>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl border transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50' 
                    : 'bg-gray-100/50 border-gray-300 hover:bg-gray-200/50'
                }`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <FaSun className='w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors duration-300' />
                ) : (
                  <FaMoon className='w-5 h-5 text-blue-600 hover:text-blue-500 transition-colors duration-300' />
                )}
              </button>

              {/* Navigation Links */}
              <nav className='flex items-center space-x-1'>
                {navItems.map((item) => (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/25' 
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    end={item.to === "/"}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
                
                <button
                  onClick={() => setbtnName(btnName === 'Login' ? 'Logout' : 'Login')}
                  className='ml-3 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                >
                  {btnName}
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='lg:hidden flex items-center space-x-3'>
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl border transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50' 
                  : 'bg-gray-100/50 border-gray-300 hover:bg-gray-200/50'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <FaSun className='w-5 h-5 text-yellow-400 hover:text-yellow-300 transition-colors duration-300' />
              ) : (
                <FaMoon className='w-5 h-5 text-blue-600 hover:text-blue-500 transition-colors duration-300' />
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50' 
                  : 'bg-gray-100/50 border-gray-300 hover:bg-gray-200/50'
              }`}
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen}
            >
              <span className='sr-only'>Open main menu</span>
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                xmlns='http://www.w3.org/2000/svg' 
                fill='none' 
                viewBox='0 0 24 24' 
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`px-4 py-6 space-y-3 border-t ${
          isDarkMode 
            ? 'bg-gray-900/95 border-gray-700' 
            : 'bg-white/95 border-gray-200'
        }`}>
          {/* Status Indicator for Mobile */}
          <div className={`flex items-center px-4 py-3 rounded-xl border ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600' 
              : 'bg-gray-100/50 border-gray-300'
          }`}>
            <span 
              className={`inline-block w-2.5 h-2.5 rounded-full mr-3 transition-all duration-300 ${
                isOnline ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              } ${isOnline ? 'animate-pulse' : ''}`}
            ></span>
            <span className={`text-sm font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Mobile Navigation Links */}
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/25' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              end={item.to === "/"}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          
          <button
            onClick={() => {
              setbtnName(btnName === 'Login' ? 'Logout' : 'Login');
              setIsMobileMenuOpen(false);
            }}
            className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-medium rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            {btnName}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
