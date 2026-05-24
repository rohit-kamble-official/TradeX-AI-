import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchStocks, fetchGainers, fetchLosers } from '../redux/slices/stockSlice';
import StockChart from '../components/Common/StockChart';
import { formatINR, formatPct, colorClass, generateSparkline } from '../utils/helpers';

const SECTORS = ['IT','Banking','FMCG','Pharma','Auto','Energy','Metals'];
const SECTOR_PCT = [2.4, 1.2, -0.6, 0.8, -1.1, 1.8, -0.3];
const INDICES = [
  { name: 'NIFTY 50',    value: '24,832', chg: '+312 (1.27%)', up: true },
  { name: 'SENSEX',      value: '81,467', chg: '+870 (1.08%)', up: true },
  { name: 'BANK NIFTY',  value: '52,140', chg: '−180 (0.34%)', up: false },
  { name: 'NIFTY IT',    value: '38,210', chg: '+924 (2.48%)', up: true },
];

export default function MarketsPage() {
  const dispatch = useDispatch();
  const { list, gainers, losers, loading } = useSelector(s => s.stocks);

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchGainers());
    dispatch(fetchLosers());
  }, [dispatch]);

  const displayGainers = gainers.length ? gainers : list.filter(s => s.changePct > 0).sort((a, b) => b.changePct - a.changePct).slice(0, 6);
  const displayLosers  = losers.length  ? losers  : list.filter(s => s.changePct < 0).sort((a, b) => a.changePct - b.changePct).slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Index cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {INDICES.map((idx, i) => {
          const spark = generateSparkline(idx.up ? 100 : 100, 0.01);
          return (
            <motion.div key={i} className="card" style={{ textAlign: 'center' }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{idx.name}</p>
              <p className="mono" style={{ fontSize: 22, fontWeight: 700 }}>{idx.value}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: idx.up ? 'var(--green)' : 'var(--red)', marginBottom: 10 }}>
                {idx.up ? '▲' : '▼'} {idx.chg}
              </p>
              <div style={{ height: 50 }}>
                <StockChart data={spark} labels={spark.map(String)} color={idx.up ? '#00d4aa' : '#ff4757'} height={50} showAxes={false} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gainers / Losers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>▲ Top Gainers</p>
          {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }} />) :
            displayGainers.map((s, i) => (
              <div key={s.symbol || i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 13 }}>{s.symbol}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.name?.slice(0, 22)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{formatINR(s.price, 0)}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>+{(s.changePct || 0).toFixed(2)}%</div>
                </div>
              </div>
            ))}
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>▼ Top Losers</p>
          {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 40, marginBottom: 8 }} />) :
            displayLosers.map((s, i) => (
              <div key={s.symbol || i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 13 }}>{s.symbol}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.name?.slice(0, 22)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{formatINR(s.price, 0)}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>{(s.changePct || 0).toFixed(2)}%</div>
                </div>
              </div>
            ))}
        </motion.div>
      </div>

      {/* Sector performance */}
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>Sector Performance</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SECTORS.map((sec, i) => {
            const pct = SECTOR_PCT[i];
            const up  = pct >= 0;
            const width = Math.abs(pct) / 3 * 100;
            return (
              <div key={sec} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 70, fontSize: 12, fontWeight: 600, color: 'var(--text2)', flexShrink: 0 }}>{sec}</span>
                <div style={{ flex: 1, height: 8, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: width + '%' }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                    style={{ height: '100%', background: up ? 'var(--green)' : 'var(--red)', borderRadius: 4 }}
                  />
                </div>
                <span style={{ width: 55, fontSize: 12, fontWeight: 700, textAlign: 'right', color: up ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--mono)' }}>
                  {up ? '+' : ''}{pct}%
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* All Stocks Table */}
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>All Stocks</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          <span>Name</span><span>Price</span><span>Change</span><span>Volume</span><span>Sector</span>
        </div>
        {list.map((s, i) => (
          <div key={s.symbol} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 8, padding: '11px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--mono)' }}>{s.symbol}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.name?.slice(0, 22)}</div>
            </div>
            <span className="mono" style={{ fontWeight: 600 }}>{formatINR(s.price)}</span>
            <span style={{ fontWeight: 700, color: (s.changePct || 0) >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--mono)' }}>
              {(s.changePct || 0) >= 0 ? '+' : ''}{(s.changePct || 0).toFixed(2)}%
            </span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{((s.volume || 0) / 1e6).toFixed(1)}M</span>
            <span><span className="badge badge-blue" style={{ fontSize: 10 }}>{s.sector}</span></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
