import NavBar from '@/components/navbar/navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPopup from '@/components/popups/authPopup';
import PurchaseHistory from '@/components/purchase/purchaseHistory';

const PurchaseHistoryPage: React.FC = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setShowLoginPopup(true);
    }
  }, []);

  // navigate to landing page
  const handleClosePopup = () => {
    setShowLoginPopup(false);
    navigate('/');
  };

  // navigate to auth page
  const handleLoginPopup = () => {
    setShowLoginPopup(false);
    navigate('/auth');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>

      <main className="flex-grow flex justify-center items-center">
        <PurchaseHistory />
      </main>

      {showLoginPopup && <AuthPopup onClose={handleClosePopup} onLogin={handleLoginPopup} />}
    </div>
  );
};

export default PurchaseHistoryPage;
