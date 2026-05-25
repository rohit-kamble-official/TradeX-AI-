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
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  BarChart3,
  Sparkles,
} from 'lucide-react';

import {
  fetchStocks,
  fetchGainers,
  fetchLosers,
} from '../redux/slices/stockSlice';

import StockChart from '../components/Common/StockChart';

import {
  formatINR,
  generateSparkline,
} from '../utils/helpers';

const SECTORS = [
  'IT',
  'Banking',
  'FMCG',
  'Pharma',
  'Auto',
  'Energy',
  'Metals',
];

const SECTOR_PCT = [
  2.4,
  1.2,
  -0.6,
  0.8,
  -1.1,
  1.8,
  -0.3,
];

const INDICES = [
  {
    name: 'NIFTY 50',
    value: '24,832',
    chg: '+312 (1.27%)',
    up: true,
  },

  {
    name: 'SENSEX',
    value: '81,467',
    chg: '+870 (1.08%)',
    up: true,
  },

  {
    name: 'BANK NIFTY',
    value: '52,140',
    chg: '-180 (0.34%)',
    up: false,
  },

  {
    name: 'NIFTY IT',
    value: '38,210',
    chg: '+924 (2.48%)',
    up: true,
  },
];

export default function MarketsPage() {
  const dispatch =
    useDispatch();

  const {
    list,
    gainers,
    losers,
    loading,
  } = useSelector(
    (s) => s.stocks
  );

  const [search, setSearch] =
    useState('');

  useEffect(() => {
    dispatch(fetchStocks());

    dispatch(fetchGainers());

    dispatch(fetchLosers());
  }, [dispatch]);

  const displayGainers =
    gainers.length
      ? gainers
      : list
          .filter(
            (s) =>
              s.changePct > 0
          )
          .sort(
            (a, b) =>
              b.changePct -
              a.changePct
          )
          .slice(0, 6);

  const displayLosers =
    losers.length
      ? losers
      : list
          .filter(
            (s) =>
              s.changePct < 0
          )
          .sort(
            (a, b) =>
              a.changePct -
              b.changePct
          )
          .slice(0, 6);

  const filteredStocks =
    useMemo(() => {
      if (!search)
        return list;

      return list.filter(
        (s) =>
          s.symbol
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          s.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [list, search]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection:
          'column',
        gap: 20,
      }}
    >
      {/* HEADER */}
      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems:
            'center',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            Markets
          </h1>

          <p
            style={{
              color:
                'var(--muted)',
            }}
          >
            Live market
            overview and stock
            analytics
          </p>
        </div>

        <div
          style={{
            padding:
              '10px 18px',
            borderRadius: 999,
            background:
              'rgba(0,212,170,0.10)',
            border:
              '1px solid rgba(0,212,170,0.18)',
            color:
              '#00d4aa',
            fontWeight: 700,
          }}
        >
          ● MARKET OPEN
        </div>
      </motion.div>

      {/* INDICES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4,1fr)',
          gap: 16,
        }}
      >
        {INDICES.map(
          (
            idx,
            i
          ) => {
            const spark =
              generateSparkline(
                100,
                0.01
              );

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
                    i * 0.06,
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
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      color:
                        'var(--muted)',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {
                      idx.name
                    }
                  </span>

                  {idx.up ? (
                    <TrendingUp
                      size={
                        18
                      }
                      color="#00d4aa"
                    />
                  ) : (
                    <TrendingDown
                      size={
                        18
                      }
                      color="#ff4757"
                    />
                  )}
                </div>

                <h2
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  {
                    idx.value
                  }
                </h2>

                <p
                  style={{
                    color:
                      idx.up
                        ? '#00d4aa'
                        : '#ff4757',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  {idx.up
                    ? '▲'
                    : '▼'}{' '}
                  {idx.chg}
                </p>

                <StockChart
                  data={
                    spark
                  }
                  labels={spark.map(
                    String
                  )}
                  color={
                    idx.up
                      ? '#00d4aa'
                      : '#ff4757'
                  }
                  height={
                    60
                  }
                  showAxes={
                    false
                  }
                />
              </motion.div>
            );
          }
        )}
      </div>

      {/* GAINERS LOSERS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: 18,
        }}
      >
        {/* GAINERS */}
        <motion.div
          className="card"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          style={{
            borderRadius: 26,
          }}
        >
          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <TrendingUp
              size={20}
              color="#00d4aa"
            />

            <h3>
              Top Gainers
            </h3>
          </div>

          {displayGainers.map(
            (
              s,
              i
            ) => (
              <div
                key={
                  s.symbol
                }
                style={{
                  display:
                    'flex',
                  justifyContent:
                    'space-between',
                  alignItems:
                    'center',
                  padding:
                    '14px 0',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                    }}
                  >
                    {
                      s.symbol
                    }
                  </div>

                  <div
                    style={{
                      color:
                        'var(--muted)',
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {s.name?.slice(
                      0,
                      24
                    )}
                  </div>
                </div>

                <div
                  style={{
                    textAlign:
                      'right',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {formatINR(
                      s.price,
                      0
                    )}
                  </div>

                  <div
                    style={{
                      color:
                        '#00d4aa',
                      fontWeight: 800,
                      marginTop: 4,
                    }}
                  >
                    +
                    {(
                      s.changePct ||
                      0
                    ).toFixed(
                      2
                    )}
                    %
                  </div>
                </div>
              </div>
            )
          )}
        </motion.div>

        {/* LOSERS */}
        <motion.div
          className="card"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          style={{
            borderRadius: 26,
          }}
        >
          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <TrendingDown
              size={20}
              color="#ff4757"
            />

            <h3>
              Top Losers
            </h3>
          </div>

          {displayLosers.map(
            (
              s,
              i
            ) => (
              <div
                key={
                  s.symbol
                }
                style={{
                  display:
                    'flex',
                  justifyContent:
                    'space-between',
                  alignItems:
                    'center',
                  padding:
                    '14px 0',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                    }}
                  >
                    {
                      s.symbol
                    }
                  </div>

                  <div
                    style={{
                      color:
                        'var(--muted)',
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {s.name?.slice(
                      0,
                      24
                    )}
                  </div>
                </div>

                <div
                  style={{
                    textAlign:
                      'right',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {formatINR(
                      s.price,
                      0
                    )}
                  </div>

                  <div
                    style={{
                      color:
                        '#ff4757',
                      fontWeight: 800,
                      marginTop: 4,
                    }}
                  >
                    {(
                      s.changePct ||
                      0
                    ).toFixed(
                      2
                    )}
                    %
                  </div>
                </div>
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* SECTORS */}
      <motion.div
        className="card"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        style={{
          borderRadius: 26,
        }}
      >
        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap: 10,
            marginBottom: 22,
          }}
        >
          <Activity
            size={20}
            color="#3b82f6"
          />

          <h3>
            Sector
            Performance
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: 16,
          }}
        >
          {SECTORS.map(
            (
              sec,
              i
            ) => {
              const pct =
                SECTOR_PCT[
                  i
                ];

              const up =
                pct >= 0;

              const width =
                (Math.abs(
                  pct
                ) /
                  3) *
                100;

              return (
                <div
                  key={sec}
                >
                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <strong>
                      {
                        sec
                      }
                    </strong>

                    <span
                      style={{
                        color:
                          up
                            ? '#00d4aa'
                            : '#ff4757',
                        fontWeight: 700,
                      }}
                    >
                      {up
                        ? '+'
                        : ''}
                      {pct}
                      %
                    </span>
                  </div>

                  <div
                    style={{
                      height: 10,
                      borderRadius: 999,
                      overflow:
                        'hidden',
                      background:
                        'rgba(255,255,255,0.05)',
                    }}
                  >
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width:
                          width +
                          '%',
                      }}
                      transition={{
                        duration: 0.7,
                        delay:
                          i *
                          0.05,
                      }}
                      style={{
                        height:
                          '100%',
                        borderRadius: 999,
                        background:
                          up
                            ? 'linear-gradient(90deg,#00d4aa,#00a884)'
                            : 'linear-gradient(90deg,#ff4757,#ff2d55)',
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </motion.div>

      {/* STOCK TABLE */}
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
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              All Stocks
            </h3>

            <p
              style={{
                color:
                  'var(--muted)',
                fontSize: 13,
              }}
            >
              Explore live
              market data
            </p>
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
              placeholder="Search stocks..."
              className="input"
              style={{
                paddingLeft: 38,
              }}
            />
          </div>
        </div>

        {/* HEAD */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1.6fr 1fr 1fr 1fr 1fr',
            gap: 10,
            padding:
              '12px 0',
            borderBottom:
              '1px solid rgba(255,255,255,0.05)',
            color:
              'var(--muted)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing:
              '0.8px',
            textTransform:
              'uppercase',
          }}
        >
          <span>
            Company
          </span>

          <span>
            Price
          </span>

          <span>
            Change
          </span>

          <span>
            Volume
          </span>

          <span>
            Sector
          </span>
        </div>

        {/* ROWS */}
        {filteredStocks.map(
          (
            s,
            i
          ) => {
            const up =
              (s.changePct ||
                0) >=
              0;

            return (
              <motion.div
                key={
                  s.symbol
                }
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay:
                    i *
                    0.02,
                }}
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    '1.6fr 1fr 1fr 1fr 1fr',
                  gap: 10,
                  padding:
                    '16px 0',
                  alignItems:
                    'center',
                  borderBottom:
                    '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* COMPANY */}
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                    }}
                  >
                    {
                      s.symbol
                    }
                  </div>

                  <div
                    style={{
                      color:
                        'var(--muted)',
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {s.name?.slice(
                      0,
                      28
                    )}
                  </div>
                </div>

                {/* PRICE */}
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {formatINR(
                    s.price
                  )}
                </div>

                {/* CHANGE */}
                <div
                  style={{
                    color:
                      up
                        ? '#00d4aa'
                        : '#ff4757',
                    fontWeight: 800,
                  }}
                >
                  {up
                    ? '+'
                    : ''}
                  {(
                    s.changePct ||
                    0
                  ).toFixed(
                    2
                  )}
                  %
                </div>

                {/* VOL */}
                <div
                  style={{
                    color:
                      'var(--muted)',
                  }}
                >
                  {(
                    (s.volume ||
                      0) /
                    1e6
                  ).toFixed(
                    1
                  )}
                  M
                </div>

                {/* SECTOR */}
                <div>
                  <span
                    style={{
                      padding:
                        '6px 10px',
                      borderRadius: 999,
                      background:
                        'rgba(59,130,246,0.12)',
                      color:
                        '#3b82f6',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {
                      s.sector
                    }
                  </span>
                </div>
              </motion.div>
            );
          }
        )}
      </motion.div>

      {/* AI INSIGHT */}
      <motion.div
        className="card"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        style={{
          borderRadius: 26,
          background:
            'rgba(59,130,246,0.06)',
          border:
            '1px solid rgba(59,130,246,0.14)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Sparkles
            size={20}
            color="#3b82f6"
          />

          <h3>
            AI Market
            Insight
          </h3>
        </div>

        <p
          style={{
            color:
              'var(--text2)',
            lineHeight: 1.8,
          }}
        >
          AI analysis
          indicates strong
          bullish momentum in
          the IT and Energy
          sectors, while
          Banking stocks show
          moderate short-term
          consolidation.
          Overall market
          sentiment remains
          positive with stable
          institutional buying
          activity.
        </p>
      </motion.div>
    </div>
  );
}