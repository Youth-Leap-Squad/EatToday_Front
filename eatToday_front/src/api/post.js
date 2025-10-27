import http from '@/api/index'

/** 정렬 → 백엔드 경로 매핑 */
function listPathBySort(sort) {
  if (sort === 'view') return '/foods/sorted/views'
  if (sort === 'like') return '/foods/sorted/likes'
  if (sort === 'comment') return '/foods/sorted/comments'
  return '/foods/approved'
}

/** 이미지 URL 정규화
 * - 절대 URL: 그대로
 * - /images/... : Vite public 폴더 (그대로 사용)
 * - /src/assets/... : Vite 번들 URL로 변환
 * - /uploads/... : 게이트웨이 호스트 보정
 * - 기타 상대경로: 업로드 기준으로 가정
 */
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
      return new URL(`./${u}`, import.meta.url).href
    } catch {
      console.warn('이미지 경로 변환 실패:', u)
      return ''
    }
  }
  if (u.startsWith('/uploads/')) return `http://localhost:8080${u}`
  return `http://localhost:8080/uploads/${u.replace(/^\/+/, '')}`
}

/** 본문에서 첫 번째 이미지 src 추출 */
function firstImgFromHtml(html) {
  const m = (html || '').match(/<img[^>]+src=["']?([^"' >]+)["']?/i)
  return m?.[1] || ''
}

/** 백 DTO → 프론트 모델 표준화 */
function normalizeItem(x) {
  const id = x.id ?? x.boardNo ?? x.board_no ?? x.no

  // 반응 합계
  const totalLikes =
    x.totalLikes != null
      ? Number(x.totalLikes)
      : Number(x.likesNo1 ?? x.likes_no_1 ?? 0) +
        Number(x.likesNo2 ?? x.likes_no_2 ?? 0) +
        Number(x.likesNo3 ?? x.likes_no_3 ?? 0) +
        Number(x.likesNo4 ?? x.likes_no_4 ?? 0)

  // 조회수: board_seq 사용
  const views = Number(x.views ?? x.viewCount ?? x.boardSeq ?? 0)

  // 커버 후보
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
  }
}

/** 목록 */
export async function fetchPosts({ page = 0, size = 12, sort = 'view' } = {}) {
  const path = listPathBySort(sort)
  const { data } = await http.get(path, { params: { page, size } })
  const list = (Array.isArray(data) ? data : []).map(normalizeItem)
  return { list, page: { totalPages: 1, number: page, size } }
}

/** 단건 */
export async function fetchPost(id) {
  try {
    const r = await http.get(`/foods/${id}`)
    return normalizeItem(r.data)
  } catch (e) {
    const { list } = await fetchPosts({ page: 0, size: 200, sort: 'view' })
    const found = list.find((it) => String(it.id) === String(id))
    if (!found) throw e
    return found
  }
}

/** 작성 */
export async function createPost({
  category,
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

/** 수정 */
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

/** 즐겨찾기 */
export function addBookmark(folderId, boardNo) {
  return http.post('/command/bookmarks', { folderId, boardNo }).then((r) => r.data)
}
export function removeBookmark(folderId, boardNo) {
  return http
    .delete('/command/bookmarks', { params: { folderId, boardNo } })
    .then((r) => r.data)
}
