// components/Loader.tsx
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
