import React from "react";

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#ea3737]">
    <img
      src="https://res.cloudinary.com/dfotyo6jc/image/upload/v1754349724/Frame_40076_i5yw4a.png"
      alt="Logo"
      className="w-100 mb-8"
    />

    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-50"></div>
    </div>
  </div>
);

export default LoadingScreen;