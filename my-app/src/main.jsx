import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppLayout from './App';
import Body from './components/Body/Body';
import Contact from './components/ContactUs/Contact';
import About from './components/AboutUs/About';
import RestrauntMenu from './components/RestrauntMenu/RestrauntMenu';
import Error from './components/Error/Error';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load the Grocery component
const Grocery = lazy(() => import('./components/Grocery/Grocery'));

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
      },
      {
        path: '/grocery',
        element: (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          }>
            <Grocery />
          </Suspense>
        ),
      },
    ],
    errorElement: <Error />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  </StrictMode>
);
