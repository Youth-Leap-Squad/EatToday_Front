<!-- src/views/member/admin/AdminQnaAnswer.vue -->
<template>
    <AdminHeader />
    <div class="page">
      <h2 class="title">문의 답변 관리</h2>
  
      <section class="card">
        <div class="q-head">
          <div class="q-title">
            <span class="label">제목</span>
            <span class="val">{{ post?.inquiryTitle || '(제목 없음)' }}</span>
          </div>
          <div class="q-meta">
            <span>작성자: <b>{{ post?.questioner?.memberName || '-' }}</b></span>
            <span class="dot">·</span>
            <span>{{ fmt(post?.inquiryAt) }}</span>
          </div>
        </div>
        <div class="q-body">{{ post?.inquiryContent }}</div>
      </section>
  
      <section class="card">
        <h3 class="sec-title">새 답변</h3>
        <textarea
          v-model="newContent"
          class="ta"
          :placeholder="loading ? '불러오는 중...' : '답변 내용을 입력하세요'"
          :disabled="loading"
        />
        <div class="actions">
          <button class="btn primary" :disabled="!trimmedNew || loading" @click="onCreate">등록</button>
          <button class="btn" :disabled="loading" @click="newContent = ''">초기화</button>
        </div>
      </section>
  
      <section class="card">
        <h3 class="sec-title">등록된 답변</h3>
  
        <div v-if="cLoading" class="empty">답변 목록을 불러오는 중...</div>
        <div v-else-if="comments.length === 0" class="empty">아직 등록된 답변이 없습니다.</div>
  
        <ul v-else class="list">
          <li v-for="c in comments" :key="c.commentNo" class="item">
            <div class="row-1">
              <div class="who">
                <b>{{ c.answerer?.memberName || '관리자' }}</b>
                <span class="dot">·</span>
                <span class="date">{{ fmt(c.commentAt) }}</span>
              </div>
  
              <div class="ops" v-if="editId !== c.commentNo">
                <button class="mini" @click="startEdit(c)">수정</button>
                <button class="mini danger" @click="onDelete(c)">삭제</button>
              </div>
            </div>
  
            <p v-if="editId !== c.commentNo" class="content">{{ c.commentContent }}</p>
  
            <div v-else class="edit-box">
              <textarea v-model="editContent" class="ta" />
              <div class="actions">
                <button class="btn primary" :disabled="!editContent.trim()" @click="onUpdate(c)">저장</button>
                <button class="btn" @click="cancelEdit">취소</button>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
    <AdminFooter />
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AdminHeader from '@/common/header/AdminHeader.vue'
  import AdminFooter from '@/common/footer/AdminFooter.vue'
  import {
    fetchQnaDetail,
    fetchQnaComments,
    createQnaComment,
    updateQnaComment,
    deleteQnaComment
  } from '@/api/inquiryQna'
  
  const route = useRoute()
  const router = useRouter()
  const token = localStorage.getItem('token') || ''
  
  function fmt(d) {
    if (!d) return '-'
    const s = String(d)
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.replace('T', ' ').slice(0, 16)
    try {
      const dt = new Date(s)
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const dd = String(dt.getDate()).padStart(2, '0')
      const hh = String(dt.getHours()).padStart(2, '0')
      const mm = String(dt.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${dd} ${hh}:${mm}`
    } catch {
      return s
    }
  }
  
  const qnaPostNo = route.query.id
  const post = ref(null)
  const loading = ref(false)
  
  const comments = ref([])
  const cLoading = ref(false)
  
  const newContent = ref('')
  const trimmedNew = computed(() => newContent.value.trim())
  
  const editId = ref(null)
  const editContent = ref('')
  
  async function loadDetail() {
    loading.value = true
    try {
      post.value = await fetchQnaDetail({ id: qnaPostNo, token })
    } finally {
      loading.value = false
    }
  }
  
  async function loadComments() {
    cLoading.value = true
    try {
      const res = await fetchQnaComments({ qnaPostNo, page: 0, size: 50, token })
      comments.value = res?.content ?? []
    } finally {
      cLoading.value = false
    }
  }
  
  async function onCreate() {
    if (!trimmedNew.value) return
    await createQnaComment({ qnaPostNo, content: trimmedNew.value, token })
    newContent.value = ''
    await loadComments()
    alert('등록되었습니다.')
  }
  
  function startEdit(c) {
    editId.value = c.commentNo
    editContent.value = c.commentContent
  }
  function cancelEdit() {
    editId.value = null
    editContent.value = ''
  }
  
  async function onUpdate(c) {
    await updateQnaComment({ commentId: c.commentNo, content: editContent.value.trim(), token })
    await loadComments()
    cancelEdit()
    alert('수정되었습니다.')
  }
  
  async function onDelete(c) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await deleteQnaComment({ commentId: c.commentNo, token })
    await loadComments()
    alert('삭제되었습니다.')
  }
  
  onMounted(async () => {
    if (!qnaPostNo) {
      alert('잘못된 접근입니다.')
      router.replace('/admin/qna')
      return
    }
    await loadDetail()
    await loadComments()
  })
  </script>
  
  <style scoped>
.page {
  margin: 0 auto;
  padding: 22px 16px 40px;
  background: #ffffff;
}

.title {
  font-size: 24px;
  font-weight: 900;
  color: #2b1f14;
  margin-bottom: 14px;
  text-align: center;
}

/* 카드 배경 화이트로 변경 */
.card {
  border: 1px solid #e2d8c7;
  border-radius: 12px;
  padding: 16px;
  width: 800px;
  background: #ffffff;
  margin: 0 auto 16px;
}

.sec-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 900;
  color: #2b1f14;
}

.q-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  justify-content: space-between;
}

.q-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.label {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f2d5a7;
  color: #2b1f14;
  font-weight: 900;
  font-size: 12px;
}

.val {
  font-size: 18px;
  font-weight: 900;
  color: #2b1f14;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 560px;
}

.q-meta {
  color: #5b4a38;
  font-weight: 700;
  font-size: 13px;
}

.dot {
  margin: 0 6px;
  opacity: 0.6;
}

.q-body {
  margin-top: 10px;
  color: #2b1f14;
  font-weight: 800;
  line-height: 1.8;
}

.ta {
  width: 100%;
  min-height: 110px;
  box-sizing: border-box; 
  border: 1px solid #e2d8c7;
  border-radius: 10px;
  background: #ffffff;
  color: #2b1f14;
  padding: 12px;
  resize: vertical;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid #e2d8c7;
  background: #f3e7d5;
  color: #2b1f14;
  font-weight: 900;
  cursor: pointer;
}

.btn.primary {
  background: #f2d5a7;
  border-color: #f2d5a7;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.item {
  border: 1px solid #e2d8c7;
  border-radius: 10px;
  background: #ffffff;
  padding: 12px;
}

.row-1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.who {
  color: #2b1f14;
  font-weight: 800;
}

.date {
  opacity: 0.8;
  font-weight: 700;
}

.ops {
  display: flex;
  gap: 6px;
}

.mini {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e2d8c7;
  background: #fff7e9;
  font-weight: 800;
  cursor: pointer;
}

.mini.danger {
  background: #ffe8e6;
  border-color: #ffd0cc;
  color: #9d1b1b;
}

.content {
  margin: 10px 0 0;
  color: #2b1f14;
  font-weight: 800;
  line-height: 1.8;
}

.edit-box {
  margin-top: 10px;
}

.empty {
  padding: 18px 6px;
  text-align: center;
  color: #7a6a56;
  font-weight: 800;
}
</style>