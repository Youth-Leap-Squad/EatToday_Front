<template>
  <div class="photo-review-page" v-if="review">
    <div class="surface">
      <button class="nav-back" type="button" @click="router.back()">←</button>
      <h1 class="headline">{{ review.reviewTitle || review.title || '리뷰 제목 없음' }}</h1>

      <div class="author-row">
        <button class="author-info" type="button" @click="goAuthorPage">
          <img class="avatar" :src="authorAvatar" alt="작성자" />
          <div class="meta">
            <div class="name">
              {{ authorName || '작성자' }}
              <span class="badge" v-if="authorName">작성자</span>
            </div>
            <div class="time">{{ timeAgo(review.reviewDate || review.createdAt || review.regDate) }}</div>
          </div>
        </button>
        <details class="dot-menu">
          <summary>⋯</summary>
          <div class="menu-pop">
            <button type="button">✈ 메시지 보내기</button>
            <button type="button" class="danger">🚨 신고</button>
          </div>
        </details>
      </div>

      <figure class="photo-card" v-if="thumbnailUrl">
        <img :src="thumbnailUrl" alt="리뷰 이미지" />
      </figure>

      <section class="story">
        <h2 class="story-title">{{ review.reviewTitle || '사진 리뷰' }}</h2>
        <p v-if="hashtag" class="story-tag">{{ hashtag }}</p>
      </section>

      <div class="like-line">
        <button
          class="like-chip"
          :class="{ on: liked }"
          type="button"
          :disabled="likeBusy"
          @click="onToggleLike"
        >
          <span class="heart">{{ liked ? '♥' : '♡' }}</span>
          <span class="count">{{ likeCount }}</span>
        </button>
      </div>

      <section class="comments-card">
        <header class="comments-header">
          <h3>댓글 {{ comments.length }}</h3>
        </header>

        <div class="comment-form">
          <div class="me">🙂 {{ currentUserDisplay }}</div>
          <input
            class="comment-input"
            v-model="commentInput"
            placeholder="댓글을 작성해 주세요."
            @keyup.enter="submitComment"
          />
          <button class="submit" type="button" @click="submitComment">등록</button>
        </div>

        <ul class="comment-list">
          <li v-for="c in comments" :key="c.prcNo ?? c.commentNo ?? c.id" class="comment-item">
            <div class="comment-meta">
              <div class="comment-left">
                <span class="comment-name">
                  {{ commentName(c) }}
                  <span v-if="isAuthorComment(c)" class="badge-author">작성자</span>
                </span>
                <span class="comment-time">{{ timeAgo(c.prcAt || c.createdAt || c.fcDate) }}</span>
              </div>
              <div class="comment-actions">
                <template v-if="isMyComment(c)">
                  <button type="button" @click="startEdit(c)">수정</button>
                  <button type="button" @click="removeComment(c)">삭제</button>
                </template>
                <button type="button" class="warn" @click="reportComment(c)">신고</button>
              </div>
            </div>

            <div v-if="editingId === (c.prcNo ?? c.commentNo ?? c.id)" class="edit-box">
              <input v-model="editText" />
              <div class="edit-buttons">
                <button type="button" @click="saveEdit">완료</button>
                <button type="button" @click="cancelEdit">취소</button>
              </div>
            </div>
            <p v-else class="comment-text">{{ c.prcDetail || c.content }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>

  <div v-else class="empty">리뷰 데이터를 불러올 수 없습니다.</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchReviewDetail,
  listComments,
  addComment,
  updateComment,
  deleteComment,
  fetchReviewLikeStatus,
  toggleReviewLike
} from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()

// state
const review = ref(null)
const thumbnailUrl = ref('')
const likeCount = ref(0)
const liked = ref(false)
const likeBusy = ref(false)
const comments = ref([])
const commentInput = ref('')

// ✨ 편집 상태 (누락됐던 부분 추가)
const editingId = ref(null)
const editText = ref('')

const reviewId = computed(() => Number(route.params.reviewNo))

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'
const FRONT_ORIGIN = window.location.origin
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i

