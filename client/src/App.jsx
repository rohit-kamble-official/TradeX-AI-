import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe } from './redux/slices/authSlice';
import { setTheme } from './redux/slices/uiSlice';

// Pages
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';
import TradingPage    from './pages/TradingPage';
import PortfolioPage  from './pages/PortfolioPage';
import MarketsPage    from './pages/MarketsPage';
import AIChatPage     from './pages/AIChatPage';
import OrdersPage     from './pages/OrdersPage';
import NewsPage       from './pages/NewsPage';
import ProfilePage    from './pages/ProfilePage';
import AppLayout      from './components/Layout/AppLayout';

// Protected Route wrapper
const Protected = ({ children }) => {
  const { token } = useSelector(s => s.auth);
  return token ? children : <Navigate to="/login" replace />;
};

// Public Route (redirect to dashboard if logged in)
const Public = ({ children }) => {
  const { token } = useSelector(s => s.auth);
  return !token ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector(s => s.ui);
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) dispatch(getMe());
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'Syne, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#00d4aa', secondary: '#0d1220' } },
          error:   { iconTheme: { primary: '#ff4757', secondary: '#0d1220' } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<Public><LoginPage /></Public>} />
        <Route path="/register"element={<Public><RegisterPage /></Public>} />

        {/* Protected App Routes */}
        <Route path="/" element={<Protected><AppLayout /></Protected>}>
          <Route path="dashboard"  element={<DashboardPage />} />
          <Route path="trading"    element={<TradingPage />} />
          <Route path="portfolio"  element={<PortfolioPage />} />
          <Route path="markets"    element={<MarketsPage />} />
          <Route path="ai-advisor" element={<AIChatPage />} />
          <Route path="orders"     element={<OrdersPage />} />
          <Route path="news"       element={<NewsPage />} />
          <Route path="profile"    element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
