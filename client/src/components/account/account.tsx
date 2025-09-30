import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { type User } from '@/types/user';
import userIcon from '@/assets/icons/user.png';
import { Button } from '../ui/button';
import UpdateUserPopup from '../popups/updateUserPopup';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const Account: React.FC = () => {
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // handle logout button click
  const handleLogout = () => {
    // clear session storage
    sessionStorage.clear();

    window.location.href = '/';
  };

  // fetch user details
  const fetchUserDetails = async (accessToken: string) => {
    try {
      const { data } = await api.get('/api/v1/user', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      });
      const response = data;

      if (response.success) {
        setUser(data.response.data.user);
      } else {
        setError(response.response.data.message || 'Failed to fetch user details');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch user details');
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      fetchUserDetails(accessToken);
    }
  }, []);

  if (!user) return null;

  return (
    <>
      {error ? (
        <div className="flex justify-center items-start pt-24 pb-10 px-4 w-full">
          <div className="bg-red-300 p-6 rounded-2xl shadow-lg w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl flex flex-col sm:flex-row gap-8">
            {error}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-start pt-20 pb-10 px-4 w-full">
          <div className="bg-gray-100 p-6 md:p-30 rounded-2xl shadow-lg w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl flex flex-col sm:flex-row gap-8">
            {/* left panel - user image */}
            <div className="flex flex-col items-center gap-4 sm:w-1/3">
              <div className="w-60 h-60 rounded-full overflow-hidden flex items-center justify-center">
                <img src={userIcon} alt="User Avatar" className="w-100 h-100 object-contain" />
              </div>
            </div>

            {/* right panel - user details */}
            <div className="flex-1 flex flex-col gap-4 items-center sm:items-center justify-center px-4">
              <div className="font-bold text-2xl md:text-4xl cursor-default">{user.name}</div>

              <p className="text-gray-700 text-base md:text-lg cursor-default">{user.email}</p>

              <div className={`px-3 py-1 rounded-full text-white text-sm cursor-default ${user.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </div>

              <div className="relative inline-block group">
                <p className="italic text-sm md:text-base cursor-pointer">View past purchases</p>
                <span className="absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 w-0 group-hover:w-full"></span>
              </div>

              {/* buttons */}
              <div className="flex gap-4 justify-center mt-4">
                {/* update button */}
                <Button
                  onClick={() => setShowUpdatePopup(true)}
                  className="px-8 py-2 bg-green-700 text-white text-sm md:text-base rounded-lg hover:bg-green-900 cursor-pointer"
                >
                  Update
                </Button>

                {/* logout button */}
                <Button
                  onClick={handleLogout}
                  className="px-8 py-2 bg-red-700 text-white text-sm md:text-base rounded-lg hover:bg-red-900 cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {showUpdatePopup && <UpdateUserPopup user={user} onClose={() => setShowUpdatePopup(false)} />}
        </div>
      )}
    </>
  );
};

export default Account;
