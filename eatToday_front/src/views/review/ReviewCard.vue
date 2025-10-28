<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { likeReview } from '@/mock/review.js'
import { fetchReviewDetail } from '@/api/photoReviewAnju'

/** 상세 이미지 캐시 */
const detailThumbnailCache = new Map()
const pendingDetailThumbnails = new Map()

const router = useRouter()

const props = defineProps({
  // item = { id, reviewNo, title, content, authorName, authorAvatar, likeCount, imgUrl, files: [...] }
  item: { type: Object, required: true }
})

/* 좋아요 카운트 반응형 */
const likes = ref(props.item?.likeCount ?? 0)
watch(() => props.item?.likeCount, v => (likes.value = v ?? 0))

/* 상세 페이지 이동 */
function goDetail() {
  const id = props.item?.id || props.item?.reviewNo
  if (!id) return
  router.push({
    path: `/reviews/${id}`,
    state: { imgUrl: props.item?.imgUrl || '' }
  })
}

/* 좋아요 클릭 */
async function onLike(e) {
  e.stopPropagation()
  const id = props.item?.id || props.item?.reviewNo
  if (!id) return
  likes.value = await likeReview(id) // 실제 API면 서버 응답의 likeCount로 갱신
}

/* ---------------- 이미지 URL 유틸 ---------------- */
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'
const FRONT_ORIGIN = window.location.origin
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i

const ORDER_KEYS = [
  'sort','order','sequence','seq','fileOrder','fileSeq','fileSequence','fileSort',
  'prFileSeq','prFileOrder','displayOrder','priority','position','index','idx','rownum','rnum'
]
const RAW_URL_KEYS = [
  'prFileUrl','prFilePath','prFileFullPath','prFileOriginName','prFileOriginalName','prFileStoredName',
  'prStoredFileName','prOriginFileName','prFileServerName','fileUrl','fileUrlPath','filePath','file_full_path',
  'fileFullPath','urlOrPath','url','path','pr_file_url','pr_file_path','file_path','originName','originalName',
  'originFileName','storedName','storedFileName','storedFilePath','stored_path','storedPath','storedUrl','stored_url',
  'saveName','saveFileName','savedFileName','saveFilePath','save_file_path','save_file_name','savePath','uploadPath',
  'uploadDir','uploadDirectory','uploadUrl','directory','location','fileName','filename','originFilename','origin_file_name'
]
const FILE_COLLECTION_KEYS = [
  'files','file','fileList','reviewFiles','reviewFile','reviewFileList','photoReviewFiles','photoReviewFile',
  'photoReviewFileList','photoReviewFileDtoList','photoReviewFileDtos','photoReviewFileResponses','photoReviewFileResponseList',
  'photoFiles','photoFileList','photoFile','photos','photo','photoList','imageRecords','imageDtos','imageObjects',
  'media','fileDtoList','fileDto','fileDtos','prFiles','prFileList','prFileDtos','photoReviewFileDtoResponses',
  'fileResponses','fileResponseList','attachments','attachmentList','images','imageList','imageUrls','imagePaths',
  'thumbnails','thumbnailList'
]

function joinOrigin(origin, segment) {
  const base = String(origin || '').replace(/\/+$/, '')
  const tail = String(segment || '').replace(/\\/g, '/').replace(/^\/+/, '')
  return tail ? `${base}/${tail}` : base
}

function resolveImg(rawUrl) {
  const url = String(rawUrl || '').replace(/\\/g, '/').trim()
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (/^https?:\/\//i.test(url)) return url
  if (/^[a-zA-Z]:\//.test(url)) {
    // Windows 절대경로 → 경로만 재귀 처리
    return resolveImg(url.slice(2))
  }

  const lower = url.toLowerCase()

  // 백엔드 정적매핑: /photo_review/**
  const photoIdx = lower.lastIndexOf('/photo_review/')
  if (photoIdx !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx))
  const photoIdx2 = lower.lastIndexOf('photo_review/')
  if (photoIdx2 !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx2))
  const photoIdx3 = lower.lastIndexOf('photoreview/')
  if (photoIdx3 !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx3))

  // 프론트 public: /images/**
  const imgIdx = lower.lastIndexOf('/images/')
  if (imgIdx !== -1) return joinOrigin(FRONT_ORIGIN, url.slice(imgIdx))
  const imgIdx2 = lower.lastIndexOf('images/')
  if (imgIdx2 !== -1) return joinOrigin(FRONT_ORIGIN, url.slice(imgIdx2))

  // 상대경로 → API_ORIGIN 기준
  const normalized = url.startsWith('/') ? url : '/' + url
  return joinOrigin(API_ORIGIN, normalized)
}

