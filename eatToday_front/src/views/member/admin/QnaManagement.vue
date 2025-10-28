<!-- src/views/member/admin/QnaManagement.vue -->
<template>
    <AdminHeader />
    <div class="admin-qna">
      <h2 class="title">문의사항 관리</h2>
  
      <div class="search-box">
        <input
          v-model="keyword"
          class="ipt"
          placeholder="제목 또는 내용 검색"
          @keyup.enter="onSearch"
        />
        <button class="btn" @click="onSearch">검색</button>
      </div>
  
      <table class="tb">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
  
        <tbody>
          <tr
            v-for="p in list"
            :key="p.qnaPostNo"
            @click="goDetail(p.qnaPostNo)"
            class="row"
          >
            <td>{{ p.qnaPostNo }}</td>
            <td class="left">{{ p.inquiryTitle }}</td>
            <td>{{ p.questioner?.memberName }}</td>
            <td>{{ fmt(p.inquiryAt) }}</td>
          </tr>
        </tbody>
      </table>
  
      <div class="pager" v-if="totalPages > 0">
        <button
          class="pager-btn arrow"
          :disabled="page===0"
          @click="go(page-1)"
        >
          ‹
        </button>
  
        <button class="pager-btn active">
          {{ page + 1 }}
        </button>
  
        <button
          class="pager-btn arrow"
          :disabled="page>=totalPages-1"
          @click="go(page+1)"
        >
          ›
        </button>
      </div>
    </div>
    <AdminFooter/>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { fetchAllQnaDate, searchQna } from '@/api/inquiryQna'
  import AdminHeader from '@/common/header/AdminHeader.vue'
  import AdminFooter from '@/common/footer/AdminFooter.vue'
  
  const router = useRouter()
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
  
  function hasAdminRole(payload) {
    if (!payload) return false
    const cand = [
      payload.memberRole,
      payload.role,
      payload.authority,
      ...(Array.isArray(payload.roles) ? payload.roles : []),
      ...(Array.isArray(payload.authorities) ? payload.authorities : []),
    ].filter(Boolean).map(String)
    return cand.some(r => r.toUpperCase().includes('ADMIN') || r.toUpperCase().includes('ROLE_ADMIN'))
  }
  
  const isAdmin = computed(() => hasAdminRole(parseJwt(token)))
  
  const page = ref(0)
  const size = ref(10)
  const totalPages = ref(1)
  const list = ref([])
  const keyword = ref('')
  
  function fmt(d) {
    return String(d).replace('T', ' ').slice(0, 16)
  }
  
  async function loadList() {
    const res = await fetchAllQnaDate({ page: page.value, size: size.value, token })
    list.value = res.content ?? []
    totalPages.value = res.totalPages ?? 1
  }
  
  async function onSearch() {
    if (!keyword.value.trim()) return loadList()
    const res = await searchQna({ keyword: keyword.value, page: page.value, size: size.value, token })
    list.value = res.content ?? []
    totalPages.value = res.totalPages ?? 1
  }
  
  function go(p) {
    page.value = Math.max(0, Math.min(totalPages.value - 1, p))
  }
  
  watch(page, () => {
    if (keyword.value.trim()) onSearch()
    else loadList()
  })
  
  onMounted(async () => {
    if (!isAdmin.value) {
      alert('관리자만 접근 가능합니다.')
      router.replace('/')
      return
    }
    await loadList()
  })
  
  function goDetail(no) {
    router.push(`/admin/qna/answer?id=${no}`)
  }
  </script>
  
  <style scoped>
  .admin-qna {
    padding: 20px;
    background: #ffffff;
  }
  .title {
    font-size: 24px;
    font-weight: 900;
    margin-bottom: 14px;
    color: #2b1f14;
  }
  .search-box {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  .ipt {
    flex: 1;
    border: 1px solid #d9d0c1;
    padding: 8px;
    border-radius: 8px;
  }
  .btn {
    background: #f2d5a7;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 900;
    cursor: pointer;
  }
  .tb {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
  }
  .tb th,
  .tb td {
    border: 1px solid #e2d8c7;
    padding: 10px;
    text-align: center;
  }
  .left {
    text-align: left;
  }
  .row:hover {
    background: #fff0d0;
    cursor: pointer;
  }
  .pager {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    gap: 6px;
    background: #ffffff;
    padding: 10px 0;
  }
  .pager-btn {
    min-width: 34px;
    height: 34px;
    padding: 0;
    border-radius: 8px;
    border: 2px solid #e2d8c7;
    background: #fff;
    color: #2b1f14;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    transition: 0.15s;
  }
  .pager-btn.active {
    background: #2b1f14;
    border-color: #2b1f14;
    color: #ffffff;
  }
  .pager-btn.arrow {
    font-size: 16px;
  }
  .pager-btn:hover:not(.active):not(:disabled) {
    background: #faf5ef;
  }
  .pager-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  </style>