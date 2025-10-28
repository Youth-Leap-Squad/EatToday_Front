<!-- src/views/review/PhotoReviewDetail.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchReviewDetail,
  listComments,
  addComment,
  updateComment,
  deleteComment,
  toggleReviewLike
} from '@/api/photoReviewAnju'

/* ---------------- 기본 상태 ---------------- */
const route = useRoute()
const router = useRouter()
const reviewNo = Number(route.params.id || route.params.reviewNo)

const review = ref(null)
const comments = ref([])
const input = ref('')
const editingId = ref(null)
const editText = ref('')

const likeBusy = ref(false)
const likeCount = ref(0)
const liked = ref(false)

/* ---------------- 인증/유틸 ---------------- */
function parseJwt(token) {
  if (!token) return null
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4 || 4)) % 4)
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}
function requireLogin() {
  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  if (!token || token === 'null' || token === 'undefined') {
    alert('로그인이 필요합니다.')
    router.replace('/login')
    return false
  }
  return true
}

const myMemberNo = computed(() => {
  const stored = Number(localStorage.getItem('memberNo'))
  if (Number.isFinite(stored)) return stored
  const raw =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  if (!raw) return null
  const pure = raw.startsWith('Bearer ') ? raw.slice(7) : raw
  const payload = parseJwt(pure)
  const no = Number(payload?.memberNo ?? payload?.member_no)
  return Number.isFinite(no) ? no : null
})

/* ---------------- 작성자 표시 ---------------- */
const authorMemberNo = computed(() => {
  const r = review.value
  if (!r) return null
  const cands = [r.memberNo, r.member_no, r.writerNo, r.authorNo, r?.member?.memberNo, r?.writer?.memberNo, r?.author?.memberNo]
    .map(Number)
    .filter(Number.isFinite)
  return cands.length ? cands[0] : null
})
const authorName = computed(() => {
  const r = review.value
  return (
    r?.memberName ??
    r?.authorName ??
    r?.writerName ??
    r?.member?.memberName ??
    r?.author?.name ??
    r?.writer?.name ??
    r?.memberId ??
    'user'
  )
})

/* ---------------- 표기 ---------------- */
function timeAgo(isoOrTs) {
  const ts = typeof isoOrTs === 'number' ? isoOrTs : Date.parse(isoOrTs)
  const h = Math.max(1, Math.floor((Date.now() - ts) / 3600000))
  return `${h}시간 전`
}

/* ---------------- 이미지 URL 해석 ---------------- */
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'
const FRONT_ORIGIN = window.location.origin
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i

const RAW_URL_KEYS = [
  'prFileUrl','fileUrl','url','path','pr_file_url',
  'prFilePath','filePath','pr_file_path','file_path',
  'storedFilePath','storedFileName','saveFilePath','save_file_path',
  'uploadPath','uploadUrl','directory','location',
  'originFilename','origin_file_name'
]
const FILE_COLLECTION_KEYS = [
  'files','reviewFiles','photoFiles','attachments','images','thumbnails',
  'photos','photoList','imageList','mediaList','fileDtoList','photoReviewFileList'
]
const ORDER_KEYS = [
  'sort','order','sequence','seq','fileOrder','fileSeq','fileSequence','fileSort',
  'prFileSeq','prFileOrder','displayOrder','priority','position','index','idx','rownum','rnum'
]

function joinOrigin(origin, segment) {
  const base = String(origin || '').replace(/\/+$/, '')
  const tail = String(segment || '').replace(/\\/g, '/').replace(/^\/+/, '')
  return tail ? `${base}/${tail}` : ''
}

function ensureServedPath(filenameOrPath) {
  // 파일명만 들어오면 /images/photo_review/, 백엔드 별칭도 대비해 /photo_review/도 시도
  const name = String(filenameOrPath || '').split('/').pop()
  if (!name) return ''
  // 우선 프론트 public 매핑
  const front = joinOrigin(FRONT_ORIGIN, `/images/photo_review/${name}`)
  // 백엔드 정적 매핑 별칭(있는 경우)
  const backend = joinOrigin(API_ORIGIN, `/photo_review/${name}`)
  // 둘 다 반환할 수 없으니 우선 front 경로로
  return front // 필요시 백엔드 경로로 바꾸려면 backend 리턴
}

