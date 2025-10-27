<template>
  <div class="qna-comment">
    <div class="inner">
      <div class="card">
        <div class="card-title">
          <h2 class="title">문의사항</h2>
          <hr class="title-line" />
        </div>

        <div class="head">
          <div class="user">
            <img :src="userImg" alt="user" class="avatar" />
            <div class="meta">
              <div class="name">{{ name }}</div>
              <div class="subject">{{ subject }}</div>
            </div>
          </div>
          <div class="date">{{ date }}</div>
        </div>

        <div class="body">
          <p v-for="(line, i) in bodyLines" :key="i">{{ line }}</p>
        </div>

        <hr class="divider" />

        <div v-if="answer" class="reply">
          <div class="reply-head">
            <div class="reply-title">
              <img :src="arrowImg" class="arrow-img" />
              <span class="label">답변</span>
            </div>
            <div class="reply-date">{{ answer.date }}</div>
          </div>
          <div class="reply-meta">{{ answer.writer }}</div>
          <div class="reply-body">
            <p v-for="(line, i) in answer.lines" :key="i">{{ line }}</p>
          </div>
        </div>

        <div v-else class="reply">
          <div class="reply-meta" style="margin-left:0">아직 등록된 답변이 없습니다.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import userImg from '@/assets/images/photo_review/userexample.png'
import arrowImg from '@/assets/images/arrow.png'
import { fetchQnaDetail } from '@/api/inquiryQna'

const route = useRoute()

const name = ref('사용자')
const subject = ref('문의 제목')
const date = ref('')
const body = ref('')

const answer = ref(null) // { writer, date, lines }

const token = localStorage.getItem('token') || ''

function fmtDate(d) {
  if (!d) return ''
  // "2025-09-12" 또는 ISO 모두 처리
  const s = String(d)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.replaceAll('-', '.')
  try {
    const dt = new Date(s)
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    return `${y}.${m}.${dd}`
  } catch { return s }
}

const bodyLines = computed(() => (body.value || '').split(/\r?\n/).filter(Boolean))

onMounted(async () => {
  const id = route.query.id
  if (!id) return

  try {
    const data = await fetchQnaDetail({ id, token })
    
    name.value = data?.questioner?.memberName || '사용자'
    subject.value =
      data?.inquiryTitle ||
      (data?.inquiryContent ? String(data.inquiryContent).slice(0, 30) : '문의 제목')

    date.value = fmtDate(data?.inquiryAt)
    body.value = data?.inquiryContent || ''

    if (data?.answer?.content) {
      answer.value = {
        writer: data?.answer?.adminName || '관리자',
        date: fmtDate(data?.answer?.answeredAt || data?.answer?.createdAt),
        lines: String(data.answer.content).split(/\r?\n/).filter(Boolean),
      }
    } else {
      answer.value = null
    }
  } catch (e) {
    alert(`상세 조회 실패: ${e.message}`)
  }
})
</script>
  
  <style scoped>
  .qna-comment {
    background: #FFF7E9;
    min-height: 100vh;
  }
  .inner {
    width: 86%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 22px 0 60px;
  }
  .card {
    background: #F3E7D5;
    border: 1px solid #E2D8C7;
    border-radius: 16px;
    padding: 22px 26px 28px;
  }
  .card-title {
    margin-bottom: 6px;
  }
  .title {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: #5B5B5B;
    margin-top: 20px;
  }
  .title-line {
    border: none;
    border-top: 1px solid #BFBFBF;
    margin: 10px 0 0 0;
  }
  .head {
    display: grid;
    grid-template-columns: 1fr 140px;
    align-items: center;
    column-gap: 12px;
    margin-top: 14px;
  }
  .user {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #E2D8C7;
    background: #fff;
  }
  .meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .name {
    font-size: 18px;
    font-weight: 800;
    color: #2B1F14;
  }
  .subject {
    font-size: 18px;
    font-weight: 800;
    color: #D2B382;
  }
  .date {
    justify-self: end;
    font-size: 15px;
    color: #2B1F14;
  }
  .body {
    margin: 16px 0 6px 58px;
    color: #3b3127;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.9;
  }
  .divider {
    border: none;
    border-top: 1px solid #BFBFBF;
    margin: 18px 0 0 0;
  }
  .reply {
    margin-top: 18px;
    background: transparent;
    border-radius: 12px;
    padding: 16px 6px 0 6px;
  }
  .reply-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin: 0 10px 8px 10px;
  }
  .reply-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .arrow-img {
    width: 18px;
    height: 18px;
  }
  .label {
    font-size: 18px;
    font-weight: 800;
    color: #2B1F14;
  }
  .reply-meta {
    margin-top: 18px;
    margin-left: 36px;
    font-size: 15px;
    font-weight: 800;
    color: #2B1F14;
    margin-bottom: 8px;
  }
  .reply-body {
    margin-left: 36px;
    color: #000;
    font-weight: 800;
    line-height: 1.9;
  }
  .reply-date {
    font-size: 14px;
    color: #2B1F14;
  }
  @media (max-width: 720px) {
    .head { grid-template-columns: 1fr auto; }
    .body { margin-left: 58px; font-size: 15px; }
    .reply-body { font-size: 15px; }
  }
  </style>