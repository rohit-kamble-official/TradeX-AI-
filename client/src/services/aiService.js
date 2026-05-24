import api from './api';

export const chatWithAI = async (message, history = []) => {
  const { data } = await api.post('/ai/chat', { message, history });
  return data;
};

export const predictStock = async (symbol) => {
  const { data } = await api.post('/ai/predict', { symbol });
  return data;
};

export const analyzePortfolio = async () => {
  const { data } = await api.post('/ai/analyze');
  return data;
};
