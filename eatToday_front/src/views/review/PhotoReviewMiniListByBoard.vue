<!-- src/views/review/PhotoReviewMiniListByBoard.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchReviewsByBoard } from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  boardNo: { type: [Number, String], default: null },
  limit: { type: Number, default: 6 }
})

const items = ref([])
const loading = ref(false)
const error = ref('')
const loungePath = '/rounge'

const count = computed(() => {
  const n = Number(props.limit)
  return Number.isFinite(n) && n > 0 ? n : 6
})

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'
const FRONT_ORIGIN = window.location.origin
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i
const RAW_URL_KEYS = [
  'thumbnailUrl',
  'thumbnailPath',
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
  'storedFileName',
  'storedFilePath',
  'stored_path',
  'storedPath',
  'storedUrl',
  'stored_url',
  'saveName',
  'saveFileName',
  'savedFileName',
  'saveFilePath',
  'save_file_path',
  'save_file_name',
  'savePath',
  'uploadPath',
  'uploadDir',
  'uploadDirectory',
  'uploadUrl',
  'directory',
  'location',
  'fileName',
  'filename',
  'originFilename',
  'origin_file_name'
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
  'photos',
  'photo',
  'photoList',
  'imageRecords',
  'imageDtos',
  'imageObjects',
  'media',
  'fileDtoList',
  'fileDto',
  'fileDtos',
  'prFiles',
  'prFileList',
  'prFileDtos',
  'photoReviewFileDtoResponses',
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

function joinOrigin(origin, segment) {
  const base = String(origin || '').replace(/\/+$/, '')
  const tail = String(segment || '').replace(/\\/g, '/').replace(/^\/+/, '')
  return tail ? `${base}/${tail}` : ''
}

function parseBoardNo(value) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

const activeBoardNo = ref(resolveBoardNo())
const lastLoadedBoard = ref(null)

function resolveBoardNo() {
  return (
    parseBoardNo(props.boardNo) ??
    parseBoardNo(route.params.boardNo) ??
    parseBoardNo(route.params.id) ??
    parseBoardNo(route.params.reviewNo) ??
    parseBoardNo(route.params.anjuNo) ??
    1
  )
}

function extractBoardNoFromRecord(record) {
  if (!record || typeof record !== 'object') return null
  return (
    parseBoardNo(record.boardNo) ??
    parseBoardNo(record.reviewBoardNo) ??
    parseBoardNo(record.board_no) ??
    parseBoardNo(record.anjuNo) ??
    parseBoardNo(record.anju_no) ??
    parseBoardNo(record.foodBoardNo) ??
    parseBoardNo(record.foodNo) ??
    parseBoardNo(record.food_id) ??
    parseBoardNo(record.boardId) ??
    parseBoardNo(record.id)
  )
}

watch(
  () => [
    props.boardNo,
    route.params.boardNo,
    route.params.id,
    route.params.reviewNo,
    route.params.anjuNo
  ],
  () => {
    const next = resolveBoardNo()
    if (next !== activeBoardNo.value) {
      activeBoardNo.value = next
      load()
    } else if (next !== lastLoadedBoard.value) {
      load()
    }
  },
  { immediate: true }
)

function resolveImg(rawUrl) {
  const url = String(rawUrl || '').replace(/\\/g, '/').trim()
  if (!url) return ''
  if (url.startsWith('data:')) return url
  if (/^https?:\/\//i.test(url)) return url

  if (/^[a-zA-Z]:\//.test(url)) {
    return resolveImg(url.slice(2))
  }

  const lower = url.toLowerCase()

  const photoMarker = '/photo_review/'
  const photoIdx = lower.lastIndexOf(photoMarker)
  if (photoIdx !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx))
  const photoIdx2 = lower.lastIndexOf('photo_review/')
  if (photoIdx2 !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx2))
  const photoIdx3 = lower.lastIndexOf('photoreview/')
  if (photoIdx3 !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx3))
  const photoIdx4 = lower.lastIndexOf('photoreview\\')
  if (photoIdx4 !== -1) return joinOrigin(API_ORIGIN, url.slice(photoIdx4))

  const imgMarker = '/images/'
  const imgIdx = lower.lastIndexOf(imgMarker)
  if (imgIdx !== -1) return joinOrigin(FRONT_ORIGIN, url.slice(imgIdx))
  const imgIdx2 = lower.lastIndexOf('images/')
  if (imgIdx2 !== -1) return joinOrigin(FRONT_ORIGIN, url.slice(imgIdx2))

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

  const entries = Object.entries(file).filter(
    ([, val]) => typeof val === 'string' && val.trim()
  )

  const withExt = entries
    .map(([k, v]) => [k, v.trim()])
    .filter(([, v]) => IMAGE_EXT_RE.test(v))

  const withSlash = withExt.find(([, v]) => v.includes('/') || v.includes('\\'))
  if (withSlash) return withSlash[1]

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

