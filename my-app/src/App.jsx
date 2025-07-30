import React from 'react';
import Header from './components/Header/Header';
import Body from './components/Body/Body';
import {Outlet} from 'react-router-dom';
const AppLayout = () => {
  return (
    <div className="app">
      <Header />
      <Outlet />
    </div>
  );
};
// Default exported main component
export default AppLayout;