const RAW_URL_KEYS = [
  'prFileUrl','prFilePath','fileUrl','filePath','file_full_path','urlOrPath','url','path',
  'pr_file_url','pr_file_path','file_path','originName','originalName','originFileName',
  'storedName','storedFileName','storedFilePath','stored_path','storedPath','saveName',
  'saveFileName','savedFileName','saveFilePath','save_file_path','save_file_name','savePath',
  'uploadPath','uploadUrl','directory','location','fileName','filename','originFilename','origin_file_name'
]

const FILE_COLLECTION_KEYS = [
  'files','fileList','reviewFiles','photoReviewFiles','photoReviewFileList','photoReviewFileDtoList',
  'photoReviewFileDtos','photoReviewFileResponses','photoReviewFileResponseList','photoFiles','photoFile',
  'photoFileList','photos','photo','photoList','imageList','images','thumbnails','thumbnailList','mediaList'
]

const ORDER_KEYS = [
  'sort','order','sequence','seq','fileOrder','fileSeq','fileSequence','fileSort','prFileSeq','prFileOrder',
  'displayOrder','priority','position','index','idx','rownum'
]

// utils
function joinOrigin(origin, segment) {
  const base = String(origin || '').replace(/\/+$/, '')
  const tail = String(segment || '').replace(/\\/g, '/').replace(/^\/+/, '')
  return tail ? `${base}/${tail}` : ''
}

function resolveImg(rawUrl) {
  const url = String(rawUrl || '').replace(/\\/g, '/').trim()
  if (!url) return ''
  if (url.startsWith('data:') || /^https?:\/\//i.test(url)) return url
  const lower = url.toLowerCase()
  if (lower.includes('/photo_review/')) return joinOrigin(API_ORIGIN, url.slice(lower.lastIndexOf('/photo_review/')))
  if (lower.includes('photoreview/')) return joinOrigin(API_ORIGIN, url.slice(lower.lastIndexOf('photoreview/')))
  if (lower.includes('/images/')) return joinOrigin(FRONT_ORIGIN, url.slice(lower.lastIndexOf('/images/')))
  if (lower.includes('images/')) return joinOrigin(FRONT_ORIGIN, url.slice(lower.lastIndexOf('images/')))
  return joinOrigin(API_ORIGIN, url.startsWith('/') ? url : `/${url}`)
}

function pickRawFilePath(file) {
  if (!file) return ''
  if (typeof file === 'string') return file
  for (const key of RAW_URL_KEYS) {
    const val = file[key]
    if (typeof val === 'string' && val.trim()) return val
  }
  const entries = Object.entries(file).filter(([, v]) => typeof v === 'string' && v.trim())
  const withExt = entries.filter(([, v]) => IMAGE_EXT_RE.test(v))
  if (!withExt.length) return ''
  const withSlash = withExt.find(([, v]) => v.includes('/') || v.includes('\\'))
  return withSlash ? withSlash[1] : withExt[0][1]
}

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
    if (typeof current === 'string') { if (current.trim()) results.push(current); continue }
    if (Array.isArray(current)) { queue.push(...current); continue }
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
      if (!entry || typeof entry !== 'object') return { entry, order: idx, idx }
      const numericOrder = ORDER_KEYS.map(key => Number(entry[key])).filter(Number.isFinite).sort((a,b)=>a-b)[0]
      const idKeys = ['prFileNo','fileNo','fileId','id','fileSeq','seq']
      const numericId = idKeys.map(key => Number(entry[key])).filter(Number.isFinite).sort((a,b)=>a-b)[0]
      const order = (Number.isFinite(numericOrder) ? numericOrder : null) ?? (Number.isFinite(numericId) ? numericId : null) ?? idx
      return { entry, order, idx }
    })
    .sort((a, b) => (a.order === b.order ? a.idx - b.idx : a.order - b.order))
    .map(item => item.entry)
}

