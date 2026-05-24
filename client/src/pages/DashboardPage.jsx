import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Wallet,
} from 'lucide-react';

import { fetchStocks, fetchHistory } from '../redux/slices/stockSlice';
import { fetchSummary, fetchPortfolio } from '../redux/slices/portfolioSlice';

import StockChart from '../components/Common/StockChart';
import TradeModal from '../components/Common/TradeModal';

import {
  formatINR,
  formatPct,
  colorClass,
  arrowPrefix,
  generateSparkline,
} from '../utils/helpers';

import styles from './DashboardPage.module.css';

const TIMEFRAMES = ['1D', '1W', '1M', '3M'];

export default function DashboardPage() {
  const dispatch = useDispatch();

  const { list: stocks, history, loading } = useSelector(
    (s) => s.stocks
  );

  const { summary } = useSelector((s) => s.portfolio);

  const [selectedSym, setSelectedSym] =
    useState('RELIANCE');

  const [tradeStock, setTradeStock] =
    useState(null);

  const [timeframe, setTimeframe] =
    useState('1D');

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchSummary());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSym) {
      dispatch(
        fetchHistory({
          sym: selectedSym,
          period: timeframe,
        })
      );
    }
  }, [selectedSym, timeframe, dispatch]);

  const selectedStock = useMemo(() => {
    return stocks.find(
      (s) => s.symbol === selectedSym
    );
  }, [stocks, selectedSym]);

  const chartData = useMemo(() => {
    const h = history[selectedSym] || [];

    return {
      data: h.map((p) => p.price),
      labels: h.map((_, i) => `${i}`),
    };
  }, [history, selectedSym]);

  const fallbackData = useMemo(() => {
    return generateSparkline(
      selectedStock?.price || 22000,
      0.005,
      80
    );
  }, [selectedStock?.price]);

  const statCards = [
    {
      title: 'Portfolio Value',
      value: formatINR(
        summary?.currentValue || 0
      ),
      icon: Wallet,
      positive:
        (summary?.totalPnlPct || 0) >= 0,
      sub:
        formatPct(summary?.totalPnlPct || 0) +
        ' overall',
    },
    {
      title: 'Total P&L',
      value: formatINR(summary?.totalPnl || 0),
      icon: TrendingUp,
      positive:
        (summary?.totalPnl || 0) >= 0,
      sub: 'Overall performance',
    },
    {
      title: 'Available Margin',
      value: formatINR(
        summary?.walletBalance || 0
      ),
      icon: Zap,
      positive: true,
      sub: 'Ready to trade',
    },
    {
      title: 'Risk Meter',
      value: 'Moderate',
      icon: Activity,
      positive: true,
      sub: 'AI market sentiment',
    },
  ];

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.hero}
      >
        <div>
          <h1 className={styles.heroTitle}>
            Trading Dashboard
          </h1>

          <p className={styles.heroSub}>
            Real-time stock intelligence &
            AI-powered insights
          </p>
        </div>

        <div className={styles.liveBadge}>
          ● LIVE MARKET
        </div>
      </motion.div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        {statCards.map((card, i) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={i}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.08,
              }}
            >
              <div className={styles.statTop}>
                <div
                  className={styles.statIcon}
                >
                  <Icon size={18} />
                </div>

                <span
                  className={
                    card.positive
                      ? styles.green
                      : styles.red
                  }
                >
                  {card.sub}
                </span>
              </div>

              <h3 className={styles.statValue}>
                {card.value}
              </h3>

              <p className={styles.statTitle}>
                {card.title}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className={styles.mainGrid}>
        {/* LEFT */}
        <div className={styles.leftCol}>
          {/* MAIN CHART */}
          <motion.div
            className={styles.chartCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.chartHeader}>
              <div>
                <h2 className={styles.stockName}>
                  {selectedSym}
                </h2>

                <div
                  className={styles.stockPrice}
                >
                  <span>
                    {formatINR(
                      selectedStock?.price || 0
                    )}
                  </span>

                  <span
                    className={colorClass(
                      selectedStock?.changePct
                    )}
                  >
                    {arrowPrefix(
                      selectedStock?.changePct
                    )}

                    {formatPct(
                      selectedStock?.changePct
                    )}
                  </span>
                </div>
              </div>

              <div
                className={
                  styles.timeframeWrap
                }
              >
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    onClick={() =>
                      setTimeframe(tf)
                    }
                    className={`${
                      styles.tfBtn
                    } ${
                      timeframe === tf
                        ? styles.tfActive
                        : ''
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <StockChart
              data={
                chartData.data.length
                  ? chartData.data
                  : fallbackData
              }
              labels={chartData.labels}
              color={
                selectedStock?.changePct >= 0
                  ? '#00d4aa'
                  : '#ff4757'
              }
              height={300}
            />
          </motion.div>

          {/* MARKET HEATMAP */}
          <motion.div
            className={styles.heatmapCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className={styles.sectionHeader}
            >
              <h3>Market Heatmap</h3>

              <span>
                NSE Top Movers
              </span>
            </div>

            <div className={styles.heatmap}>
              {stocks.slice(0, 10).map((s) => {
                const up =
                  s.changePct >= 0;

                return (
                  <div
                    key={s.symbol}
                    className={
                      styles.heatCell
                    }
                    style={{
                      background: up
                        ? 'rgba(0,212,170,0.14)'
                        : 'rgba(255,71,87,0.14)',
                    }}
                    onClick={() =>
                      setSelectedSym(
                        s.symbol
                      )
                    }
                  >
                    <strong>
                      {s.symbol}
                    </strong>

                    <span
                      className={
                        up
                          ? styles.green
                          : styles.red
                      }
                    >
                      {up ? '+' : ''}
                      {(
                        s.changePct || 0
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className={styles.rightCol}>
          {/* WATCHLIST */}
          <motion.div
            className={styles.watchlist}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <div
              className={styles.sectionHeader}
            >
              <h3>Watchlist</h3>

              <span>Live</span>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              stocks
                .slice(0, 6)
                .map((stock) => {
                  const up =
                    stock.changePct >= 0;

                  const spark =
                    generateSparkline(
                      stock.price,
                      0.007
                    );

                  return (
                    <div
                      key={stock.symbol}
                      className={
                        styles.watchItem
                      }
                      onClick={() => {
                        setSelectedSym(
                          stock.symbol
                        );

                        setTradeStock(
                          stock
                        );
                      }}
                    >
                      <div>
                        <h4>
                          {stock.symbol}
                        </h4>

                        <p>
                          {stock.name?.slice(
                            0,
                            18
                          )}
                        </p>
                      </div>

                      <div
                        className={
                          styles.watchRight
                        }
                      >
                        <svg
                          width="50"
                          height="28"
                        >
                          <polyline
                            points={spark
                              .map(
                                (
                                  v,
                                  i
                                ) => {
                                  const min =
                                    Math.min(
                                      ...spark
                                    );

                                  const max =
                                    Math.max(
                                      ...spark
                                    );

                                  const x =
                                    (i /
                                      (
                                        spark.length -
                                        1
                                      )) *
                                    48;

                                  const y =
                                    26 -
                                    ((v -
                                      min) /
                                      (max -
                                        min ||
                                        1)) *
                                      24;

                                  return `${x},${y}`;
                                }
                              )
                              .join(
                                ' '
                              )}
                            fill="none"
                            stroke={
                              up
                                ? '#00d4aa'
                                : '#ff4757'
                            }
                            strokeWidth="2"
                          />
                        </svg>

                        <div>
                          <strong>
                            {formatINR(
                              stock.price,
                              0
                            )}
                          </strong>

                          <p
                            className={
                              up
                                ? styles.green
                                : styles.red
                            }
                          >
                            {up
                              ? '+'
                              : ''}
                            {(
                              stock.changePct ||
                              0
                            ).toFixed(
                              2
                            )}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </motion.div>

          {/* QUICK TRADE */}
          {tradeStock && (
            <motion.div
              className={
                styles.tradeCard
              }
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              <div
                className={
                  styles.tradeTop
                }
              >
                <h3>
                  {tradeStock.symbol}
                </h3>

                <span>
                  {formatINR(
                    tradeStock.price
                  )}
                </span>
              </div>

              <button
                className={
                  styles.buyBtn
                }
              >
                <TrendingUp
                  size={15}
                />

                Buy Stock
              </button>

              <button
                className={
                  styles.sellBtn
                }
              >
                <TrendingDown
                  size={15}
                />

                Sell Stock
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* TRADE MODAL */}
      {tradeStock && (
        <TradeModal
          stock={tradeStock}
          onClose={() =>
            setTradeStock(null)
          }
        />
      )}
    </div>
  );
}