import http from '@/api/index'

/** 정렬 → 백엔드 경로 매핑 */
function listPathBySort(sort) {
  if (sort === 'view') return '/foods/sorted/views'
  if (sort === 'like') return '/foods/sorted/likes'
  if (sort === 'comment') return '/foods/sorted/comments'
  return '/foods/approved'
}

/** 이미지 URL 정규화 */
function resolveAssetUrl(u) {
  if (!u) return ''
  // DB가 'a.jpg,b.jpg' 형태면 첫 장만
  if (typeof u === 'string' && u.includes(',')) {
    u = u.split(',')[0].trim()
  }
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/images/')) return u
  if (u.startsWith('/src/assets/')) {
    try {
      // Vite 번들 경로로 변환
      return new URL(`./${u}`, import.meta.url).href
    } catch {
      console.warn('이미지 경로 변환 실패:', u)
      return ''
    }
  }
  if (u.startsWith('/uploads/')) return `http://localhost:8080${u}`
  // 기타 상대경로는 업로드 기준으로 가정
  return `http://localhost:8080/uploads/${u.replace(/^\/+/, '')}`
}

/** 본문 HTML에서 첫 번째 img src 추출 */
function firstImgFromHtml(html) {
  const m = (html || '').match(/<img[^>]+src=["']?([^"' >]+)["']?/i)
  return m?.[1] || ''
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

  // 조회수 대용: board_seq 사용 (백엔드 로직과 맵핑)
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

/** ====== 일반 게시글 API ====== */

/** 목록 (정렬 기준: view | like | comment | 기본=approved) */
export async function fetchPosts({ page = 0, size = 12, sort = 'view' } = {}) {
  const path = listPathBySort(sort)
  const { data } = await http.get(path, { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 단건 조회 */
export async function fetchPost(id) {
  try {
    const r = await http.get(`/foods/${id}`)
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
export async function createPost({
  category, // 사용 안 하더라도 유지
  alcoholNo = 1,
  title,
  subtitle,
  contentHtml,
  mainImageFile,
  contentImageFiles = [],
}) {
  const meta = {
    alcoholNo: Number(alcoholNo || 1),
    boardTitle: title ?? '',
    boardContent: contentHtml ?? '',
    foodExplain: subtitle ?? '',
  }

  const fd = new FormData()
  fd.append('meta', JSON.stringify(meta))
  if (mainImageFile instanceof File) fd.append('image', mainImageFile)
  contentImageFiles
    .filter((f) => f instanceof File)
    .forEach((f) => fd.append('images', f))

  const { data } = await http.post('/command/foods', fd)
  return data
}

/** 수정 (FormData: meta JSON + 이미지들) */
export async function updatePost(id, payload) {
  const fd = new FormData()
  fd.append('meta', JSON.stringify(payload))
  const { data } = await http.patch(`/command/foods/${id}`, fd)
  return normalizeItem(data)
}

/** 삭제 */
export async function deletePost(id) {
  await http.delete(`/command/foods/${id}`)
  return true
}

/** ====== 즐겨찾기 ====== */
export function addBookmark(folderId, boardNo) {
  return http.post('/command/bookmarks', { folderId, boardNo }).then((r) => r.data)
}
export function removeBookmark(folderId, boardNo) {
  return http
    .delete('/command/bookmarks', { params: { folderId, boardNo } })
    .then((r) => r.data)
}

/** ====== 관리자 전용 ====== */

/** 미승인 목록 */
export async function fetchUnapprovedPosts({ page = 0, size = 12 } = {}) {
  const { data } = await http.get('/foods/unapproved', { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 전체 목록 (승인 여부 무관) */
export async function fetchAllPosts({ page = 0, size = 12 } = {}) {
  const { data } = await http.get('/foods/all', { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 승인/반려: PATCH /command/foods/{boardNo}/approve?approved=true|false  (ADMIN) */
export function approvePost(boardNo, approved = true) {
  return http
    .patch(`/command/foods/${boardNo}/approve`, null, { params: { approved } })
    .then((r) => r.data)
}

export function getAllPosts(params = {}) {
  return fetchUnapprovedPosts(params).then(({ list, page }) => ({ data: list, page }))
}
