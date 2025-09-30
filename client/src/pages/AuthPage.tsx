import React, { useState } from 'react';
import NavBar from '@/components/navbar/navbar';
import LoginForm from '@/forms/loginForm';
import RegisterForm from '@/forms/registerForm';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow flex justify-center items-center">
        {showLogin ? <LoginForm switchForm={() => setShowLogin(false)} /> : <RegisterForm switchForm={() => setShowLogin(true)} />}
      </main>
    </div>
  );
};

export default AuthPage;
