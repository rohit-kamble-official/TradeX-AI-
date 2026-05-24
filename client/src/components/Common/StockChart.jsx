import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function StockChart({
  data = [],
  labels = [],
  color = '#00d4aa',
  height = 320,
  type = 'line',
  showAxes = true,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const ctx = canvasRef.current.getContext('2d');

    /* GRADIENT */
    const gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      height
    );

    gradient.addColorStop(
      0,
      color + '55'
    );

    gradient.addColorStop(
      0.5,
      color + '15'
    );

    gradient.addColorStop(
      1,
      color + '00'
    );

    /* DESTROY OLD CHART */
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    /* CREATE CHART */
    chartRef.current = new Chart(ctx, {
      type,

      data: {
        labels,

        datasets: [
          {
            data,

            borderColor: color,

            backgroundColor:
              type === 'line'
                ? gradient
                : data.map((v) =>
                    v >= 0
                      ? 'rgba(0,212,170,0.75)'
                      : 'rgba(255,71,87,0.75)'
                  ),

            borderWidth:
              type === 'line'
                ? 2.5
                : 1,

            fill:
              type === 'line',

            tension: 0.42,

            pointRadius: 0,

            pointHoverRadius: 5,

            pointHoverBorderWidth: 2,

            pointHoverBackgroundColor:
              '#ffffff',

            pointHoverBorderColor:
              color,

            borderRadius:
              type === 'bar'
                ? 8
                : 0,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        interaction: {
          intersect: false,
          mode: 'index',
        },

        animation: {
          duration: 800,
          easing: 'easeOutQuart',
        },

        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 6,
            right: 12,
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: true,

            backgroundColor:
              'rgba(13,18,32,0.96)',

            borderColor:
              'rgba(255,255,255,0.08)',

            borderWidth: 1,

            padding: 14,

            displayColors: false,

            titleColor: '#94a3b8',

            titleFont: {
              size: 11,
              weight: '600',
            },

            bodyColor: '#ffffff',

            bodyFont: {
              size: 14,
              weight: '700',
            },

            cornerRadius: 14,

            callbacks: {
              label: (ctx) =>
                `₹${Number(
                  ctx.raw
                ).toLocaleString(
                  'en-IN',
                  {
                    minimumFractionDigits: 2,
                  }
                )}`,
            },
          },
        },

        scales: {
          x: {
            display: showAxes,

            ticks: {
              color: '#64748b',

              maxTicksLimit: 6,

              font: {
                size: 10,
                family:
                  'JetBrains Mono',
              },
            },

            grid: {
              color:
                'rgba(255,255,255,0.04)',

              drawBorder: false,

              drawTicks: false,
            },

            border: {
              display: false,
            },
          },

          y: {
            display: showAxes,

            ticks: {
              color: '#64748b',

              font: {
                size: 10,
                family:
                  'JetBrains Mono',
              },

              callback: (v) =>
                '₹' +
                Number(v).toLocaleString(
                  'en-IN'
                ),
            },

            grid: {
              color:
                'rgba(255,255,255,0.04)',

              drawBorder: false,
            },

            border: {
              display: false,
            },
          },
        },

        elements: {
          line: {
            capBezierPoints: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [
    data,
    labels,
    color,
    height,
    type,
    showAxes,
  ]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
      }}
    >
      {/* GLOW EFFECT */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${color}22 0%, transparent 70%)`,
          filter: 'blur(60px)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      />
    </div>
  );
}