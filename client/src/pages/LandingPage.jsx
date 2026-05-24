import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Bot, BarChart2, Globe, ChevronRight, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: TrendingUp, title: 'Real-Time Trading',      desc: 'Live prices with sub-second updates via WebSocket. Trade NSE/BSE stocks instantly.' },
  { icon: Bot,        title: 'AI Trading Advisor',     desc: 'GPT-4 powered assistant analyzes stocks, predicts trends, and optimizes your portfolio.' },
  { icon: BarChart2,  title: 'Advanced Analytics',     desc: 'Candlestick charts, RSI, MACD, Bollinger Bands, volume indicators and more.' },
  { icon: Shield,     title: 'Bank-Grade Security',    desc: 'JWT auth, bcrypt encryption, rate limiting, and MongoDB sanitization.' },
  { icon: Zap,        title: 'Lightning Fast',         desc: 'Optimized React frontend with Redux, lazy loading, and 60fps animations.' },
  { icon: Globe,      title: 'Market Intelligence',    desc: 'Sentiment analysis, news feed, sector heatmaps, and FII/DII flow data.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.',    role: 'Equity Analyst',    text: 'TradeX AI completely transformed how I manage my portfolio. The AI predictions are surprisingly accurate.' },
  { name: 'Arjun M.',   role: 'Retail Investor',    text: 'Finally a platform that feels premium. The UI is as good as Zerodha but with AI superpowers.' },
  { name: 'Divya R.',   role: 'Day Trader',         text: 'The real-time charts and market depth view give me everything I need for intraday trading.' },
];

const PRICES = [
  { plan: 'Free',    price: '₹0',    period: 'forever',   features: ['10 trades/month','Basic charts','Watchlist (5 stocks)','Market news'],        cta: 'Start Free',    highlight: false },
  { plan: 'Pro',     price: '₹499',  period: 'per month', features: ['Unlimited trades','AI advisor (100 queries)','Advanced charts','Portfolio AI', 'Priority support'], cta: 'Start Pro',     highlight: true },
  { plan: 'Elite',   price: '₹1,299',period: 'per month', features: ['Everything in Pro','Unlimited AI queries','AI risk analysis','API access','Custom alerts'],         cta: 'Go Elite',      highlight: false },
];

