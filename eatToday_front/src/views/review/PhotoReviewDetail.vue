<!-- src/views/review/PhotoReviewDetail.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchReviewDetail,
  listComments,
  addComment,
  updateComment,
  deleteComment
} from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()
const reviewNo = Number(route.params.id || route.params.reviewNo)

const review = ref(null)
const comments = ref([])
const input = ref('')
const editingId = ref(null)
const editText = ref('')

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

function timeAgo(isoOrTs) {
  const ts = typeof isoOrTs === 'number' ? isoOrTs : Date.parse(isoOrTs)
  const h = Math.max(1, Math.floor((Date.now() - ts) / 3600000))
  return `${h}시간 전`
}

async function load() {
  try {
    const r = await fetchReviewDetail(reviewNo)
    if (!r) {
      alert('리뷰를 찾을 수 없어요.')
      router.replace('/reviews')
      return
    }
    review.value = r
    comments.value = await listComments(reviewNo)
  } catch (e) {
    console.error('❌ 리뷰 로드 실패:', e)
    alert('데이터를 불러오지 못했습니다.')
  }
}

/* ---------------- 이미지 URL 해석기 ---------------- */
// 백엔드 오리진(필요 시 .env에 VITE_API_ORIGIN=http://localhost:7777 설정)
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'
const FRONT_ORIGIN = window.location.origin
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i
const RAW_URL_KEYS = [
  'prFileUrl',
  'prFilePath',
  'prFileFullPath',
  'prFileOriginName',
  'prFileOriginalName',
  'prFileStoredName',
  'prStoredFileName',
  'prOriginFileName',
  'prFileServerName',
  'fileUrl',
  'fileUrlPath',
  'filePath',
  'file_full_path',
  'fileFullPath',
  'urlOrPath',
  'url',
  'path',
  'pr_file_url',
  'pr_file_path',
  'file_path',
  'originName',
  'originalName',
  'originFileName',
  'storedName',
  'saveName',
  'saveFileName',
  'savedFileName',
  'savePath',
  'directory',
  'location'
]
const FILE_COLLECTION_KEYS = [
  'files',
  'file',
  'fileList',
  'reviewFiles',
  'reviewFile',
  'reviewFileList',
  'photoReviewFiles',
  'photoReviewFile',
  'photoReviewFileList',
  'photoReviewFileDtoList',
  'photoReviewFileDtos',
  'photoReviewFileResponses',
  'photoReviewFileResponseList',
  'photoFiles',
  'photoFile',
  'photoFileList',
  'fileResponses',
  'fileResponseList',
  'attachments',
  'attachmentList',
  'images',
  'imageList',
  'imageUrls',
  'imagePaths',
  'thumbnails',
  'thumbnailList'
]

