import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/order/orderHistoryPage';
import OrderDetailsPage from './pages/order/orderDetailsPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/item/:itemId" element={<ProductDetailsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderHistoryPage />} />
        <Route path="/order/details/:orderId" element={<OrderDetailsPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
