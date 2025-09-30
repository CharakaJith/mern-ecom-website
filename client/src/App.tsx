import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AccountPage from './pages/AccountPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/item/:itemId" element={<ProductDetailsPage />} />
        <Route path="/account" element={<AccountPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