function pickFirstImage(record) {
  if (!record || typeof record !== 'object') return ''
  const directCandidates = [
    record?.thumbnailUrl, record?.thumbnailPath, record?.imageUrl, record?.imgUrl, record?.imagePath, record?.imgPath,
    record?.photoUrl, record?.photo, record?.photoSrc, record?.photoURL, record?.photoPath, record?.mainImage,
    record?.mainImageUrl, record?.mainImagePath, record?.coverUrl, record?.cover, record?.thumbnail, record?.thumbnailImage,
    record?.fileUrl, record?.filePath, record?.file_path, record?.previewUrl, record?.firstImage, record?.image,
    record?.imageSrc, record?.img, record?.firstImageUrl, record?.mediaUrl, record?.mediaPath, record?.media, record?.resourceUrl
  ]
  for (const c of directCandidates) {
    const resolved = resolveImg(c)
    if (resolved) return resolved
  }
  const arrayCandidates = [
    record?.imgUrls, record?.imgUrlList, record?.imageList, record?.images, record?.imageArray, record?.photos,
    record?.photoList, record?.thumbnails, record?.thumbnailList, record?.mediaList
  ]
  for (const group of arrayCandidates) {
    if (!Array.isArray(group)) continue
    const str = group.find(v => typeof v === 'string' && v.trim())
    if (str) { const resolved = resolveImg(str); if (resolved) return resolved }
    const obj = group.find(v => v && typeof v === 'object')
    if (obj) { const resolved = resolveImg(pickRawFilePath(obj)); if (resolved) return resolved }
  }
  const entries = sortFileEntries(extractFiles(record))
  for (const entry of entries) {
    const resolved = resolveImg(pickRawFilePath(entry))
    if (resolved) return resolved
  }
  return ''
}

function timeAgo(value) {
  if (!value) return '방금 전'
  const ts = typeof value === 'number' ? value : Date.parse(value)
  if (!Number.isFinite(ts)) return '방금 전'
  const diff = Date.now() - ts
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

function parseJwt(token) {
  if (!token) return null
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4 || 4)) % 4)
    const json = decodeURIComponent(
      atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(json)
  } catch { return null }
}

function currentToken() {
  const raw = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('Authorization')
  return raw || ''
}

const myMemberNo = computed(() => {
  const raw = currentToken()
  if (raw) {
    const payload = parseJwt(raw.startsWith('Bearer ') ? raw.slice(7) : raw)
    const n = Number(payload?.memberNo ?? payload?.member_no)
    if (Number.isFinite(n)) return n
  }
  const stored = Number(localStorage.getItem('memberNo'))
  return Number.isFinite(stored) ? stored : null
})

watch(myMemberNo, n => {
  if (Number.isFinite(n)) localStorage.setItem('memberNo', String(n))
}, { immediate: true })

const currentUserName = computed(() => {
  const raw = currentToken()
  const payload = raw ? parseJwt(raw.startsWith('Bearer ') ? raw.slice(7) : raw) : null
  return (
    localStorage.getItem('memberNickname') ||
    localStorage.getItem('memberName') ||
    payload?.memberNickname ||
    payload?.memberName ||
    payload?.nickname ||
    payload?.name ||
    ''
  )
})


function requireLogin() {
  const token = currentToken()
  if (!token || token === 'null' || token === 'undefined') {
    alert('로그인이 필요합니다.')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return false
  }
  return true
}

const authorMemberNo = computed(() => {
  const r = review.value
  if (!r) return null
  const candidates = [
    r.memberNo, r.member_no, r.authorNo, r.writerNo,
    r.member?.memberNo, r.author?.memberNo, r.writer?.memberNo
  ]
  const hit = candidates.map(Number).find(Number.isFinite)
  return Number.isFinite(hit) ? hit : null
})

const defaultAvatar = '/images/photo_review/userexample.png'

const authorName = computed(() => {
  const r = review.value
  if (!r) return '익명'
  return (
    r.memberName || r.authorName || r.writerName ||
    r.member?.memberName || r.author?.name || r.writer?.name ||
    r.memberId || '익명'
  )
})

const authorAvatar = computed(() => {
  const r = review.value
  if (!r) return defaultAvatar
  const raw =
    r.authorAvatar ?? r.avatar ?? r.profileImage ?? r.profileUrl ??
    r.member?.profileImageUrl ?? r.member?.profileImage?.url ??
    r.author?.avatarUrl ?? r.writer?.avatarUrl ?? ''
  return resolveImg(raw) || defaultAvatar
})

