import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchOrders } from '../redux/slices/portfolioSlice';
import { formatINR, timeAgo } from '../utils/helpers';

const STATUS_BADGE = {
  EXECUTED:  'badge-green',
  PENDING:   'badge-amber',
  CANCELLED: 'badge badge-blue',
  FAILED:    'badge-red',
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, totalOrders, loading } = useSelector(s => s.portfolio);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  const displayed = filter === 'ALL' ? orders : orders.filter(o => o.type === filter || o.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Orders',   val: totalOrders || orders.length },
          { label: 'Executed',       val: orders.filter(o => o.status === 'EXECUTED').length },
          { label: 'Buy Orders',     val: orders.filter(o => o.type === 'BUY').length },
          { label: 'Sell Orders',    val: orders.filter(o => o.type === 'SELL').length },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="label">{s.label}</p>
            <p className="value mono" style={{ fontSize: 28 }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['ALL', 'BUY', 'SELL', 'EXECUTED', 'PENDING', 'CANCELLED'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr 0.8fr 1fr 0.8fr 1fr 0.8fr', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>Stock</span><span>Type</span><span>Order</span><span>Price</span><span>Qty</span><span>Value</span><span>Status</span>
        </div>

        {loading ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 6, marginTop: 6 }} />) :
          displayed.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No orders found. Start trading!</p>
          ) :
          displayed.map((o, i) => (
            <motion.div key={o._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
              style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr 0.8fr 1fr 0.8fr 1fr 0.8fr', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--mono)' }}>{o.symbol}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{o.stockName?.slice(0, 18)}</div>
              </div>
              <span style={{ fontWeight: 700, color: o.type === 'BUY' ? 'var(--green)' : 'var(--red)', fontSize: 12 }}>{o.type}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{o.orderType || 'MARKET'}</span>
              <span className="mono" style={{ fontWeight: 600 }}>{formatINR(o.price)}</span>
              <span className="mono">{o.quantity}</span>
              <span className="mono" style={{ fontWeight: 600 }}>{formatINR(o.totalValue, 0)}</span>
              <div>
                <span className={`badge ${STATUS_BADGE[o.status] || 'badge-blue'}`}>{o.status}</span>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{timeAgo(o.createdAt || o.executedAt)}</div>
              </div>
            </motion.div>
          ))
        }
      </motion.div>
    </div>
  );
}
