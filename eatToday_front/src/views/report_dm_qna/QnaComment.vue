<template>
  <div class="qna-comment">
    <div class="inner">
      <div class="card">
        <div class="card-title">
          <div class="title-left">
            <h2 class="title">문의사항</h2>
          </div>

          <div v-if="canEdit" class="title-actions">
            <button class="icon-btn" @click="toggleEdit">
              <img :src="editImg" alt="edit" />
            </button>
            <button class="icon-btn" @click="onDelete">
              <img :src="closeImg" alt="delete" />
            </button>
          </div>
        </div>
        <hr class="title-line" />

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

        <div v-if="isEdit" class="edit-box">
          <textarea v-model="editContent" class="edit-ta" />
          <div class="edit-actions">
            <button class="btn primary" @click="onSave">저장</button>
            <button class="btn" @click="cancelEdit">취소</button>
          </div>
        </div>

        <div v-else class="body">
          <p v-for="(line, i) in bodyLines" :key="i">{{ line }}</p>
        </div>

        <hr class="divider" />

        <div v-if="comments.length" class="reply-list">
          <div v-for="c in comments" :key="c.commentNo" class="reply">
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
import { useRoute, useRouter } from 'vue-router'
import userImg from '@/assets/images/photo_review/userexample.png'
import arrowImg from '@/assets/images/arrow.png'
import editImg from '@/assets/images/blackeditbutton.png'
import closeImg from '@/assets/images/blackclosebutton.png'
import { fetchQnaDetail, fetchQnaComments } from '@/api/inquiryQna'

const route = useRoute()
const router = useRouter()

const name = ref('사용자')
const subject = ref('문의 제목')
const date = ref('')
const body = ref('')
const postMemberNo = ref(null)

const comments = ref([])
const page = ref(0)
const size = ref(10)
const totalPages = ref(1)

const isEdit = ref(false)
const editContent = ref('')

const token = localStorage.getItem('token') || ''

function parseJwt(t) {
  try {
    const p = t.split('.')[1]
    if (!p) return null
    const b64 = p.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64 + '='.repeat((4 - (b64.length % 4 || 4)) % 4)
    return JSON.parse(
      decodeURIComponent(
        atob(pad).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      )
    )
  } catch { return null }
}
const myNo = computed(() => parseJwt(token)?.memberNo || null)
const canEdit = computed(() => !!token && !!myNo.value && myNo.value === postMemberNo.value)

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
  postMemberNo.value = data?.memberNo ?? null
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

function toggleEdit() {
  isEdit.value = !isEdit.value
  if (isEdit.value) editContent.value = body.value
}
function cancelEdit() {
  isEdit.value = false
  editContent.value = ''
}

async function onSave() {
  const id = route.query.id
  if (!id) return
  const newContent = encodeURIComponent(editContent.value ?? '')
  const res = await fetch(`/api/qna-posts/${id}?newContent=${newContent}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    alert(`수정 실패: ${t}`)
    return
  }
  body.value = editContent.value
  isEdit.value = false
}

async function onDelete() {
  const id = route.query.id
  if (!id) return
  if (!confirm('정말 삭제하시겠습니까?')) return
  const res = await fetch(`/api/qna-posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const t = await res.text().catch(() => '')
    alert(`삭제 실패: ${t}`)
    return
  }
  alert('삭제되었습니다.')
  router.replace('/qna/my')
}

onMounted(async () => {
  const id = route.query.id
  if (!id) return
  await loadDetail(id)
  await loadComments(id)
})

watch(page, async () => {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #2B1F14;
  margin-top: 20px;
  white-space: nowrap;
}
.title-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.icon-btn {
  border: none;
  background: transparent;
  padding: 2px;
  cursor: pointer;
}
.icon-btn img {
  width: 20px;
  height: 20px;
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

.edit-box {
  margin: 16px 0 6px 58px;
}
.edit-ta {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  border-radius: 10px;
  border: 1px solid #E2D8C7;
  padding: 12px;
  font-size: 15px;
  color: #2B1F14;
  background: #FFFDF8;
}
.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.btn {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #E2D8C7;
  background: #F3E7D5;
  color: #2B1F14;
  font-weight: 800;
  cursor: pointer;
}
.btn.primary {
  background: #F2D5A7;
  border-color: #F2D5A7;
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
  filter: invert(9%) sepia(9%) saturate(936%) hue-rotate(347deg) brightness(95%) contrast(92%);
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

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}
.nav {
  border: 1px solid #E2D8C7;
  background: #F3E7D5;
  color: #2B1F14;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
}
.pg-text {
  color: #2B1F14;
  font-weight: 800;
}
</style>