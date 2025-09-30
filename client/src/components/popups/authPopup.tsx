import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { type AuthPopupProps } from '@/types/authPopupProps';

const AuthPopup: React.FC<AuthPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* popup display card */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md relative">
        {/* card heading */}
        <h2 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center">Please Login</h2>

        {/* subtext */}
        <p className="text-base sm:text-lg mb-4 text-center">You must be logged in to access this page.</p>

        {/* buttons */}
        <div className="flex flex-col gap-2 items-center lg:flex-row lg:justify-center lg:gap-4">
          <Button className="w-1/2 lg:w-1/4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 cursor-pointer" onClick={onClose}>
            Close
          </Button>

          <Button
            className="w-1/2 lg:w-1/4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