const currentUserDisplay = computed(() => {
  if (Number.isFinite(authorMemberNo.value) && myMemberNo.value === authorMemberNo.value) return '작성자'
  return currentUserName.value || 'user'
})

const hashtag = computed(() => {
  const r = review.value
  if (!r) return ''
  const candidates = r.hashtags ?? r.tagList ?? r.hashTags ?? r.tags ?? (typeof r.tagString === 'string' ? r.tagString.split(',') : [])
  const ary = Array.isArray(candidates) ? candidates : typeof candidates === 'string' ? candidates.split(',') : []
  const formatted = ary.map(t => String(t).trim()).filter(Boolean).map(t => (t.startsWith('#') ? t : `#${t}`))
  if (formatted.length) return formatted.join(' ')
  if (r.boardName) return `#${r.boardName}`
  return ''
})

const galleryImages = computed(() => {
  const r = review.value
  if (!r) return []
  const images = new Set()
  ;[
    r.thumbnailUrl, r.thumbnailPath, r.mainImage, r.mainImageUrl, r.mainImagePath,
    r.imgUrl, r.imageUrl, r.photoUrl, r.photo
  ].map(resolveImg).filter(Boolean).forEach(img => images.add(img))
  const entries = sortFileEntries(extractFiles(r))
  for (const entry of entries) {
    const src = resolveImg(pickRawFilePath(entry))
    if (src) images.add(src)
  }
  return Array.from(images)
})

async function loadComments() {
  const id = reviewId.value
  if (!Number.isFinite(id)) return
  const list = await listComments(id)
  comments.value = Array.isArray(list) ? list : []
}

async function loadReview() {
  const id = reviewId.value
  if (!Number.isFinite(id)) return
  try {
    const data = await fetchReviewDetail(id)
    review.value = data
    likeCount.value = Number(data.reviewLikeCount ?? data.likeCount ?? data.likes ?? data.reviewLike ?? 0) || 0

    const images = galleryImages.value
    thumbnailUrl.value = images[0] || pickFirstImage(data)

    const status = await fetchReviewLikeStatus(id)
    if (status) {
      if (status.likeCount != null) likeCount.value = Number(status.likeCount) || likeCount.value
      if ('liked' in status) liked.value = !!status.liked
      else if ('isLiked' in status) liked.value = !!status.isLiked
    }

    await loadComments()
  } catch (err) {
    console.error('리뷰 상세 불러오기 실패:', err)
  }
}

async function onToggleLike() {
  if (!requireLogin()) return
  const id = reviewId.value
  const memberNo = myMemberNo.value
  if (!Number.isFinite(id) || !Number.isFinite(memberNo) || likeBusy.value) return
  likeBusy.value = true
  try {
    const res = await toggleReviewLike(id, { memberNo })
    if (res) {
      if (res.likeCount != null) likeCount.value = Number(res.likeCount) || likeCount.value
      if ('liked' in res) liked.value = !!res.liked
      else if ('isLiked' in res) liked.value = !!res.isLiked
      else liked.value = !liked.value
    } else {
      liked.value = !liked.value
      likeCount.value = Math.max(0, likeCount.value + (liked.value ? 1 : -1))
    }
  } catch (err) {
    console.error('좋아요 처리 실패:', err?.response?.data || err)
  } finally {
    likeBusy.value = false
  }
}

async function submitComment() {
  if (!requireLogin()) return
  const id = reviewId.value
  const memberNo = myMemberNo.value
  const text = commentInput.value.trim()
  if (!Number.isFinite(id)) return
  if (!Number.isFinite(memberNo)) { alert('회원 정보를 확인할 수 없습니다.'); return }
  if (!text) return
  try {
    await addComment(id, { memberNo, prcDetail: text, content: text })
    commentInput.value = ''
    await loadComments()
  } catch (err) {
    console.error('댓글 등록 실패:', err?.response?.data || err)
    alert('댓글 등록 중 오류가 발생했습니다.')
  }
}

