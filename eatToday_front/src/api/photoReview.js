import axios from 'axios'

const api = axios.create()

export async function searchPhotoReviews({ keyword = '', page = 0, size = 6 }) {
  const { data } = await api.get('/photoReview/search', { params: { keyword, page, size } })
  return data
}

export async function fetchPhotoReviewsByDate({ page = 0, size = 6 }) {
  const { data } = await api.get('/photoReview/date', { params: { page, size } })
  return data
}

export async function fetchPhotoReviewsByLike({ page = 0, size = 6 }) {
  const { data } = await api.get('/photoReview/like', { params: { page, size } })
  return data
}

export async function fetchPhotoReviewsByAlcohol({ alcoholNo, page = 0, size = 6 }) {
  const { data } = await api.get('/photoReview/alcohol', { params: { alcoholNo, page, size } })
  return data
}

export async function fetchPhotoReviewsByAlcoholLike({ alcoholNo, page = 0, size = 6 }) {
  const { data } = await api.get('/photoReview/alcohol/like', { params: { alcoholNo, page, size } })
  return data
}