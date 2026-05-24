import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { register, clearError } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [show, setShow]   = useState(false);
  const [agree, setAgree] = useState(false);

  useEffect(() => { dispatch(clearError()); }, []);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) return toast.error('Please accept the terms');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    const res = await dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Welcome to TradeX AI 🎉');
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Syne', sans-serif" }}>
      <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(79,139,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, background: '#0d1220', border: '1px solid #1e2d4a', borderRadius: 18, padding: 36, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#fff' }}>TX</div>
          <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(90deg, #00d4aa, #4f8bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TradeX AI</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: '#e2e8f4' }}>Create account</h1>
        <p style={{ color: '#6b7a9a', fontSize: 14, marginBottom: 28 }}>Start with ₹1,00,000 virtual money</p>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma' },
            { label: 'Email',     key: 'email', type: 'email', placeholder: 'you@example.com' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#6b7a9a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</label>
              <input type={type} required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                style={{ width: '100%', padding: '11px 14px', background: '#111827', border: '1px solid #1e2d4a', borderRadius: 10, color: '#e2e8f4', fontSize: 14, fontFamily: 'Syne, sans-serif', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#4f8bff'}
                onBlur={e  => e.target.style.borderColor = '#1e2d4a'}
              />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#6b7a9a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters"
                style={{ width: '100%', padding: '11px 42px 11px 14px', background: '#111827', border: '1px solid #1e2d4a', borderRadius: 10, color: '#e2e8f4', fontSize: 14, fontFamily: 'Syne, sans-serif', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#4f8bff'}
                onBlur={e  => e.target.style.borderColor = '#1e2d4a'}
              />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7a9a', cursor: 'pointer', display: 'flex' }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24, cursor: 'pointer' }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 2, accentColor: '#00d4aa' }} />
            <span style={{ fontSize: 13, color: '#6b7a9a', lineHeight: 1.5 }}>
              I agree to the <a href="#" style={{ color: '#4f8bff', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#4f8bff', textDecoration: 'none' }}>Privacy Policy</a>. This is a simulation platform — not real financial advice.
            </span>
          </label>

          <button type="submit" disabled={loading || !agree}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', color: '#080c14', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne, sans-serif', opacity: (loading || !agree) ? 0.7 : 1 }}>
            {loading ? 'Creating account…' : 'Create Account & Trade →'}
          </button>
        </form>

        <div style={{ marginTop: 16, padding: '12px', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 10, fontSize: 12, color: '#6b7a9a', textAlign: 'center' }}>
          🎁 Get <strong style={{ color: '#00d4aa' }}>₹1,00,000</strong> virtual money on signup to start trading!
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7a9a' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00d4aa', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