function startEdit(comment) {
  if (!isMyComment(comment)) return
  const id = Number(comment.prcNo ?? comment.commentNo ?? comment.id)
  if (!Number.isFinite(id)) return
  editingId.value = id
  editText.value = comment.prcDetail ?? comment.content ?? ''
}

function cancelEdit() {
  editingId.value = null
  editText.value = ''
}

async function saveEdit() {
  if (!requireLogin()) return
  const id = editingId.value
  const memberNo = myMemberNo.value
  const text = editText.value.trim()
  if (!Number.isFinite(id) || !Number.isFinite(memberNo) || !text) return
  const target = findCommentById(id)
  if (!target || !isMyComment(target)) {
    alert('내 댓글만 수정할 수 있습니다.')
    cancelEdit()
    return
  }
  try {
    await updateComment(id, { memberNo, prcDetail: text, reviewNo: reviewId.value })
    cancelEdit()
    await loadComments()
  } catch (err) {
    console.error('댓글 수정 실패:', err?.response?.data || err)
    alert('댓글 수정 중 오류가 발생했습니다.')
  }
}

async function removeComment(comment) {
  if (!requireLogin()) return
  if (!isMyComment(comment)) {
    alert('내 댓글만 삭제할 수 있습니다.')
    return
  }
  if (!confirm('댓글을 삭제할까요?')) return
  const id = Number(comment.prcNo ?? comment.commentNo ?? comment.id)
  const memberNo = myMemberNo.value
  if (!Number.isFinite(id) || !Number.isFinite(memberNo)) return
  try {
    await deleteComment(id, memberNo)
    await loadComments()
  } catch (err) {
    console.error('댓글 삭제 실패:', err?.response?.data || err)
    alert('댓글 삭제 중 오류가 발생했습니다.')
  }
}

function goAuthorPage() {
  const target = authorMemberNo.value
  if (Number.isFinite(target)) router.push({ name: 'mypage.user', params: { memberNo: target } })
  else router.push({ name: 'mypage.self' })
}

function commentMemberNo(c) {
  return Number(
    c?.memberNo ??
    c?.member_no ??
    c?.writerNo ??
    c?.writer_no ??
    c?.member?.memberNo ??
    c?.member?.id ??
    c?.author?.memberNo
  )
}
function commentName(c) {
  const direct = [
    c?.memberName,
    c?.member?.memberName,
    c?.writerName,
    c?.writer?.name,
    c?.authorName,
    c?.author?.name,
    c?.memberNickname,
    c?.nickname,
    c?.memberId,
    c?.memberEmail
  ]
    .map(v => (typeof v === 'string' ? v.trim() : ''))
    .find(Boolean)
  if (direct) return direct
  const n = commentMemberNo(c)
  if (Number.isFinite(n)) return `회원#${n}`
  return '익명'
}

function isAuthorComment(comment) {
  const authorNo = authorMemberNo.value
  const commentNo = commentMemberNo(comment)
  return Number.isFinite(authorNo) && Number.isFinite(commentNo) && authorNo === commentNo
}

function isMyComment(comment) {
  const me = myMemberNo.value
  const commentNo = commentMemberNo(comment)
  return Number.isFinite(me) && Number.isFinite(commentNo) && me === commentNo
}

function findCommentById(id) {
  const targetId = Number(id)
  if (!Number.isFinite(targetId)) return null
  return comments.value.find(
    item => Number(item?.prcNo ?? item?.commentNo ?? item?.id) === targetId
  ) || null
}

function reportComment(comment) {
  console.info('신고 요청', comment)
  alert('신고 기능은 준비 중입니다.')
}

onMounted(loadReview)
</script>

