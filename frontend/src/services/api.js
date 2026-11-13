import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 60000,
});

export const api = {
  async checkHealth() {
    const res = await client.get('/health');
    return res.data;
  },

  async analyzeReport(file, userId = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }
    const res = await client.post('/reports/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getSampleReport(type = 'cbc') {
    const res = await client.get(`/reports/sample?report_type=${encodeURIComponent(type)}`);
    return res.data;
  },

  async askReportQuestion(message, reportContext, history = []) {
    const res = await client.post('/chat/ask', {
      message,
      report_context: reportContext,
      history,
    });
    return res.data;
  },
};
