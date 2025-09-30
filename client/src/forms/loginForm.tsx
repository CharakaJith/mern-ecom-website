import axios from 'axios';
import React, { useState, useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VALIDATE } from '@/common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const LoginForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();

  // handle email on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (emailValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle password on change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate fields
    if (!email || email.trim().length === 0 || !password || password.trim().length === 0) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else {
      // request body
      const loginDetails = {
        email: email,
        password: password,
      };

      // send request
      try {
        const res = await api.post('/api/v1/user/login', loginDetails);
        if (res.data.success) {
          // store access token and refresh token
          const accessToken = res.headers['access-token'];
          if (accessToken) {
            sessionStorage.setItem('accessToken', accessToken);
          }

          // store user info
          const user = res.data.response.data.user;
          sessionStorage.setItem('user', JSON.stringify(user));

          navigate('/home');
        }
      } catch (error: any) {
        const responseData = error.response?.data?.response?.data;
        if (Array.isArray(responseData)) {
          setError(responseData.map((err) => err.message).filter(Boolean));
        } else if (responseData?.message) {
          setError([responseData.message]);
        } else {
          setError(['An unexpected error occurred']);
        }
        setIsError(true);
      }
    }
  };

  // handle error timeout
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
        setError([]);
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    }
  }, [isError]);

  return (
    <div className="flex w-full items-center justify-center">
      {/* input card */}
      <div className="flex flex-col gap-4 w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-sm p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-gray-200 shadow-lg">
        {/* card heading */}
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">Access Your Dashboard</h2>

        {/* login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* input fields */}
          <Input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
          <Input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />

          {/* error boxes */}
          {isError &&
            error.map((msg, index) => (
              <div key={index} className="w-full py-2 bg-red-500 text-white rounded-md text-sm text-center">
                {msg}
              </div>
            ))}

          {/* submit button */}
          <Button type="submit" className="cursor-pointer w-full bg-gray-700 hover:bg-gray-900">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
