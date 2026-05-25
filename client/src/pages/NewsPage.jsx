import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  motion,
} from 'framer-motion';

import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
  Flame,
  Search,
} from 'lucide-react';

import api from '../services/api';

import {
  timeAgo,
} from '../utils/helpers';

const SAMPLE_NEWS = [
  {
    id: 1,
    headline:
      'RBI keeps repo rate unchanged at 6.5%, signals cautious optimism',
    source:
      'Economic Times',
    datetime:
      Date.now() -
      7200000,
    sentiment:
      'bullish',
    category:
      'macro',
  },

  {
    id: 2,
    headline:
      'Reliance Industries Q3 profit surges 18% YoY, beats estimates',
    source: 'Mint',
    datetime:
      Date.now() -
      10800000,
    sentiment:
      'bullish',
    category:
      'earnings',
  },

  {
    id: 3,
    headline:
      'IT sector faces headwinds amid global tech spending slowdown',
    source:
      'Business Standard',
    datetime:
      Date.now() -
      18000000,
    sentiment:
      'bearish',
    category:
      'sector',
  },

  {
    id: 4,
    headline:
      'FII net inflows cross ₹3,200 Crore in equity markets today',
    source:
      'CNBC TV18',
    datetime:
      Date.now() -
      21600000,
    sentiment:
      'bullish',
    category: 'flow',
  },

  {
    id: 5,
    headline:
      'Adani Group stocks rally 4-7% after strong Q2 earnings',
    source:
      'Bloomberg Quint',
    datetime:
      Date.now() -
      28800000,
    sentiment:
      'bullish',
    category:
      'earnings',
  },

  {
    id: 6,
    headline:
      'Crude oil at $78/barrel — mixed impact on Indian markets',
    source:
      'Reuters',
    datetime:
      Date.now() -
      32400000,
    sentiment:
      'neutral',
    category:
      'commodity',
  },
];

const COLORS = {
  bullish:
    '#00d4aa',

  bearish:
    '#ff4757',

  neutral:
    '#3b82f6',
};

