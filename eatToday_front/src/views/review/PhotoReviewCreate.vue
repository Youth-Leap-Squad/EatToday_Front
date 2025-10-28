<!-- src/views/review/PhotoReviewCreate.vue -->
<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

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

// (실서비스는 JWT 디코드 권장)
function getMemberNo(){
  const v = Number(localStorage.getItem('memberNo'))
  return Number.isFinite(v) ? v : 1
}

async function submit(){
  if (!title.value.trim()) return alert('제목을 입력해 주세요.')
  if (!content.value.trim()) return alert('내용을 입력해 주세요.')

  const payload = {
    boardNo,
    memberNo: getMemberNo(),
    reviewTitle: title.value,
    reviewContent: content.value,
    reviewLike: 0
  }

  const fd = new FormData()
  fd.append('review', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
  fileList.value.forEach(f => fd.append('files', f))

  try {
    const { data } = await axios.post('http://localhost:8080/command/photo-reviews', fd, { withCredentials: true })
    const detail =
      data && typeof data === 'object'
        ? { ...payload, ...data }
        : typeof data === 'number'
          ? { ...payload, reviewNo: data }
          : payload
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('photo-review:created', { detail }))
    }
    alert('등록되었습니다.')
    router.push(`/boards/${boardNo}`)
  } catch (e) {
    console.error('등록 실패:', e?.response?.data || e)
    alert('등록 실패: ' + (e.response?.data?.message || e.message))
  }
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
