<template>
  <div class="photo-review-page" v-if="review">
    <div class="surface">
      <!-- 뒤로가기 버튼 -->
      <button class="nav-back" type="button" @click="router.back()">←</button>
      
      <!-- 제목 -->
      <h1 class="headline">{{ review.reviewTitle || review.title || '리뷰 제목 없음' }}</h1>

      <!-- 작성자 정보 -->
      <div class="author-row">
        <button class="author-info" type="button" @click="goAuthorPage">
          <img class="avatar" :src="authorAvatar" :alt="authorName" @error="handleAvatarError" />
          <div class="meta">
            <div class="name">
              {{ authorName || '작성자' }}
              <span class="badge" v-if="isMyReview">작성자</span>
            </div>
            <div class="time">{{ timeAgo(review.reviewDate || review.createdAt || review.regDate) }}</div>
          </div>
        </button>
        
        <!-- 더보기 메뉴 -->
        <!-- <details class="dot-menu">
          <summary>⋯</summary>
          <div class="menu-pop">
            <button type="button">✈ 메시지 보내기</button>
            <button type="button" class="danger">🚨 신고</button>
          </div>
        </details> -->
      </div>

      <!-- 리뷰 이미지 -->
      <figure class="photo-card" v-if="thumbnailUrl">
        <img 
          :src="thumbnailUrl" 
          alt="리뷰 이미지"
          @error="handleImageError"
        />
      </figure>
      
      <!-- 이미지가 없을 때 플레이스홀더 -->
      <figure class="photo-card placeholder" v-else>
        <div class="no-image">
          <span>📷</span>
          <p>이미지 없음</p>
        </div>
      </figure>

      <!-- 리뷰 내용 -->
      <section class="story">
        <h2 class="story-title">{{ review.reviewTitle || '사진 리뷰' }}</h2>
        <p v-if="hashtag" class="story-tag">{{ hashtag }}</p>
      </section>

      <!-- 좋아요 -->
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

      <!-- 댓글 섹션 -->
      <section class="comments-card">
        <header class="comments-header">
          <h3>댓글 {{ comments.length }}</h3>
        </header>

        <!-- 댓글 작성 폼 -->
        <div class="comment-form">
          <input
            class="comment-input"
            v-model="commentInput"
            placeholder="댓글을 작성해 주세요."
            @keyup.enter="submitComment"
          />
          <button class="submit" type="button" @click="submitComment">등록</button>
        </div>

        <!-- 댓글 리스트 -->
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
              
              <!-- 댓글 액션 버튼 -->
              <div class="comment-actions">
                <template v-if="isMyComment(c)">
                  <button type="button" @click="startEdit(c)">수정</button>
                  <button type="button" @click="removeComment(c)">삭제</button>
                </template>
                <button type="button" class="warn" @click="reportComment(c)">신고</button>
              </div>
            </div>

            <!-- 댓글 수정 모드 -->
            <div v-if="editingId === (c.prcNo ?? c.commentNo ?? c.id)" class="edit-box">
              <input v-model="editText" />
              <div class="edit-buttons">
                <button type="button" @click="saveEdit">완료</button>
                <button type="button" @click="cancelEdit">취소</button>
              </div>
            </div>
            
            <!-- 댓글 내용 -->
            <p v-else class="comment-text">{{ c.prcDetail || c.content }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>

  <!-- 로딩/에러 상태 -->
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
  toggleReviewLike,
  fetchMemberProfile
} from '@/api/photoReviewAnju'
import { getMyInfo, getProfileImageUrl } from '@/api/member'

// ==================== 라우터 & 환경설정 ====================
const route = useRoute()
const router = useRouter()
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'
const FRONT_ORIGIN = window.location.origin

// ==================== 상태 관리 ====================
const review = ref(null)
const thumbnailUrl = ref('')
const likeCount = ref(0)
const liked = ref(false)
const likeBusy = ref(false)
const comments = ref([])
const commentInput = ref('')
const editingId = ref(null)
const editText = ref('')

// 작성자 정보
const authorProfile = ref(null)
const authorProfileLoading = ref(false)

// ==================== Computed ====================
const reviewId = computed(() => Number(route.params.reviewNo))

const defaultAvatar = '/images/user_profile/basic_profile.jpg'

