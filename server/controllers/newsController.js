const axios = require('axios');

// Simulated news (use Finnhub in production)
const sampleNews = [
  { id: 1, headline: 'RBI keeps repo rate unchanged at 6.5%, signals cautious optimism', source: 'Economic Times', datetime: Date.now() - 7200000, sentiment: 'bullish', category: 'macro' },
  { id: 2, headline: 'Reliance Industries Q3 profit surges 18% YoY, beats estimates', source: 'Mint', datetime: Date.now() - 10800000, sentiment: 'bullish', category: 'earnings' },
  { id: 3, headline: 'IT sector faces headwinds amid global tech spending slowdown', source: 'Business Standard', datetime: Date.now() - 18000000, sentiment: 'bearish', category: 'sector' },
  { id: 4, headline: 'FII net inflows cross ₹3,200 Crore in equity markets today', source: 'CNBC TV18', datetime: Date.now() - 21600000, sentiment: 'bullish', category: 'flow' },
  { id: 5, headline: 'Adani Group stocks rally 4-7% after strong Q2 earnings', source: 'Bloomberg Quint', datetime: Date.now() - 28800000, sentiment: 'bullish', category: 'earnings' },
  { id: 6, headline: 'Crude oil at $78/barrel — impact on Indian markets', source: 'Reuters', datetime: Date.now() - 32400000, sentiment: 'neutral', category: 'commodity' },
  { id: 7, headline: 'SEBI tightens F&O regulations to curb retail investor losses', source: 'Financial Express', datetime: Date.now() - 36000000, sentiment: 'neutral', category: 'regulatory' },
  { id: 8, headline: 'Nifty IT index gains 2.4% on strong US tech earnings', source: 'Moneycontrol', datetime: Date.now() - 43200000, sentiment: 'bullish', category: 'sector' },
];

exports.getNews = async (req, res, next) => {
  try {
    const { category, sentiment, limit = 20 } = req.query;
    let news = sampleNews;
    if (category)  news = news.filter(n => n.category === category);
    if (sentiment) news = news.filter(n => n.sentiment === sentiment);

    // Try Finnhub API if key exists
    if (process.env.FINNHUB_KEY) {
      try {
        const r = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_KEY}`);
        news = r.data.slice(0, Number(limit));
      } catch(e) { /* fallback to sample */ }
    }

    const bullish = news.filter(n => n.sentiment === 'bullish').length;
    const bearish = news.filter(n => n.sentiment === 'bearish').length;

    res.json({
      success: true,
      total: news.length,
      sentiment: { bullish, bearish, neutral: news.length - bullish - bearish },
      news: news.slice(0, Number(limit))
    });
  } catch (err) { next(err); }
};
