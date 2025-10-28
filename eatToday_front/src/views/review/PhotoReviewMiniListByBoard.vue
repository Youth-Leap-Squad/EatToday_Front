<!-- src/views/review/PhotoReviewMiniListByBoard.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchReviewsByBoard } from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()

const boardNo = Number(route.params.boardNo) || 1
const items = ref([])
const loading = ref(false)
const error = ref('')
const count = 6
const loungePath = '/rounge'

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

function normalize(list = []) {
  return list.map(r => {
    const id = Number(r?.reviewNo)
    const title = r?.reviewTitle ?? r?.title ?? '제목 없음'
    const f0 = r?.files?.[0] ?? {}
    const imgUrl =
      r?.thumbnailUrl ??
      r?.imgUrl ??
      f0?.urlOrPath ?? f0?.url ?? f0?.fileUrl ?? f0?.file_path ?? f0?.filePath ?? null
    return { id: Number.isFinite(id) ? id : null, title, imgUrl }
  }).filter(it => it.id !== null)
}

async function load () {
  loading.value = true
  error.value = ''
  try {
    const list = await fetchReviewsByBoard(boardNo)
    items.value = normalize(list).slice(0, count)
  } catch (e) {
    error.value = e?.response?.data?.message || e?.message || '로드 실패'
  } finally {
    loading.value = false
  }
}

/** 등록 직후 이벤트로 최상단에 끼워 넣기 */
function handleCreated (e) {
  const r = e.detail
  if (Number(r.boardNo) !== boardNo) return
  const [norm] = normalize([r])
  if (!norm) return
  items.value = [norm, ...items.value].slice(0, count)
}

function goCreate () {
  if (!requireLogin()) return
  router.push(`/boards/${boardNo}/reviews/new`)
}
function goDetail (id) {
  if (!requireLogin()) return
  const n = Number(id)
  if (Number.isFinite(n)) router.push(`/reviews/${n}`)
}
function goLounge () {
  router.push(loungePath)
}

onMounted(() => {
  load()
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
        <img v-if="it.imgUrl" :src="it.imgUrl" alt="사진 리뷰 썸네일" loading="lazy" decoding="async" />
        <div v-else class="placeholder">이미지 없음</div>
      </button>
    </div>

    <footer class="more">
      <button class="more-btn" @click="goLounge">더보기</button>
    </footer>
  </section>
</template>

<style scoped>
.wrap{max-width:1100px;margin:16px auto;padding:0 16px}
.head{display:flex;align-items:center;justify-content:space-between;margin:8px 0 14px}
.head h2{margin:0;font-size:18px;font-weight:900;color:#2e2318}
.create{background:#d2b382;color:#2a1f16;border:none;border-radius:12px;padding:10px 14px;font-weight:900;cursor:pointer}
.loading,.error,.empty{padding:24px 0;text-align:center}
.error{color:#b01212}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px}
.card{width:100%;aspect-ratio:16/10;border:1px solid #e6dccb;background:#f4ecdf;border-radius:12px;overflow:hidden;padding:0;cursor:pointer}
.card img{width:100%;height:100%;object-fit:cover;display:block}
.placeholder{width:100%;height:100%;display:grid;place-items:center;color:#9a8b7a;font-size:12px}
.more{display:flex;justify-content:center;margin:16px 0 6px}
.more-btn{background:#fff;color:#2a1f16;border:1px solid #d9c7a7;border-radius:999px;padding:8px 18px;font-weight:900;cursor:pointer}
</style>