function resolveImg(rawUrl) {
  const url = String(rawUrl || '').replace(/\\/g, '/').trim()
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (/^https?:\/\//i.test(url)) return url

  // Windows 절대경로 C:/... → 경로 부분만 사용
  if (/^[a-zA-Z]:\//.test(url)) {
    return resolveImg(url.slice(2))
  }

  const lower = url.toLowerCase()

  // 로컬 파일 시스템 절대경로(C:/.../photo_review/...) → API_ORIGIN + /photo_review/...
  const photoMarker = '/photo_review/'
  const photoIdx = lower.lastIndexOf(photoMarker)
  if (photoIdx !== -1) {
    return API_ORIGIN + url.slice(photoIdx)
  }
  const photoIdx2 = lower.lastIndexOf('photo_review/')
  if (photoIdx2 !== -1) {
    return API_ORIGIN + '/' + url.slice(photoIdx2)
  }
  const photoIdx3 = lower.lastIndexOf('photoreview/')
  if (photoIdx3 !== -1) {
    return API_ORIGIN + '/' + url.slice(photoIdx3)
  }

  // 프론트 public에 있는 상대경로: /images/... 혹은 images/...
  const imgMarker = '/images/'
  const imgIdx = lower.lastIndexOf(imgMarker)
  if (imgIdx !== -1) {
    return FRONT_ORIGIN + url.slice(imgIdx)
  }
  const imgIdx2 = lower.lastIndexOf('images/')
  if (imgIdx2 !== -1) {
    return FRONT_ORIGIN + '/' + url.slice(imgIdx2)
  }

  // 그 외 상대경로는 API_ORIGIN 기준으로 처리
  const normalized = url.startsWith('/') ? url : '/' + url
  return API_ORIGIN + normalized
}

// 파일 DTO가 어떤 키를 쓰든 안전하게 URL 뽑기
function pickRawFilePath(file) {
  if (!file) return ''
  if (typeof file === 'string') return file

  for (const key of RAW_URL_KEYS) {
    const val = file[key]
    if (typeof val === 'string' && val.trim()) return val
  }

  const entries = Object.entries(file).filter(
    ([, val]) => typeof val === 'string' && val.trim()
  )

  // 1) 값 자체가 경로/파일명 포함 문자열
  const withExt = entries
    .map(([k, v]) => [k, v.trim()])
    .filter(([, v]) => IMAGE_EXT_RE.test(v))

  const withSlash = withExt.find(([, v]) => v.includes('/') || v.includes('\\'))
  if (withSlash) return withSlash[1]

  // 2) 경로와 파일명이 분리돼 있다면 조합
  if (withExt.length) {
    const filename = withExt[0][1].replace(/^\.?[/\\]+/, '')
    const pathCandidate = entries
      .map(([, v]) => v)
      .find(v => /photo[\W_]?review/i.test(v) || /upload/i.test(v) || v.endsWith('/') || v.includes('\\'))

    if (pathCandidate) {
      const cleanedPath = pathCandidate.replace(/\\/g, '/').replace(/\/+$/, '')
      return `${cleanedPath}/${filename}`
    }
    return filename
  }

  return ''
}

function fileUrl(f) {
  return resolveImg(pickRawFilePath(f))
}
function fileKey(f) {
  return f?.prFileNo ?? f?.fileNo ?? f?.id ?? `${fileUrl(f)}`
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

    if (typeof current === 'string') {
      if (current.trim()) results.push(current)
      continue
    }

    if (Array.isArray(current)) {
      queue.push(...current)
      continue
    }

    if (typeof current === 'object') {
      if (seen.has(current)) continue
      seen.add(current)

      const hasFileLikeKey = RAW_URL_KEYS.some(
        key => typeof current[key] === 'string' && current[key].trim()
      )
      if (hasFileLikeKey) {
        results.push(current)
      }

      for (const key of FILE_COLLECTION_KEYS) {
        const nested = current[key]
        if (nested) queue.push(nested)
      }
    }
  }

  return results
}

const galleryFiles = computed(() => {
  if (!review.value) return []
  const direct = [
    review.value.thumbnailUrl,
    review.value.thumbnailPath,
    review.value.imageUrl,
    review.value.imgUrl,
    review.value.imagePath,
    review.value.imgPath,
    review.value.photoUrl,
    review.value.mainImage,
    review.value.mainImageUrl,
    review.value.coverUrl,
    review.value.thumbnail,
    review.value.thumbnailImage,
    review.value.fileUrl,
    review.value.filePath,
    review.value.file_path,
    review.value.previewUrl,
    review.value.firstImage
  ].filter(v => typeof v === 'string' && v.trim())
  return [...direct, ...extractFiles(review.value)]
})
/* --------------------------------------------------- */

onMounted(load)

async function submitComment() {
  if (!requireLogin()) return
  const text = input.value?.trim()
  if (!text) return alert('댓글을 입력해 주세요.')
  try {
    await addComment(reviewNo, { memberNo: 1, content: text })
    comments.value = await listComments(reviewNo)
    input.value = ''
  } catch (e) {
    console.error('댓글 등록 실패:', e?.response?.data || e)
    alert('댓글 등록 실패: ' + (e.response?.data?.message || e.message))
  }
}

function startEdit(c) {
  const id = Number(c.prcNo ?? c.commentNo ?? c.id)
  if (!Number.isFinite(id)) { alert('댓글 ID가 유효하지 않습니다.'); return }
  editingId.value = id
  editText.value = c.prcDetail ?? c.content ?? ''
}

function cancelEdit() {
  editingId.value = null
  editText.value = ''
}

async function saveEdit() {
  if (!requireLogin()) return
  const id = Number(editingId.value)
  if (!Number.isFinite(id)) { alert('댓글 ID가 유효하지 않습니다.'); return }
  const text = (editText.value ?? '').trim()
  if (!text) { cancelEdit(); return }
  try {
    await updateComment(id, { memberNo: 1, prcDetail: text, reviewNo })
    comments.value = await listComments(reviewNo)
    cancelEdit()
  } catch (e) {
    console.error('댓글 수정 실패:', e?.response?.data || e)
    alert('댓글 수정 실패: ' + (e.response?.data?.message || e.message))
  }
}

async function removeComment(c) {
  if (!requireLogin()) return
  const id = Number(c.prcNo ?? c.commentNo ?? c.id)
  if (!Number.isFinite(id)) { alert('댓글 ID가 유효하지 않습니다.'); return }
  try {
    await deleteComment(id, 1)
    comments.value = await listComments(reviewNo)
  } catch (e) {
    console.error('댓글 삭제 실패:', e?.response?.data || e)
    alert('댓글 삭제 실패: ' + (e.response?.data?.message || e.message))
  }
}
</script>

