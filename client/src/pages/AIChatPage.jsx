import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, TrendingUp, Shield, BookOpen, RefreshCw } from 'lucide-react';
import { chatWithAI, predictStock, analyzePortfolio } from '../services/aiService';
import { useSelector } from 'react-redux';
import { formatINR } from '../utils/helpers';

const CHIPS = [
  { label: 'Analyze RELIANCE',         msg: 'Analyze RELIANCE Industries stock — should I buy, hold, or sell?' },
  { label: 'Best Nifty 50 stocks',     msg: 'What are the best Nifty 50 stocks to invest in right now?' },
  { label: 'Explain RSI',              msg: 'Explain RSI indicator in simple terms with examples' },
  { label: 'Portfolio diversification',msg: 'How should I diversify my stock portfolio for 2025?' },
  { label: 'Weekly market outlook',    msg: 'What is the market outlook for this week?' },
  { label: 'Beginner tips',            msg: 'What are the top 5 tips for a beginner stock investor in India?' },
];

function Message({ msg }) {
  const isAI = msg.role === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', gap: 10, alignSelf: isAI ? 'flex-start' : 'flex-end',
        maxWidth: '88%',
      }}
    >
      {isAI && (
        <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
          <Bot size={14} color="#fff" />
        </div>
      )}
      <div style={{
        padding: '10px 14px',
        borderRadius: isAI ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        background: isAI ? 'var(--bg-2)' : 'linear-gradient(135deg, var(--accent2), #3a7aed)',
        border: isAI ? '1px solid var(--border)' : 'none',
        color: isAI ? 'var(--text)' : '#fff',
        fontSize: 13.5, lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '👋 Hi! I\'m your TradeX AI advisor. I can analyze stocks, explain market trends, suggest portfolio strategies, and help you understand risk.\n\nWhat would you like to explore today?' },
    { role: 'ai', content: '📊 Today\'s Market Brief:\nNifty 50 ▲ 1.27% • IT sector leading • FII buying ₹3,200 Cr • India VIX stable at 14.2.\n\nAsk me anything about stocks, strategies, or market analysis!' },
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [predLoading, setPredLoading] = useState(false);
  const bodyRef = useRef(null);
  const { list: stocks } = useSelector(s => s.stocks);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));
      const { reply } = await chatWithAI(msg, history);
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ I\'m having trouble connecting to the AI service. Please check your API configuration. Meanwhile, I can tell you: markets look moderately bullish today with Nifty support at 24,600.' }]);
    } finally {
      setLoading(false);
    }
  };

  const runPredictions = async () => {
    if (!stocks.length) return;
    setPredLoading(true);
    const syms = stocks.slice(0, 5).map(s => s.symbol);
    try {
      const results = await Promise.allSettled(syms.map(s => predictStock(s)));
      setPredictions(results.filter(r => r.status === 'fulfilled').map(r => r.value.prediction));
    } catch(e) {}
    setPredLoading(false);
  };

  const runPortfolioAnalysis = async () => {
    setLoading(true);
    try {
      const { analysis: a } = await analyzePortfolio();
      setAnalysis(a);
      setMessages(prev => [...prev, { role: 'ai', content: '📊 Portfolio Analysis Complete!\n\n' + a }]);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { runPredictions(); }, [stocks.length]);

  const signalColor = (sig) => sig === 'BUY' ? 'var(--green)' : sig === 'SELL' ? 'var(--red)' : 'var(--accent2)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, height: 'calc(100vh - 120px)' }}>
      {/* Chat panel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800 }}>TradeX AI Advisor</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, background: 'var(--green)', borderRadius: '50%', animation: 'pulse-badge 2s infinite' }} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Online • Powered by GPT-4o-mini</span>
            </div>
          </div>
          <button className="btn btn-outline" style={{ marginLeft: 'auto', fontSize: 12, padding: '6px 12px' }} onClick={runPortfolioAnalysis}>
            <Sparkles size={13} /> Analyze Portfolio
          </button>
        </div>

        {/* Messages */}
        <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => <Message key={i} msg={m} />)}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10, alignSelf: 'flex-start' }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={14} color="#fff" />
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }}
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick chips */}
        <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CHIPS.map(c => (
            <button key={c.label} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 20 }} onClick={() => sendMessage(c.msg)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input
            className="input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about stocks, strategies, market analysis…"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Right: AI Predictions + tips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {/* AI Predictions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>AI Predictions</p>
            <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }} onClick={runPredictions}>
              <RefreshCw size={12} />
            </button>
          </div>
          {predLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 8 }} />) :
            predictions.map((p, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 13 }}>{p.symbol}</span>
                  <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, fontWeight: 700, background: p.signal === 'BUY' ? 'rgba(0,212,170,0.12)' : p.signal === 'SELL' ? 'rgba(255,71,87,0.12)' : 'rgba(79,139,255,0.12)', color: signalColor(p.signal) }}>{p.signal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                  <span>Confidence: <strong style={{ color: 'var(--text)' }}>{p.confidence}%</strong></span>
                  <span>Target: <strong style={{ fontFamily: 'var(--mono)' }}>{formatINR(p.targetPrice)}</strong></span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: p.confidence + '%', background: signalColor(p.signal), borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--muted)' }}>RSI {p.indicators?.rsi}</span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-3)', color: 'var(--muted)' }}>{p.indicators?.trend}</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* Quick tips */}
        <div className="card" style={{ background: 'rgba(0,212,170,0.04)', borderColor: 'rgba(0,212,170,0.2)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>📚 Trading Tips</p>
          {[
            { icon: TrendingUp, tip: 'Never invest more than 5% of portfolio in a single stock' },
            { icon: Shield,     tip: 'Always set stop-loss orders to limit downside risk' },
            { icon: BookOpen,   tip: 'Study fundamentals: P/E, ROE, debt-to-equity ratio' },
          ].map(({ icon: Icon, tip }, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, background: 'rgba(0,212,170,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} color="var(--accent)" />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