function resolveImg(rawUrl) {
  const url = String(rawUrl || '').replace(/\\/g,'/').trim()
  if (!url) return ''
  if (url.startsWith('data:') || /^https?:\/\//i.test(url)) return url

  // DB에 /images/photo_review/ 저장된 경우
  if (/\/images\/photo_review\//i.test(url)) {
    const tail = url.slice(url.toLowerCase().lastIndexOf('/images/photo_review/'))
    return joinOrigin(FRONT_ORIGIN, tail)
  }

  // DB에 /photo_review/ 저장된 경우(백엔드 별칭)
  if (/\/photo_review\//i.test(url)) {
    const tail = url.slice(url.toLowerCase().lastIndexOf('/photo_review/'))
    return joinOrigin(API_ORIGIN, tail)
  }

  // 물리경로만 있는 경우 → 파일명 뽑아서 보정
  if (/^[a-zA-Z]:\//.test(url) || url.startsWith('/')) {
    const filename = url.split('/').pop()
    return ensureServedPath(filename)
  }

  // 기타 상대경로 → API 기준
  return joinOrigin(API_ORIGIN, url.startsWith('/') ? url : `/${url}`)
}

function pickRawFilePath(file) {
  if (!file) return ''
  if (typeof file === 'string') return file
  for (const k of RAW_URL_KEYS) {
    const v = file[k]
    if (typeof v === 'string' && v.trim()) return v
  }
  // 키가 다르면 이미지 확장자 포함 문자열을 찾아서 사용
  for (const [k, v] of Object.entries(file)) {
    if (typeof v === 'string' && IMAGE_EXT_RE.test(v)) return v
  }
  return ''
}
function fileUrl(f) { return resolveImg(pickRawFilePath(f)) }
function fileKey(f) { return f?.prFileNo ?? f?.fileNo ?? f?.id ?? fileUrl(f) }

function extractFiles(record) {
  if (!record || typeof record !== 'object') return []
  const results = []
  const queue = []
  const seen = new WeakSet()
  for (const key of FILE_COLLECTION_KEYS) {
    const value = record[key]
    if (value) queue.push(value)
  }
  while (queue.length) {
    const current = queue.shift()
    if (!current) continue
    if (typeof current === 'string') {
      if (current.trim()) results.push(current)
      continue
    }
    if (Array.isArray(current)) {
      queue.push(...current); continue
    }
    if (typeof current === 'object') {
      if (seen.has(current)) continue
      seen.add(current)
      const hasFile = RAW_URL_KEYS.some(key => typeof current[key] === 'string' && current[key].trim())
      if (hasFile) results.push(current)
      for (const key of FILE_COLLECTION_KEYS) {
        const nested = current[key]
        if (nested) queue.push(nested)
      }
    }
  }
  return results
}
function sortFileEntries(entries) {
  return entries
    .map((entry, idx) => {
      if (!entry || typeof entry !== 'object') return { entry, idx, order: idx }
      const numericOrder = ORDER_KEYS.map(key => Number(entry[key]))
        .filter(Number.isFinite)
        .sort((a,b)=>a-b)[0]
      const idKeys = ['prFileNo','fileNo','fileId','id','fileSeq','seq']
      const numericId = idKeys.map(key => Number(entry[key]))
        .filter(Number.isFinite)
        .sort((a,b)=>a-b)[0]
      const order = (Number.isFinite(numericOrder) ? numericOrder : null) ??
                    (Number.isFinite(numericId) ? numericId : null) ?? idx
      return { entry, idx, order }
    })
    .sort((a,b)=> (a.order===b.order ? a.idx-b.idx : a.order-b.order))
    .map(x=>x.entry)
}

const galleryFiles = computed(() => {
  if (!review.value) return []
  const direct = [
    review.value?.thumbnailUrl,
    review.value?.imageUrl,
    review.value?.imgUrl,
    review.value?.fileUrl,
    review.value?.photoUrl
  ].filter(v => typeof v === 'string' && v.trim())
  const files = sortFileEntries(extractFiles(review.value))
  return [...direct, ...files]
})

/* ---------------- 데이터 로드 ---------------- */
async function load() {
  try {
    const r = await fetchReviewDetail(reviewNo)
    if (!r) { router.replace('/reviews'); return }
    review.value = r

    // likeCount 추출(서버 응답에 있는 값 사용)
    likeCount.value = Number(
      r?.reviewLike ??
      r?.likeCount ??
      r?.reviewLikeCount ??
      r?.likes ??
      r?.heartCount ?? 0
    ) || 0

    // liked는 서버 응답에 없으면 브라우저 로컬 상태로 결정
    const serverLiked =
      r?.liked ?? r?.isLiked ?? r?.likedByMe ?? r?.myLike ?? r?.likedYn
    if (typeof serverLiked === 'boolean') {
      liked.value = serverLiked
    } else {
      liked.value = localStorage.getItem(`liked_review_${reviewNo}`) === '1'
    }

    comments.value = await listComments(reviewNo)
  } catch (e) {
    console.error('❌ 리뷰 로드 실패:', e)
    alert('데이터를 불러오지 못했습니다.')
  }
}

onMounted(load)

/* ---------------- 좋아요 ---------------- */
function storeBrowserLikeState(state) {
  localStorage.setItem(`liked_review_${reviewNo}`, state ? '1' : '0')
}
async function onToggleLike() {
  if (!requireLogin()) return
  const me = myMemberNo.value
  if (!Number.isFinite(me)) {
    alert('회원 정보를 확인할 수 없습니다.')
    return
  }
  if (likeBusy.value) return
  likeBusy.value = true
  try {
    const data = await toggleReviewLike(reviewNo, { memberNo: me })
    if (data) {
      if (data.likeCount != null) likeCount.value = Number(data.likeCount) || 0
      if ('liked' in data) liked.value = !!data.liked
      else if ('isLiked' in data) liked.value = !!data.isLiked
      else {
        // 서버가 토글 상태를 안주면 브라우저에서 반전
        liked.value = !liked.value
        likeCount.value = Math.max(0, likeCount.value + (liked.value ? 1 : -1))
      }
    } else {
      // 서버 응답이 비어도 브라우저에서 토글 반영
      liked.value = !liked.value
      likeCount.value = Math.max(0, likeCount.value + (liked.value ? 1 : -1))
    }
    storeBrowserLikeState(liked.value)
  } catch (err) {
    console.error('좋아요 처리 실패:', err?.response?.data || err)
    alert('좋아요를 처리하지 못했습니다.')
  } finally {
    likeBusy.value = false
  }
}

/* ---------------- 댓글 ---------------- */
async function submitComment() {
  if (!requireLogin()) return
  const text = input.value?.trim()
  if (!text) return alert('댓글을 입력해 주세요.')
  await addComment(reviewNo, { memberNo: myMemberNo.value ?? 1, content: text })
  comments.value = await listComments(reviewNo)
  input.value = ''
}
function startEdit(c){
  const id = Number(c.prcNo ?? c.commentNo ?? c.id)
  if (!Number.isFinite(id)) return
  editingId.value = id
  editText.value = c.prcDetail ?? c.content ?? ''
}
function cancelEdit(){ editingId.value = null; editText.value = '' }
async function saveEdit(){
  if (!requireLogin()) return
  const id = Number(editingId.value); if (!Number.isFinite(id)) return
  const text = (editText.value ?? '').trim(); if (!text) return cancelEdit()
  await updateComment(id, { memberNo: myMemberNo.value ?? 1, prcDetail: text, reviewNo })
  comments.value = await listComments(reviewNo); cancelEdit()
}
async function removeComment(c){
  if (!requireLogin()) return
  const id = Number(c.prcNo ?? c.commentNo ?? c.id); if (!Number.isFinite(id)) return
  await deleteComment(id, myMemberNo.value ?? 1)
  comments.value = await listComments(reviewNo)
}

/* ---------------- 네비 ---------------- */
function goAuthorPage() {
  const target = authorMemberNo.value
  if (Number.isFinite(target)) {
    router.push({ name: 'mypage.user', params: { memberNo: target } })
  } else {
    router.push({ name: 'mypage.self' })
  }
}
</script>

<template>
  <main class="screen">
    <section v-if="review" class="container">
      <!-- 상단 헤더 -->
      <header class="header">
        <button class="back" @click="router.back()" aria-label="뒤로">←</button>
        <div class="titlebox">
          <h1 class="title">{{ review.reviewTitle || review.title }}</h1>
          <button class="meta link" type="button" @click.stop="goAuthorPage">
            <img
              class="avatar"
              :src="authorAvatar || '/images/photo_review/userexample.png'"
              alt="작성자"
            />
            <div class="who">
              <div class="name">{{ authorName || 'user' }}</div>
              <div class="time">{{ timeAgo(review.reviewDate || review.createdAt) }}</div>
            </div>
          </button>
        </div>

        <!-- 점3개 메뉴 (CSS-only) -->
        <details class="menu">
          <summary>⋯</summary>
          <div class="menu-pop">
            <button class="menu-item">✈ 메시지 보내기</button>
            <button class="menu-item danger">🚫 신고</button>
          </div>
        </details>
      </header>

      <!-- 이미지 -->
      <div class="photo-wrap">
        <img
          v-for="f in (galleryFiles.length ? galleryFiles : [review])"
          :key="fileKey(f)"
          :src="fileUrl(f)"
          class="photo"
          :alt="review.reviewTitle || review.title || '리뷰 이미지'"
        />
      </div>

      <!-- 본문 -->
      <article class="content">
        <p class="body" v-text="review.reviewContent || review.content" />
      </article>

      <!-- 댓글/좋아요 -->
      <section class="comments">
        <div class="c-head">
          <div class="c-count">댓글 <b>{{ comments.length }}</b></div>
          <button
            class="c-like"
            :class="{ on: liked }"
            @click="onToggleLike"
            :disabled="likeBusy"
            type="button"
            aria-label="좋아요"
          >
            <span class="heart">{{ liked ? '♥' : '♡' }}</span>
            <span class="count">{{ likeCount }}</span>
          </button>
        </div>

        <div class="write">
          <div class="me">🙂 user</div>
          <input
            v-model="input"
            placeholder="댓글을 작성해 주세요."
            @keyup.enter="submitComment"
          />
          <button class="ok" @click="submitComment">등록</button>
        </div>

        <ul class="c-list">
          <li v-for="c in comments" :key="c.prcNo ?? c.commentNo ?? c.id" class="c-item">
            <div class="c-left">👤</div>
            <div class="c-right">
              <div class="c-name">{{ c.memberEmail || c.authorName || '익명' }}</div>

              <div v-if="editingId !== (c.prcNo ?? c.commentNo ?? c.id)" class="c-bubble">
                {{ c.prcDetail ?? c.content }}
              </div>

              <div v-else class="edit-row">
                <input v-model="editText" />
                <div class="edit-actions">
                  <button @click="saveEdit()">완료</button>
                  <button @click="cancelEdit">취소</button>
                </div>
              </div>

              <div class="c-actions">
                <button class="chip">신고</button>
                <button class="chip" @click="startEdit(c)">수정</button>
                <button class="chip warn" @click="removeComment(c)">삭제</button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </section>

    <section v-else class="loading">불러오는 중...</section>
  </main>
</template>

<style scoped>
/* 화면 베이스 */
.screen{
  min-height:100vh;
  background:
    linear-gradient(180deg, #fdf1df, #fdf1df, rgba(243,230,207,0) 42%) no-repeat,
    #fdf1df;
  padding-top:14px;
  color:#2e2318;
  font-weight:500;
}

/* 중앙 컨테이너 */
.container{ max-width:960px; margin:24px auto 80px; padding:0 20px; }

/* 상단 헤더 줄 */
.header{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:8px; }
.back{ border:none;background:transparent;cursor:pointer; font-size:28px; line-height:1; padding:2px 6px; border-radius:8px; }
.titlebox{ flex:1; }
.title{ margin:0 0 6px; font-weight:900; font-size:28px; letter-spacing:.2px; }
.meta{ display:flex; align-items:center; gap:10px; }
.meta.link{ border:none; background:transparent; padding:4px 6px; border-radius:12px; cursor:pointer; transition:background .15s ease, transform .15s ease; }
.meta.link:hover{ background:rgba(255,255,255,0.6); transform:translateY(-1px); }
.meta.link:focus-visible{ outline:2px solid #caa77a; outline-offset:3px; }
.avatar{ width:36px; height:36px; border-radius:50%; object-fit:cover; background:#f0eadf; }
.who{ display:grid; gap:2px; }
.name{ font-weight:900; }
.time{ font-size:12px; color:#8a7a6a; }

/* 점3개 메뉴 */
.menu{ position:relative; }
.menu summary{ list-style:none; cursor:pointer; user-select:none; font-size:26px; line-height:1; padding:2px 6px; border-radius:8px; }
.menu summary::-webkit-details-marker{ display:none; }
.menu[open] summary{ background:#fff3; }
.menu-pop{
  position:absolute; top:38px; right:0;
  background:#fff; border:1px solid #eadcc7; border-radius:12px; padding:10px 0; width:190px;
  box-shadow:0 12px 28px rgba(0,0,0,.12);
  z-index:10;
}
.menu-item{ width:100%; text-align:left; background:transparent; border:none; cursor:pointer; padding:10px 14px; font-weight:800; color:#2e2318; }
.menu-item:hover{ background:#faf5ee; }
.menu-item.danger{ color:#8b2e2e; }

/* 이미지 카드 */
.photo-wrap{ display:flex; justify-content:center; flex-wrap:wrap; gap:14px; margin:10px 0 18px; }
.photo{
  width:100%; max-width:640px; aspect-ratio:16/10; object-fit:cover; display:block;
  border-radius:14px; box-shadow:0 18px 40px rgba(60,35,0,.18);
}

/* 본문 카드 */
.content{
  max-width:720px; margin:0 auto 10px;
  background:#f6f0e6; border-radius:14px; padding:16px 18px; line-height:1.75;
  box-shadow:0 10px 28px rgba(60,35,0,.06);
}
.body{ white-space:pre-wrap; }

/* 댓글 박스 */
.comments{
  max-width:760px; margin:18px auto 0;
  background:#efe6d8; border:1px solid #e6d8c3;
  border-radius:16px; padding:16px;
  box-shadow:0 10px 28px rgba(60,35,0,.06);
}
.c-head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:12px; }
.c-like{
  display:inline-flex; align-items:center; gap:6px; font-weight:900;
  border:none; background:#fff; border-radius:999px; padding:6px 14px;
  box-shadow:0 6px 16px rgba(0,0,0,0.12); cursor:pointer;
  transition:transform .12s ease, box-shadow .12s ease;
}
.c-like.on{ background:#fbe7d2; color:#b45b2d; box-shadow:0 8px 18px rgba(180,91,45,0.18); }
.c-like:disabled{ opacity:.6; cursor:default; transform:none; }
.c-like:not(:disabled):active{ transform:translateY(1px); box-shadow:0 2px 8px rgba(0,0,0,0.18); }
.c-count{ color:#2e2318; }
.heart{ font-size:16px; line-height:1; }
.count{ font-size:14px; }

.write{
  display:flex; gap:10px; align-items:center; margin:8px 0 14px;
  background:#f7f2ea; border:1px solid #e7dac6; border-radius:12px; padding:10px;
}
.write .me{ font-size:20px; }
.write input{ flex:1; border:1px solid #e0d5c4; border-radius:10px; padding:10px; background:#fff; }
.write .ok{ border:1px solid #c9ae86; background:#fff; border-radius:10px; padding:8px 12px; cursor:pointer; font-weight:800; }

.c-list{ list-style:none; margin:0; padding:0; display:grid; gap:14px; }
.c-item{ display:flex; gap:10px; }
.c-left{ width:34px; height:34px; border-radius:50%; background:#f0eadf; display:grid; place-items:center; }
.c-right{ flex:1; }
.c-name{ font-size:13px; color:#6b5b4a; margin-bottom:6px; }
.c-bubble{ background:#fff; border-radius:12px; padding:10px 12px; }

.c-actions{ display:flex; gap:8px; margin-top:8px; }
.chip{
  border:none; background:#fff; border-radius:999px; padding:5px 12px; font-size:12px; cursor:pointer;
  border:1px solid #e0d5c4;
}
.chip.warn{ background:#ffe8e8; }

.edit-row{ display:flex; gap:8px; align-items:center; margin-top:4px; }
.edit-row input{ flex:1; background:#fff; border:1px solid #d5c9ba; border-radius:8px; padding:8px; }
.edit-actions button{ margin-left:4px; border:1px solid #d5c9ba; background:#fff; border-radius:8px; padding:6px 10px; cursor:pointer; }

/* 로딩 */
.loading{ max-width:860px; margin:60px auto; text-align:center; color:#6b5b4a; }
</style>