const authorMemberNo = computed(() => {
  const r = review.value
  if (!r) return null
  
  const candidates = [
    r.memberNo, r.member_no,           // 스네이크 케이스 추가
    r.authorNo, r.author_no,           // 스네이크 케이스 추가
    r.writerNo, r.writer_no,           // 스네이크 케이스 추가
    r.member?.memberNo, r.member?.member_no,
    r.author?.memberNo, r.author?.member_no,
    r.writer?.memberNo, r.writer?.member_no
  ]
  
  const hit = candidates.map(Number).find(Number.isFinite)
  
  // 디버깅 로그
  console.log('👤 작성자 memberNo 찾기:', {
    reviewData: r,
    candidates,
    found: hit
  })
  
  return Number.isFinite(hit) ? hit : null
})

const authorName = computed(() => {
  const r = review.value
  
  // 🔧 임시: 내 리뷰인 경우 현재 로그인한 사용자 이름 사용
  if (isMyReview.value && currentUserName.value) {
    console.log('✅ 내 리뷰 - 현재 사용자 이름 사용:', currentUserName.value)
    return currentUserName.value
  }
  
  // 디버깅 로그
  console.log('📝 작성자 이름 찾기:', {
    authorProfile: authorProfile.value,
    reviewData: r,
    member_id: r?.member_id,
    memberId: r?.memberId,
    memberName: r?.memberName
  })
  
  // 2순위: 리뷰 데이터에서 직접 (member_id 최우선)
  if (!r) return '익명'
  
  // ✅ member_id를 닉네임으로 최우선 사용
  const directName = 
    r.member_id ||           // ✅ 최우선: member_id를 닉네임으로 사용
    r.memberId ||            // 카멜 케이스
    r.member_name ||         // member_name
    r.memberName ||          // 카멜 케이스
    r.authorName || 
    r.author_name ||
    r.writerName ||
    r.writer_name ||
    r.nickname || 
    r.name
  
  if (directName) {
    console.log('✅ 리뷰 데이터에서 이름 찾음:', directName)
    return directName
  }
  
  // 3순위: 중첩 객체
  const nestedName = 
    r.member?.member_id ||        // ✅ 최우선
    r.member?.memberId ||
    r.member?.member_nickname ||
    r.member?.memberNickname || 
    r.member?.member_name ||
    r.member?.memberName || 
    r.author?.name || 
    r.writer?.name
  
  if (nestedName) {
    console.log('✅ 중첩 객체에서 이름 찾음:', nestedName)
    return nestedName
  }
  
  // 1순위 (마지막으로 이동): 로드된 프로필 정보
  // 프로필 정보는 있을 경우에만 사용 (백업용)
  if (authorProfile.value) {
    const name = authorProfile.value.memberId ||
                 authorProfile.value.member_id ||
                 authorProfile.value.memberNickname || 
                 authorProfile.value.member_nickname ||
                 authorProfile.value.memberName || 
                 authorProfile.value.member_name ||
                 authorProfile.value.nickname || 
                 authorProfile.value.name
    
    if (name) {
      console.log('✅ 프로필에서 이름 찾음:', name)
      return name
    }
  }
  
  // 4순위: memberNo만 있는 경우
  const memberNo = r.memberNo || r.member_no
  if (memberNo) {
    console.log('⚠️ memberNo만 있음:', memberNo)
    return `회원#${memberNo}`
  }
  
  console.warn('❌ 작성자 이름을 찾을 수 없습니다')
  return '익명'
})

function profileImageFromMemberNo(memberNo) {
  if (!Number.isFinite(memberNo)) return ''
  const bust = Date.now()
  const local = getProfileImageUrl(memberNo, bust)
  if (local) return local
  return joinOrigin(API_ORIGIN, `/members/profile-image/${memberNo}?bust=${bust}`)
}

const authorAvatar = computed(() => {
  const profile = authorProfile.value
  if (profile?.profileImageUrl) {
    return resolveImg(profile.profileImageUrl) || defaultAvatar
  }
  if (Number.isFinite(profile?.memberNo)) {
    return profileImageFromMemberNo(profile.memberNo)
  }

  const memberNo = authorMemberNo.value
  if (Number.isFinite(memberNo)) {
    return profileImageFromMemberNo(memberNo)
  }

  const r = review.value
  if (!r) return defaultAvatar

  const raw =
    r.authorAvatar ??
    r.avatar ??
    r.profileImage ??
    r.profileUrl ??
    r.member?.profileImageUrl ??
    r.member?.profileImage?.url ??
    r.author?.avatarUrl ??
    r.writer?.avatarUrl ??
    ''

  return resolveImg(raw) || defaultAvatar
})

const isMyReview = computed(() => {
  const me = myMemberNo.value
  const author = authorMemberNo.value
  return Number.isFinite(me) && Number.isFinite(author) && me === author
})

