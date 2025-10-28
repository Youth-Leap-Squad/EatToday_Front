<!-- src/views/review/PhotoReviewCreate.vue -->
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createReview } from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()
const boardNo = Number(route.params.boardNo) || 1

const title = ref('')
const content = ref('')
const files = ref([])

// 선택 입력: 날짜를 직접 지정하고 싶으면 사용 (yyyy-MM-dd)
const reviewDate = ref('') // 비워두면 전송하지 않음

function onFile(e){ files.value = Array.from(e.target.files || []) }

// 로그인 사용자 (실서비스에선 토큰 decode 등으로 memberNo 가져오세요)
const memberNo = 1

function toYMD(d = new Date()){
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${dd}`
}

async function submit(){
  if(!title.value.trim()){ alert('제목을 입력해 주세요'); return }
  if(!content.value.trim()){ alert('내용을 입력해 주세요'); return }

  // 토큰 없으면 서버에서 401 나므로 사전 차단(선택)
  const hasToken =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  if(!hasToken){
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }

  try{
    // ✅ 서버 DTO(CreateRequest) 필수값을 모두 포함
    const payload = {
      boardNo,                // @NotNull
      memberNo,               // @NotNull
      reviewTitle: title.value.trim(),    // @NotBlank
      reviewContent: content.value.trim(),// @NotBlank
      reviewLike: 0,          // @NotNull (초기값 0 필수)
      // reviewDate는 값이 있을 때만 추가 (빈 문자열 전송 금지!)
      ...(reviewDate.value ? { reviewDate: reviewDate.value } : {})
      // 자동으로 오늘 날짜를 넣고 싶다면 위 줄 대신:
      // reviewDate: toYMD()
    }

    const res = await createReview(payload, files.value)  // { reviewNo }

    // 즉시 리스트에 반영: 커스텀 이벤트 전파(미니리스트가 듣고 최신순 맨 앞으로)
    window.dispatchEvent(new CustomEvent('photo-review:created', {
      detail: {
        boardNo,
        reviewNo: res.reviewNo,
        reviewTitle: payload.reviewTitle,
        reviewContent: payload.reviewContent,
        files: files.value.map(f => ({ urlOrPath: URL.createObjectURL(f) })),
        createdAt: Date.now()
      }
    }))

    alert('등록되었습니다.')
    // 상세로 가고 싶으면: router.push(`/reviews/${res.reviewNo}`)
    router.back()
  }catch(e){
    const msg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      '등록 실패'
    alert('등록 실패: ' + msg)
    console.error('등록 실패 응답:', e?.response?.data || e)
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
      <label>촬영일(선택, yyyy-MM-dd)</label>
      <input v-model="reviewDate" placeholder="예: 2025-10-27" />
      <!-- 오늘 날짜 자동으로 넣고 싶으면 위 input 대신
           <input v-model="reviewDate" :value="toYMD()" readonly />
      -->
    </div>

    <div class="row">
      <label>이미지</label>
      <input type="file" multiple accept="image/*" @change="onFile" />
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
</style>