function pickRawFilePath(file) {
  if (!file) return ''
  if (typeof file === 'string') return file

  for (const key of RAW_URL_KEYS) {
    const val = file[key]
    if (typeof val === 'string' && val.trim()) return val
  }

  // 파일명만 있는 경우 조합 시도
  const entries = Object.entries(file).filter(
    ([, val]) => typeof val === 'string' && val.trim()
  )
  const withExt = entries
    .map(([k, v]) => [k, v.trim()])
    .filter(([, v]) => IMAGE_EXT_RE.test(v))
  const withSlash = withExt.find(([, v]) => v.includes('/') || v.includes('\\'))
  if (withSlash) return withSlash[1]
  if (withExt.length) return withExt[0][1]
  return ''
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
      if (hasFileLikeKey) results.push(current)

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
      const numericOrder = ORDER_KEYS.map(key => Number(entry[key]))
        .filter(n => Number.isFinite(n))
        .sort((a, b) => a - b)[0]
      const idKeys = ['prFileNo','fileNo','id','fileId','file_no','fileSeq','seq']
      const numericId = idKeys.map(key => Number(entry[key]))
        .filter(n => Number.isFinite(n))
        .sort((a, b) => a - b)[0]
      const order =
        (Number.isFinite(numericOrder) ? numericOrder : null) ??
        (Number.isFinite(numericId) ? numericId : null) ??
        idx
      return { entry, order, idx }
    })
    .sort((a, b) => (a.order === b.order ? a.idx - b.idx : a.order - b.order))
    .map(item => item.entry)
}

/* ✅ "상세페이지의 첫 번째 사진"을 엄격히 선택 */
function parseDateMaybe(v) {
  const t = Date.parse(v)
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY
}

function pickFirstPhotoStrict(detailOrItem) {
  // 1) 우선순위: files 배열
  const files = detailOrItem?.files
  if (Array.isArray(files) && files.length) {
    // 정렬 기준: 표시순서(ORDER_KEYS) → prFileNo/fileNo → prFileAt/createdAt
    const sorted = [...files].sort((a, b) => {
      const orderA = ORDER_KEYS.map(k => Number(a?.[k])).find(Number.isFinite)
      const orderB = ORDER_KEYS.map(k => Number(b?.[k])).find(Number.isFinite)
      if (Number.isFinite(orderA) || Number.isFinite(orderB)) {
        return (orderA ?? Infinity) - (orderB ?? Infinity)
      }
      const idA = Number(a?.prFileNo ?? a?.fileNo ?? a?.id)
      const idB = Number(b?.prFileNo ?? b?.fileNo ?? b?.id)
      if (Number.isFinite(idA) || Number.isFinite(idB)) {
        return (Number.isFinite(idA) ? idA : Infinity) - (Number.isFinite(idB) ? idB : Infinity)
      }
      const tA = parseDateMaybe(a?.prFileAt ?? a?.createdAt ?? a?.created_at)
      const tB = parseDateMaybe(b?.prFileAt ?? b?.createdAt ?? b?.created_at)
      return tA - tB
    })

    // 첫 번째 항목의 URL 생성
    const first = sorted[0]
    // ① URL 계열 우선
    const raw =
      first?.prFileUrl ??
      first?.fileUrl ??
      first?.url ??
      first?.path ??
      first?.pr_file_url ??
      first?.file_path ??
      first?.pr_file_path

    if (raw) return resolveImg(raw)

    // ② rename → 프론트 public 경로
    const rename =
      first?.prFileRename ??
      first?.storedFileName ??
      first?.storedName ??
      first?.saveFileName
    if (rename) return joinOrigin(FRONT_ORIGIN, `/images/photo_review/${rename}`)

    // ③ 기타 문자열에서 파일명/경로 추출
    const picked = pickRawFilePath(first)
    if (picked) return resolveImg(picked)
  }

  // 2) files가 없으면 기존 일반 탐색
  // (대표 필드들 → nested 파일들)
  const directCandidates = [
    detailOrItem?.thumbnailUrl, detailOrItem?.imageUrl, detailOrItem?.imgUrl,
    detailOrItem?.fileUrl, detailOrItem?.photoUrl
  ]
  for (const c of directCandidates) {
    const u = resolveImg(c)
    if (u) return u
  }

  const entries = sortFileEntries(extractFiles(detailOrItem))
  for (const entry of entries) {
    const u = resolveImg(pickRawFilePath(entry))
    if (u) return u
  }

  return ''
}

