import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchPortfolio, fetchSummary } from '../redux/slices/portfolioSlice';
import DonutChart, { COLORS } from '../components/Common/DonutChart';
import StockChart from '../components/Common/StockChart';
import { formatINR, formatPct, colorClass, arrowPrefix, generateSparkline } from '../utils/helpers';

export default function PortfolioPage() {
  const dispatch = useDispatch();
  const { portfolio, summary, loading } = useSelector(s => s.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchSummary());
  }, [dispatch]);

  const holdings = portfolio?.holdings || [];

  // PnL history (simulated for display)
  const pnlData   = [4200, -1800, 8400, 3100, -2300, 6800, portfolio?.totalPnl || 0].map(Math.round);
  const pnlLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Now'];

  const donutData   = holdings.map(h => h.currentValue || h.quantity * h.avgPrice);
  const donutLabels = holdings.map(h => h.symbol);
  const total       = donutData.reduce((a, b) => a + b, 0);

  const summaryCards = [
    { label: 'Total Invested',  val: formatINR(summary?.totalInvested || 0, 0), up: true },
    { label: 'Current Value',   val: formatINR(summary?.currentValue  || 0, 0), up: (summary?.totalPnl || 0) >= 0 },
    { label: 'Total Returns',   val: formatINR(Math.abs(summary?.totalPnl || 0), 0), pct: formatPct(summary?.totalPnlPct || 0), up: (summary?.totalPnl || 0) >= 0 },
    { label: 'Free Cash',       val: formatINR(summary?.walletBalance  || 0, 0), up: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {summaryCards.map((c, i) => (
          <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}>
            <p className="label">{c.label}</p>
            <p className={`value ${c.up ? 'text-green' : 'text-red'}`} style={{ fontSize: 20 }}>{c.val}</p>
            {c.pct && <p className={`sub ${c.up ? 'text-green' : 'text-red'}`}>{c.pct}</p>}
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Allocation</p>
          {donutData.length ? (
            <>
              <DonutChart data={donutData.map(v => (v / (total || 1)) * 100)} labels={donutLabels} size={180} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, justifyContent: 'center' }}>
                {holdings.map((h, i) => (
                  <span key={h.symbol} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], display: 'inline-block' }} />
                    {h.symbol} {((donutData[i] / (total || 1)) * 100).toFixed(1)}%
                  </span>
                ))}
              </div>
            </>
          ) : <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No holdings yet</p>}
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>P&L History</p>
          <StockChart data={pnlData} labels={pnlLabels} color="#4f8bff" height={200} type="bar" showAxes />
        </motion.div>
      </div>

      {/* Holdings table */}
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Holdings</p>
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />)
        ) : holdings.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No holdings. Start trading to build your portfolio!</p>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 1fr 1fr 1fr 1fr', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span>Stock</span><span>Qty</span><span>Avg Price</span><span>LTP</span><span>Invested</span><span>P&L</span>
            </div>
            {holdings.map((h, i) => {
              const pnl    = h.pnl ?? ((h.currentPrice - h.avgPrice) * h.quantity);
              const pnlPct = h.pnlPercent ?? (((h.currentPrice - h.avgPrice) / h.avgPrice) * 100);
              const up     = pnl >= 0;
              return (
                <motion.div key={h.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.05 } }}
                  style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 1fr 1fr 1fr 1fr', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 13 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--mono)' }}>{h.symbol}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{h.stockName?.slice(0, 20)}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{h.quantity}</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>{formatINR(h.avgPrice)}</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>{formatINR(h.currentPrice || h.avgPrice)}</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>{formatINR(h.investedValue || h.quantity * h.avgPrice, 0)}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: up ? 'var(--green)' : 'var(--red)' }}>
                      {up ? '+' : ''}{formatINR(Math.abs(pnl), 0)}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: up ? 'var(--green)' : 'var(--red)' }}>
                      {up ? '+' : ''}{pnlPct.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
