import React from 'react';
import Header from './components/Header/Header';
import Body from './components/Body/Body';
import {Outlet} from 'react-router-dom';
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
// Default exported main component
export default AppLayout;
