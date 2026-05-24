// Format Indian Rupee
export const formatINR = (val, decimals = 2) => {
  if (val === undefined || val === null) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format large numbers (crores/lakhs)
export const formatCrore = (val) => {
  if (!val) return '0';
  if (val >= 1e7) return (val / 1e7).toFixed(2) + ' Cr';
  if (val >= 1e5) return (val / 1e5).toFixed(2) + ' L';
  return val.toLocaleString('en-IN');
};

// Format percentage
export const formatPct = (val) => {
  if (val === undefined || val === null) return '0%';
  const sign = val >= 0 ? '+' : '';
  return sign + Number(val).toFixed(2) + '%';
};

// Color based on value
export const colorClass = (val) => (val >= 0 ? 'text-green' : 'text-red');

// Arrow prefix
export const arrowPrefix = (val) => (val >= 0 ? '▲' : '▼');

// Time ago
export const timeAgo = (ts) => {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)   return Math.round(diff) + 's ago';
  if (diff < 3600) return Math.round(diff / 60) + 'm ago';
  if (diff < 86400)return Math.round(diff / 3600) + 'h ago';
  return Math.round(diff / 86400) + 'd ago';
};

// Generate fake sparkline data
export const generateSparkline = (base, volatility = 0.02, points = 12) => {
  const arr = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += v * (Math.random() - 0.49) * volatility;
    arr.push(+v.toFixed(2));
  }
  return arr;
};

// Truncate text
export const truncate = (str, n = 50) => (str?.length > n ? str.slice(0, n) + '…' : str);

// Debounce
export const debounce = (fn, ms) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
};
