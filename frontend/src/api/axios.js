import axios from 'axios'

// 프로덕션(Vercel 동일 도메인): VITE_API_BASE_URL=""  → baseURL="" → 상대 경로 /api/*
// 로컬 개발(.env.local):         VITE_API_BASE_URL="http://localhost:8012" 사용
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

export default api
