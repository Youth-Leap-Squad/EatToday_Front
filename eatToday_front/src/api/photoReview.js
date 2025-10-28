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

export async function fetchMyPhotoReviews({ page = 0, size = 6, token }) {
  const res = await fetch(`/photoReview/member/me?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('내 리뷰 조회 실패');
  return res.json();
}

export async function fetchUserPhotoReviews({ memberNo, page = 0, size = 6, token }) {
  const url = `/photoReview/member?memberNo=${memberNo}&page=${page}&size=${size}`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error('특정 사용자 리뷰 조회 실패');
  return res.json();
}