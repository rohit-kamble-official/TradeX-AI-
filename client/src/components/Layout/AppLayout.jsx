import React, { useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, TrendingUp, PieChart, BarChart2,
  Bot, ClipboardList, Newspaper, User, LogOut,
  Sun, Moon, Menu, Bell, ChevronRight,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme, toggleSidebar } from '../../redux/slices/uiSlice';
import { fetchStocks } from '../../redux/slices/stockSlice';
import { fetchSummary } from '../../redux/slices/portfolioSlice';
import { connectSocket, getSocket } from '../../services/socket';
import { updatePrices } from '../../redux/slices/stockSlice';
import { formatINR } from '../../utils/helpers';
import styles from './AppLayout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trading',    icon: TrendingUp,      label: 'Trading' },
  { to: '/portfolio',  icon: PieChart,        label: 'Portfolio' },
  { to: '/markets',    icon: BarChart2,       label: 'Markets' },
  { to: '/ai-advisor', icon: Bot,             label: 'AI Advisor', badge: 'AI' },
  { to: '/orders',     icon: ClipboardList,   label: 'Orders' },
  { to: '/news',       icon: Newspaper,       label: 'News' },
  { to: '/profile',    icon: User,            label: 'Profile' },
];

export default function AppLayout() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector(s => s.auth);
  const { theme, sidebarOpen } = useSelector(s => s.ui);
  const { list: stocks } = useSelector(s => s.stocks);
  const { summary } = useSelector(s => s.portfolio);
  const tickerRef  = useRef(null);

  // Init data & socket
  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchSummary());
    const socket = connectSocket();
    socket.on('price_update', (updates) => dispatch(updatePrices(updates)));
    return () => { socket.off('price_update'); };
  }, [dispatch]);

  // Ticker animation reset
  useEffect(() => {
    if (!tickerRef.current) return;
    const el = tickerRef.current;
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = '';
  }, [stocks]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TX';

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className={styles.sidebar}
            initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Logo */}
            <div className={styles.logo}>
              <div className={styles.logoIcon}>TX</div>
              <span className={styles.logoText}>TradeX AI</span>
            </div>

            {/* Nav */}
            <nav className={styles.nav}>
              <p className={styles.navSection}>Main</p>
              {NAV_ITEMS.slice(0, 4).map(({ to, icon: Icon, label, badge }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                  <Icon size={17} />
                  <span>{label}</span>
                  {badge && <span className={styles.aiBadge}>{badge}</span>}
                </NavLink>
              ))}
              <p className={styles.navSection}>Tools</p>
              {NAV_ITEMS.slice(4).map(({ to, icon: Icon, label, badge }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                  <Icon size={17} />
                  <span>{label}</span>
                  {badge && <span className={styles.aiBadge}>{badge}</span>}
                </NavLink>
              ))}
            </nav>

            {/* Sidebar bottom */}
            <div className={styles.sidebarBottom}>
              <div className={styles.userCard}>
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user?.name || 'Trader'}</p>
                  <p className={styles.userRole}>{user?.role === 'admin' ? 'Admin' : 'Pro Trader'}</p>
                </div>
              </div>
              <button className={styles.themeBtn} onClick={() => dispatch(toggleTheme())}>
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className={`${styles.themeBtn} ${styles.logoutBtn}`} onClick={handleLogout}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuBtn} onClick={() => dispatch(toggleSidebar())}>
              <Menu size={20} />
            </button>
            {/* Live ticker */}
            <div className={styles.tickerWrap}>
              <div className={styles.ticker} ref={tickerRef}>
                {[...stocks, ...stocks].map((s, i) => (
                  <span key={i} className={styles.tickItem}>
                    <span className={styles.tickSym}>{s.symbol}</span>
                    <span className={styles.tickPrice}>{formatINR(s.price, 2)}</span>
                    <span className={s.changePct >= 0 ? styles.tickUp : styles.tickDn}>
                      {s.changePct >= 0 ? '▲' : '▼'} {Math.abs(s.changePct || 0).toFixed(2)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.balancePill}>
              {formatINR(summary?.walletBalance ?? user?.wallet?.balance ?? 0, 0)}
            </div>
            <button className={styles.iconBtn}><Bell size={18} /></button>
            <div className={styles.avatarSm} onClick={() => navigate('/profile')}>{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