function extractFiles (record) {
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

/** 로그인 체크 (로컬스토리지 여러 키 지원) */
function isLoggedIn () {
  const t =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  return !!(t && t !== 'null' && t !== 'undefined')
}
function requireLogin () {
  if (!isLoggedIn()) {
    alert('로그인이 필요합니다.')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return false
  }
  return true
}

function normalize (list = []) {
  return list
    .map(r => {
      // ... (id, title, nickname, likes, avatarRaw 계산은 그대로)

      // ✅ 0) files[] 최우선 처리
      let imgUrl = firstImageFromFiles(r)

      // ✅ 1) 파일에서 못 찾았으면 direct candidates
      if (!imgUrl) {
        const directCandidates = [
          r?.thumbnailUrl,
          r?.thumbnailPath,
          r?.imageUrl,
          r?.imgUrl,
          r?.imagePath,
          r?.imgPath,
          r?.photoUrl,
          r?.photo,
          r?.photoSrc,
          r?.photoURL,
          r?.photoPath,
          r?.mainImage,
          r?.mainImageUrl,
          r?.mainImagePath,
          r?.coverUrl,
          r?.cover,
          r?.thumbnail,
          r?.thumbnailImage,
          r?.fileUrl,
          r?.filePath,
          r?.file_path,
          r?.previewUrl,
          r?.firstImage,
          r?.image,
          r?.imageSrc,
          r?.img,
          r?.firstImageUrl,
          r?.mediaUrl,
          r?.mediaPath,
          r?.media,
          r?.resourceUrl
        ]
        imgUrl = directCandidates.map(resolveImg).find(Boolean) || ''
      }

      // ✅ 2) 배열/중첩 객체에서 탐색
      if (!imgUrl) {
        const arrayCandidates = [
          r?.imgUrls,
          r?.imgUrlList,
          r?.imageList,
          r?.images,
          r?.imageArray,
          r?.photos,
          r?.photoList,
          r?.thumbnails,
          r?.thumbnailList,
          r?.mediaList
        ]
        for (const group of arrayCandidates) {
          if (!Array.isArray(group)) continue
          const str = group.find(v => typeof v === 'string' && v.trim())
          if (str) { imgUrl = resolveImg(str); if (imgUrl) break }
          const obj = group.find(v => v && typeof v === 'object')
          if (obj) {
            const raw = pickRawFilePath(obj)
            const resolved = resolveImg(raw)
            if (resolved) { imgUrl = resolved; break }
          }
        }
      }

      // ✅ 3) files[] 전체 순회(이전 일반화 로직)
      if (!imgUrl) {
        const fileEntries = extractFiles(r)
        for (const entry of fileEntries) {
          const resolved = resolveImg(pickRawFilePath(entry))
          if (resolved) { imgUrl = resolved; break }
        }
      }

      if (!imgUrl && import.meta.env.DEV) {
        console.warn('[PhotoReviewMiniList] 이미지 경로 없음:', r)
      }

      const rawNames = [
        r?.member_id,
        r?.memberId,
        r?.member_nickname,
        r?.memberNickname,
        r?.member_name,
        r?.memberName,
        r?.nickname,
        r?.nickName,
        r?.userNickname,
        r?.userName,
        r?.name,
        r?.authorName,
        r?.author_name,
        r?.writerName,
        r?.writer_name,
        r?.reviewWriter,
        r?.review_writer,
        r?.reviewWriterName,
        r?.review_writer_name,
        r?.memberEmail,
        r?.member_email,
        r?.email,
        r?.member?.member_id,
        r?.member?.memberId,
        r?.member?.member_nickname,
        r?.member?.memberNickname,
        r?.member?.member_name,
        r?.member?.memberName,
        r?.member?.nickname,
        r?.member?.name,
        r?.author?.name,
        r?.author?.nickname,
        r?.writer?.name,
        r?.writer?.nickname
      ]
      const nameCandidates = rawNames
        .map(v => (typeof v === 'string' ? v.trim() : ''))
        .filter(name => {
          if (!name) return false
          const lower = name.toLowerCase()
          if (lower === 'user' || lower === 'guest' || lower === '익명' || lower === 'anonymous') return false
          return true
        })

      const memberNoValue = Number(r?.memberNo ?? r?.member_no)
      const nickname =
        nameCandidates[0] ||
        (Number.isFinite(memberNoValue) ? `회원#${memberNoValue}` : '') ||
        '작성자'

      // ... 반환 객체는 기존과 동일
      return {
        id: Number(
          r?.reviewNo ?? r?.review_no ?? r?.prReviewNo ?? r?.pr_review_no ??
          r?.photoReviewNo ?? r?.photo_review_no ?? r?.photoReviewId ??
          r?.reviewId ?? r?.id ?? r?.prFileGroupNo
        ) || null,
        title:
          r?.reviewTitle ?? r?.title ?? r?.subject ??
          (r?.menuName ? `${r.menuName} 리뷰` : '제목 없음'),
        imgUrl,
        nickname,
        memberId: nameCandidates[0] || (Number.isFinite(memberNoValue) ? `회원#${memberNoValue}` : null),
        memberNo: Number.isFinite(memberNoValue) ? memberNoValue : null,
        likes: Number(
          r?.likeCount ?? r?.reviewLike ?? r?.likes ?? r?.reviewLikeCount ??
          r?.heartCount ?? r?.goodCount ?? r?.favoriteCount ?? r?.like_cnt ?? 0
        ) || 0,
        avatar: resolveImg(
          r?.member?.profileImageUrl ?? r?.member?.profileImage?.url ??
          r?.writer?.avatarUrl ?? r?.author?.avatarUrl ??
          r?.authorAvatar ?? r?.profileImage ?? r?.profileUrl ?? r?.avatar ?? ''
        )
      }
    })
    .filter(it => it.id !== null)
}

async function load () {
  const board = parseBoardNo(activeBoardNo.value)
  if (!board) {
    items.value = []
    lastLoadedBoard.value = null
    return
  }
  loading.value = true
  error.value = ''
  try {
    const data = await fetchReviewsByBoard(board)
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.list)
      ? data.list
      : []
    items.value = normalize(list).slice(0, count.value)
    lastLoadedBoard.value = board
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || '로드 실패'
  } finally {
    loading.value = false
  }
}

