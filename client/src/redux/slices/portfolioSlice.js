import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPortfolio = createAsyncThunk('portfolio/fetch',   async () => { const { data } = await api.get('/portfolio'); return data.portfolio; });
export const fetchSummary   = createAsyncThunk('portfolio/summary', async () => { const { data } = await api.get('/portfolio/summary'); return data.summary; });
export const buyStock       = createAsyncThunk('portfolio/buy',     async (body, { rejectWithValue }) => { try { const { data } = await api.post('/trade/buy',  body); return data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const sellStock      = createAsyncThunk('portfolio/sell',    async (body, { rejectWithValue }) => { try { const { data } = await api.post('/trade/sell', body); return data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const fetchOrders    = createAsyncThunk('portfolio/orders',  async (params = {}) => { const { data } = await api.get('/orders', { params }); return data; });

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: { portfolio: null, summary: null, orders: [], totalOrders: 0, loading: false, tradeLoading: false, error: null },
  reducers: { clearError(state) { state.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchPortfolio.pending,   (s) => { s.loading = true; });
    b.addCase(fetchPortfolio.fulfilled, (s, a) => { s.portfolio = a.payload; s.loading = false; });
    b.addCase(fetchSummary.fulfilled,   (s, a) => { s.summary   = a.payload; });
    b.addCase(fetchOrders.fulfilled,    (s, a) => { s.orders = a.payload.orders; s.totalOrders = a.payload.total; });
    b.addCase(buyStock.pending,   (s) => { s.tradeLoading = true;  s.error = null; });
    b.addCase(sellStock.pending,  (s) => { s.tradeLoading = true;  s.error = null; });
    b.addCase(buyStock.fulfilled, (s) => { s.tradeLoading = false; });
    b.addCase(sellStock.fulfilled,(s) => { s.tradeLoading = false; });
    b.addCase(buyStock.rejected,  (s, a) => { s.tradeLoading = false; s.error = a.payload; });
    b.addCase(sellStock.rejected, (s, a) => { s.tradeLoading = false; s.error = a.payload; });
  },
});

export const { clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
