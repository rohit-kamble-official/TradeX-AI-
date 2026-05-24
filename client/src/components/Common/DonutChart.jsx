import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const COLORS = ['#00d4aa','#4f8bff','#f7931a','#ff4757','#a855f7','#06b6d4','#eab308','#10b981'];

export default function DonutChart({ data = [], labels = [], size = 200 }) {
  const ref = useRef(null);
  const ch  = useRef(null);

  useEffect(() => {
    if (!ref.current || !data.length) return;
    if (ch.current) ch.current.destroy();
    ch.current = new Chart(ref.current.getContext('2d'), {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: COLORS.slice(0, data.length), borderWidth: 0, hoverOffset: 8 }] },
      options: {
        responsive: false,
        cutout: '72%',
        animation: { animateRotate: true, duration: 600 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,18,32,0.95)',
            borderColor: 'rgba(30,45,74,0.8)',
            borderWidth: 1,
            bodyColor: '#e2e8f4',
            padding: 10,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toFixed(1)}%`,
            },
          },
        },
      },
    });
    return () => { if (ch.current) ch.current.destroy(); };
  }, [data, labels]);

  const total = data.reduce((a, b) => a + b, 0);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <canvas ref={ref} width={size} height={size} />
      {/* Center label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Holdings</div>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--mono)' }}>{data.length}</div>
      </div>
    </div>
  );
}

export { COLORS };
