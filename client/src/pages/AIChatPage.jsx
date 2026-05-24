import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Bot,
  Sparkles,
  TrendingUp,
  Shield,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

import { chatWithAI, predictStock, analyzePortfolio } from '../services/aiService';
import { useSelector } from 'react-redux';
import { formatINR } from '../utils/helpers';

const CHIPS = [
  { label: 'Analyze RELIANCE', msg: 'Analyze RELIANCE Industries stock — should I buy, hold, or sell?' },
  { label: 'Best Nifty 50', msg: 'What are the best Nifty 50 stocks right now?' },
  { label: 'Explain RSI', msg: 'Explain RSI indicator in simple words' },
  { label: 'Portfolio Tips', msg: 'How should I diversify my portfolio?' },
  { label: 'Market Outlook', msg: 'What is the market outlook this week?' },
];

function Message({ msg }) {
  const isAI = msg.role === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        alignSelf: isAI ? 'flex-start' : 'flex-end',
        gap: 10,
        maxWidth: '85%',
      }}
    >
      {isAI && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: 'linear-gradient(135deg,#00d4aa,#3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Bot size={18} color="#fff" />
        </div>
      )}

      <div
        style={{
          padding: '14px 16px',
          borderRadius: isAI
            ? '8px 18px 18px 18px'
            : '18px 8px 18px 18px',
          background: isAI
            ? 'rgba(255,255,255,0.04)'
            : 'linear-gradient(135deg,#3b82f6,#00d4aa)',
          color: '#fff',
          fontSize: 14,
          lineHeight: 1.7,
          border: isAI ? '1px solid rgba(255,255,255,0.08)' : 'none',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content:
        '👋 Welcome to TradeX AI.\n\nI can help you analyze stocks, predict market trends, explain indicators, and improve your trading strategies.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [predictions, setPredictions] = useState([]);
  const [predLoading, setPredLoading] = useState(false);

  const bodyRef = useRef(null);

  const { list: stocks } = useSelector((s) => s.stocks);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();

    if (!msg || loading) return;

    setInput('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: msg },
    ]);

    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));

      const { reply } = await chatWithAI(msg, history);

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            '⚠️ AI service temporarily unavailable. Please try again later.',
        },
      ]);
    }

    setLoading(false);
  };

  const runPredictions = async () => {
    if (!stocks.length) return;

    setPredLoading(true);

    try {
      const symbols = stocks.slice(0, 5).map((s) => s.symbol);

      const results = await Promise.allSettled(
        symbols.map((s) => predictStock(s))
      );

      setPredictions(
        results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value.prediction)
      );
    } catch {}

    setPredLoading(false);
  };

  useEffect(() => {
    runPredictions();
  }, [stocks.length]);

  const signalColor = (signal) => {
    if (signal === 'BUY') return '#00d4aa';
    if (signal === 'SELL') return '#ff4757';
    return '#3b82f6';
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 20,
        height: 'calc(100vh - 100px)',
      }}
    >
      {/* CHAT PANEL */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: 20,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              background: 'linear-gradient(135deg,#00d4aa,#3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={24} color="#fff" />
          </div>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>
              TradeX AI Assistant
            </h2>

            <p style={{ fontSize: 12, color: '#999' }}>
              GPT Powered Stock Intelligence
            </p>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => analyzePortfolio()}
          >
            <Sparkles size={14} />
            Analyze Portfolio
          </button>
        </div>

        {/* MESSAGES */}
        <div
          ref={bodyRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {messages.map((m, i) => (
            <Message key={i} msg={m} />
          ))}

          {loading && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <Bot size={18} color="#00d4aa" />

              <p style={{ color: '#999', fontSize: 13 }}>
                AI is thinking...
              </p>
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div
          style={{
            padding: '12px 18px',
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => sendMessage(chip.msg)}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#ddd',
                padding: '8px 14px',
                borderRadius: 50,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <div
          style={{
            padding: 18,
            display: 'flex',
            gap: 12,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && sendMessage()
            }
            placeholder="Ask anything about stocks..."
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              outline: 'none',
            }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            style={{
              width: 52,
              border: 'none',
              borderRadius: 16,
              background: 'linear-gradient(135deg,#00d4aa,#3b82f6)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* PREDICTIONS */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 14 }}>
              📈 AI Predictions
            </h3>

            <button
              onClick={runPredictions}
              className="btn btn-ghost"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {predLoading ? (
            <p style={{ color: '#999' }}>Loading...</p>
          ) : (
            predictions.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 0',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <strong>{p.symbol}</strong>

                  <span
                    style={{
                      color: signalColor(p.signal),
                      fontWeight: 700,
                    }}
                  >
                    {p.signal}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#999',
                  }}
                >
                  Confidence: {p.confidence}%
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#999',
                  }}
                >
                  Target: {formatINR(p.targetPrice)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* TIPS */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>
            📚 Trading Tips
          </h3>

          {[
            {
              icon: TrendingUp,
              text: 'Avoid emotional trading decisions',
            },
            {
              icon: Shield,
              text: 'Always use stop-loss protection',
            },
            {
              icon: BookOpen,
              text: 'Study fundamentals before investing',
            },
          ].map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 14,
              }}
            >
              <Icon size={16} color="#00d4aa" />

              <p
                style={{
                  fontSize: 13,
                  color: '#bbb',
                  lineHeight: 1.5,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}