const axios = require("axios");

const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`
    );

    return {
      currentPrice: response.data.c,
      change: response.data.d,
      percentChange: response.data.dp,
      high: response.data.h,
      low: response.data.l,
      open: response.data.o,
      previousClose: response.data.pc,
      timestamp: response.data.t,
    };
  } catch (error) {
    console.error("Finnhub API Error:", error.message);
    throw error;
  }
};

module.exports = {
  fetchStockData,
};