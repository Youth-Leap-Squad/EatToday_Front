import axios from 'axios'

const api = axios.create({
  baseURL: '/photoReview'
})

export async function searchPhotoReviews({ keyword = '', page = 0, size = 6 }) {
  const { data } = await api.get('/search', { params: { keyword, page, size } })
  return data
}

export async function fetchPhotoReviewsByDate({ page = 0, size = 6 }) {
  const { data } = await api.get('/date', { params: { page, size } })
  return data
}

export async function fetchPhotoReviewsByLike({ page = 0, size = 6 }) {
  const { data } = await api.get('/like', { params: { page, size } })
  return data
}

export async function fetchPhotoReviewsByAlcohol({ alcoholNo, page = 0, size = 6 }) {
  const { data } = await api.get('/alcohol', { params: { alcoholNo, page, size } })
  return data
}

export async function fetchPhotoReviewsByAlcoholLike({ alcoholNo, page = 0, size = 6 }) {
  const { data } = await api.get('/alcohol/like', { params: { alcoholNo, page, size } })
  return data
}