import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  motion,
} from 'framer-motion';

import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
  Search,
} from 'lucide-react';

import {
  fetchOrders,
} from '../redux/slices/portfolioSlice';

import {
  formatINR,
  timeAgo,
} from '../utils/helpers';

const STATUS = {
  EXECUTED: {
    color: '#00d4aa',
    bg: 'rgba(0,212,170,0.12)',
  },

  PENDING: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },

  CANCELLED: {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },

  FAILED: {
    color: '#ff4757',
    bg: 'rgba(255,71,87,0.12)',
  },
};

export default function OrdersPage() {
  const dispatch =
    useDispatch();

  const {
    orders,
    totalOrders,
    loading,
  } = useSelector(
    (s) => s.portfolio
  );

  const [filter, setFilter] =
    useState('ALL');

  const [search, setSearch] =
    useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const displayed =
    useMemo(() => {
      return orders.filter(
        (o) => {
          const matchFilter =
            filter === 'ALL'
              ? true
              : o.type ===
                  filter ||
                o.status ===
                  filter;

          const matchSearch =
            o.symbol
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            o.stockName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchFilter &&
            matchSearch
          );
        }
      );
    }, [
      orders,
      filter,
      search,
    ]);

  const stats = [
    {
      label:
        'Total Orders',

      value:
        totalOrders ||
        orders.length,

      icon:
        ClipboardList,

      color:
        '#3b82f6',
    },

    {
      label:
        'Executed',

      value:
        orders.filter(
          (o) =>
            o.status ===
            'EXECUTED'
        ).length,

      icon:
        Activity,

      color:
        '#00d4aa',
    },

    {
      label:
        'Buy Orders',

      value:
        orders.filter(
          (o) =>
            o.type ===
            'BUY'
        ).length,

      icon:
        TrendingUp,

      color:
        '#00d4aa',
    },

    {
      label:
        'Sell Orders',

      value:
        orders.filter(
          (o) =>
            o.type ===
            'SELL'
        ).length,

      icon:
        TrendingDown,

      color:
        '#ff4757',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection:
          'column',
        gap: 20,
      }}
    >
      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="card"
        style={{
          borderRadius: 28,
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.10), rgba(0,212,170,0.08))',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 14,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 18,
                  background:
                    'linear-gradient(135deg,#3b82f6,#00d4aa)',
                  display:
                    'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                }}
              >
                <ClipboardList
                  size={
                    24
                  }
                  color="#fff"
                />
              </div>

              <div>
                <h1
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                  }}
                >
                  Orders
                </h1>

                <p
                  style={{
                    color:
                      'var(--muted)',
                  }}
                >
                  Trading history &
                  transaction
                  management
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              padding:
                '12px 18px',
              borderRadius:
                999,
              background:
                'rgba(0,212,170,0.10)',
              border:
                '1px solid rgba(0,212,170,0.18)',
              color:
                '#00d4aa',
              fontWeight: 700,
            }}
          >
            ● LIVE ORDERS
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4,1fr)',
          gap: 16,
        }}
      >
        {stats.map(
          (
            s,
            i
          ) => {
            const Icon =
              s.icon;

            return (
              <motion.div
                key={i}
                className="card"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    i * 0.05,
                }}
                style={{
                  borderRadius: 24,
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 16,
                      background:
                        s.color +
                        '22',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                    }}
                  >
                    <Icon
                      size={
                        20
                      }
                      color={
                        s.color
                      }
                    />
                  </div>

                  <Sparkles
                    size={18}
                    color={
                      s.color
                    }
                  />
                </div>

                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  {
                    s.value
                  }
                </h2>

                <p
                  style={{
                    color:
                      'var(--muted)',
                  }}
                >
                  {
                    s.label
                  }
                </p>
              </motion.div>
            );
          }
        )}
      </div>

      {/* TABLE */}
      <motion.div
        className="card"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        style={{
          borderRadius: 28,
        }}
      >
        {/* TOP */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap: 14,
            marginBottom: 22,
            flexWrap:
              'wrap',
          }}
        >
          {/* FILTERS */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap:
                'wrap',
            }}
          >
            {[
              'ALL',
              'BUY',
              'SELL',
              'EXECUTED',
              'PENDING',
              'CANCELLED',
            ].map((f) => (
              <button
                key={f}
                onClick={() =>
                  setFilter(
                    f
                  )
                }
                style={{
                  border:
                    'none',
                  cursor:
                    'pointer',
                  padding:
                    '10px 16px',
                  borderRadius:
                    14,
                  background:
                    filter ===
                    f
                      ? 'linear-gradient(135deg,#3b82f6,#00d4aa)'
                      : 'rgba(255,255,255,0.04)',
                  color:
                    filter ===
                    f
                      ? '#fff'
                      : 'var(--muted)',
                  fontWeight: 700,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div
            style={{
              position:
                'relative',
              width: 260,
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
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              placeholder="Search orders..."
              className="input"
              style={{
                paddingLeft: 38,
              }}
            />
          </div>
        </div>

        {/* HEADER */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1.6fr 0.8fr 0.8fr 1fr 0.7fr 1fr 1fr',
            gap: 10,
            padding:
              '12px 0',
            borderBottom:
              '1px solid rgba(255,255,255,0.05)',
            color:
              'var(--muted)',
            fontSize: 11,
            fontWeight: 700,
            textTransform:
              'uppercase',
            letterSpacing:
              '0.8px',
          }}
        >
          <span>
            Stock
          </span>

          <span>
            Type
          </span>

          <span>
            Order
          </span>

          <span>
            Price
          </span>

          <span>
            Qty
          </span>

          <span>
            Value
          </span>

          <span>
            Status
          </span>
        </div>

        {/* ROWS */}
        {loading ? (
          Array(6)
            .fill(0)
            .map(
              (
                _,
                i
              ) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{
                    height: 60,
                    borderRadius: 16,
                    marginTop: 12,
                  }}
                />
              )
            )
        ) : displayed.length ===
          0 ? (
          <div
            style={{
              padding:
                '80px 0',
              textAlign:
                'center',
              color:
                'var(--muted)',
            }}
          >
            No orders found.
            Start trading 🚀
          </div>
        ) : (
          displayed.map(
            (
              o,
              i
            ) => {
              const st =
                STATUS[
                  o.status
                ] ||
                STATUS.EXECUTED;

              return (
                <motion.div
                  key={
                    o._id ||
                    i
                  }
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      i *
                      0.03,
                  }}
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1.6fr 0.8fr 0.8fr 1fr 0.7fr 1fr 1fr',
                    gap: 10,
                    padding:
                      '16px 0',
                    alignItems:
                      'center',
                    borderBottom:
                      '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  {/* STOCK */}
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      {
                        o.symbol
                      }
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color:
                          'var(--muted)',
                        marginTop: 4,
                      }}
                    >
                      {o.stockName?.slice(
                        0,
                        22
                      )}
                    </div>
                  </div>

                  {/* TYPE */}
                  <div>
                    <span
                      style={{
                        color:
                          o.type ===
                          'BUY'
                            ? '#00d4aa'
                            : '#ff4757',
                        fontWeight: 800,
                      }}
                    >
                      {
                        o.type
                      }
                    </span>
                  </div>

                  {/* ORDER */}
                  <div
                    style={{
                      color:
                        'var(--muted)',
                      fontSize: 12,
                    }}
                  >
                    {o.orderType ||
                      'MARKET'}
                  </div>

                  {/* PRICE */}
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {formatINR(
                      o.price
                    )}
                  </div>

                  {/* QTY */}
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {
                      o.quantity
                    }
                  </div>

                  {/* VALUE */}
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {formatINR(
                      o.totalValue,
                      0
                    )}
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      style={{
                        padding:
                          '8px 12px',
                        borderRadius:
                          999,
                        background:
                          st.bg,
                        color:
                          st.color,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {
                        o.status
                      }
                    </span>

                    <div
                      style={{
                        fontSize: 11,
                        color:
                          'var(--muted)',
                        marginTop: 6,
                      }}
                    >
                      {timeAgo(
                        o.createdAt ||
                          o.executedAt
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }
          )
        )}
      </motion.div>
    </div>
  );
}