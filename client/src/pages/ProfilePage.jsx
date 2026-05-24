import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Palette, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { updateProfile, logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/uiSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/helpers';

const RISK_OPTIONS = [
  { value: 'conservative', label: 'Conservative', desc: 'Low risk, stable returns. Prefer debt and large-cap stocks.', color: 'var(--green)' },
  { value: 'moderate',     label: 'Moderate',     desc: 'Balanced approach. Mix of growth and value investing.',      color: 'var(--accent2)' },
  { value: 'aggressive',   label: 'Aggressive',   desc: 'High risk, high reward. Small-cap and momentum stocks.',     color: 'var(--red)' },
];

export default function ProfilePage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, loading } = useSelector(s => s.auth);
  const { theme } = useSelector(s => s.ui);
  const { summary } = useSelector(s => s.portfolio);

  const [form, setForm] = useState({
    name:        user?.name || '',
    phone:       user?.phone || '',
    riskProfile: user?.riskProfile || 'moderate',
  });
  const [activeTab, setTab] = useState('profile');

  const handleSave = async () => {
    const res = await dispatch(updateProfile(form));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Profile updated!');
    else toast.error('Update failed');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TX';

  const TABS = [
    { id: 'profile',  label: 'Profile',   icon: User },
    { id: 'security', label: 'Security',  icon: Shield },
    { id: 'prefs',    label: 'Preferences',icon: Palette },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header card */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, var(--accent2), var(--accent4))', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>{user?.name}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <span className={`badge ${user?.isVerified ? 'badge-green' : 'badge-amber'}`}>
              {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
            </span>
            <span className="badge badge-blue">{user?.role === 'admin' ? 'Admin' : 'Pro Trader'}</span>
            <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{user?.riskProfile || 'Moderate'} Risk</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Portfolio Value</p>
          <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{formatINR(summary?.currentValue || 0, 0)}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Wallet: {formatINR(summary?.walletBalance || user?.wallet?.balance || 0, 0)}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--bg-2)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
              background: activeTab === id ? 'var(--bg-1)' : 'transparent',
              color:      activeTab === id ? 'var(--text)'  : 'var(--muted)',
              boxShadow:  activeTab === id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Personal Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Full Name',    key: 'name',  type: 'text' },
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</label>
                    <input className="input" type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Email</label>
                  <input className="input" value={user?.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Member Since</label>
                  <input className="input" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSave} disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

            {/* Risk Profile */}
            <div className="card">
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Risk Profile</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {RISK_OPTIONS.map(opt => (
                  <div key={opt.value} onClick={() => setForm(f => ({ ...f, riskProfile: opt.value }))}
                    style={{ padding: '14px', borderRadius: 12, border: `1px solid ${form.riskProfile === opt.value ? opt.color : 'var(--border)'}`, cursor: 'pointer', background: form.riskProfile === opt.value ? opt.color + '12' : 'var(--bg-2)', transition: 'all 0.2s' }}>
                    <p style={{ fontWeight: 700, color: opt.color, marginBottom: 6 }}>{opt.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* KYC */}
            <div className="card">
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>KYC Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                {user?.kycStatus === 'approved'
                  ? <CheckCircle size={20} color="var(--green)" />
                  : <AlertCircle size={20} color="var(--accent3)" />}
                <div>
                  <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>KYC {user?.kycStatus || 'Pending'}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {user?.kycStatus === 'approved' ? 'Your identity has been verified.' : 'Submit Aadhaar + PAN to complete verification.'}
                  </p>
                </div>
                {user?.kycStatus !== 'approved' && (
                  <button className="btn btn-primary" style={{ marginLeft: 'auto', fontSize: 12, padding: '7px 14px' }}>Submit KYC</button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card">
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Security Settings</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Change Password', desc: 'Update your account password', action: 'Change', danger: false },
                { label: 'Two-Factor Auth', desc: '2FA adds an extra layer of security via OTP', action: user?.preferences?.twoFA ? 'Disable' : 'Enable', danger: user?.preferences?.twoFA },
                { label: 'Active Sessions', desc: 'View and manage all active login sessions', action: 'View Sessions', danger: false },
                { label: 'Delete Account', desc: 'Permanently delete your account and all data', action: 'Delete', danger: true },
              ].map(({ label, desc, action, danger }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{desc}</p>
                  </div>
                  <button className={`btn ${danger ? 'btn-danger' : 'btn-outline'}`} style={{ fontSize: 12, padding: '7px 14px' }}>{action}</button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="btn btn-outline" style={{ width: '100%', gap: 8 }} onClick={handleLogout}>
                <LogOut size={15} /> Sign Out of All Devices
              </button>
            </div>
          </div>
        )}

        {activeTab === 'prefs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card">
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Appearance & Preferences</p>
              {[
                { label: 'Dark Mode', desc: 'Toggle between dark and light theme', action: () => dispatch(toggleTheme()), btnLabel: theme === 'dark' ? 'Switch to Light' : 'Switch to Dark' },
                { label: 'Email Notifications', desc: 'Receive trade confirmations and alerts', action: () => {}, btnLabel: 'Manage' },
                { label: 'Price Alerts',         desc: 'Set custom price alerts for your watchlist', action: () => {}, btnLabel: 'Set Alerts' },
                { label: 'Language',             desc: 'Interface language (English)', action: () => {}, btnLabel: 'English ▾' },
              ].map(({ label, desc, action, btnLabel }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{desc}</p>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: 12, padding: '7px 14px' }} onClick={action}>{btnLabel}</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
