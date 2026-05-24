import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';
import { fetchStocks, fetchHistory } from '../redux/slices/stockSlice';
import { fetchSummary, fetchPortfolio } from '../redux/slices/portfolioSlice';
import StockChart from '../components/Common/StockChart';
import TradeModal from '../components/Common/TradeModal';
import { formatINR, formatPct, colorClass, arrowPrefix, generateSparkline } from '../utils/helpers';
import styles from './DashboardPage.module.css';

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const ITEM    = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const TIMEFRAMES = ['1D', '1W', '1M', '3M'];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { list: stocks, history, loading } = useSelector(s => s.stocks);
  const { summary, portfolio } = useSelector(s => s.portfolio);
  const [tf, setTf]         = useState('1D');
  const [tradeStock, setTS] = useState(null);
  const [selectedSym, setSym] = useState('RELIANCE');

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchSummary());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSym) dispatch(fetchHistory({ sym: selectedSym, period: tf }));
  }, [selectedSym, tf, dispatch]);

  const selectedStock = useMemo(() => stocks.find(s => s.symbol === selectedSym), [stocks, selectedSym]);
  const chartData     = useMemo(() => {
    const h = history[selectedSym] || [];
    return { data: h.map(p => p.price), labels: h.map((_, i) => `${i}`) };
  }, [history, selectedSym]);

  // Fallback chart with simulated data
  const fallbackData = useMemo(() => generateSparkline(selectedStock?.price || 22000, 0.005, 80), [selectedStock?.price]);

  const watchlist = stocks.slice(0, 6);
  const heatmap   = stocks.slice(0, 10);

  const statCards = [
    { label: 'Portfolio Value',  value: formatINR(summary?.currentValue || 0,  0), sub: formatPct(summary?.totalPnlPct || 0) + ' overall', up: (summary?.totalPnlPct || 0) >= 0 },
    { label: 'Total P&L',        value: formatINR(summary?.totalPnl || 0,       0), sub: 'Since inception',                                 up: (summary?.totalPnl || 0) >= 0 },
    { label: 'Free Margin',      value: formatINR(summary?.walletBalance || 0,   0), sub: 'Available to trade',                              up: true },
    { label: 'Holdings',         value: summary?.holdingsCount || 0,                sub: 'Active positions',                                up: true },
  ];

  return (
    <div className={styles.page}>
      {/* Stat cards */}
      <motion.div className={styles.statsGrid} variants={STAGGER} initial="hidden" animate="show">
        {statCards.map((c, i) => (
          <motion.div key={i} className="stat-card" variants={ITEM}>
            <p className="label">{c.label}</p>
            <p className={`value ${c.up ? 'text-green' : 'text-red'}`} style={{ fontSize: 20 }}>{c.value}</p>
            <p className={`sub ${c.up ? 'text-green' : 'text-red'}`}>{c.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className={styles.mainGrid}>
        {/* Left: Chart + Heatmap */}
        <div className={styles.leftCol}>
          {/* Main chart */}
          <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className={styles.chartSym}>{selectedSym}</h3>
                <div className={styles.chartPrice}>
                  <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{formatINR(selectedStock?.price || 0)}</span>
                  <span className={colorClass(selectedStock?.changePct)}>
                    {arrowPrefix(selectedStock?.changePct)} {formatPct(selectedStock?.changePct)}
                  </span>
                </div>
              </div>
              <div className={styles.chartControls}>
                <span className="badge badge-live">● LIVE</span>
                <div className={styles.tfTabs}>
                  {TIMEFRAMES.map(t => (
                    <button key={t} className={`${styles.tfTab} ${tf === t ? styles.tfActive : ''}`} onClick={() => setTf(t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <StockChart
              data={chartData.data.length ? chartData.data : fallbackData}
              labels={chartData.labels}
              color={selectedStock?.changePct >= 0 ? '#00d4aa' : '#ff4757'}
              height={260}
            />
          </motion.div>

          {/* Heatmap */}
          <motion.div className="card" style={{ marginTop: 14 }} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Market Heatmap</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>NSE Top Stocks</span>
            </div>
            <div className={styles.heatmap}>
              {heatmap.map(s => {
                const pct  = s.changePct || 0;
                const up   = pct >= 0;
                const intensity = Math.min(Math.abs(pct) / 4, 1);
                return (
                  <div
                    key={s.symbol}
                    className={styles.hmCell}
                    style={{ background: up ? `rgba(0,212,170,${0.1 + intensity * 0.4})` : `rgba(255,71,87,${0.1 + intensity * 0.4})` }}
                    onClick={() => { setSym(s.symbol); setTS(s); }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', color: up ? 'var(--green)' : 'var(--red)' }}>{s.symbol}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: up ? 'var(--green)' : 'var(--red)' }}>{up ? '+' : ''}{pct.toFixed(2)}%</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: Watchlist + Trade panel */}
        <div className={styles.rightCol}>
          {/* Watchlist */}
          <motion.div className="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Watchlist</span>
              <span style={{ fontSize: 12, color: 'var(--accent2)', cursor: 'pointer' }}>Manage →</span>
            </div>
            {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />) :
              watchlist.map(s => {
                const up = s.changePct >= 0;
                const sparkData = generateSparkline(s.price, 0.008);
                return (
                  <div key={s.symbol} className={styles.wlItem} onClick={() => { setSym(s.symbol); setTS(s); }}>
                    <div>
                      <div className={styles.wlSym}>{s.symbol}</div>
                      <div className={styles.wlName}>{s.name?.slice(0, 22)}</div>
                    </div>
                    <div className={styles.wlRight}>
                      <svg width="48" height="28" viewBox="0 0 48 28">
                        <polyline
                          points={sparkData.map((v, i) => {
                            const min = Math.min(...sparkData), max = Math.max(...sparkData);
                            const x = (i / (sparkData.length - 1)) * 46 + 1;
                            const y = 26 - ((v - min) / (max - min || 1)) * 24 + 1;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke={up ? '#00d4aa' : '#ff4757'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div>
                        <div className={`${styles.wlPrice} mono`}>{formatINR(s.price, 0)}</div>
                        <div className={up ? 'text-green' : 'text-red'} style={{ fontSize: 11, fontWeight: 600, textAlign: 'right' }}>
                          {up ? '+' : ''}{(s.changePct || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </motion.div>

          {/* AI Risk Meter */}
          <motion.div className="card" style={{ background: 'rgba(79,139,255,0.04)', borderColor: 'rgba(79,139,255,0.2)' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Activity size={14} color="var(--accent2)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>AI Risk Meter</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
              <span>Conservative</span><span>Moderate</span><span>Aggressive</span>
            </div>
            <div style={{ height: 8, background: 'linear-gradient(90deg, #00d4aa, #f7931a, #ff4757)', borderRadius: 4, position: 'relative', marginBottom: 12 }}>
              <div style={{ position: 'absolute', top: -4, left: '52%', transform: 'translateX(-50%)', width: 16, height: 16, background: 'var(--bg-1)', border: '3px solid var(--accent2)', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
              Market sentiment: <strong style={{ color: 'var(--green)' }}>Bullish</strong>. India VIX at moderate 14.2. Suggested allocation: 2–3% per position.
            </p>
          </motion.div>

          {/* Quick trade */}
          {tradeStock && (
            <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{tradeStock.symbol}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{formatINR(tradeStock.price)}</span>
              </div>
              <button className="btn btn-success" style={{ width: '100%', marginBottom: 8 }} onClick={() => setTS(tradeStock)}>
                <TrendingUp size={14} /> Buy
              </button>
              <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => setTS(tradeStock)}>
                <TrendingDown size={14} /> Sell
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trade Modal */}
      {tradeStock && <TradeModal stock={tradeStock} onClose={() => setTS(null)} />}
    </div>
  );
}
