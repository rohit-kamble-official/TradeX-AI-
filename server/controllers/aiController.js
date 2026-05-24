const OpenAI = require('openai');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are TradeX AI — an expert financial advisor and stock market analyst for the Indian stock market (NSE/BSE). You:
- Speak professionally yet accessibly, like a seasoned broker who can explain things to beginners
- Provide data-driven insights about Indian stocks, indices (Nifty 50, Sensex, Bank Nifty), sectors
- Explain technical indicators (RSI, MACD, Bollinger Bands, moving averages) clearly
- Always mention risk warnings — never guarantee returns
- Suggest diversified portfolio strategies based on user risk profiles
- Analyze market sentiment and news impact
- Keep responses concise (under 200 words unless asked for detailed analysis)
- Format responses with emojis for visual clarity
- Always end with a disclaimer: "This is not financial advice. Invest responsibly."`;

// POST /api/ai/chat
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    // Build conversation
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.json({ success: true, reply, tokens: response.usage });
  } catch (err) {
    // Fallback if OpenAI unavailable
    const reply = generateFallbackReply(req.body.message);
    res.json({ success: true, reply, fallback: true });
  }
};

// POST /api/ai/predict
exports.predict = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    const stock = await Stock.findOne({ symbol: symbol?.toUpperCase() });
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });

    // Simple momentum-based prediction simulation
    const rsi = 30 + Math.random() * 40;
    const macd = (Math.random() - 0.4) * 5;
    const volumeRatio = 0.8 + Math.random() * 1.5;
    const trend = stock.changePct > 0 ? 1 : -1;

    const bullishScore = (
      (rsi < 70 ? 1 : 0) * 20 +
      (macd > 0  ? 1 : 0) * 25 +
      (volumeRatio > 1 ? 1 : 0) * 20 +
      (trend > 0 ? 1 : 0) * 20 +
      Math.random() * 15
    );

    const signal = bullishScore > 60 ? 'BUY' : bullishScore > 40 ? 'HOLD' : 'SELL';
    const confidence = Math.round(45 + Math.random() * 40);
    const targetPrice = stock.price * (1 + (bullishScore / 100 - 0.4) * 0.15);

    res.json({
      success: true,
      prediction: {
        symbol: stock.symbol,
        currentPrice: stock.price,
        signal,
        confidence,
        targetPrice: +targetPrice.toFixed(2),
        indicators: {
          rsi: +rsi.toFixed(1),
          macd: +macd.toFixed(2),
          volumeRatio: +volumeRatio.toFixed(2),
          trend: trend > 0 ? 'Bullish' : 'Bearish',
          support: +(stock.price * 0.97).toFixed(2),
          resistance: +(stock.price * 1.04).toFixed(2),
        },
        timeframe: '1 Week',
        disclaimer: 'AI predictions are for educational purposes only. Not financial advice.'
      }
    });
  } catch (err) { next(err); }
};

// POST /api/ai/analyze - Analyze portfolio
exports.analyzePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio?.holdings.length)
      return res.json({ success: true, analysis: { message: 'No holdings to analyze yet.' } });

    const symbols = portfolio.holdings.map(h => h.symbol).join(', ');
    const prompt = `Analyze this Indian stock portfolio: ${symbols}. 
    Total invested: ₹${portfolio.totalInvested.toFixed(0)}. 
    Current value: ₹${portfolio.currentValue.toFixed(0)}.
    P&L: ₹${portfolio.totalPnl.toFixed(0)} (${portfolio.totalPnlPct.toFixed(2)}%).
    Provide: 1) Diversification assessment 2) Risk level 3) Top recommendation 4) Rebalancing suggestion.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: prompt }],
        max_tokens: 400
      });
      res.json({ success: true, analysis: response.choices[0].message.content });
    } catch {
      res.json({ success: true, analysis: generatePortfolioInsight(portfolio), fallback: true });
    }
  } catch (err) { next(err); }
};

// Fallback AI responses (when OpenAI unavailable)
function generateFallbackReply(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('reliance') || m.includes('ril')) return '📈 Reliance Industries (RIL) is a diversified conglomerate with strong presence in telecom (Jio), retail, and energy. Current momentum is positive driven by Jio subscriber growth. Analysts have a 12-month target of ₹3,200. RSI around 62 — not overbought. Consider accumulating on dips near ₹2,750 support. ⚠️ Not financial advice. Invest responsibly.';
  if (m.includes('rsi')) return '📊 RSI (Relative Strength Index) measures price momentum on a 0-100 scale. Above 70 = overbought (potential sell signal). Below 30 = oversold (potential buy). 40-60 = neutral zone. Use 14-period RSI as default. Pro tip: RSI divergence (price vs RSI moving opposite) is a powerful signal. ⚠️ Not financial advice. Invest responsibly.';
  if (m.includes('nifty') || m.includes('market')) return '🔮 Nifty 50 is showing bullish momentum with key support at 24,600. Resistance at 25,100. FII buying continues to support the rally. Key events this week: RBI minutes, Q3 results. IT sector leading; FMCG underperforming. Suggested: stay invested, buy quality large-caps on dips. ⚠️ Not financial advice. Invest responsibly.';
  return '🤖 Great question! Based on current market conditions, I recommend focusing on quality large-cap stocks with strong fundamentals. Diversify across sectors — IT, Banking, FMCG, and Pharma. Keep 10-15% in cash for buying opportunities. Monitor FII flows and global cues. Would you like me to analyze a specific stock? ⚠️ Not financial advice. Invest responsibly.';
}

function generatePortfolioInsight(portfolio) {
  const pct = portfolio.totalPnlPct;
  return `📊 Portfolio Analysis:\n\n✅ Holdings: ${portfolio.holdings.length} stocks\n${pct >= 0 ? '📈' : '📉'} Overall P&L: ${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%\n\n💡 Recommendations:\n1. Diversification looks ${portfolio.holdings.length >= 5 ? 'good' : 'limited — add more stocks'}\n2. Consider adding defensive stocks (FMCG/Pharma) if not present\n3. Review underperformers quarterly\n4. Maintain SIP discipline for long-term wealth creation\n\n⚠️ Not financial advice. Invest responsibly.`;
}
