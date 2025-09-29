'use client'; 

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Caught error in error.tsx:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      
      <h2 className="text-4xl font-bold text-red-600 mb-4">
        Something Went Wrong!
      </h2>

      <p className="text-xl text-gray-700 mb-8">
        We &apos; re sorry, an unexpected error occurred.
      </p>

      <button
        onClick={
          () => reset()
        }
        className="px-6 py-3 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try Reloading This Section
      </button>

      <div className="mt-8 p-4 bg-gray-100 rounded-md text-sm text-gray-500">
        <p>
          <span className="font-semibold">Error Message:</span> {error.message}
        </p>
        {error.digest && (
          <p className="mt-1">
            <span className="font-semibold">Digest:</span> {error.digest}
          </p>
        )}
      </div>

    </div>
  );
}