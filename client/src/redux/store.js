import { configureStore } from '@reduxjs/toolkit';
import authReducer      from './slices/authSlice';
import stockReducer     from './slices/stockSlice';
import portfolioReducer from './slices/portfolioSlice';
import uiReducer        from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    stocks:    stockReducer,
    portfolio: portfolioReducer,
    ui:        uiReducer,
  },
});
