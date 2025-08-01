import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppLayout from './App';
import Body from './components/Body/Body';
import Contact from './components/ContactUs/Contact';
import About from './components/AboutUs/About';
import RestrauntMenu from './components/AboutUs/RestrauntMenu/RestrauntMenu';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Body />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      }
      ,{
        path: '/restaurant/:resId',
        element: <RestrauntMenu />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);
