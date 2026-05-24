import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { buyStock, sellStock, fetchSummary, fetchPortfolio } from '../../redux/slices/portfolioSlice';
import { formatINR, formatPct } from '../../utils/helpers';
import styles from './TradeModal.module.css';

export default function TradeModal({ stock, onClose }) {
  const dispatch = useDispatch();
  const { tradeLoading, error } = useSelector(s => s.portfolio);
  const { summary } = useSelector(s => s.portfolio);
  const [side, setSide]     = useState('BUY');
  const [qty, setQty]       = useState(1);
  const [orderType, setOT]  = useState('MARKET');

  const price    = stock?.price || 0;
  const total    = +(qty * price).toFixed(2);
  const canAfford = (summary?.walletBalance || 0) >= total;

  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleTrade = async () => {
    if (qty < 1) return toast.error('Quantity must be at least 1');
    if (side === 'BUY' && !canAfford) return toast.error('Insufficient balance');

    const body = { symbol: stock.symbol, quantity: qty, price, orderType };
    const thunk = side === 'BUY' ? buyStock : sellStock;
    const result = await dispatch(thunk(body));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`${side === 'BUY' ? '✅ Bought' : '📤 Sold'} ${qty} × ${stock.symbol} @ ${formatINR(price)}`);
      dispatch(fetchSummary());
      dispatch(fetchPortfolio());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div className={styles.overlay} onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className={styles.modal} onClick={e => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}>

          {/* Header */}
          <div className={styles.header}>
            <div>
              <h2 className={styles.sym}>{stock?.symbol}</h2>
              <p className={styles.name}>{stock?.name}</p>
            </div>
            <div className={styles.headerRight}>
              <div>
                <div className={styles.price}>{formatINR(price)}</div>
                <div className={stock?.changePct >= 0 ? styles.chgUp : styles.chgDn}>
                  {stock?.changePct >= 0 ? '▲' : '▼'} {formatPct(stock?.changePct)}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
            </div>
          </div>

          {/* BUY/SELL tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${side === 'BUY' ? styles.tabBuy : ''}`} onClick={() => setSide('BUY')}>
              <TrendingUp size={15} /> BUY
            </button>
            <button className={`${styles.tab} ${side === 'SELL' ? styles.tabSell : ''}`} onClick={() => setSide('SELL')}>
              <TrendingDown size={15} /> SELL
            </button>
          </div>

          {/* Form */}
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Order Type</label>
              <select className="input" value={orderType} onChange={e => setOT(e.target.value)}>
                <option value="MARKET">Market Order</option>
                <option value="LIMIT">Limit Order</option>
                <option value="STOP_LOSS">Stop Loss</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Quantity</label>
              <div className={styles.qtyRow}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input className="input" type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontWeight: 700 }} />
                <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Price</label>
              <input className="input" value={formatINR(price)} readOnly style={{ fontFamily: 'var(--mono)', fontWeight: 600 }} />
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Est. Total</span>
              <span className={styles.totalVal}>{formatINR(total)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Brokerage</span>
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>₹0 (Free)</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Available Balance</span>
              <span style={{ fontFamily: 'var(--mono)' }}>{formatINR(summary?.walletBalance || 0, 0)}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            className={`btn ${side === 'BUY' ? 'btn-success' : 'btn-danger'}`}
            style={{ width: '100%', marginTop: 4, fontSize: 15, padding: '13px' }}
            onClick={handleTrade}
            disabled={tradeLoading || (side === 'BUY' && !canAfford)}
          >
            {tradeLoading ? 'Processing…' : `${side} ${qty} × ${stock?.symbol}`}
          </button>

          {side === 'BUY' && !canAfford && (
            <p style={{ textAlign: 'center', color: 'var(--red)', fontSize: 12, marginTop: 8 }}>Insufficient balance</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
