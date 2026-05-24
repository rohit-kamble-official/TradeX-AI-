import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { fetchStocks, fetchHistory } from '../redux/slices/stockSlice';
import { buyStock, sellStock, fetchSummary } from '../redux/slices/portfolioSlice';
import StockChart from '../components/Common/StockChart';
import { formatINR, formatPct, colorClass, generateSparkline } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function TradingPage() {
  const dispatch = useDispatch();
  const { list, history, loading } = useSelector(s => s.stocks);
  const { summary, tradeLoading } = useSelector(s => s.portfolio);

  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [side, setSide]       = useState('BUY');
  const [qty, setQty]         = useState(1);
  const [orderType, setOT]    = useState('MARKET');
  const [tf, setTf]           = useState('1D');

  useEffect(() => { dispatch(fetchStocks()); }, [dispatch]);

  useEffect(() => {
    if (list.length && !selected) setSelected(list[0]);
  }, [list]);

  useEffect(() => {
    if (selected) dispatch(fetchHistory({ sym: selected.symbol, period: tf }));
  }, [selected, tf, dispatch]);

  const filtered = useMemo(() =>
    search ? list.filter(s => s.symbol.includes(search.toUpperCase()) || s.name?.toLowerCase().includes(search.toLowerCase())) : list,
    [list, search]
  );

  const chartData = useMemo(() => {
    const h = history[selected?.symbol] || [];
    return { data: h.map(p => p.price), labels: h.map((_, i) => `${i}`) };
  }, [history, selected]);

  const fallback  = useMemo(() => generateSparkline(selected?.price || 1000, 0.005, 80), [selected?.price]);
  const price     = selected?.price || 0;
  const total     = +(qty * price).toFixed(2);
  const canAfford = (summary?.walletBalance || 0) >= total;

  const handleTrade = async () => {
    if (!selected) return;
    if (qty < 1) return toast.error('Min quantity is 1');
    if (side === 'BUY' && !canAfford) return toast.error('Insufficient balance');
    const body  = { symbol: selected.symbol, quantity: qty, price, orderType };
    const thunk = side === 'BUY' ? buyStock : sellStock;
    const res   = await dispatch(thunk(body));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(`${side === 'BUY' ? '✅ Bought' : '📤 Sold'} ${qty} × ${selected.symbol}`);
      dispatch(fetchSummary());
    }
  };

  // Simulated market depth
  const bids = Array(5).fill(0).map((_, i) => ({ price: price - (i + 1) * 0.5, qty: Math.round(100 + Math.random() * 900) }));
  const asks = Array(5).fill(0).map((_, i) => ({ price: price + (i + 1) * 0.5, qty: Math.round(100 + Math.random() * 900) }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: 14, height: 'calc(100vh - 120px)' }}>
      {/* Stock list */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stocks…" style={{ paddingLeft: 32, fontSize: 13 }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(s => (
            <div key={s.symbol} onClick={() => setSelected(s)}
              style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selected?.symbol === s.symbol ? 'rgba(79,139,255,0.08)' : 'transparent', borderLeft: selected?.symbol === s.symbol ? '2px solid var(--accent2)' : '2px solid transparent', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--mono)', fontSize: 12 }}>{s.symbol}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: (s.changePct || 0) >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--mono)' }}>
                  {(s.changePct || 0) >= 0 ? '+' : ''}{(s.changePct || 0).toFixed(2)}%
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{formatINR(s.price, 0)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--mono)' }}>{selected?.symbol}</h2>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{selected?.name} • {selected?.exchange || 'NSE'} • {selected?.sector}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: (selected?.changePct || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>{formatINR(price)}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: (selected?.changePct || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {(selected?.changePct || 0) >= 0 ? '▲' : '▼'} {formatPct(selected?.changePct)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'var(--bg-2)', borderRadius: 8, padding: 3, width: 'fit-content', marginBottom: 12 }}>
            {['1D','1W','1M','3M'].map(t => (
              <button key={t} onClick={() => setTf(t)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600, border: 'none', background: tf === t ? 'var(--bg-1)' : 'transparent', color: tf === t ? 'var(--text)' : 'var(--muted)', fontFamily: 'var(--font)', transition: 'all 0.15s' }}>{t}</button>
            ))}
          </div>
          <div style={{ height: 260 }}>
            <StockChart data={chartData.data.length ? chartData.data : fallback} labels={chartData.labels} color={(selected?.changePct || 0) >= 0 ? '#00d4aa' : '#ff4757'} height={260} />
          </div>
        </div>

        {/* Market depth */}
        <div className="card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Activity size={14} color="var(--accent2)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Market Depth</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Buyers (Bid)</p>
              {bids.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', fontFamily: 'var(--mono)' }}>
                  <span style={{ color: 'var(--green)' }}>{formatINR(b.price)}</span>
                  <span style={{ color: 'var(--muted)' }}>{b.qty}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sellers (Ask)</p>
              {asks.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', fontFamily: 'var(--mono)' }}>
                  <span style={{ color: 'var(--red)' }}>{formatINR(a.price)}</span>
                  <span style={{ color: 'var(--muted)' }}>{a.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trade panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {['BUY','SELL'].map(s => (
              <button key={s} onClick={() => setSide(s)} style={{
                padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                cursor: 'pointer', fontFamily: 'var(--font)', letterSpacing: '0.5px',
                border: '1px solid', transition: 'all 0.2s',
                background: side === s ? (s === 'BUY' ? 'var(--green)' : 'var(--red)') : s === 'BUY' ? 'rgba(0,212,170,0.08)' : 'rgba(255,71,87,0.08)',
                color:      side === s ? (s === 'BUY' ? '#080c14' : '#fff') : s === 'BUY' ? 'var(--green)' : 'var(--red)',
                borderColor: s === 'BUY' ? 'rgba(0,212,170,0.3)' : 'rgba(255,71,87,0.25)',
              }}>{s}</button>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Order Type</label>
            <select className="input" value={orderType} onChange={e => setOT(e.target.value)}>
              <option value="MARKET">Market Order</option>
              <option value="LIMIT">Limit Order</option>
              <option value="STOP_LOSS">Stop Loss</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Quantity</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)', fontSize: 18 }}>−</button>
              <input className="input" type="number" value={qty} min="1" onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontWeight: 700 }} />
              <button onClick={() => setQty(q => q + 1)} style={{ width: 38, height: 38, background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text)', fontSize: 18 }}>+</button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
            {[
              ['Price', formatINR(price)],
              ['Total', formatINR(total)],
              ['Brokerage', '₹0 (Free)'],
              ['Available', formatINR(summary?.walletBalance || 0, 0)],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <button onClick={handleTrade} disabled={tradeLoading || !selected || (side === 'BUY' && !canAfford)}
            className={`btn ${side === 'BUY' ? 'btn-success' : 'btn-danger'}`}
            style={{ width: '100%', fontSize: 14, padding: 13, letterSpacing: '0.5px' }}>
            {tradeLoading ? 'Processing…' : `${side} ${qty} × ${selected?.symbol || '—'}`}
          </button>
          {side === 'BUY' && !canAfford && <p style={{ textAlign: 'center', color: 'var(--red)', fontSize: 12, marginTop: 8 }}>Insufficient balance</p>}
        </div>

        {/* Stock info */}
        <div className="card">
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Stock Info</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            {[
              ['Open',    formatINR(selected?.open    || 0)],
              ['High',    formatINR(selected?.high    || 0)],
              ['Low',     formatINR(selected?.low     || 0)],
              ['Prev',    formatINR(selected?.prevClose || 0)],
              ['52W High',formatINR(selected?.high52w || 0)],
              ['52W Low', formatINR(selected?.low52w  || 0)],
              ['Volume',  ((selected?.volume || 0) / 1e6).toFixed(1) + 'M'],
              ['P/E',     (selected?.pe || 0).toFixed(1) + 'x'],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* AI signal */}
        <div className="card" style={{ background: 'rgba(0,212,170,0.04)', borderColor: 'rgba(0,212,170,0.2)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>◈ AI Signal</p>
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
            Momentum: <strong style={{ color: (selected?.changePct || 0) >= 0 ? 'var(--green)' : 'var(--red)' }}>{(selected?.changePct || 0) >= 0 ? 'Bullish' : 'Bearish'}</strong>.
            Volume trending {Math.random() > 0.5 ? 'above' : 'near'} average.
            Suggested position: <strong>2-3% of portfolio</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
