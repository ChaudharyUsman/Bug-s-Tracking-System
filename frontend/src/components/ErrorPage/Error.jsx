import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBug } from 'react-icons/fa';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-600 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center items-center text-red-500 text-6xl mb-4">
          <FaBug />
        </div>
        <h1 className="text-4xl font-bold text-white-800 mb-2">404</h1>
        <p className="text-white-600 mb-6">
          An unexpected error has occurred. Please try again later or return to the login page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition duration-300"
        >
          Go Login
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