const hashtag = computed(() => {
  const r = review.value
  if (!r) return ''
  const candidates = r.hashtags ?? r.tagList ?? r.hashTags ?? r.tags ?? 
    (typeof r.tagString === 'string' ? r.tagString.split(',') : [])
  const ary = Array.isArray(candidates) ? candidates : 
    typeof candidates === 'string' ? candidates.split(',') : []
  const formatted = ary.map(t => String(t).trim()).filter(Boolean)
    .map(t => (t.startsWith('#') ? t : `#${t}`))
  if (formatted.length) return formatted.join(' ')
  if (r.boardName) return `#${r.boardName}`
  return ''
})

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

const currentUserDisplay = computed(() => {
  if (Number.isFinite(authorMemberNo.value) && myMemberNo.value === authorMemberNo.value) {
    return '작성자'
  }
  return currentUserName.value || 'user'
})

// ==================== 유틸리티 함수 ====================

// 이미지 URL 키 목록
const RAW_URL_KEYS = [
  'thumbnailUrl', 'thumbnailPath', 'thumbnailFullPath', 'thumbnail', 'thumbnailImage',
  'prFileUrl', 'prFilePath', 'prFileFullPath', 'prFileOriginName', 'prFileOriginalName',
  'fileUrl', 'filePath', 'fileFullPath', 'imageUrl', 'imgUrl', 'photoUrl', 'photoPath'
]

// 파일 컬렉션 키 목록
const FILE_COLLECTION_KEYS = [
  'files', 'fileList', 'reviewFiles', 'photoReviewFiles', 'photos', 'images', 'imageList'
]

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i

function joinOrigin(origin, segment) {
  const base = String(origin || '').replace(/\/+$/, '')
  const tail = String(segment || '').replace(/\\/g, '/').replace(/^\/+/, '')
  return tail ? `${base}/${tail}` : ''
}

/**
 * 이미지 URL을 안전하게 처리하는 함수
 * 다양한 형식의 URL을 정규화하여 반환
 */
function resolveImg(rawUrl) {
  // null, undefined, 빈 문자열 처리
  if (!rawUrl) return ''
  
  // 문자열로 변환하고 백슬래시를 슬래시로 통일, 공백 제거
  let url = String(rawUrl).replace(/\\/g, '/').trim()
  if (!url) return ''
  
  // 1. 이미 완전한 URL인 경우 (http://, https://, data:)
  if (url.startsWith('data:') || /^https?:\/\//i.test(url)) {
    return url
  }
  
  // 2. Windows 절대 경로 처리 (C:/, D:/ 등)
  if (/^[a-zA-Z]:\//.test(url)) {
    url = url.slice(2) // C:/path -> /path
  }
  
  // 3. 더블 슬래시 정리 (//path -> /path)
  url = url.replace(/\/+/g, '/')
  
  // 4. URL 디코딩 (인코딩된 한글 등 처리)
  try {
    // 이미 디코딩된 문자열인지 확인
    if (url !== decodeURIComponent(url)) {
      url = decodeURIComponent(url)
    }
  } catch (e) {
    // 디코딩 실패 시 원본 사용
  }
  
  const lower = url.toLowerCase()
  
  // 5. photo_review 경로 처리
  if (lower.includes('/photo_review/') || lower.includes('photo_review/')) {
    const startIndex = lower.lastIndexOf('photo_review/')
    const relativePath = url.slice(startIndex)
    return joinOrigin(API_ORIGIN, relativePath)
  }
  
  // 6. photoreview (띄어쓰기 없음) 경로 처리
  if (lower.includes('/photoreview/') || lower.includes('photoreview/')) {
    const startIndex = lower.lastIndexOf('photoreview/')
    const relativePath = url.slice(startIndex)
    return joinOrigin(API_ORIGIN, relativePath)
  }
  
  // 7. uploads 경로 처리
  if (lower.includes('/uploads/') || lower.includes('uploads/')) {
    const startIndex = lower.lastIndexOf('uploads/')
    const relativePath = url.slice(startIndex)
    return joinOrigin(API_ORIGIN, relativePath)
  }
  
  // 8. images 경로 처리 (프론트엔드 정적 리소스)
  if (lower.includes('/images/') || lower.includes('images/')) {
    const startIndex = lower.lastIndexOf('images/')
    const relativePath = url.slice(startIndex)
    return joinOrigin(FRONT_ORIGIN, relativePath)
  }
  
  // 9. static 또는 public 경로 처리
  if (lower.includes('/static/') || lower.includes('static/')) {
    const startIndex = lower.lastIndexOf('static/')
    const relativePath = url.slice(startIndex)
    return joinOrigin(FRONT_ORIGIN, relativePath)
  }
  
  if (lower.includes('/public/') || lower.includes('public/')) {
    const startIndex = lower.lastIndexOf('public/')
    const relativePath = url.slice(startIndex)
    return joinOrigin(FRONT_ORIGIN, relativePath)
  }
  
  // 10. 이미지 확장자가 있는지 확인
  const hasImageExt = IMAGE_EXT_RE.test(url)
  
  // 11. 상대 경로 처리
  // - 이미지 확장자가 있으면 API 서버로
  // - 슬래시로 시작하면 그대로 사용
  // - 그 외는 앞에 슬래시 추가
  if (hasImageExt || url.startsWith('/')) {
    return joinOrigin(API_ORIGIN, url.startsWith('/') ? url : `/${url}`)
  }
  
  // 12. 기타 모든 경우 API 서버 기준으로 처리
  return joinOrigin(API_ORIGIN, `/${url}`)
}

