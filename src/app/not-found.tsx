import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      
      <h1 className="text-9xl font-extrabold text-gray-800 tracking-wider">
        404
      </h1>

      <p className="text-2xl font-semibold text-gray-600 mb-6">
        Page Not Found
      </p>

      <Link href="/">
        <div className="px-6 py-3 text-lg font-medium text-white bg-gray-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md cursor-pointer">
          Go Back Home
        </div>
      </Link>
    </div>
  );
};

export default NotFound;