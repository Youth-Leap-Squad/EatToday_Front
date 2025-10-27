// src/api/post.js
import api from '@/api/index'

/* -------------------- 헬퍼 -------------------- */
/** 정렬 → 백엔드 경로 매핑 */
function listPathBySort(sort) {
  if (sort === 'view') return '/foods/sorted/views'
  if (sort === 'like') return '/foods/sorted/likes'
  if (sort === 'comment') return '/foods/sorted/comments'
  return '/foods/approved'
}

/** 본문 HTML에서 첫 번째 img src 추출 */
function firstImgFromHtml(html) {
  const m = (html || '').match(/<img[^>]+src=["']?([^"' >]+)["']?/i)
  return m?.[1] || ''
}

/** 이미지 URL 정규화
 * - 절대 URL: 그대로
 * - /images/... : Vite public 폴더 (그대로 사용)
 * - /src/assets/... : Vite 번들 URL로 변환
 * - /uploads/... : 프론트 → 프록시 → 백엔드 (상대경로 유지)
 * - 기타 상대경로: 업로드 기준으로 가정
 */
function resolveAssetUrl(u) {
  if (!u) return ''
  if (typeof u === 'string' && u.includes(',')) u = u.split(',')[0].trim()
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/images/')) return u
  if (u.startsWith('/src/assets/')) {
    try { return new URL(`./${u}`, import.meta.url).href } catch { return '' }
  }
  if (u.startsWith('/uploads/')) return u               // ✅ 상대경로 유지 → 프록시가 처리
  return `/uploads/${u.replace(/^\/+/, '')}`            // ✅ 기본도 상대경로
}

/** 백엔드 DTO → 프론트 표준 모델 */
function normalizeItem(x) {
  const id = x.id ?? x.boardNo ?? x.board_no ?? x.no
  const totalLikes =
    x.totalLikes != null
      ? Number(x.totalLikes)
      : Number(x.likesNo1 ?? x.likes_no_1 ?? 0) +
        Number(x.likesNo2 ?? x.likes_no_2 ?? 0) +
        Number(x.likesNo3 ?? x.likes_no_3 ?? 0) +
        Number(x.likesNo4 ?? x.likes_no_4 ?? 0)
  const views = Number(x.views ?? x.viewCount ?? x.boardSeq ?? 0)
  const rawCover =
    x.coverUrl ||
    x.mainImageUrl ||
    x.imageUrl ||
    x.foodPicture ||
    x.cover ||
    x.image ||
    firstImgFromHtml(x.content || x.boardContent || x.contentHtml)

  return {
    id,
    title: x.title ?? x.boardTitle ?? '(제목 없음)',
    subtitle: x.subtitle ?? x.foodExplain ?? '',
    author: x.author ?? x.writer ?? x.memberId ?? '익명',
    views,
    likes: totalLikes,
    comment: Number(x.comment ?? x.commentCount ?? 0),
    coverUrl: resolveAssetUrl(rawCover),
    avatar: resolveAssetUrl(x.avatar ?? x.authorAvatar ?? ''),
    content: x.content ?? x.boardContent ?? x.contentHtml ?? '',
    createdAt: x.createdAt ?? x.boardDate ?? null,
    approved: x.confirmedYn === 'T' || x.approved === true,
  }
}

/* -------------------- 공개 API (회원 모듈 스타일) -------------------- */

/** 목록 (정렬: view | like | comment | 기본=approved) */
export const fetchPosts = async ({ page = 0, size = 12, sort = 'view' } = {}) => {
  const path = listPathBySort(sort)
  const { data } = await api.get(path, { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 단건 조회 */
export const fetchPost = async (id) => {
  try {
    const r = await api.get(`/foods/${id}`)
    return normalizeItem(r.data)
  } catch (e) {
    // fallback: 리스트에서 찾아보기
    const { list } = await fetchPosts({ page: 0, size: 200, sort: 'view' })
    const found = list.find((it) => String(it.id) === String(id))
    if (!found) throw e
    return found
  }
}

/** 작성 (FormData: meta JSON + 이미지들) */
export const createPost = async ({
  category, // 사용 안하더라도 유지
  alcoholNo = 1,
  title,
  subtitle,
  contentHtml,
  mainImageFile,
  contentImageFiles = [],
}) => {
  const meta = {
    alcoholNo: Number(alcoholNo || 1),
    boardTitle: title ?? '',
    boardContent: contentHtml ?? '',
    foodExplain: subtitle ?? '',
  }
  const fd = new FormData()
  fd.append('meta', JSON.stringify(meta))
  if (mainImageFile instanceof File) fd.append('image', mainImageFile)
  contentImageFiles.filter(f => f instanceof File).forEach(f => fd.append('images', f))
  const { data } = await api.post('/command/foods', fd)
  return data
}

/** 수정 (FormData: meta JSON + 이미지들) */
export const updatePost = async (id, payload) => {
  const fd = new FormData()
  fd.append('meta', JSON.stringify(payload))
  const { data } = await api.patch(`/command/foods/${id}`, fd)
  return normalizeItem(data)
}

/** 삭제 */
export const deletePost = async (id) => {
  await api.delete(`/command/foods/${id}`)
  return true
}

/** 댓글 목록 */
export const fetchComments = async (boardNo) => {
  const { data } = await api.get(`/foods/${boardNo}/comments`)
  return Array.isArray(data) ? data : []
}

/** 반응 집계 */
export const fetchReactions = async (boardNo) => {
  const { data } = await api.get(`/foods/${boardNo}/reactions`)
  return Array.isArray(data) ? data : []
}

/** 즐겨찾기 추가/제거 */
export const addBookmark = async (folderId, boardNo) => {
  const { data } = await api.post('/command/bookmarks', { folderId, boardNo })
  return data
}
export const removeBookmark = async (folderId, boardNo) => {
  const { data } = await api.delete('/command/bookmarks', { params: { folderId, boardNo } })
  return data
}

/* -------------------- 관리자 전용 -------------------- */

/** 미승인 목록 */
export const fetchUnapprovedPosts = async ({ page = 0, size = 12 } = {}) => {
  const { data } = await api.get('/foods/unapproved', { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 전체 목록 (승인 여부 무관) */
export const fetchAllPosts = async ({ page = 0, size = 12 } = {}) => {
  const { data } = await api.get('/foods/all', { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 승인/반려 (ADMIN): PATCH /command/foods/{boardNo}/approve?approved=true|false */
export const approvePost = async (boardNo, approved = true) => {
  const { data } = await api.patch(`/command/foods/${boardNo}/approve`, null, { params: { approved } })
  return data
}

/** PostManagement.vue 호환 이름 */
export const getAllPosts = async (params = {}) => {
  const { list, page } = await fetchUnapprovedPosts(params)
  return { data: list, page }
}
