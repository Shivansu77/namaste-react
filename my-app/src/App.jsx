import React from 'react';
import Header from './components/Header/Header';
import Body from './components/Body/Body';

const AppLayout = () => {
  return (
    <div className="app">
      <Header />
      <Body />
    </div>
  );
};

// Default exported main component
export default function App() {
  return <AppLayout />;
}
