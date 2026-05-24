import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchStocks  = createAsyncThunk('stocks/all',     async (params = {}) => { const { data } = await api.get('/stocks', { params }); return data.stocks; });
export const fetchStock   = createAsyncThunk('stocks/one',     async (sym) => { const { data } = await api.get(`/stocks/${sym}`); return data.stock; });
export const fetchHistory = createAsyncThunk('stocks/history', async ({ sym, period }) => { const { data } = await api.get(`/stocks/${sym}/history`, { params: { period } }); return { sym, history: data.history }; });
export const fetchGainers = createAsyncThunk('stocks/gainers', async () => { const { data } = await api.get('/stocks/gainers'); return data.stocks; });
export const fetchLosers  = createAsyncThunk('stocks/losers',  async () => { const { data } = await api.get('/stocks/losers');  return data.stocks; });

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    list: [], selected: null, history: {}, gainers: [], losers: [],
    loading: false, error: null,
  },
  reducers: {
    updatePrices(state, { payload }) {
      payload.forEach(({ symbol, price, changePct, change }) => {
        const s = state.list.find(x => x.symbol === symbol);
        if (s) { s.price = price; s.changePct = changePct; s.change = change; }
        if (state.selected?.symbol === symbol) {
          state.selected.price = price;
          state.selected.changePct = changePct;
          state.selected.change = change;
        }
      });
    },
    selectStock(state, { payload }) { state.selected = payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchStocks.pending,    (s) => { s.loading = true; });
    b.addCase(fetchStocks.rejected,   (s, a) => { s.loading = false; s.error = a.error.message; });
    b.addCase(fetchStocks.fulfilled,  (s, a) => { s.list = a.payload; s.loading = false; });
    b.addCase(fetchStock.fulfilled,   (s, a) => { s.selected = a.payload; });
    b.addCase(fetchHistory.fulfilled, (s, a) => { s.history[a.payload.sym] = a.payload.history; });
    b.addCase(fetchGainers.fulfilled, (s, a) => { s.gainers = a.payload; });
    b.addCase(fetchLosers.fulfilled,  (s, a) => { s.losers  = a.payload; });
  },
});

export const { updatePrices, selectStock } = stockSlice.actions;
export default stockSlice.reducer;