/**
 * 이미지 URL이 유효한지 검증
 */
function isValidImageUrl(url) {
  if (!url) return false
  const resolved = resolveImg(url)
  if (!resolved) return false
  
  // data URL은 항상 유효
  if (resolved.startsWith('data:')) return true
  
  // 이미지 확장자 확인
  return IMAGE_EXT_RE.test(resolved)
}

/**
 * 파일 객체에서 이미지 URL/경로 추출
 * 우선순위: 정의된 키 > 이미지 확장자 있는 값 > 경로 구분자 있는 값
 */
function pickRawFilePath(file) {
  if (!file) return ''
  
  // 이미 문자열이면 그대로 반환
  if (typeof file === 'string') return file.trim()
  
  // 객체가 아니면 빈 문자열
  if (typeof file !== 'object') return ''
  
  // 1순위: 정의된 키에서 찾기
  for (const key of RAW_URL_KEYS) {
    const val = file[key]
    if (typeof val === 'string' && val.trim()) {
      return val.trim()
    }
  }
  
  // 2순위: 모든 문자열 값 중에서 찾기
  const entries = Object.entries(file)
    .filter(([, v]) => typeof v === 'string' && v.trim())
  
  if (entries.length === 0) return ''
  
  // 이미지 확장자가 있는 값들 필터링
  const withImageExt = entries.filter(([, v]) => IMAGE_EXT_RE.test(v))
  
  // 이미지 확장자가 있는 경우
  if (withImageExt.length > 0) {
    // 경로 구분자(/ 또는 \)가 있는 것 우선
    const withPath = withImageExt.find(([, v]) => 
      v.includes('/') || v.includes('\\')
    )
    if (withPath) return withPath[1].trim()
    
    // 없으면 첫 번째 이미지 파일
    return withImageExt[0][1].trim()
  }
  
  // 3순위: 경로 구분자가 있는 값
  const withPath = entries.find(([, v]) => 
    v.includes('/') || v.includes('\\')
  )
  if (withPath) return withPath[1].trim()
  
  // 4순위: 'url', 'path', 'src' 등이 포함된 키
  const urlLikeKeys = ['url', 'path', 'src', 'link', 'href', 'location']
  for (const keyword of urlLikeKeys) {
    const found = entries.find(([k]) => k.toLowerCase().includes(keyword))
    if (found) return found[1].trim()
  }
  
  // 마지막: 첫 번째 문자열 값
  return entries[0][1].trim()
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
      const hasFile = RAW_URL_KEYS.some(key => 
        typeof current[key] === 'string' && current[key].trim()
      )
      if (hasFile) results.push(current)
      for (const key of FILE_COLLECTION_KEYS) {
        const nested = current[key]
        if (nested) queue.push(nested)
      }
    }
  }
  return results
}

/**
 * 리뷰 데이터에서 첫 번째 유효한 이미지 URL 찾기
 * 우선순위: 직접 필드 > 배열 > 중첩 객체
 */
