// src/api/post.js
import api from '@/api/index'

/* -------------------- 헬퍼 -------------------- */
function listPathBySort(sort) {
  if (sort === 'view') return '/foods/sorted/views'
  if (sort === 'like') return '/foods/sorted/likes'
  if (sort === 'comment') return '/foods/sorted/comments'
  return '/foods/approved'
}

function firstImgFromHtml(html) {
  const m = (html || '').match(/<img[^>]+src=["']?([^"' >]+)["']?/i)
  return m?.[1] || ''
}

/** 이미지 URL 정규화 */
function resolveAssetUrl(u) {
  if (!u) return ''
  if (typeof u === 'string' && u.includes(',')) u = u.split(',')[0].trim()
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/images/')) return u
  if (u.startsWith('/src/assets/')) {
    try { return new URL(`./${u}`, import.meta.url).href } catch { return '' }
  }
  if (u.startsWith('/uploads/')) return u
  return `/uploads/${u.replace(/^\/+/, '')}`
}

/** 백엔드 DTO → 프론트 표준 모델 */
function asBool(v) {
  if (v === true || v === 1) return true
  if (v === false || v === 0 || v == null) return false
  const s = String(v).trim().toUpperCase()
  return s === 'T' || s === 'Y' || s === 'TRUE' || s === '1'
}

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
    approved: asBool(x.confirmedYn ?? x.confirmed ?? x.approved),
  }
}

/* -------------------- 공개 API -------------------- */

/** 목록 (정렬: view | like | comment | 기본=approved) */
export const fetchPosts = async ({ page = 0, size = 12, sort = 'view' } = {}) => {
  const path = listPathBySort(sort)
  const { data } = await api.get(path, { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** ✅ 주종별 승인된 게시글 목록 */
export const fetchPostsByAlcohol = async ({ alcoholNo, page = 0, size = 12 } = {}) => {
  try {
    const { data } = await api.get(`/${alcoholNo}/foods`, { params: { page, size } })
    let list = (Array.isArray(data) ? data : []).map(normalizeItem)
    if (list.length === 0) {
      // 승인글이 없으면 전체에서 해당 주종만 클라이언트 필터 (임시 폴백)
      const { data: all } = await api.get('/foods/all', { params: { page, size: 200 } })
      const filtered = (Array.isArray(all) ? all : []).filter(
        x => Number(x.alcoholNo ?? x.alcohol_no) === Number(alcoholNo)
      )
      list = filtered.map(normalizeItem)
    }
    return { list, page: { totalPages: 1, number: page, size } }
  } catch (e) {
    console.error('[fetchPostsByAlcohol] fail:', e)
    return { list: [], page: { totalPages: 1, number: page, size }, error: e }
  }
}

/** 단건 조회 */
export const fetchPost = async (id) => {
  const r = await api.get(`/foods/${id}`)
  return normalizeItem(r.data)

}

/** 작성 */
export const createPost = async ({
  category,
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

/** 수정 */
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

export const fetchUnapprovedPosts = async ({ page = 0, size = 12 } = {}) => {
  const { data } = await api.get('/foods/unapproved', { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

export const fetchAllPosts = async ({ page = 0, size = 12 } = {}) => {
  const { data } = await api.get('/foods/all', { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

export const approvePost = async (boardNo, approved = true) => {
  const { data } = await api.patch(`/command/foods/${boardNo}/approve`, null, { params: { approved } })
  return data
}

/** PostManagement.vue 호환 */
export const getAllPosts = async (params = {}) => {
  const { list, page } = await fetchUnapprovedPosts(params)
  return { data: list, page }
}

export const increaseView = async (boardNo) => {
  await api.patch(`/command/foods/${boardNo}/view`)
}

/* -------------------- ✅ 여기부터 핵심 수정 -------------------- */

/** ✅ 댓글 작성: JSON(content) → JSON(fcContent) → FormData 순 폴백 */
export const createComment = async (boardNo, text) => {
  const content = (text ?? '').trim()
  const url = `/command/foods/${boardNo}/comments`

  // 1) 기본: content
  try {
    const { data } = await api.post(url, { content }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return data
  } catch (e1) {
    const code = e1?.response?.status
    if (code !== 400 && code !== 415 && code !== 422) throw e1
    // 2) 대체 키: fcContent
    try {
      const { data } = await api.post(url, { fcContent: content }, {
        headers: { 'Content-Type': 'application/json' }
      })
      return data
    } catch {
      // 3) 마지막 폴백: multipart/form-data
      const fd = new FormData()
      fd.append('content', content)
      const { data } = await api.post(url, fd)
      return data
    }
  }
}

/** ✅ 반응 토글: PATCH → 실패 시 POST 폴백 */
export const toggleReaction = async (boardNo, likesType /* 1~4 */) => {
  const payload = { likesType: Number(likesType) }

  try {
    const { data } = await api.patch(`/command/foods/${boardNo}/reactions`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    // 일부 서버는 204를 응답할 수 있음 → 그땐 재조회
    if (data == null || data === '') {
      const r = await api.get(`/foods/${boardNo}/reactions`)
      return Array.isArray(r.data) ? r.data[0] : r.data
    }
    return data
  } catch (e) {
    const code = e?.response?.status
    if (code === 400 || code === 404 || code === 409) {
      const { data } = await api.post(`/command/foods/${boardNo}/reactions`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })
      return data
    }
    throw e
  }
}

export async function fetchUserPosts({ memberNo, page = 0, size = 12, token }) {
  const headers = token ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {}
  // 백엔드가 배열을 바로 주는 케이스와 페이징 래퍼(content/totalElements)를 모두 지원
  const res = await api.get(`/members/${memberNo}/foods`, {
    headers,
    params: { page, size },
  })
  return res.data
}