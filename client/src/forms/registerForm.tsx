import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VALIDATE, ERROR, DISPLAY } from '@/common/messages';
import type { AuthFormProps } from '@/types/authFormProps';
import MessagePopup from '@/components/popups/messagePopup';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const RegisterForm: React.FC<AuthFormProps> = ({ switchForm }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const [error, setError] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  // handle name on change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const nameValue = e.target.value;
    setName(nameValue);

    if (nameValue.trim().length > 0) {
      setIsError(false);
    }
  };

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

  // handle confirm password on change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    if (confirmPasswordValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate fields
    if (
      !name ||
      name.trim().length === 0 ||
      !email ||
      email.trim().length === 0 ||
      !password ||
      password.trim().length === 0 ||
      !confirmPassword ||
      confirmPassword.trim().length === 0
    ) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else {
      // request body
      const loginDetails = {
        name: name,
        email: email,
        password: password,
      };

      // send request
      try {
        const res = await api.post('/api/v1/user', loginDetails);
        if (res.data.success) {
          // reset form fields
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');

          // show popup
          setPopupMessage(DISPLAY.REGISTER_SUCCESS);

          setTimeout(() => {
            switchForm();
            setPopupMessage(null);
          }, 8000);
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

  // check password and confrim password on change
  useEffect(() => {
    if (confirmPassword && password && confirmPassword !== password) {
      setIsError(true);
      setError([VALIDATE.PASSWORD_MISMATCH]);
    } else if (isError && error[0] === VALIDATE.PASSWORD_MISMATCH) {
      setIsError(false);
      setError([]);
    }
  }, [password, confirmPassword]);

  return (
    <div className="flex w-full items-center justify-center px-5 cursor-default">
      {/* input card */}
      <div className="flex flex-col gap-4 w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-sm p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-gray-200 shadow-lg">
        {/* card heading */}
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">Create a New Account</h2>

        {/* login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* input fields */}
          <Input type="name" value={name} onChange={handleNameChange} placeholder="Name" />
          <Input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
          <Input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
          <Input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Cofirm Password" />

          {/* error boxes */}
          {isError &&
            error.map((msg, index) => (
              <div key={index} className="w-full py-2 bg-red-500 text-white rounded-md text-sm text-center">
                {msg}
              </div>
            ))}

          {/* submit button */}
          <Button type="submit" className="cursor-pointer w-full bg-gray-700 hover:bg-gray-900">
            Register
          </Button>

          {/* go to sign up text */}
          <div className="w-full flex justify-center items-center">
            <p className="text-center text-gray-500">
              Already have an account?{' '}
              <span className="relative inline-block group cursor-pointer hover:text-black" onClick={switchForm}>
                Login here.
                <span className="absolute left-0 -bottom-0.5 h-[2px] bg-black w-0 group-hover:w-full transition-all duration-300"></span>
              </span>
            </p>
          </div>
        </form>
      </div>

      {popupMessage && <MessagePopup message={popupMessage} />}
    </div>
  );
};

export default RegisterForm;