function pickFirstImage(record) {
  if (!record || typeof record !== 'object') return ''

// 가장 흔한 더미 케이스: files[0].prFileRename만 있는 경우
if (Array.isArray(record.files) && record.files.length > 0) {
  const f = record.files[0]
  if (typeof f?.prFileRename === 'string' && f.prFileRename.trim()) {
    return resolveImg(`/images/photo_review/${f.prFileRename.trim()}`)
  }
  // prFilePath만 있고 파일명이 있는 경우에도 보완
  if (typeof f?.prFilePath === 'string' && f.prFilePath.trim()) {
    const name = f.prFilePath.replace(/\\/g,'/').split('/').pop()
    if (name) return resolveImg(`/images/photo_review/${name}`)
  }
}
  
  console.log('🔎 pickFirstImage 시작, record:', record)
  
  // 1단계: 직접 접근 가능한 주요 이미지 필드 체크
  const directCandidates = [
    record?.thumbnailUrl,
    record?.thumbnailPath, 
    record?.thumbnailFullPath,
    record?.mainImage,
    record?.mainImageUrl,
    record?.imageUrl,
    record?.imgUrl,
    record?.photoUrl,
    record?.photo,
    record?.fileUrl,
    record?.filePath,
    record?.prFileUrl,
    record?.prFilePath,
    record?.prFileFullPath
  ]
  
  for (const candidate of directCandidates) {
    if (!candidate) continue
    console.log('  ➡️ 직접 필드 체크:', candidate)
    const resolved = resolveImg(candidate)
    console.log('  ✅ 해석된 URL:', resolved)
    if (resolved && isValidImageUrl(resolved)) {
      console.log('  ✨ 유효한 이미지 발견!')
      return resolved
    }
  }
  
  // 2단계: 배열 형태의 이미지 필드 체크
  const arrayFields = [
    record?.images,
    record?.imageList,
    record?.imgUrls,
    record?.photos,
    record?.photoList,
    record?.thumbnails,
    record?.files,
    record?.fileList,
    record?.reviewFiles,
    record?.photoReviewFiles,
    record?.photoReviewFileDtoList
  ]
  
  for (const array of arrayFields) {
    if (!Array.isArray(array) || array.length === 0) continue
    
    console.log('  ➡️ 배열 필드 체크, 길이:', array.length)
    
    // 배열의 첫 번째 유효한 항목 찾기
    for (const item of array) {
      if (!item) continue
      
      // 문자열인 경우
      if (typeof item === 'string') {
        console.log('    - 배열의 문자열 항목:', item)
        const resolved = resolveImg(item)
        console.log('    - 해석된 URL:', resolved)
        if (resolved && isValidImageUrl(resolved)) {
          console.log('    ✨ 유효한 이미지 발견!')
          return resolved
        }
      }
      
      // 객체인 경우
      if (typeof item === 'object') {
        console.log('    - 배열의 객체 항목:', item)
        const path = pickRawFilePath(item)
        console.log('    - 추출된 경로:', path)
        if (path) {
          const resolved = resolveImg(path)
          console.log('    - 해석된 URL:', resolved)
          if (resolved && isValidImageUrl(resolved)) {
            console.log('    ✨ 유효한 이미지 발견!')
            return resolved
          }
        }
      }
    }
  }
  
  // 3단계: extractFiles로 모든 파일 객체 추출해서 찾기
  console.log('  ➡️ extractFiles로 파일 추출 시도')
  const fileEntries = extractFiles(record)
  console.log('  📁 추출된 파일 수:', fileEntries.length)
  
  for (const entry of fileEntries) {
    const path = pickRawFilePath(entry)
    if (path) {
      console.log('    - 파일 경로:', path)
      const resolved = resolveImg(path)
      console.log('    - 해석된 URL:', resolved)
      if (resolved && isValidImageUrl(resolved)) {
        console.log('    ✨ 유효한 이미지 발견!')
        return resolved
      }
    }
  }
  
  // 4단계: 객체의 모든 속성 재귀적으로 검색 (최후의 수단)
  console.log('  ➡️ 깊이 우선 탐색 시작')
  const deepSearch = (obj, depth = 0) => {
    // 깊이 제한 (무한 루프 방지)
    if (depth > 3 || !obj || typeof obj !== 'object') return ''
    
    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue
      
      // 키 이름이 이미지 관련인 경우 우선 체크
      const lowerKey = key.toLowerCase()
      if (lowerKey.includes('image') || 
          lowerKey.includes('photo') || 
          lowerKey.includes('thumbnail') ||
          lowerKey.includes('url') ||
          lowerKey.includes('path') ||
          lowerKey.includes('file')) {
        
        if (typeof value === 'string') {
          console.log(`    - 깊이 ${depth}, 키 "${key}":`, value)
          const resolved = resolveImg(value)
          if (resolved && isValidImageUrl(resolved)) {
            console.log('    ✨ 유효한 이미지 발견!')
            return resolved
          }
        }
        
        if (typeof value === 'object') {
          const result = deepSearch(value, depth + 1)
          if (result) return result
        }
      }
    }
    
    return ''
  }
  
  const deepResult = deepSearch(record)
  if (deepResult) {
    console.log('  ✨ 깊이 탐색에서 이미지 발견!')
    return deepResult
  }
  
  console.log('  ❌ 이미지를 찾지 못했습니다')
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
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + 
      '='.repeat((4 - (part.length % 4 || 4)) % 4)
    const json = decodeURIComponent(
      atob(padded).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function currentToken() {
  const raw = localStorage.getItem('accessToken') || 
    localStorage.getItem('token') || 
    localStorage.getItem('Authorization')
  return raw || ''
}

function requireLogin() {
  const token = currentToken()
  if (!token || token === 'null' || token === 'undefined') {
    alert('로그인이 필요합니다.')
    router.push({ 
      path: '/login', 
      query: { redirect: router.currentRoute.value.fullPath } 
    })
    return false
  }
  return true
}

// ==================== 댓글 관련 함수 ====================

function commentMemberNo(c) {
  return Number(
    c?.memberNo ?? c?.member_no ?? c?.writerNo ?? 
    c?.member?.memberNo ?? c?.author?.memberNo
  )
}

function commentName(c) {
  const direct = [
    c?.memberName, c?.member?.memberName, c?.writerName,
    c?.memberNickname, c?.nickname, c?.memberId
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

// ==================== API 호출 함수 ====================

async function loadAuthorProfile(memberNo) {
  if (!Number.isFinite(memberNo) || authorProfileLoading.value) return
  
  try {
    authorProfileLoading.value = true
    
    console.log('🔄 작성자 프로필 로드 시작:', memberNo)
    
    // 방법 1: 리뷰 데이터에서 이메일 추출
    const email = review.value?.memberEmail || 
                  review.value?.member_email ||      // ✅ 스네이크 케이스 추가
                  review.value?.email ||
                  review.value?.member?.memberEmail ||
                  review.value?.member?.member_email ||  // ✅ 스네이크 케이스 추가
                  review.value?.member?.email
    
    console.log('📧 추출된 이메일:', email)
    
    if (email) {
      try {
        const profile = await getMyInfo(email)
        authorProfile.value = profile
        console.log('✅ 작성자 프로필 로드 완료:', profile)
        return
      } catch (err) {
        console.warn('⚠️ 이메일로 프로필 조회 실패:', err)
      }
    }
    
    // 방법 2: member_id가 있으면 그대로 사용 (이메일일 수 있음)
    const memberId = review.value?.member_id || review.value?.memberId
    if (memberId && typeof memberId === 'string' && memberId.includes('@')) {
      try {
        console.log('🔄 member_id를 이메일로 사용:', memberId)
        const profile = await getMyInfo(memberId)
        authorProfile.value = profile
        console.log('✅ 작성자 프로필 로드 완료:', profile)
        return
      } catch (err) {
        console.warn('⚠️ member_id로 프로필 조회 실패:', err)
      }
    }
    
    // 방법 3: memberNo 기반 프로필 조회
    if (Number.isFinite(memberNo)) {
      try {
        console.log('🔄 memberNo로 프로필 조회:', memberNo)
        const profile = await fetchMemberProfile(memberNo)
        if (profile) {
          authorProfile.value = profile
          console.log('✅ memberNo 프로필 로드 완료:', profile)
          return
        }
      } catch (err) {
        console.warn('⚠️ memberNo로 프로필 조회 실패:', err)
      }
    }
    
    console.warn('⚠️ 작성자 프로필을 로드할 수 없습니다. 리뷰 데이터 사용')
    
  } catch (err) {
    console.error('❌ 작성자 프로필 로드 실패:', err)
  } finally {
    authorProfileLoading.value = false
  }
}

async function loadComments() {
  const id = reviewId.value
  if (!Number.isFinite(id)) return
  
  try {
    const list = await listComments(id)
    comments.value = Array.isArray(list) ? list : []
  } catch (err) {
    console.error('댓글 목록 불러오기 실패:', err)
  }
}

async function loadReview() {
  const id = reviewId.value
  if (!Number.isFinite(id)) return
  
  try {
    const data = await fetchReviewDetail(id)
    review.value = data
    
    // 🔍 디버깅: 응답 데이터 구조 확인
    console.log('📦 리뷰 상세 데이터:', data)
    console.log('🔍 이미지 관련 필드 확인:', {
      thumbnailUrl: data.thumbnailUrl,
      thumbnailPath: data.thumbnailPath,
      imageUrl: data.imageUrl,
      photoUrl: data.photoUrl,
      fileUrl: data.fileUrl,
      files: data.files,
      images: data.images,
      photoReviewFiles: data.photoReviewFiles,
      reviewFiles: data.reviewFiles
    })
    
    // 좋아요 수 설정
    likeCount.value = Number(
      data.reviewLikeCount ?? data.likeCount ?? data.likes ?? 0
    ) || 0

    // 썸네일 이미지 설정
    const foundImage = pickFirstImage(data)
    console.log('🖼️ 찾은 이미지 URL:', foundImage)
    
    thumbnailUrl.value = foundImage

    // 작성자 프로필 로드
    const memberNo = authorMemberNo.value
    if (Number.isFinite(memberNo)) {
      await loadAuthorProfile(memberNo)
    }

    // 좋아요 상태 가져오기 (에러 처리 강화)
    try {
      const status = await fetchReviewLikeStatus(id)
      if (status) {
        if (status.likeCount != null) {
          likeCount.value = Number(status.likeCount) || likeCount.value
        }
        if ('liked' in status) {
          liked.value = !!status.liked
        } else if ('isLiked' in status) {
          liked.value = !!status.isLiked
        }
      }
    } catch (likeErr) {
      // 좋아요 상태 API가 404이거나 실패해도 계속 진행
      console.warn('좋아요 상태 조회 실패 (무시하고 계속):', likeErr?.response?.status)
      // 기본값 유지: liked = false, likeCount는 리뷰 데이터의 값 사용
    }

    // 댓글 불러오기
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
      if (res.likeCount != null) {
        likeCount.value = Number(res.likeCount) || likeCount.value
      }
      if ('liked' in res) {
        liked.value = !!res.liked
      } else if ('isLiked' in res) {
        liked.value = !!res.isLiked
      } else {
        liked.value = !liked.value
      }
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
  if (!Number.isFinite(memberNo)) {
    alert('회원 정보를 확인할 수 없습니다.')
    return
  }
  if (!text) return
  
  try {
    await addComment(id, { memberNo, prcDetail: text, content: text })
    commentInput.value = ''
    await loadComments()
  } catch (err) {
    console.error('댓글 등록 실패:', err?.response?.data || err)
    const msg = err?.response?.data?.message || 
      err?.response?.data?.error || 
      err?.message
    alert('댓글 등록 실패: ' + (typeof msg === 'string' ? msg : JSON.stringify(msg)))
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
  if (Number.isFinite(target)) {
    router.push({ name: 'mypage.user', params: { memberNo: target } })
  } else {
    router.push({ name: 'mypage.self' })
  }
}

function reportComment(comment) {
  console.info('신고 요청', comment)
  alert('신고 기능은 준비 중입니다.')
}

/**
 * 프로필 이미지 로드 실패 시 기본 아바타로 대체
 */
function handleAvatarError(event) {
  console.warn('프로필 이미지 로드 실패, 기본 이미지로 대체')
  event.target.src = defaultAvatar
}

/**
 * 이미지 로드 실패 시 처리
 */
function handleImageError(event) {
  console.warn('이미지 로드 실패:', thumbnailUrl.value)
  
  // 이미 fallback을 시도했다면 빈 이미지로 표시
  if (event.target.dataset.fallbackAttempted) {
    thumbnailUrl.value = ''
    return
  }
  
  // 첫 시도: API_ORIGIN으로 다시 시도
  const currentUrl = thumbnailUrl.value
  if (!currentUrl.startsWith(API_ORIGIN)) {
    event.target.dataset.fallbackAttempted = 'true'
    
    // 경로만 추출해서 API_ORIGIN과 결합
    const pathMatch = currentUrl.match(/\/(photo_review|photoreview|uploads|images)\/.*$/)
    if (pathMatch) {
      thumbnailUrl.value = joinOrigin(API_ORIGIN, pathMatch[0])
      return
    }
  }
  
  // 두 번째 시도: FRONT_ORIGIN으로 시도
  if (!currentUrl.startsWith(FRONT_ORIGIN)) {
    event.target.dataset.fallbackAttempted = 'true'
    const pathMatch = currentUrl.match(/\/(images|static|public)\/.*$/)
    if (pathMatch) {
      thumbnailUrl.value = joinOrigin(FRONT_ORIGIN, pathMatch[0])
      return
    }
  }
  
  // 모든 시도 실패 시 빈 이미지로
  thumbnailUrl.value = ''
}

// ==================== 라이프사이클 & 감시자 ====================

watch(myMemberNo, n => {
  if (Number.isFinite(n)) {
    localStorage.setItem('memberNo', String(n))
  }
}, { immediate: true })

onMounted(loadReview)
</script>

<style scoped>
/* ==================== 레이아웃 ==================== */
.photo-review-page {
  min-height: 100vh;
  background: #f8ead4;
  padding: 40px 0 60px;
}

.surface {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px;
  color: #2f2419;
}

/* ==================== 네비게이션 ==================== */
.nav-back {
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 12px;
}

/* ==================== 제목 ==================== */
.headline {
  margin: 0 0 18px;
  font-size: 26px;
  font-weight: 900;
}

/* ==================== 작성자 정보 ==================== */
.author-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 14px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0e1cc;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.meta .name {
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta .badge {
  background: #fde2c7;
  color: #b3542d;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.meta .time {
  font-size: 12px;
  color: #8a7a6a;
}

/* ==================== 더보기 메뉴 ==================== */
.dot-menu {
  position: relative;
}

.dot-menu summary {
  list-style: none;
  cursor: pointer;
  font-size: 26px;
  line-height: 1;
  border-radius: 8px;
  padding: 2px 6px;
}

.dot-menu summary::-webkit-details-marker {
  display: none;
}

.dot-menu[open] summary {
  background: rgba(0, 0, 0, 0.05);
}

.menu-pop {
  position: absolute;
  top: 32px;
  right: 0;
  background: #fff;
  border: 1px solid #e8d6be;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  display: grid;
  padding: 6px 0;
  min-width: 160px;
  z-index: 10;
}

.menu-pop button {
  background: none;
  border: none;
  text-align: left;
  font-weight: 800;
  padding: 10px 16px;
  cursor: pointer;
  color: #2f2419;
}

.menu-pop button:hover {
  background: #f7eedf;
}

.menu-pop .danger {
  color: #b14a3c;
}

/* ==================== 이미지 카드 ==================== */
.photo-card {
  margin: 0 0 24px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.16);
  background: #000;
}

.photo-card img {
  width: 100%;
  display: block;
  object-fit: cover;
  max-height: 600px;
}

.photo-card.placeholder {
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image {
  text-align: center;
  color: #999;
}

.no-image span {
  font-size: 64px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.no-image p {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

/* ==================== 스토리 섹션 ==================== */
.story {
  margin-bottom: 20px;
}

.story-title {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 900;
}

.story-tag {
  margin: 0;
  font-weight: 800;
  color: #9b7c49;
}

/* ==================== 좋아요 ==================== */
.like-line {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.like-chip {
  border: none;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  padding: 8px 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.like-chip:disabled {
  opacity: 0.6;
  cursor: default;
}

.like-chip:not(:disabled):active {
  transform: translateY(1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.like-chip.on {
  background: #fde2c7;
  color: #b3542d;
}

.like-chip .heart {
  font-size: 18px;
}

/* ==================== 댓글 섹션 ==================== */
.comments-card {
  background: #f4e7d3;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.comments-header {
  margin-bottom: 16px;
}

.comments-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}

/* ==================== 댓글 작성 폼 ==================== */
.comment-form {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff4e3;
  border: 1px solid #e7d5b9;
  border-radius: 14px;
  padding: 10px;
  margin-bottom: 18px;
}

.comment-form .me {
  font-size: 20px;
}

.comment-input {
  flex: 1;
  border: 1px solid #e7d5b9;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  background: #fff;
}

.comment-input:focus {
  outline: 2px solid #d4b487;
  outline-offset: 1px;
}

.comment-form .submit {
  border: none;
  background: #d4b487;
  color: #fff;
  font-weight: 800;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
}

.comment-form .submit:hover {
  background: #c29d70;
}

/* ==================== 댓글 리스트 ==================== */
.comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.comment-item {
  background: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  font-weight: 800;
  font-size: 13px;
  color: #695443;
  margin-bottom: 6px;
}

.comment-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-name .badge-author {
  margin-left: 4px;
  background: #fde2c7;
  color: #b3542d;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.comment-time {
  color: #999;
}

.comment-actions {
  display: flex;
  gap: 6px;
}

.comment-actions button {
  border: none;
  background: #f2e0c7;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.comment-actions button:hover {
  background: #e3cfae;
}

.comment-actions .warn {
  background: #ffe4e4;
}

.comment-actions .warn:hover {
  background: #ffd0d0;
}

/* ==================== 댓글 수정 ==================== */
.edit-box {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.edit-box input {
  flex: 1;
  border: 1px solid #d9c7a7;
  border-radius: 10px;
  padding: 8px 10px;
}

.edit-buttons button {
  border: none;
  background: #d4b487;
  color: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  margin-right: 4px;
  cursor: pointer;
}

.edit-buttons button:hover {
  background: #c29d70;
}

.edit-buttons button:last-child {
  background: #ccc;
  color: #333;
}

.edit-buttons button:last-child:hover {
  background: #b8b8b8;
}

.comment-text {
  margin: 0;
  color: #3f3327;
  line-height: 1.5;
}

/* ==================== 빈 상태 ==================== */
.empty {
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: #7a6f63;
  font-weight: 700;
}
</style>
