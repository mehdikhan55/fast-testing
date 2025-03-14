import React from 'react'

// Loading component
const LoadingFallback = () => (
    <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-b from-slate-900 to-blue-900">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-white font-light tracking-wider">Initiating launch sequence...</p>
      </div>
    </div>
  );
export default LoadingFallback
