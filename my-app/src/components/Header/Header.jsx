import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
const Header = () => {
  const [btnName,setbtnName]=useState('Login');
  return (
    <div className='header'>
      <div className='logo-container'>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" 
          className="logo" 
          alt="Logo" 
        />
      </div>
      <div className='nav-items'>
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Contact Us
            </NavLink>
          </li>
          <li>Cart</li>
          <li 
            className='login' 
            onClick={() => {
              setbtnName(btnName === 'Login' ? 'Logout' : 'Login');
            }}
          >
            {btnName}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
