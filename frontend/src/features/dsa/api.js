import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const fetchTopics = (level) => axios.get(`${BACKEND}/api/dsa/topics/${level}`);
export const fetchQuestions = (level, topic = '', searchQuery = '') =>
  axios.get(`${BACKEND}/api/dsa/questions/${level}`, { params: { topic, searchQuery }});
export const fetchQuestionById = (id) => axios.get(`${BACKEND}/api/dsa/question/${id}`);
export const submitSolution = (payload, token) =>
  axios.post(`${BACKEND}/api/dsa/submit`, payload, { headers: { Authorization: `Bearer ${token}` } });
export const fetchProgress = (token) =>
  axios.get(`${BACKEND}/api/dsa/progress`, { headers: { Authorization: `Bearer ${token}` } });