/* ✅ 카드 데이터에서 대표 이미지 자동 추출 (즉시) */
const thumbnailUrlDirect = computed(() => pickFirstPhotoStrict(props.item))

/* ✅ 폴백으로 상세 호출해 엄격 추출 */
const thumbnail = ref('')
async function resolveThumbnailFromDetail() {
  const rawId = props.item?.id ?? props.item?.reviewNo ?? props.item?.review_id
  const reviewId = Number(rawId)
  if (!Number.isFinite(reviewId)) return ''

  if (detailThumbnailCache.has(reviewId)) {
    return detailThumbnailCache.get(reviewId) ?? ''
  }
  if (pendingDetailThumbnails.has(reviewId)) {
    return pendingDetailThumbnails.get(reviewId)
  }

  const promise = (async () => {
    try {
      const detail = await fetchReviewDetail(reviewId)
      const url = pickFirstPhotoStrict(detail) || ''
      detailThumbnailCache.set(reviewId, url)
      return url
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[ReviewCard] 상세 이미지 로드 실패:', reviewId, err)
      }
      detailThumbnailCache.set(reviewId, '')
      return ''
    } finally {
      pendingDetailThumbnails.delete(reviewId)
    }
  })()

  pendingDetailThumbnails.set(reviewId, promise)
  return promise
}

/* ✅ 최종 썸네일 결정: 즉시 추출 → 상세 호출 폴백 */
watch(
  () => [thumbnailUrlDirect.value, props.item?.id, props.item?.reviewNo],
  async () => {
    const direct = thumbnailUrlDirect.value
    if (direct) {
      thumbnail.value = direct
      return
    }
    const fallback = await resolveThumbnailFromDetail()
    thumbnail.value = fallback || ''
  },
  { immediate: true }
)
</script>

<template>
  <article class="card" @click="goDetail" tabindex="0" @keyup.enter="goDetail">
    <!-- ✅ 썸네일: 상세의 '첫 번째 사진' 우선 -->
    <div class="thumb">
      <img v-if="thumbnail" :src="thumbnail" alt="리뷰 이미지" />
      <div v-else class="placeholder">이미지</div>

      <!-- 좋아요 배지 -->
      <button class="like-badge" @click="onLike" aria-label="좋아요">
        <span class="heart">♡</span>
        <span class="cnt">{{ likes }}</span>
      </button>
    </div>

    <!-- 하단 메타 -->
    <div class="meta">
      <div class="row">
        <img
          v-if="item?.authorAvatar"
          :src="item.authorAvatar"
          class="avatar"
          alt="작성자"
        />
        <div v-else class="avatar ph">👤</div>
        <div class="text">
          <div class="name">{{ item?.authorName || 'user' }}</div>
          <div class="desc">{{ item?.title || item?.reviewTitle || '제목 없음' }}</div>
          <div class="sub">{{ item?.content || item?.reviewContent || '' }}</div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card{
  background:#f6efe2;
  border-radius:18px;
  padding:12px;
  box-shadow:0 8px 24px rgba(50,30,0,.07);
  cursor:pointer;
  transition:transform .15s ease, box-shadow .15s ease;
}
.card:hover{ transform:translateY(-2px); box-shadow:0 10px 28px rgba(50,30,0,.10); }

.thumb{
  position:relative;
  width:100%;
  aspect-ratio:16/10;
  background:#ece5dc;
  border-radius:14px;
  overflow:hidden;
}
.thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
.placeholder{ width:100%; height:100%; display:grid; place-items:center; color:#9a8b7a; font-weight:800; }

/* 좋아요 배지 */
.like-badge{
  position:absolute; top:10px; right:10px;
  display:flex; align-items:center; gap:6px;
  border:none; background:#ffffff;
  padding:6px 10px; border-radius:999px;
  box-shadow:0 6px 16px rgba(0,0,0,.12);
  font-weight:900; color:#2e2318; cursor:pointer;
}
.heart{ font-size:16px; line-height:1; }
.cnt{ font-size:14px; }

.meta{ padding:12px 6px 4px; }
.row{ display:flex; gap:10px; align-items:flex-start; }
.avatar{ width:36px; height:36px; border-radius:50%; object-fit:cover; background:#f0eadf; }
.avatar.ph{ display:grid; place-items:center; font-size:18px; }
.text{ display:grid; gap:2px; }
.name{ font-weight:900; color:#2f2419; }
.desc{ color:#2f2419; font-weight:800; }
.sub{
  color:#6b5b4a; font-size:13px;
  display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
}
</style>
