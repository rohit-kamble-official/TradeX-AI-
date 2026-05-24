# TradeX AI 🚀
### AI-Powered Stock Trading Simulation Platform

A production-grade, full-stack fintech application inspired by Zerodha with real-time market simulation, AI trading advisor, advanced analytics, and portfolio management.

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Redux Toolkit, Framer Motion, Chart.js |
| Backend    | Node.js, Express.js, Socket.io |
| Database   | MongoDB + Mongoose |
| Auth       | JWT + bcryptjs |
| AI         | OpenAI GPT-4o-mini |
| Real-time  | Socket.io WebSocket |
| Security   | Helmet, Rate Limiting, Mongo Sanitize |

---

## 📁 Project Structure

```
tradex-ai/
├── client/                      # React frontend
│   └── src/
│       ├── components/
│       │   ├── Layout/          # AppLayout (sidebar + topbar)
│       │   └── Common/          # StockChart, DonutChart, TradeModal
│       ├── pages/               # All 9 page components
│       ├── redux/slices/        # Auth, Stock, Portfolio, UI slices
│       ├── services/            # api.js, socket.js, aiService.js
│       └── utils/helpers.js     # Formatters, utilities
│
└── server/                      # Express backend
    ├── controllers/             # Auth, Stock, Trade, Portfolio, AI, etc.
    ├── models/                  # User, Stock, Order, Portfolio, Watchlist
    ├── routes/                  # All API routes
    ├── middleware/auth.js        # JWT protect middleware
    ├── services/marketSimulator # Live price simulation engine
    └── sockets/marketSocket.js  # Socket.io handler
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourname/tradex-ai.git
cd tradex-ai
npm run install:all
```

### 2. Configure Environment

**Server** — copy `server/.env.example` to `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/tradex
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=http://localhost:3000
```

**Client** — `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Run Development

```bash
npm run dev   # Starts both client (3000) and server (5000)
```

### 4. Production Build

```bash
npm run build   # Builds React app
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/update-profile` | Update profile |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | All stocks (with search/filter) |
| GET | `/api/stocks/:symbol` | Single stock details |
| GET | `/api/stocks/:symbol/history` | Price history |
| GET | `/api/stocks/gainers` | Top gainers |
| GET | `/api/stocks/losers` | Top losers |

### Trading
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trade/buy` | Buy stocks |
| POST | `/api/trade/sell` | Sell stocks |
| GET  | `/api/orders` | Order history |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Full portfolio with live P&L |
| GET | `/api/portfolio/summary` | Quick summary stats |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | AI trading advisor chat |
| POST | `/api/ai/predict` | Stock price prediction |
| POST | `/api/ai/analyze` | Portfolio analysis |

---

## 🌟 Features

### 7 Full Pages
- **Dashboard** — Stats, live Nifty chart, watchlist, heatmap, buy/sell panel, AI risk meter
- **Trading** — Stock list, candlestick charts, market depth, quick trade panel
- **Portfolio** — Allocation donut, P&L history, holdings table with live returns
- **Markets** — Index cards, gainers/losers, sector performance, full stock table
- **AI Advisor** — Real chat with GPT-4, AI predictions, portfolio analysis
- **Orders** — Full order history with filters and status badges
- **News** — Market news feed with AI sentiment analysis
- **Profile** — User settings, risk profile, KYC, security, preferences

### Real-Time Engine
- Market prices update every 5 seconds via Socket.io
- Live ticker in topbar with all stock symbols
- Portfolio P&L updates automatically

### AI Features
- GPT-4o-mini powered chat advisor (with fallback responses)
- Stock buy/sell/hold signal predictions with confidence scores
- Portfolio diversification analysis
- News sentiment classification (Bullish/Bearish/Neutral)

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client && npm run build
# Upload build/ to Vercel or connect GitHub repo
```

### Backend → Render / Railway
```bash
# Set environment variables in dashboard
# Deploy server/ directory
# Start command: node server.js
```

### Database → MongoDB Atlas
- Create free cluster at mongodb.com/atlas
- Whitelist all IPs (0.0.0.0/0) for production
- Copy connection string to MONGO_URI

---

## 📄 License

MIT License — Free for personal & educational use.

> ⚠️ **Disclaimer:** TradeX AI is a simulation platform for educational purposes only. It does not provide real financial advice. Virtual money is used — no real funds are involved.
