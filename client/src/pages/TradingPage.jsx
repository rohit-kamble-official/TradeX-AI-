import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import { motion } from 'framer-motion';

import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Wallet,
} from 'lucide-react';

import {
  fetchStocks,
  fetchHistory,
} from '../redux/slices/stockSlice';

import {
  buyStock,
  sellStock,
  fetchSummary,
} from '../redux/slices/portfolioSlice';

import StockChart from '../components/Common/StockChart';

import {
  formatINR,
  formatPct,
  generateSparkline,
} from '../utils/helpers';

import toast from 'react-hot-toast';

export default function TradingPage() {
  const dispatch = useDispatch();

  const {
    list,
    history,
    loading,
  } = useSelector((s) => s.stocks);

  const {
    summary,
    tradeLoading,
  } = useSelector((s) => s.portfolio);

  const [search, setSearch] =
    useState('');

  const [selected, setSelected] =
    useState(null);

  const [side, setSide] =
    useState('BUY');

  const [qty, setQty] =
    useState(1);

  const [orderType, setOrderType] =
    useState('MARKET');

  const [tf, setTf] =
    useState('1D');

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  useEffect(() => {
    if (list.length && !selected) {
      setSelected(list[0]);
    }
  }, [list]);

  useEffect(() => {
    if (selected) {
      dispatch(
        fetchHistory({
          sym: selected.symbol,
          period: tf,
        })
      );
    }
  }, [selected, tf, dispatch]);

  const filtered = useMemo(() => {
    return search
      ? list.filter(
          (s) =>
            s.symbol.includes(
              search.toUpperCase()
            ) ||
            s.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        )
      : list;
  }, [list, search]);

  const chartData = useMemo(() => {
    const h =
      history[selected?.symbol] ||
      [];

    return {
      data: h.map((p) => p.price),
      labels: h.map(
        (_, i) => `${i}`
      ),
    };
  }, [history, selected]);

  const fallback = useMemo(
    () =>
      generateSparkline(
        selected?.price || 1000,
        0.005,
        80
      ),
    [selected?.price]
  );

  const price =
    selected?.price || 0;

  const total = +(
    qty * price
  ).toFixed(2);

  const canAfford =
    (summary?.walletBalance || 0) >=
    total;

  const handleTrade = async () => {
    if (!selected) return;

    if (qty < 1) {
      return toast.error(
        'Minimum quantity is 1'
      );
    }

    if (
      side === 'BUY' &&
      !canAfford
    ) {
      return toast.error(
        'Insufficient balance'
      );
    }

    const body = {
      symbol: selected.symbol,
      quantity: qty,
      price,
      orderType,
    };

    const thunk =
      side === 'BUY'
        ? buyStock
        : sellStock;

    const res = await dispatch(
      thunk(body)
    );

    if (
      res.meta.requestStatus ===
      'fulfilled'
    ) {
      toast.success(
        `${side} ${qty} × ${selected.symbol}`
      );

      dispatch(fetchSummary());
    }
  };

  const bids = Array(5)
    .fill(0)
    .map((_, i) => ({
      price:
        price -
        (i + 1) * 0.5,
      qty: Math.round(
        100 +
          Math.random() * 900
      ),
    }));

  const asks = Array(5)
    .fill(0)
    .map((_, i) => ({
      price:
        price +
        (i + 1) * 0.5,
      qty: Math.round(
        100 +
          Math.random() * 900
      ),
    }));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          '260px 1fr 340px',
        gap: 18,
        height:
          'calc(100vh - 100px)',
      }}
    >
      {/* LEFT PANEL */}
      <motion.div
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        className="card"
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: 22,
        }}
      >
        <div
          style={{
            padding: 16,
            borderBottom:
              '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              position: 'relative',
            }}
          >
            <Search
              size={16}
              style={{
                position:
                  'absolute',
                left: 12,
                top: '50%',
                transform:
                  'translateY(-50%)',
                color:
                  'var(--muted)',
              }}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search stocks..."
              className="input"
              style={{
                paddingLeft: 38,
              }}
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {filtered.map((s) => {
            const up =
              (s.changePct || 0) >=
              0;

            return (
              <div
                key={s.symbol}
                onClick={() =>
                  setSelected(s)
                }
                style={{
                  padding:
                    '14px 16px',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  background:
                    selected?.symbol ===
                    s.symbol
                      ? 'rgba(59,130,246,0.08)'
                      : 'transparent',
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: 6,
                  }}
                >
                  <strong>
                    {s.symbol}
                  </strong>

                  <span
                    style={{
                      color: up
                        ? '#00d4aa'
                        : '#ff4757',
                      fontWeight: 700,
                    }}
                  >
                    {up ? '+' : ''}
                    {(
                      s.changePct ||
                      0
                    ).toFixed(2)}
                    %
                  </span>
                </div>

                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color:
                        'var(--muted)',
                    }}
                  >
                    {s.name?.slice(
                      0,
                      16
                    )}
                  </p>

                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {formatINR(
                      s.price,
                      0
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CENTER */}
      <div
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: 18,
        }}
      >
        {/* CHART */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="card"
          style={{
            borderRadius: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                }}
              >
                {selected?.symbol}
              </h2>

              <p
                style={{
                  color:
                    'var(--muted)',
                }}
              >
                {selected?.name}
              </p>
            </div>

            <div
              style={{
                textAlign:
                  'right',
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color:
                    (selected?.changePct ||
                      0) >=
                    0
                      ? '#00d4aa'
                      : '#ff4757',
                }}
              >
                {formatINR(price)}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  color:
                    (selected?.changePct ||
                      0) >=
                    0
                      ? '#00d4aa'
                      : '#ff4757',
                }}
              >
                {(selected?.changePct ||
                  0) >= 0
                  ? '▲'
                  : '▼'}{' '}
                {formatPct(
                  selected?.changePct
                )}
              </div>
            </div>
          </div>

          {/* TF */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 18,
            }}
          >
            {[
              '1D',
              '1W',
              '1M',
              '3M',
            ].map((t) => (
              <button
                key={t}
                onClick={() =>
                  setTf(t)
                }
                style={{
                  border: 'none',
                  padding:
                    '8px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background:
                    tf === t
                      ? 'linear-gradient(135deg,#00d4aa,#3b82f6)'
                      : 'rgba(255,255,255,0.04)',
                  color:
                    tf === t
                      ? '#fff'
                      : 'var(--muted)',
                  fontWeight: 700,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <StockChart
            data={
              chartData.data
                .length
                ? chartData.data
                : fallback
            }
            labels={
              chartData.labels
            }
            color={
              (selected?.changePct ||
                0) >= 0
                ? '#00d4aa'
                : '#ff4757'
            }
            height={340}
          />
        </motion.div>

        {/* MARKET DEPTH */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="card"
          style={{
            borderRadius: 22,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <BarChart3
              size={18}
              color="#3b82f6"
            />

            <h3>
              Market Depth
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 24,
            }}
          >
            {/* BIDS */}
            <div>
              <p
                style={{
                  color:
                    '#00d4aa',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                BUY ORDERS
              </p>

              {bids.map(
                (b, i) => (
                  <div
                    key={i}
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      padding:
                        '8px 0',
                    }}
                  >
                    <span
                      style={{
                        color:
                          '#00d4aa',
                      }}
                    >
                      {formatINR(
                        b.price
                      )}
                    </span>

                    <span>
                      {b.qty}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* ASKS */}
            <div>
              <p
                style={{
                  color:
                    '#ff4757',
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                SELL ORDERS
              </p>

              {asks.map(
                (a, i) => (
                  <div
                    key={i}
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      padding:
                        '8px 0',
                    }}
                  >
                    <span
                      style={{
                        color:
                          '#ff4757',
                      }}
                    >
                      {formatINR(
                        a.price
                      )}
                    </span>

                    <span>
                      {a.qty}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{
          opacity: 0,
          x: 20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: 18,
        }}
      >
        {/* TRADE */}
        <div
          className="card"
          style={{
            borderRadius: 24,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 10,
              marginBottom: 20,
            }}
          >
            {['BUY', 'SELL'].map(
              (s) => (
                <button
                  key={s}
                  onClick={() =>
                    setSide(s)
                  }
                  style={{
                    border:
                      'none',
                    padding:
                      '14px',
                    borderRadius: 16,
                    cursor:
                      'pointer',
                    fontWeight: 800,
                    background:
                      side === s
                        ? s ===
                          'BUY'
                          ? 'linear-gradient(135deg,#00d4aa,#00a884)'
                          : 'linear-gradient(135deg,#ff4757,#ff2d55)'
                        : 'rgba(255,255,255,0.04)',
                    color:
                      side === s
                        ? '#fff'
                        : 'var(--muted)',
                  }}
                >
                  {s}
                </button>
              )
            )}
          </div>

          {/* INPUTS */}
          <div
            style={{
              marginBottom: 14,
            }}
          >
            <label>
              Quantity
            </label>

            <input
              type="number"
              value={qty}
              min="1"
              onChange={(e) =>
                setQty(
                  Math.max(
                    1,
                    parseInt(
                      e.target
                        .value
                    ) || 1
                  )
                )
              }
              className="input"
            />
          </div>

          <div
            style={{
              marginBottom: 16,
            }}
          >
            <label>
              Order Type
            </label>

            <select
              value={orderType}
              onChange={(e) =>
                setOrderType(
                  e.target
                    .value
                )
              }
              className="input"
            >
              <option>
                MARKET
              </option>

              <option>
                LIMIT
              </option>

              <option>
                STOP LOSS
              </option>
            </select>
          </div>

          {/* SUMMARY */}
          <div
            style={{
              background:
                'rgba(255,255,255,0.03)',
              border:
                '1px solid rgba(255,255,255,0.06)',
              padding: 16,
              borderRadius: 18,
              marginBottom: 18,
            }}
          >
            {[
              [
                'Price',
                formatINR(
                  price
                ),
              ],
              [
                'Total',
                formatINR(
                  total
                ),
              ],
              [
                'Balance',
                formatINR(
                  summary?.walletBalance ||
                    0
                ),
              ],
            ].map(
              ([k, v]) => (
                <div
                  key={k}
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      color:
                        'var(--muted)',
                    }}
                  >
                    {k}
                  </span>

                  <strong>
                    {v}
                  </strong>
                </div>
              )
            )}
          </div>

          <button
            onClick={
              handleTrade
            }
            disabled={
              tradeLoading
            }
            style={{
              width: '100%',
              border: 'none',
              padding:
                '15px',
              borderRadius: 18,
              fontWeight: 800,
              cursor: 'pointer',
              background:
                side === 'BUY'
                  ? 'linear-gradient(135deg,#00d4aa,#00a884)'
                  : 'linear-gradient(135deg,#ff4757,#ff2d55)',
              color: '#fff',
            }}
          >
            {tradeLoading
              ? 'Processing...'
              : `${side} ${qty} × ${selected?.symbol}`}
          </button>
        </div>

        {/* AI SIGNAL */}
        <div
          className="card"
          style={{
            borderRadius: 24,
            background:
              'rgba(0,212,170,0.05)',
            border:
              '1px solid rgba(0,212,170,0.18)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Activity
              size={18}
              color="#00d4aa"
            />

            <h3>
              AI Signal
            </h3>
          </div>

          <p
            style={{
              color:
                'var(--text2)',
              lineHeight: 1.7,
              fontSize: 13,
            }}
          >
            Momentum is currently{' '}
            <strong
              style={{
                color:
                  (selected?.changePct ||
                    0) >=
                  0
                    ? '#00d4aa'
                    : '#ff4757',
              }}
            >
              {(selected?.changePct ||
                0) >= 0
                ? 'Bullish'
                : 'Bearish'}
            </strong>
            . Volume activity is
            above average and AI
            confidence remains
            strong for short-term
            momentum trades.
          </p>
        </div>

        {/* WALLET */}
        <div
          className="card"
          style={{
            borderRadius: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Wallet
              size={18}
              color="#3b82f6"
            />

            <h3>
              Wallet Balance
            </h3>
          </div>

          <h2
            style={{
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            {formatINR(
              summary?.walletBalance ||
                0
            )}
          </h2>
        </div>
      </motion.div>
    </div>
  );
}