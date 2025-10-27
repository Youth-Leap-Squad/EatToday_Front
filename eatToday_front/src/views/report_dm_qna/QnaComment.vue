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

        <!-- 답변 목록 -->
        <div v-if="comments.length" class="reply-list">
          <div
            v-for="c in comments"
            :key="c.commentNo"
            class="reply"
          >
            <div class="reply-head">
              <div class="reply-title">
                <img :src="arrowImg" class="arrow-img" />
                <span class="label">답변</span>
              </div>
              <div class="reply-date">{{ fmtDate(c.commentAt) }}</div>
            </div>
            <div class="reply-meta">{{ c.answerer?.memberName || '관리자' }}</div>
            <div class="reply-body">
              <p v-for="(line, i) in splitLines(c.commentContent)" :key="i">{{ line }}</p>
            </div>
          </div>

          <!-- 간단 페이지네이션 -->
          <div class="pager" v-if="totalPages > 1">
            <button class="nav" :disabled="page===0" @click="go(page-1)">이전</button>
            <span class="pg-text">{{ page+1 }} / {{ totalPages }}</span>
            <button class="nav" :disabled="page>=totalPages-1" @click="go(page+1)">다음</button>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import userImg from '@/assets/images/photo_review/userexample.png'
import arrowImg from '@/assets/images/arrow.png'
import { fetchQnaDetail, fetchQnaComments } from '@/api/inquiryQna'

const route = useRoute()

const name = ref('사용자')
const subject = ref('문의 제목')
const date = ref('')
const body = ref('')

const comments = ref([])
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)

const token = localStorage.getItem('token') || ''

function fmtDate(d) {
  if (!d) return ''
  const s = String(d)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.replaceAll('-', '.')
  try {
    const dt = new Date(s)
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    const hh = String(dt.getHours()).padStart(2, '0')
    const mm = String(dt.getMinutes()).padStart(2, '0')
    const ss = String(dt.getSeconds()).padStart(2, '0')
    return `${y}.${m}.${dd} ${hh}:${mm}:${ss}`
  } catch { return s }
}

const bodyLines = computed(() => (body.value || '').split(/\r?\n/).filter(Boolean))
const splitLines = txt => String(txt || '').split(/\r?\n/).filter(Boolean)

async function loadDetail(id) {
  const data = await fetchQnaDetail({ id, token })
  name.value = data?.questioner?.memberName || '사용자'
  subject.value = data?.inquiryTitle || (data?.inquiryContent ? String(data.inquiryContent).slice(0, 30) : '문의 제목')
  date.value = fmtDate(data?.inquiryAt)
  body.value = data?.inquiryContent || ''
}

async function loadComments(id) {
  const res = await fetchQnaComments({ qnaPostNo: id, page: page.value, size: size.value, token })
  const items = res?.content ?? res?.items ?? []
  comments.value = items
  totalPages.value = res?.totalPages ?? 1
}

function go(p) {
  page.value = Math.max(0, Math.min(totalPages.value - 1, p))
}

onMounted(async () => {
  const id = route.query.id
  if (!id) return
  await loadDetail(id)
  await loadComments(id)
})

watch(page, async (p) => {
  const id = route.query.id
  if (!id) return
  await loadComments(id)
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