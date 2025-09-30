import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VALIDATE, ERROR } from '@/common/messages';
import type { AuthFormProps } from '@/types/authFormProps';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const LoginForm: React.FC<AuthFormProps> = ({ switchForm }) => {
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

          navigate('/');
        }
      } catch (error: any) {
        const responseData = error.response?.data?.response?.data;
        if (Array.isArray(responseData)) {
          setError(responseData.map((err) => err.message).filter(Boolean));
        } else if (responseData?.message) {
          setError([responseData.message]);
        } else {
          setError([ERROR.UNEXPECTED]);
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
    <div className="flex w-full items-center justify-center px-5 cursor-default">
      {/* input card */}
      <div className="flex flex-col gap-4 w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-sm p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-gray-200 shadow-lg">
        {/* card heading */}
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">Login to Your Account</h2>

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

          {/* go to sign up text */}
          <div className="w-full flex justify-center items-center">
            <p className="text-center text-gray-500">
              New here?{' '}
              <span className="relative inline-block group cursor-pointer hover:text-black" onClick={switchForm}>
                Create an account.
                <span className="absolute left-0 -bottom-0.5 h-[2px] bg-black w-0 group-hover:w-full transition-all duration-300"></span>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
