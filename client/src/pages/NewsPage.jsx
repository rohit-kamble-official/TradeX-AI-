import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { timeAgo, truncate } from '../utils/helpers';

const SAMPLE_NEWS = [
  { id:1, headline:'RBI keeps repo rate unchanged at 6.5%, signals cautious optimism', source:'Economic Times', datetime: Date.now()-7200000,  sentiment:'bullish', category:'macro' },
  { id:2, headline:'Reliance Industries Q3 profit surges 18% YoY, beats estimates',  source:'Mint',           datetime: Date.now()-10800000, sentiment:'bullish', category:'earnings' },
  { id:3, headline:'IT sector faces headwinds amid global tech spending slowdown',    source:'Business Standard',datetime:Date.now()-18000000, sentiment:'bearish', category:'sector' },
  { id:4, headline:'FII net inflows cross ₹3,200 Crore in equity markets today',     source:'CNBC TV18',      datetime: Date.now()-21600000, sentiment:'bullish', category:'flow' },
  { id:5, headline:'Adani Group stocks rally 4-7% after strong Q2 earnings',         source:'Bloomberg Quint',datetime: Date.now()-28800000, sentiment:'bullish', category:'earnings' },
  { id:6, headline:'Crude oil at $78/barrel — mixed impact on Indian markets',       source:'Reuters',        datetime: Date.now()-32400000, sentiment:'neutral', category:'commodity' },
  { id:7, headline:'SEBI tightens F&O regulations to curb retail investor losses',   source:'Financial Express',datetime:Date.now()-36000000, sentiment:'neutral', category:'regulatory' },
  { id:8, headline:'Nifty IT index gains 2.4% on strong US tech earnings',           source:'Moneycontrol',   datetime: Date.now()-43200000, sentiment:'bullish', category:'sector' },
  { id:9, headline:'Auto sector sees strong demand; Maruti Q3 volumes up 14%',       source:'Auto Car India', datetime: Date.now()-50000000, sentiment:'bullish', category:'sector' },
  { id:10,headline:'Pharma stocks dip as US FDA issues warning to Sun Pharma plant', source:'NDTV Profit',    datetime: Date.now()-54000000, sentiment:'bearish', category:'sector' },
];

const SENT_COLORS = { bullish:'badge-green', bearish:'badge-red', neutral:'badge-blue' };
const SENT_LABELS = { bullish:'Bullish', bearish:'Bearish', neutral:'Neutral' };

export default function NewsPage() {
  const [news, setNews]       = useState(SAMPLE_NEWS);
  const [filter, setFilter]   = useState('ALL');
  const [sentiment, setSent]  = useState({ bullish: 0, bearish: 0, neutral: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/news')
      .then(({ data }) => {
        if (data.news?.length) setNews(data.news);
        if (data.sentiment) setSent(data.sentiment);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const b = news.filter(n => n.sentiment === 'bullish').length;
    const r = news.filter(n => n.sentiment === 'bearish').length;
    setSent({ bullish: b, bearish: r, neutral: news.length - b - r });
  }, [news]);

  const displayed = filter === 'ALL' ? news : news.filter(n => n.sentiment === filter.toLowerCase() || n.category === filter.toLowerCase());
  const total     = sentiment.bullish + sentiment.bearish + sentiment.neutral || 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
      {/* News feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['ALL','bullish','bearish','neutral','macro','earnings','sector'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: 12, padding: '6px 14px', textTransform: 'capitalize' }}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Market News</span>
            <span className="badge badge-live">● LIVE</span>
          </div>

          {loading ? Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div className="skeleton" style={{ height: 16, marginBottom: 6, width: '80%' }} />
              <div className="skeleton" style={{ height: 12, width: '40%' }} />
            </div>
          )) : displayed.map((n, i) => (
            <motion.div key={n.id || i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.paddingLeft = '6px'}
              onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
            >
              <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, marginBottom: 8, transition: 'color 0.15s' }}>
                {n.headline || n.title}
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 11, color: 'var(--muted)' }}>
                <span style={{ fontWeight: 600 }}>{n.source}</span>
                <span>{timeAgo(n.datetime)}</span>
                <span className={`badge ${SENT_COLORS[n.sentiment] || 'badge-blue'}`} style={{ fontSize: 10 }}>
                  {SENT_LABELS[n.sentiment] || n.sentiment}
                </span>
                {n.category && <span style={{ background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 4, fontSize: 10, textTransform: 'capitalize' }}>{n.category}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Sentiment breakdown */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Sentiment Index</p>
          {[
            { label: 'Bullish', count: sentiment.bullish, color: 'var(--green)' },
            { label: 'Bearish', count: sentiment.bearish, color: 'var(--red)' },
            { label: 'Neutral', count: sentiment.neutral, color: 'var(--muted)' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ fontWeight: 600, color }}>{label}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{count} ({Math.round(count / total * 100)}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: (count / total * 100) + '%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: color, borderRadius: 3 }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* AI News Brief */}
        <motion.div className="card" style={{ background: 'rgba(0,212,170,0.04)', borderColor: 'rgba(0,212,170,0.2)' }}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>◈ AI News Brief</p>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
            Overall sentiment today is{' '}
            <strong style={{ color: 'var(--green)' }}>
              Bullish ({Math.round(sentiment.bullish / total * 100)}%)
            </strong>.
            Key drivers: RBI policy stance, Q3 earnings beat expectations, FII inflows. Watch IT sector closely — US tech earnings driving outperformance. Macro backdrop remains supportive.
          </p>
        </motion.div>

        {/* Trending topics */}
        <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Trending Topics</p>
          {['RBI Policy', 'Q3 Results', 'FII Flows', 'IT Sector', 'SEBI F&O Rules', 'Crude Oil'].map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{t}</span>
              <div style={{ width: 50, height: 20 }}>
                <svg viewBox="0 0 50 20" style={{ width: '100%', height: '100%' }}>
                  <polyline
                    points={Array(8).fill(0).map((_, j) => `${j * 7},${10 + (Math.random() - 0.5) * 14}`).join(' ')}
                    fill="none" stroke="var(--accent2)" strokeWidth="1.5" strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
