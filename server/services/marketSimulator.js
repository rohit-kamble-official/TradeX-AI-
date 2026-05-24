const Stock = require('../models/Stock');

// NSE top stocks with realistic data
const STOCKS = [
  { symbol: 'RELIANCE',   name: 'Reliance Industries Ltd',    sector: 'Energy',    price: 2847,  marketCap: 19200000, pe: 24.2 },
  { symbol: 'TCS',        name: 'Tata Consultancy Services',  sector: 'IT',        price: 3921,  marketCap: 14200000, pe: 31.4 },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank Ltd',              sector: 'Banking',   price: 1724,  marketCap: 13100000, pe: 19.4 },
  { symbol: 'INFY',       name: 'Infosys Ltd',                sector: 'IT',        price: 1756,  marketCap: 7300000,  pe: 26.1 },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank Ltd',             sector: 'Banking',   price: 1142,  marketCap: 8010000,  pe: 17.2 },
  { symbol: 'WIPRO',      name: 'Wipro Ltd',                  sector: 'IT',        price: 522,   marketCap: 2730000,  pe: 21.3 },
  { symbol: 'ITC',        name: 'ITC Ltd',                    sector: 'FMCG',      price: 447,   marketCap: 5580000,  pe: 27.1 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd',          sector: 'NBFC',      price: 7240,  marketCap: 4370000,  pe: 38.2 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd',     sector: 'FMCG',      price: 2380,  marketCap: 5590000,  pe: 52.1 },
  { symbol: 'SBIN',       name: 'State Bank of India',        sector: 'Banking',   price: 778,   marketCap: 6940000,  pe: 9.8  },
  { symbol: 'KOTAKBANK',  name: 'Kotak Mahindra Bank',        sector: 'Banking',   price: 1892,  marketCap: 3760000,  pe: 23.4 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd',           sector: 'Consumer',  price: 2650,  marketCap: 2540000,  pe: 55.3 },
  { symbol: 'MARUTI',     name: 'Maruti Suzuki India',        sector: 'Auto',      price: 11250, marketCap: 3410000,  pe: 30.2 },
  { symbol: 'SUNPHARMA',  name: 'Sun Pharmaceutical',         sector: 'Pharma',    price: 1620,  marketCap: 3890000,  pe: 35.7 },
  { symbol: 'NTPC',       name: 'NTPC Ltd',                   sector: 'Energy',    price: 368,   marketCap: 3570000,  pe: 16.4 },
];

let initialized = false;

// Seed stocks into DB on first run
async function initStocks() {
  if (initialized) return;
  initialized = true;
  for (const s of STOCKS) {
    await Stock.findOneAndUpdate(
      { symbol: s.symbol },
      { ...s, open: s.price, high: s.price * 1.02, low: s.price * 0.98, close: s.price, prevClose: s.price * 0.99, volume: Math.round(Math.random() * 10000000), high52w: s.price * 1.25, low52w: s.price * 0.75 },
      { upsert: true, new: true }
    );
  }
  console.log('✅ Stock data seeded');
}

// Called every 5 seconds by cron
async function simulateMarket(io) {
  try {
    await initStocks();
    const stocks = await Stock.find({});
    const updates = [];

    for (const stock of stocks) {
      const volatility = 0.002 + Math.random() * 0.003;
      const direction  = Math.random() > 0.48 ? 1 : -1;
      const change     = stock.price * volatility * direction;
      const newPrice   = +(stock.price + change).toFixed(2);

      // Keep price in reasonable range
      if (newPrice < stock.low52w || newPrice > stock.high52w) continue;

      const changePct  = +((newPrice - stock.prevClose) / stock.prevClose * 100).toFixed(2);

      await Stock.findByIdAndUpdate(stock._id, {
        price:    newPrice,
        change:   +(newPrice - stock.prevClose).toFixed(2),
        changePct,
        high:     Math.max(stock.high, newPrice),
        low:      Math.min(stock.low,  newPrice),
        volume:   stock.volume + Math.round(Math.random() * 1000),
        $push: { priceHistory: { $each: [{ price: newPrice }], $slice: -500 } },
        updatedAt: new Date()
      });

      updates.push({ symbol: stock.symbol, price: newPrice, change: +(newPrice - stock.prevClose).toFixed(2), changePct });
    }

    // Emit to all connected clients
    if (updates.length) io.emit('price_update', updates);
  } catch (err) {
    console.error('Market simulation error:', err.message);
  }
}

module.exports = { simulateMarket, initStocks };
