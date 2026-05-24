import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try { const { data } = await api.post('/auth/login', creds); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const register = createAsyncThunk('auth/register', async (body, { rejectWithValue }) => {
  try { const { data } = await api.post('/auth/register', body); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const getMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/auth/me'); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const updateProfile = createAsyncThunk('auth/update', async (body, { rejectWithValue }) => {
  try { const { data } = await api.put('/auth/update-profile', body); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const storedUser = localStorage.getItem('tradex_user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    storedUser ? JSON.parse(storedUser) : null,
    token:   localStorage.getItem('tradex_token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user = null; state.token = null;
      localStorage.removeItem('tradex_token');
      localStorage.removeItem('tradex_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (b) => {
    const handle = (thunk) => {
      b.addCase(thunk.pending,   (s) => { s.loading = true; s.error = null; });
      b.addCase(thunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
      b.addCase(thunk.fulfilled, (s, a) => {
        s.loading = false;
        if (a.payload?.token) {
          s.token = a.payload.token;
          s.user  = a.payload.user;
          localStorage.setItem('tradex_token', a.payload.token);
          localStorage.setItem('tradex_user',  JSON.stringify(a.payload.user));
        }
        if (a.payload?.user) s.user = a.payload.user;
      });
    };
    handle(login); handle(register); handle(getMe); handle(updateProfile);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
