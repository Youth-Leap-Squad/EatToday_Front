// src/api/http.js
import axios from 'axios';

function attachAuth(instance) {
  instance.interceptors.request.use((config) => {
    const raw =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('Authorization')
    if (raw) {
      const token = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`
      config.headers.Authorization = token
    }
    return config
  })
  return instance
}

export const queryApi = attachAuth(axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
}))

export const commandApi = attachAuth(axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
}))

export async function fetchReviewsByBoard(boardNoOrOptions) {
  const params = normalizeBoardParams(boardNoOrOptions)
  try {
    const { data } = await queryApi.get('/query/photo-reviews/latest', { params })
    return data
  } catch (err) {
    if (err?.response?.status === 404) {
      const { data } = await queryApi.get('/photoReview/date', { params })
      return data
    }
    throw err
  }
}