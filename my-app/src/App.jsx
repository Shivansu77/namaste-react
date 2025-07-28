import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

// Component for the layout
const Header = () => {
  return (
    <div className='header'>
      <div className='logo-container'>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" className="logo" alt="Vite logo" />
      </div>
      <div className='nav-items'>
        <ul>
          <li>Home</li>
          <li>About us</li>
          <li>Contact Us</li>
          <li>Cart</li>
        </ul>
      </div>
    </div>
  )
}
const Body = () => {
 
}
          
const AppLayout = () => {
  return (
    <div className="app">
      <Header />
      <Body/>
    </div>
  );
};

// Default exported main component
export default function App() {
  return <AppLayout />;
}