/** 등록 직후 이벤트로 최상단에 끼워 넣기 */
function handleCreated (e) {
  const r = e.detail
  const eventBoardNo = extractBoardNoFromRecord(r)
  if (eventBoardNo && eventBoardNo !== activeBoardNo.value) return
  const [norm] = normalize([r])
  if (!norm) {
    load()
    return
  }
  items.value = [norm, ...items.value].slice(0, count.value)
}

function goCreate () {
  if (!requireLogin()) return
  const board = parseBoardNo(activeBoardNo.value)
  if (board) router.push(`/boards/${board}/reviews/new`)
}
function goDetail (id) {
  if (!requireLogin()) return
  const n = Number(id)
  if (Number.isFinite(n)) {
    router.push({
      path: `/reviews/${n}`,
      state: { imgUrl: items.value.find(it => it.id === n)?.imgUrl || '' }
    })
  }
}
function goLounge () {
  router.push(loungePath)
}

function firstImageFromFiles(r) {
  if (!r || !Array.isArray(r.files) || r.files.length === 0) return ''

  // 대표는 첫 번째 파일 기준
  const f = r.files[0]

  // ✅ 1순위: URL이 이미 있으면 그대로
  if (typeof f.prFileUrl === 'string' && f.prFileUrl.trim()) {
    return resolveImg(f.prFileUrl)
  }
  if (typeof f.fileUrl === 'string' && f.fileUrl.trim()) {
    return resolveImg(f.fileUrl)
  }

  // ✅ 2순위: rename(저장파일명)으로 /images/photo_review/{rename}
  if (typeof f.prFileRename === 'string' && f.prFileRename.trim()) {
    return resolveImg(`/images/photo_review/${f.prFileRename}`)
  }

  // ✅ 3순위: 물리경로에서 파일명만 추출
  if (typeof f.prFilePath === 'string' && f.prFilePath.trim()) {
    const name = f.prFilePath.replace(/\\/g, '/').split('/').pop()
    if (name) return resolveImg(`/images/photo_review/${name}`)
  }

  // ✅ 4순위: 기타 키에서 경로/파일명 찾기
  const raw = pickRawFilePath(f)
  return resolveImg(raw)
}