export default function NewsPage() {
  const [news, setNews] =
    useState(
      SAMPLE_NEWS
    );

  const [filter, setFilter] =
    useState('ALL');

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState('');

  useEffect(() => {
    setLoading(true);

    api
      .get('/news')
      .then(
        ({ data }) => {
          if (
            data.news
              ?.length
          ) {
            setNews(
              data.news
            );
          }
        }
      )
      .catch(() => {})
      .finally(() =>
        setLoading(false)
      );
  }, []);

  const sentiment =
    useMemo(() => {
      const bullish =
        news.filter(
          (n) =>
            n.sentiment ===
            'bullish'
        ).length;

      const bearish =
        news.filter(
          (n) =>
            n.sentiment ===
            'bearish'
        ).length;

      const neutral =
        news.length -
        bullish -
        bearish;

      return {
        bullish,
        bearish,
        neutral,
      };
    }, [news]);

  const total =
    sentiment.bullish +
      sentiment.bearish +
      sentiment.neutral ||
    1;

  const displayed =
    news.filter((n) => {
      const matchFilter =
        filter === 'ALL'
          ? true
          : n.sentiment ===
              filter.toLowerCase() ||
            n.category ===
              filter.toLowerCase();

      const matchSearch =
        n.headline
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        n.source
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchFilter &&
        matchSearch
      );
    });

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
          border:
            '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
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
                <Newspaper
                  size={
                    22
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
                  Market News
                </h1>

                <p
                  style={{
                    color:
                      'var(--muted)',
                  }}
                >
                  AI-powered
                  financial news &
                  market sentiment
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
            ● LIVE NEWS
          </div>
        </div>
      </motion.div>

      {/* TOP STATS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(3,1fr)',
          gap: 16,
        }}
      >
        {[
          {
            label:
              'Bullish',
            count:
              sentiment.bullish,
            color:
              '#00d4aa',
            icon:
              TrendingUp,
          },

          {
            label:
              'Bearish',
            count:
              sentiment.bearish,
            color:
              '#ff4757',
            icon:
              TrendingDown,
          },

          {
            label:
              'Neutral',
            count:
              sentiment.neutral,
            color:
              '#3b82f6',
            icon:
              Activity,
          },
        ].map(
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

                  <span
                    style={{
                      color:
                        s.color,
                      fontWeight: 700,
                    }}
                  >
                    {Math.round(
                      (s.count /
                        total) *
                        100
                    )}
                    %
                  </span>
                </div>

                <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                  }}
                >
                  {
                    s.count
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
                  }{' '}
                  News
                </p>
              </motion.div>
            );
          }
        )}
      </div>

      {/* MAIN */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 320px',
          gap: 18,
          alignItems:
            'start',
        }}
      >
        {/* LEFT */}
        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: 16,
          }}
        >
          {/* SEARCH */}
          <div
            className="card"
            style={{
              borderRadius: 22,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems:
                  'center',
                flexWrap:
                  'wrap',
              }}
            >
              {/* SEARCH */}
              <div
                style={{
                  position:
                    'relative',
                  flex: 1,
                  minWidth: 220,
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
                  placeholder="Search market news..."
                  className="input"
                  style={{
                    paddingLeft: 38,
                  }}
                />
              </div>

              {/* FILTERS */}
              {[
                'ALL',
                'bullish',
                'bearish',
                'neutral',
                'macro',
                'earnings',
              ].map(
                (f) => (
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
                      textTransform:
                        'capitalize',
                    }}
                  >
                    {f}
                  </button>
                )
              )}
            </div>
          </div>

          {/* NEWS */}
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
                        height: 90,
                        borderRadius: 18,
                        marginBottom: 14,
                      }}
                    />
                  )
                )
            ) : (
              displayed.map(
                (
                  n,
                  i
                ) => (
                  <motion.div
                    key={
                      n.id ||
                      i
                    }
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        i *
                        0.03,
                    }}
                    style={{
                      padding:
                        '18px 0',
                      borderBottom:
                        '1px solid rgba(255,255,255,0.05)',
                      cursor:
                        'pointer',
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        gap: 18,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            lineHeight: 1.6,
                            marginBottom: 10,
                          }}
                        >
                          {
                            n.headline
                          }
                        </h3>

                        <div
                          style={{
                            display:
                              'flex',
                            gap: 12,
                            alignItems:
                              'center',
                            flexWrap:
                              'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {
                              n.source
                            }
                          </span>

                          <span
                            style={{
                              color:
                                'var(--muted)',
                              fontSize: 12,
                            }}
                          >
                            {timeAgo(
                              n.datetime
                            )}
                          </span>

                          <span
                            style={{
                              padding:
                                '6px 10px',
                              borderRadius:
                                999,
                              background:
                                COLORS[
                                  n
                                    .sentiment
                                ] +
                                '22',
                              color:
                                COLORS[
                                  n
                                    .sentiment
                                ],
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {
                              n.sentiment
                            }
                          </span>

                          <span
                            style={{
                              padding:
                                '6px 10px',
                              borderRadius:
                                999,
                              background:
                                'rgba(59,130,246,0.12)',
                              color:
                                '#3b82f6',
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform:
                                'capitalize',
                            }}
                          >
                            {
                              n.category
                            }
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 18,
                          background:
                            'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(0,212,170,0.12))',
                          display:
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          flexShrink: 0,
                        }}
                      >
                        <Newspaper
                          size={
                            30
                          }
                          color="#3b82f6"
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              )
            )}
          </motion.div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: 16,
          }}
        >
          {/* AI BRIEF */}
          <motion.div
            className="card"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            style={{
              borderRadius: 26,
              background:
                'rgba(0,212,170,0.05)',
              border:
                '1px solid rgba(0,212,170,0.16)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Sparkles
                size={20}
                color="#00d4aa"
              />

              <h3>
                AI Market Brief
              </h3>
            </div>

            <p
              style={{
                lineHeight: 1.8,
                color:
                  'var(--text2)',
                fontSize: 14,
              }}
            >
              Market sentiment
              remains{' '}
              <strong
                style={{
                  color:
                    '#00d4aa',
                }}
              >
                bullish
              </strong>{' '}
              due to strong Q3
              earnings, RBI
              stability, and
              consistent FII
              inflows. IT &
              Energy sectors are
              showing strong
              institutional
              momentum.
            </p>
          </motion.div>

          {/* TRENDING */}
          <motion.div
            className="card"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.05,
            }}
            style={{
              borderRadius: 26,
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
              <Flame
                size={20}
                color="#ff7a00"
              />

              <h3>
                Trending Topics
              </h3>
            </div>

            {[
              'RBI Policy',
              'Q3 Earnings',
              'IT Rally',
              'FII Buying',
              'Oil Prices',
              'SEBI Rules',
            ].map(
              (
                t,
                i
              ) => (
                <div
                  key={i}
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    padding:
                      '12px 0',
                    borderBottom:
                      '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    #{t}
                  </span>

                  <span
                    style={{
                      color:
                        '#00d4aa',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    +{Math.floor(
                      Math.random() *
                        80 +
                        20
                    )}
                    %
                  </span>
                </div>
              )
            )}
          </motion.div>

          {/* MARKET PULSE */}
          <motion.div
            className="card"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            style={{
              borderRadius: 26,
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
              <Activity
                size={20}
                color="#3b82f6"
              />

              <h3>
                Market Pulse
              </h3>
            </div>

            {[
              [
                'Market Fear',
                'Low',
                '#00d4aa',
              ],

              [
                'Volatility',
                'Moderate',
                '#f59e0b',
              ],

              [
                'Momentum',
                'Strong',
                '#3b82f6',
              ],

              [
                'Liquidity',
                'High',
                '#00d4aa',
              ],
            ].map(
              (
                [
                  k,
                  v,
                  c,
                ],
                i
              ) => (
                <div
                  key={i}
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    padding:
                      '12px 0',
                    borderBottom:
                      '1px solid rgba(255,255,255,0.05)',
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

                  <span
                    style={{
                      color: c,
                      fontWeight: 700,
                    }}
                  >
                    {v}
                  </span>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}