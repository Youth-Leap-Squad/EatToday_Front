<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">신고 관리</h1>

      <!-- 검색 필터 -->
      <div class="search-filters">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="신고자/대상 검색" 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <select v-model="statusFilter" class="filter-input">
            <option value="all">전체</option>
            <option value="pending">처리 대기</option>
            <option value="resolved">처리 완료</option>
            <option value="rejected">거부됨</option>
          </select>
        </div>
        <div class="filter-group">
          <select v-model="typeFilter" class="filter-input">
            <option value="all">전체 유형</option>
            <option value="post">게시글</option>
            <option value="comment">댓글</option>
            <option value="user">사용자</option>
            <option value="other">기타</option>
          </select>
        </div>
        <button class="search-btn" @click="applySearch">검색</button>
      </div>

      <!-- 신고 테이블 -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>신고자</th>
              <th>대상</th>
              <th>유형</th>
              <th>내용</th>
              <th>신고일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in filteredReports" :key="index">
              <td>{{ report.reporter }}</td>
              <td>{{ report.target }}</td>
              <td>
                <span :class="['type-badge', `type-${report.type}`]">
                  {{ getTypeText(report.type) }}
                </span>
              </td>
              <td class="reason-cell">{{ report.reason }}</td>
              <td>{{ report.date }}</td>
              <td>
                <span :class="['status-badge', `status-${report.status}`]">
                  {{ getStatusText(report.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="report.status === 'pending'" 
                    class="action-btn approve-btn"
                    @click="handleApprove(report)"
                  >
                    승인
                  </button>
                  <button 
                    v-if="report.status === 'pending'" 
                    class="action-btn reject-btn"
                    @click="handleReject(report)"
                  >
                    거부
                  </button>
                  <button 
                    class="action-btn detail-btn"
                    @click="viewDetail(report)"
                  >
                    상세
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="currentPage = page" 
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        <button 
          class="page-btn" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          >
        </button>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'

const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

const reports = ref([
  { 
    reporter: 'user123', 
    target: 'post #1234', 
    type: 'post', 
    reason: '부적절한 콘텐츠가 포함되어 있습니다.',
    date: '2025-01-15',
    status: 'pending'
  },
  { 
    reporter: 'admin_user', 
    target: 'user456', 
    type: 'user', 
    reason: '스팸 계정으로 의심됩니다.',
    date: '2025-01-14',
    status: 'resolved'
  },
  { 
    reporter: 'moderator1', 
    target: 'comment #567', 
    type: 'comment', 
    reason: '욕설 및 비방 게시글입니다.',
    date: '2025-01-13',
    status: 'pending'
  },
  { 
    reporter: 'user789', 
    target: 'post #890', 
    type: 'post', 
    reason: '저작권 침해가 의심됩니다.',
    date: '2025-01-12',
    status: 'rejected'
  },
  { 
    reporter: 'security_team', 
    target: 'user999', 
    type: 'user', 
    reason: '계정 도용 의심.',
    date: '2025-01-11',
    status: 'resolved'
  },
])

const filteredReports = computed(() => {
  let filtered = reports.value

  // 검색 필터
  if (searchQuery.value) {
    filtered = filtered.filter(r => 
      r.reporter.includes(searchQuery.value) || 
      r.target.includes(searchQuery.value) ||
      r.reason.includes(searchQuery.value)
    )
  }

  // 상태 필터
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }

  // 유형 필터
  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.type === typeFilter.value)
  }

  // 페이지네이션
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage))

const getTypeText = (type) => {
  const typeMap = {
    post: '게시글',
    comment: '댓글',
    user: '사용자',
    other: '기타'
  }
  return typeMap[type] || type
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '처리 대기',
    resolved: '처리 완료',
    rejected: '거부됨'
  }
  return statusMap[status] || status
}

const applySearch = () => {
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleApprove = (report) => {
  console.log('신고 승인:', report)
  report.status = 'resolved'
  // 실제로는 API 호출
}

const handleReject = (report) => {
  console.log('신고 거부:', report)
  report.status = 'rejected'
  // 실제로는 API 호출
}

const viewDetail = (report) => {
  console.log('신고 상세:', report)
  // 모달이나 상세 페이지로 이동
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #fafafa;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #3b2e1e;
  margin-bottom: 24px;
}

/* 검색 필터 */
.search-filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
}

.search-btn {
  padding: 10px 24px;
  background: #dabb8b;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background: #c4a876;
}

/* 테이블 */
.table-container {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f5f5f5;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
}

.data-table th {
  font-weight: 600;
  color: #333;
}

.data-table td {
  color: #666;
}

.data-table tbody tr:hover {
  background: #f9f9f9;
}

.reason-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 유형 배지 */
.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-post {
  background: #e3f2fd;
  color: #1976d2;
}

.type-comment {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-user {
  background: #fff3e0;
  color: #e65100;
}

.type-other {
  background: #eceff1;
  color: #546e7a;
}

/* 상태 배지 */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #fff3e0;
  color: #e65100;
}

.status-resolved {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-rejected {
  background: #ffebee;
  color: #c62828;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.approve-btn {
  background: #4caf50;
  color: #fff;
}

.approve-btn:hover {
  background: #388e3c;
}

.reject-btn {
  background: #f44336;
  color: #fff;
}

.reject-btn:hover {
  background: #d32f2f;
}

.detail-btn {
  background: #dabb8b;
  color: #fff;
}

.detail-btn:hover {
  background: #c4a876;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #3b2e1e;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: #f0f0f0;
}

.page-btn.active {
  background: #3b2e1e;
  color: #fff;
  border-color: #3b2e1e;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