onMounted(() => {
  window.addEventListener('photo-review:created', handleCreated)
})
onBeforeUnmount(() => {
  window.removeEventListener('photo-review:created', handleCreated)
})
</script>

<template>
  <section class="wrap">
    <header class="head">
      <h2>사진 리뷰</h2>
      <button class="create" @click="goCreate">+ 사진 등록</button>
    </header>

    <div v-if="loading" class="loading">불러오는 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!items.length" class="empty">아직 등록된 사진이 없어요.</div>

    <div v-else class="grid">
      <button
        v-for="it in items"
        :key="it.id"
        class="card"
        @click="goDetail(it.id)"
        :aria-label="`리뷰 #${it.id} 상세로 이동`"
      >
        <div class="photo-box">
          <img
            v-if="it.imgUrl"
            :src="it.imgUrl"
            alt="사진 리뷰 썸네일"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="photo-placeholder">이미지 없음</div>
        </div>

        <div class="card-body">
          <div class="profile">
            <div class="avatar" v-if="it.avatar">
              <img :src="it.avatar" alt="작성자" loading="lazy" decoding="async" />
            </div>
            <div class="avatar avatar-ph" v-else>👤</div>
            <div class="meta-text">
              <div class="nickname">{{ it.nickname }}</div>
              <div class="title" :title="it.title">{{ it.title }}</div>
            </div>
          </div>

          <div class="likes">
            <span class="heart">♡</span>
            <span class="count">{{ it.likes }}</span>
          </div>
        </div>

      </button>
    </div>

    <footer class="more">
      <button class="more-btn" @click="goLounge">더보기</button>
    </footer>
  </section>
</template>

<style scoped>
.wrap{max-width:1100px;margin:24px auto;padding:0 18px}
.head{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.head h2{margin:0;font-size:22px;font-weight:900;color:#2e2318}
.create{display:inline-flex;align-items:center;gap:6px;background:#d4b487;color:#2d2216;border:none;border-radius:999px;padding:8px 18px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.08)}
.create:hover{background:#caa77a}
.loading,.error,.empty{padding:36px 0;text-align:center;color:#6b5b4a;font-weight:700}
.error{color:#b01212}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
.card{display:flex;flex-direction:column;gap:12px;padding:16px;background:#f6efe2;border-radius:20px;border:1px solid #e6dac6;box-shadow:0 10px 22px rgba(48,34,20,0.08);text-align:left;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
.card:hover{transform:translateY(-4px);box-shadow:0 14px 26px rgba(48,34,20,0.12)}
.photo-box{width:100%;aspect-ratio:4/3;border-radius:16px;overflow:hidden;background:#ece2d3;display:flex;align-items:center;justify-content:center}
.photo-box img{width:100%;height:100%;object-fit:cover;display:block}
.photo-placeholder{width:100%;height:100%;display:grid;place-items:center;color:#9a8b7a;font-weight:700}
.card-body{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.profile{display:flex;align-items:center;gap:10px}
.avatar{width:42px;height:42px;border-radius:50%;overflow:hidden;background:#efe4d4;display:grid;place-items:center}
.avatar img{width:100%;height:100%;object-fit:cover;display:block}
.avatar-ph{font-size:22px;color:#8f7a60}
.meta-text{display:flex;flex-direction:column;gap:2px}
.nickname{font-weight:900;color:#2f241b;font-size:14px}
.title{font-weight:800;color:#3b2f22;font-size:13px;line-height:1.2;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.likes{display:flex;align-items:center;gap:6px;background:#fff;border-radius:999px;padding:5px 12px;box-shadow:0 4px 11px rgba(0,0,0,0.08);font-weight:800;color:#2f241b;min-width:56px;justify-content:center}
.heart{font-size:16px}
.count{font-size:13px}
.more{display:flex;justify-content:center;margin:24px 0 12px}
.more-btn{background:#fff;color:#2a1f16;border:1px solid #d9c7a7;border-radius:999px;padding:10px 28px;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.06)}
.more-btn:hover{background:#f4ecdf}
</style>
