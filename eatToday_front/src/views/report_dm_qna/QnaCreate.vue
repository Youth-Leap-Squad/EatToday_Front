<template>
  <div class="qna-create">
    <div class="inner">
      <h2 class="title">문의사항 작성</h2>
      <hr class="title-line" />
      <div class="submit-wrap">
        <button class="save-btn" :disabled="saving" @click="save">
          {{ saving ? '작성 중...' : '작성' }}
          <img :src="saveImg" alt="save" class="save-img" />
        </button>
      </div>
      <div class="form-card">
        <div class="form-row">
          <div class="label">제목</div>
          <input type="text" v-model="title" class="input" placeholder="문의 제목을 입력해주세요" />
        </div>
        <div class="form-row full-height">
          <div class="label">문의 내용</div>
          <div class="input-wrap">
            <textarea v-model="content" class="textarea"></textarea>
            <span v-if="!content" class="placeholder">문의 내용을 작성해주세요</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import saveImg from '@/assets/images/save.png'
import { createQna } from '@/api/Qna'

const router = useRouter()

const title = ref('')
const content = ref('')
const saving = ref(false)

const token = computed(() => localStorage.getItem('token') || '')

function parseJwt(t) {
  try {
    const part = t.split('.')[1]
    if (!part) return null
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4 || 4)) % 4)
    return JSON.parse(decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
  } catch { return null }
}

const memberNo = computed(() => {
  const p = parseJwt(token.value)
  return p?.memberNo ?? null
})

async function save() {
  if (!title.value.trim()) { alert('제목을 입력해주세요.'); return }
  if (!content.value.trim()) { alert('문의 내용을 입력해주세요.'); return }
  if (!token.value || !memberNo.value) { alert('로그인이 필요합니다.'); return }

  saving.value = true
  try {
    await createQna({
      memberNo: Number(memberNo.value),
      inquiryTitle: title.value.trim(),
      inquiryContent: content.value.trim(),
      token: token.value,
    })
    title.value = ''
    content.value = ''
    router.push('/qna/my')
  } catch (e) {
    alert(`작성 실패: ${e.message}`)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.qna-create { background: #FFF7E9; min-height: 100vh; }
.inner { width: 86%; max-width: 1080px; margin: 0 auto; padding: 22px 0 60px; }
.title { margin-top: 20px; font-size: 30px; font-weight: 800; color: #2B1F14; }
.title-line { border: none; border-top: 2px solid #BFBFBF; margin: 12px 0 24px; }
.submit-wrap { display: flex; justify-content: flex-end; margin-bottom: 14px; }
.save-btn { display: flex; align-items: center; gap: 6px; padding: 6px 18px; background: #D2B382; border-radius: 6px; border: none; font-size: 15px; font-weight: 700; cursor: pointer; color: #2B1F14; }
.save-img { width: 15px; height: 15px; }
.form-card { background: #F5E7D1AB; border: 1px solid #E2D8C7; border-radius: 18px; overflow: hidden; }
.form-row { display: grid; grid-template-columns: 160px 1fr; border-bottom: 1px solid #D3C7B8; min-height: 88px; }
.form-row.full-height { min-height: 420px; }
.label { background: #E2D8C7; font-weight: 800; color: #2B1F14; font-size: 17px; display: flex; align-items: center; justify-content: center; border-right: 1px solid #D3C7B8; }
.input { border: none; outline: none; background: transparent; padding: 22px 18px; font-size: 16px; color: #2B1F14; }
.input-wrap { position: relative; height: 100%; display: flex; align-items: center; }
.textarea { width: 100%; height: 100%; border: none; outline: none; background: transparent; padding: 0 22px; font-size: 16px; resize: none; color: #2B1F14; line-height: 1.6; }
.placeholder { position: absolute; left: 22px; right: 22px; text-align: left; color: #646466; pointer-events: none; }
</style>