<template>
  <section v-if="review" class="page">
    <header class="top">
      <button class="back" @click="router.back()">←</button>
      <div class="titlebox">
        <h1>{{ review.reviewTitle || review.title }}</h1>
        <div class="authorline">
          <div class="avatar">👤</div>
          <div class="name-time">
            <div class="name">{{ review.memberEmail || review.authorName || '익명 사용자' }}</div>
            <div class="time">{{ timeAgo(review.reviewDate || review.createdAt) }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 이미지 -->
    <div class="photo-box">
      <template v-if="galleryFiles.length">
        <img
          v-for="f in galleryFiles"
          :key="fileKey(f)"
          :src="fileUrl(f)"
          class="photo"
          :alt="review.reviewTitle || review.title || '리뷰 이미지'"
        />
      </template>
      <div v-else class="photo placeholder">이미지 없음</div>
    </div>

    <article class="content">
      <p style="white-space: pre-wrap">{{ review.reviewContent || review.content }}</p>
    </article>

    <!-- 댓글 -->
    <section class="comments">
      <div class="count">댓글 <b>{{ comments.length }}</b></div>

      <div class="write">
        <div class="me">🙂 user</div>
        <input
          v-model="input"
          placeholder="댓글을 작성해 주세요."
          @keyup.enter="submitComment"
        />
        <button class="ok" @click="submitComment">등록</button>
      </div>

      <ul class="list">
        <li v-for="c in comments" :key="c.prcNo ?? c.commentNo ?? c.id" class="item">
          <div class="left">👤</div>
          <div class="right">
            <div class="who">{{ c.memberEmail || c.authorName || '익명' }}</div>

            <div v-if="editingId !== (c.prcNo ?? c.commentNo ?? c.id)" class="bubble">
              {{ c.prcDetail ?? c.content }}
            </div>

            <div v-else class="edit-row">
              <input v-model="editText" />
              <div class="edit-actions">
                <button @click="saveEdit()">완료</button>
                <button @click="cancelEdit">취소</button>
              </div>
            </div>

            <div class="actions">
              <button class="chip" @click="startEdit(c)">수정</button>
              <button class="chip warn" @click="removeComment(c)">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </section>

  <section v-else class="page">불러오는 중...</section>
</template>

<style scoped>
.page{max-width:860px;margin:12px auto 60px;padding:0 10px;color:#2e2318}
.top{display:flex;align-items:center;gap:12px;margin:8px 0 16px;position:relative;}
.back{border:none;background:transparent;font-size:28px;cursor:pointer}
.titlebox h1{margin:2px 0 8px;font-size:22px;font-weight:900}
.authorline{display:flex;align-items:center;gap:8px}
.avatar{width:34px;height:34px;border-radius:50%;background:#f0eadf;display:grid;place-items:center}
.name-time .name{font-weight:900}
.name-time .time{font-size:12px;color:#8a7a6a}
.photo-box{display:flex;justify-content:center;margin:8px 0 16px;flex-wrap:wrap;gap:10px}
.photo{width:100%;max-width:720px;border-radius:8px;object-fit:cover}
.photo.placeholder{width:100%;max-width:720px;aspect-ratio:16/10;background:#ece5dc;display:grid;place-items:center;color:#9a8b7a}
.content{background:#fff;border-radius:10px;padding:14px;line-height:1.7}
.comments{background:#eae2d6;border-radius:12px;padding:14px;margin-top:14px}
.count{margin:4px 2px 10px}
.write{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.write input{flex:1;background:#fff;border:1px solid #e0d5c4;border-radius:8px;padding:10px}
.write .ok{background:#fff;border:1px solid #c9ae86;border-radius:8px;padding:8px 10px;cursor:pointer}
.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.item{display:flex;gap:10px}
.left{width:32px;height:32px;border-radius:50%;background:#f0eadf;display:grid;place-items:center}
.right{flex:1}
.who{font-size:13px;color:#6b5b4a;margin-bottom:4px}
.bubble{background:#fff;border-radius:10px;padding:10px}
.actions{display:flex;gap:6px;margin-top:6px}
.chip{border:none;background:#fff;border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer}
.chip.warn{background:#ffe8e8}
.edit-row{display:flex;gap:8px;align-items:center}
.edit-row input{flex:1;background:#fff;border:1px solid #d5c9ba;border-radius:8px;padding:8px}
.edit-actions button{margin-left:4px;border:1px solid #d5c9ba;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer}
</style>