<style scoped>
/* --- styles identical to your version (kept) --- */
.photo-review-page{min-height:100vh;background:#f8ead4;padding:40px 0 60px}
.surface{max-width:760px;margin:0 auto;padding:0 24px;color:#2f2419}
.nav-back{background:transparent;border:none;font-size:28px;cursor:pointer;padding:4px 0;margin-bottom:12px}
.headline{margin:0 0 18px;font-size:26px;font-weight:900}
.author-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;gap:14px}
.author-info{display:flex;align-items:center;gap:12px}
.avatar{width:48px;height:48px;border-radius:50%;object-fit:cover;background:#f0e1cc}
.meta{display:flex;flex-direction:column;gap:2px}
.meta .name{font-weight:900;display:flex;align-items:center;gap:6px}
.meta .badge{background:#fde2c7;color:#b3542d;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px}
.meta .time{font-size:12px;color:#8a7a6a}
.dot-menu{position:relative}
.dot-menu summary{list-style:none;cursor:pointer;font-size:26px;line-height:1;border-radius:8px;padding:2px 6px}
.dot-menu summary::-webkit-details-marker{display:none}
.dot-menu[open] summary{background:rgba(0,0,0,.05)}
.menu-pop{position:absolute;top:32px;right:0;background:#fff;border:1px solid #e8d6be;border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,.12);display:grid;padding:6px 0;min-width:160px;z-index:10}
.menu-pop button{background:none;border:none;text-align:left;font-weight:800;padding:10px 16px;cursor:pointer;color:#2f2419}
.menu-pop button:hover{background:#f7eedf}
.menu-pop .danger{color:#b14a3c}
.photo-card{margin:0 0 24px;border-radius:18px;overflow:hidden;box-shadow:0 16px 30px rgba(0,0,0,.16);background:#000}
.photo-card img{width:100%;display:block;object-fit:cover}
.story{margin-bottom:20px}
.story-title{margin:0 0 6px;font-size:20px;font-weight:900}
.story-tag{margin:0;font-weight:800;color:#9b7c49}
.like-line{display:flex;justify-content:flex-end;margin-bottom:24px}
.like-chip{border:none;background:#fff;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.12);padding:8px 18px;display:inline-flex;align-items:center;gap:8px;font-weight:900;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}
.like-chip:disabled{opacity:.6;cursor:default}
.like-chip:not(:disabled):active{transform:translateY(1px);box-shadow:0 4px 12px rgba(0,0,0,.12)}
.like-chip.on{background:#fde2c7;color:#b3542d}
.like-chip .heart{font-size:18px}
.comments-card{background:#f4e7d3;border-radius:18px;padding:18px;box-shadow:0 12px 24px rgba(0,0,0,.08)}
.comments-header{margin-bottom:16px}
.comments-header h3{margin:0;font-size:16px;font-weight:900}
.comment-form{display:flex;align-items:center;gap:10px;background:#fff4e3;border:1px solid #e7d5b9;border-radius:14px;padding:10px;margin-bottom:18px}
.comment-form .me{font-size:20px}
.comment-input{flex:1;border:1px solid #e7d5b9;border-radius:10px;padding:10px;font-size:14px;background:#fff}
.comment-input:focus{outline:2px solid #d4b487;outline-offset:1px}
.comment-form .submit{border:none;background:#d4b487;color:#fff;font-weight:800;border-radius:10px;padding:8px 16px;cursor:pointer}
.comment-form .submit:hover{background:#c29d70}
.comment-list{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.comment-item{background:#fff;border-radius:14px;padding:12px 14px;box-shadow:0 4px 12px rgba(0,0,0,.05)}
.comment-meta{display:flex;justify-content:space-between;font-weight:800;font-size:13px;color:#695443;margin-bottom:6px}
.comment-left{display:flex;align-items:center;gap:8px}
.comment-name .badge-author{margin-left:4px;background:#fde2c7;color:#b3542d;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px}
.comment-actions{display:flex;gap:6px}
.comment-actions button{border:none;background:#f2e0c7;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer}
.comment-actions button:hover{background:#e3cfae}
.comment-actions .warn{background:#ffe4e4}
.edit-box{display:flex;gap:8px;align-items:center;margin-bottom:6px}
.edit-box input{flex:1;border:1px solid #d9c7a7;border-radius:10px;padding:8px 10px}
.edit-buttons button{border:none;background:#d4b487;color:#fff;border-radius:8px;padding:6px 12px;margin-right:4px;cursor:pointer}
.edit-buttons button:last-child{background:#ccc;color:#333}
.comment-text{margin:0;color:#3f3327;line-height:1.5}
.empty{min-height:60vh;display:grid;place-items:center;color:#7a6f63;font-weight:700}
</style>
