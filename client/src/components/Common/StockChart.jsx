import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function StockChart({ data = [], labels = [], color = '#00d4aa', height = 260, type = 'line', showAxes = true }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    const ctx = canvasRef.current.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, color + '44');
    grad.addColorStop(1, color + '00');

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: type === 'line' ? grad : data.map(v => v >= 0 ? 'rgba(0,212,170,0.7)' : 'rgba(255,71,87,0.7)'),
          borderWidth: type === 'line' ? 2 : 1,
          tension: 0.4,
          pointRadius: 0,
          fill: type === 'line',
          borderRadius: type === 'bar' ? 4 : 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: 'rgba(13,18,32,0.95)',
          borderColor: 'rgba(30,45,74,0.8)',
          borderWidth: 1,
          titleColor: '#94a3b8',
          bodyColor: '#e2e8f4',
          padding: 10,
          callbacks: {
            label: (ctx) => ` ₹${Number(ctx.raw).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          },
        }},
        scales: {
          x: {
            display: showAxes,
            ticks: { color: '#6b7a9a', font: { size: 10, family: 'JetBrains Mono' }, maxTicksLimit: 6 },
            grid:  { color: 'rgba(30,45,74,0.5)' },
          },
          y: {
            display: showAxes,
            ticks: { color: '#6b7a9a', font: { size: 10, family: 'JetBrains Mono' }, callback: v => '₹' + v.toLocaleString('en-IN') },
            grid:  { color: 'rgba(30,45,74,0.5)' },
          },
        },
      },
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, labels, color, height, type, showAxes]);

  return <canvas ref={canvasRef} style={{ height }} />;
}
