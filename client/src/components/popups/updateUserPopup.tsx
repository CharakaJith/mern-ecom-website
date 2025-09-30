import axios from 'axios';
import React, { useState } from 'react';

import { Button } from '../ui/button';
import type { UpdateUserPopupProp } from '@/types/updateUserPopupProps';
import { Input } from '../ui/input';
import { VALIDATE } from '@/common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const UpdateUserPopup: React.FC<UpdateUserPopupProp> = ({ user, onClose }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  // handle submit
  const handleSubmit = async () => {
    // validate inputs
    if (!email || email.trim().length === 0 || !name || name.trim().length === 0) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else {
      // request body
      const updateDetails = {
        name: name,
        email: email,
      };

      // send request
      try {
        const accessToken = sessionStorage.getItem('accessToken');

        const res = await api.put('/api/v1/user', updateDetails, {
          headers: {
            Authorization: `"${accessToken}"`,
          },
        });
        if (res.data.success) {
          onClose();
          window.location.reload();
        }
      } catch (error: any) {
        const responseData = error.response?.data?.response?.data;

        if (Array.isArray(responseData)) {
          setError(responseData.map((err) => err.message).filter(Boolean));
        } else if (responseData?.message) {
          setError([responseData.message]);
        } else if (typeof responseData === 'string') {
          setError([responseData]);
        } else {
          setError(['An unexpected error occurred']);
        }

        setIsError(true);
        return;
      }
    }

    setError([]);
    setIsError(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      {/* popup display card */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md relative flex flex-col gap-4">
        {/* card heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-center">Update Details</h2>

        {/* fields */}
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* error boxes */}
        {isError &&
          error.map((msg, index) => (
            <div key={index} className="w-full py-2 bg-red-500 text-white rounded-md text-sm text-center">
              {msg}
            </div>
          ))}

        {/* buttons section */}
        <div className="flex flex-col gap-2 items-center lg:flex-row lg:justify-center lg:gap-4 mt-2">
          {/* close button */}
          <Button className="w-1/2 lg:w-1/4 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 cursor-pointer" onClick={onClose}>
            Close
          </Button>

          {/* save update */}
          <Button className="w-1/2 lg:w-1/4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 cursor-pointer" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserPopup;
