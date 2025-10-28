<!-- src/views/review/PhotoReviewCreate.vue -->
<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { commandApi } from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()
const boardNo = Number(route.params.boardNo) || 1

// ✅ 반드시 초기값을 배열로
const files = ref([])

// ✅ 템플릿에서 안전하게 사용할 가드
const fileList = computed(() => Array.isArray(files.value) ? files.value : [])

// ✅ 미리보기 URL 관리 (누수 방지)
const previews = ref([])
function rebuildPreviews() {
  // 이전 URL 해제
  previews.value.forEach(url => URL.revokeObjectURL(url))
  previews.value = fileList.value.map(f => URL.createObjectURL(f))
}
onBeforeUnmount(() => {
  previews.value.forEach(url => URL.revokeObjectURL(url))
})

function onFile(e){
  const picked = Array.from(e?.target?.files ?? [])
  files.value = picked
  rebuildPreviews()
}

const title = ref('')
const content = ref('')

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

function currentToken() {
  const raw =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  return raw || ''
}

function getMemberNo(){
  const stored = Number(localStorage.getItem('memberNo'))
  if (Number.isFinite(stored)) return stored
  const raw = currentToken()
  if (!raw) return null
  const payload = parseJwt(raw.startsWith('Bearer ') ? raw.slice(7) : raw)
  const n = Number(payload?.memberNo ?? payload?.member_no)
  if (Number.isFinite(n)) {
    localStorage.setItem('memberNo', String(n))
    return n
  }
  return Number.isFinite(n) ? n : null
}

function requireLogin() {
  const token = currentToken()
  if (!token || token === 'null' || token === 'undefined') {
    alert('로그인이 필요합니다.')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return false
  }
  return true
}

async function submit(){
  if (!requireLogin()) return
  const memberNo = getMemberNo()
  if (!Number.isFinite(memberNo)) {
    alert('회원 정보를 확인할 수 없습니다.')
    return
  }
  if (!title.value.trim()) return alert('제목을 입력해 주세요.')
  if (!content.value.trim()) return alert('내용을 입력해 주세요.')

  const payload = {
    boardNo,
    memberNo,
    reviewTitle: title.value,
    reviewContent: content.value,
    reviewLike: 0
  }

  const fd = new FormData()
  fd.append('review', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  fileList.value.forEach(f => fd.append('files', f))

  try {
    const { data } = await commandApi.post('/command/photo-reviews', fd)
    const detail = buildCreatedDetail(data, payload)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('photo-review:created', { detail }))
    }
    alert('등록되었습니다.')
    router.push(`/boards/${boardNo}`)
  } catch (e) {
    console.error('등록 실패:', e?.response?.data || e)
    const serverMessage = e?.response?.data?.message || e?.response?.data?.error || e?.message
    alert('등록 실패: ' + (typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage)))
  }
}

function buildCreatedDetail(res, fallback) {
  const base = { ...fallback }
  const detail = res && typeof res === 'object'
    ? { ...res }
    : typeof res === 'number'
      ? { reviewNo: res }
      : {}
  if (!Number.isFinite(Number(detail.reviewNo)) && Number.isFinite(Number(res))) {
    detail.reviewNo = Number(res)
  }
  detail.boardNo = Number(detail.boardNo ?? base.boardNo)
  detail.reviewTitle = detail.reviewTitle ?? detail.title ?? base.reviewTitle
  detail.reviewContent = detail.reviewContent ?? detail.content ?? base.reviewContent
  detail.memberNo = Number(detail.memberNo ?? base.memberNo ?? getMemberNo())
  return { ...base, ...detail }
}
</script>

<template>
  <section class="wrap">
    <h2>사진 리뷰 등록</h2>

    <div class="row">
      <label>제목</label>
      <input v-model="title" placeholder="제목" />
    </div>

    <div class="row">
      <label>내용</label>
      <textarea v-model="content" rows="6" placeholder="내용을 입력하세요" />
    </div>

    <div class="row">
      <label>이미지</label>
      <input type="file" multiple accept="image/*" @change="onFile" />
    </div>

    <!-- ✅ files.length 직접 접근 금지: fileList / previews 사용 -->
    <div v-if="previews.length" class="thumbs">
      <div v-for="(url, i) in previews" :key="i" class="thumb">
        <img :src="url" alt="미리보기" />
      </div>
    </div>

    <div class="actions">
      <button @click="submit">등록</button>
      <button @click="router.back()">취소</button>
    </div>
  </section>
</template>

<style scoped>
.wrap{max-width:720px;margin:20px auto;padding:0 16px}
.row{display:flex;flex-direction:column;gap:8px;margin-bottom:14px}
input,textarea{border:1px solid #ddd;border-radius:8px;padding:10px}
.actions{display:flex;gap:10px}
button{cursor:pointer;border:1px solid #c9ae86;background:#fff;border-radius:8px;padding:8px 14px;font-weight:700}
.thumbs{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
.thumb{width:120px;height:120px;overflow:hidden;border:1px solid #eee;border-radius:8px}
.thumb img{width:100%;height:100%;object-fit:cover}
</style>
