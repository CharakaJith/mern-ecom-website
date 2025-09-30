import Footer from '@/components/footer/footer';
import NavBar from '@/components/navbar/navbar';
import LoginForm from '@/forms/loginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPopup from '@/components/popups/authPopup';

const AccountPage: React.FC = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setShowLoginPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    navigate('/'); // redirect to /home on close
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow flex justify-center items-center">
        <LoginForm />
      </main>

      <footer className="bg-gray-800 rounded-t-4xl">
        <Footer />
      </footer>

      {showLoginPopup && <AuthPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default AccountPage;