export default function LandingPage() {
  const canvasRef = useRef(null);

  // Animated background chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width  = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let points = [], frame = 0;

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', resize);

    // Generate initial points
    let v = h * 0.55;
    for (let i = 0; i < 120; i++) { v += (Math.random() - 0.46) * 12; v = Math.max(h * 0.25, Math.min(h * 0.75, v)); points.push(v); }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Shift points
      points.shift();
      let nv = points[points.length - 1] + (Math.random() - 0.46) * 12;
      nv = Math.max(h * 0.2, Math.min(h * 0.8, nv));
      points.push(nv);

      // Draw gradient line
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(0,212,170,0.18)');
      grad.addColorStop(1, 'rgba(0,212,170,0)');

      ctx.beginPath();
      points.forEach((p, i) => {
        const x = (i / (points.length - 1)) * w;
        i === 0 ? ctx.moveTo(x, p) : ctx.lineTo(x, p);
      });
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      points.forEach((p, i) => {
        const x = (i / (points.length - 1)) * w;
        i === 0 ? ctx.moveTo(x, p) : ctx.lineTo(x, p);
      });
      ctx.strokeStyle = '#00d4aa';
      ctx.lineWidth = 2;
      ctx.stroke();

      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', color: '#e2e8f4', fontFamily: "'Syne', sans-serif", overflowX: 'hidden' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e2d4a', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff' }}>TX</div>
          <span style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(90deg, #00d4aa, #4f8bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TradeX AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login"    style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 8, transition: 'color 0.15s' }}>Login</Link>
          <Link to="/register" style={{ background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', color: '#080c14', textDecoration: 'none', fontSize: 14, fontWeight: 700, padding: '9px 20px', borderRadius: 10 }}>Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px', overflow: 'hidden' }}>
        {/* Animated chart background */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%',  width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(79,139,255,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

        <motion.div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 20, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#00d4aa', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, background: '#00d4aa', borderRadius: '50%', animation: 'pulse-badge 2s infinite' }} />
            AI-POWERED STOCK TRADING PLATFORM
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
            Trade Smarter with{' '}
            <span style={{ background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Intelligence</span>
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
            Professional-grade stock trading simulation with real-time data, AI predictions, advanced analytics, and portfolio management. Built for serious traders.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', color: '#080c14', textDecoration: 'none', fontSize: 16, fontWeight: 700, padding: '14px 28px', borderRadius: 12 }}>
              Start Trading Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid #1e2d4a', color: '#e2e8f4', textDecoration: 'none', fontSize: 16, fontWeight: 600, padding: '14px 28px', borderRadius: 12 }}>
              View Demo <ChevronRight size={18} />
            </Link>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 36, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
            {[['₹10Cr+','Virtual Volume'], ['50K+','Active Traders'], ['99.9%','Uptime'], ['72%','AI Accuracy']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</p>
                <p style={{ fontSize: 12, color: '#6b7a9a', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', background: '#0d1220' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: 52 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Everything You Need to Trade</h2>
          <p style={{ color: '#6b7a9a', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>A complete fintech platform that rivals Zerodha and TradingView with the power of artificial intelligence.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 14, padding: 24, cursor: 'default', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,139,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2d4a'}>
              <div style={{ width: 44, height: 44, background: 'rgba(79,139,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} color="#4f8bff" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: '#6b7a9a', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 48px' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: 48 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Loved by Traders</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {TESTIMONIALS.map(({ name, role, text }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: '#111827', border: '1px solid #1e2d4a', borderRadius: 14, padding: 24 }}>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4f8bff, #00d4aa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff' }}>{name[0]}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13 }}>{name}</p>
                  <p style={{ fontSize: 12, color: '#6b7a9a' }}>{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 48px', background: '#0d1220' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: 48 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Simple Pricing</h2>
          <p style={{ color: '#6b7a9a', fontSize: 15 }}>Start free. Upgrade when you're ready.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {PRICES.map(({ plan, price, period, features, cta, highlight }, i) => (
            <motion.div key={plan} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ background: highlight ? 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(79,139,255,0.06))' : '#111827', border: `1px solid ${highlight ? 'rgba(0,212,170,0.4)' : '#1e2d4a'}`, borderRadius: 16, padding: 28, position: 'relative', transform: highlight ? 'scale(1.03)' : 'none' }}>
              {highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', color: '#080c14', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan}</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{price}</span>
                <span style={{ fontSize: 13, color: '#6b7a9a', marginLeft: 6 }}>/{period}</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13.5, color: '#94a3b8' }}>
                    <span style={{ color: '#00d4aa', fontWeight: 700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '11px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, background: highlight ? 'linear-gradient(135deg, #00d4aa, #4f8bff)' : 'transparent', color: highlight ? '#080c14' : '#e2e8f4', border: highlight ? 'none' : '1px solid #1e2d4a' }}>{cta}</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(79,139,255,0.06))' }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Ready to Trade Smarter?</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32 }}>Join thousands of traders using AI to make better investment decisions.</p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', color: '#080c14', textDecoration: 'none', fontSize: 18, fontWeight: 700, padding: '16px 36px', borderRadius: 14 }}>
            Start Trading Free <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#080c14', borderTop: '1px solid #1e2d4a', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #00d4aa, #4f8bff)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#fff' }}>TX</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>TradeX AI</span>
        </div>
        <p style={{ color: '#6b7a9a', fontSize: 12 }}>© 2025 TradeX AI. For educational & simulation purposes only. Not financial advice.</p>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#6b7a9a' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
