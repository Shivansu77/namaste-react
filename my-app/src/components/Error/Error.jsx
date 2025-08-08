import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const Error = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-md w-full text-center bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div className="text-6xl font-bold text-red-500 mb-4">
          {error?.status || 'Oops!'}
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          {error?.statusText || 'Something went wrong'}
        </h1>
        
        <p className="text-gray-300 mb-8">
          {error?.data?.message || 
           'We apologize for the inconvenience. Please try again or return to the homepage.'}
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
        
        {error?.stack && (
          <details className="mt-8 text-left">
            <summary className="text-sm text-gray-400 cursor-pointer">
              Show error details
            </summary>
            <pre className="mt-2 p-4 bg-slate-900 rounded-lg overflow-x-auto text-xs text-red-400">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default Error;
