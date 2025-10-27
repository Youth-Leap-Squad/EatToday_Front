<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <h1 class="page-title">신고 관리</h1>

      <!-- 검색 필터 -->
      <div class="search-filters">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchQuery" 
 edits            placeholder="신고자/대상 검색" 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <select v-model="statusFilter" class="filter-input">
            <option value="all">전체</option>
            <option value="pending">처리 대기</option>
            <option value="resolved">처리 완료</option>
          </select>
        </div>
        <div class="filter-group">
          <select v-model="typeFilter" class="filter-input">
            <option value="all">전체 유형</option>
            <option value="photo_review">사진 리뷰</option>
            <option value="food_post">게시글</option>
            <option value="food_comment">댓글</option>
            <option value="direct_message">DM</option>
            <option value="qna_post">QnA</option>
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
            <tr v-for="report in filteredReports" :key="report.id">
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
          @click="currentPage = page - 1" 
          :class="['page-btn', { active: currentPage === page - 1 }]"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- 신고 상세 모달 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>신고 상세 정보</h3>
          <button class="modal-close-btn" @click="closeDetailModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="info-row">
            <span class="info-label">신고 번호:</span>
            <span>{{ selectedReport?.id }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">신고자:</span>
            <span>{{ selectedReport?.reporter }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">대상:</span>
            <span>{{ selectedReport?.target }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">유형:</span>
            <span :class="['type-badge', `type-${selectedReport?.type}`]">
              {{ getTypeText(selectedReport?.type) }}
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">제목:</span>
            <span>{{ selectedReport?.title }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">내용:</span>
            <span>{{ selectedReport?.reason }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">신고일:</span>
            <span>{{ selectedReport?.date }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">상태:</span>
            <span :class="['status-badge', `status-${selectedReport?.status}`]">
              {{ getStatusText(selectedReport?.status) }}
            </span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeDetailModal">닫기</button>
          <button 
            v-if="selectedReport?.status === 'pending'"
            class="modal-btn approve-btn" 
            @click="handleApproveFromModal"
          >
            승인
          </button>
        </div>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'
import { getReportList, approveReport } from '@/api/report'

const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const currentPage = ref(0)
const itemsPerPage = 10

const reports = ref([])
const totalPages = ref(0)
const isLoading = ref(false)

// 모달 관련
const showDetailModal = ref(false)
const selectedReport = ref(null)

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchReports()
})

// 페이지 변경 감지
watch(currentPage, () => {
  fetchReports()
})

// 백엔드에서 신고 목록 가져오기
const fetchReports = async () => {
  try {
    isLoading.value = true
    const response = await getReportList(currentPage.value, itemsPerPage)
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    reports.value = response.content.map(report => ({
      id: report.reportNo,
      reporter: report.reporter?.memberName || `User${report.memberNo}`,
      target: report.accused?.memberName || `User${report.memberNo2}`,
      type: report.reportSource,
      reason: report.reportContent,
      title: report.reportTitle,
      date: report.reportDate,
      status: report.reportYn ? 'resolved' : 'pending'
    }))
    
    totalPages.value = response.totalPages || 0
  } catch (error) {
    console.error('신고 목록 가져오기 실패:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredReports = computed(() => {
  let filtered = reports.value

  if (searchQuery.value) {
    filtered = filtered.filter(r => 
      r.reporter?.toString().includes(searchQuery.value) || 
      r.target?.toString().includes(searchQuery.value) ||
      r.reason?.includes(searchQuery.value)
    )
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === statusFilter.value)
  }

  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.type === typeFilter.value)
  }

  return filtered
})

const getTypeText = (type) => {
  const typeMap = {
    photo_review: '사진 리뷰',
    food_post: '게시글',
    food_comment: '댓글',
    direct_message: 'DM',
    qna_post: 'QnA'
  }
  return typeMap[type] || type
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '처리 대기',
    resolved: '처리 완료'
  }
  return statusMap[status] || status
}

const applySearch = () => {
  currentPage.value = 0
  fetchReports()
}

const handleApprove = async (report) => {
  try {
    await approveReport(report.id)
    report.status = 'resolved'
    alert('신고가 승인되었습니다.')
  } catch (error) {
    console.error('신고 승인 실패:', error)
    alert('신고 승인에 실패했습니다.')
  }
}

const viewDetail = (report) => {
  selectedReport.value = report
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedReport.value = null
}

const handleApproveFromModal = async () => {
  if (selectedReport.value) {
    await handleApprove(selectedReport.value)
    closeDetailModal()
  }
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

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.type-photo_review {
  background: #e3f2fd;
  color: #1976d2;
}

.type-food_post {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-food_comment {
  background: #fff3e0;
  color: #e65100;
}

.type-direct_message {
  background: #eceff1;
  color: #546e7a;
}

.type-qna_post {
  background: #e8f5e9;
  color: #2e7d32;
}

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

.detail-btn {
  background: #dabb8b;
  color: #fff;
}

.detail-btn:hover {
  background: #c4a876;
}

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

.page-btn:hover {
  background: #f0f0f0;
}

.page-btn.active {
  background: #3b2e1e;
  color: #fff;
  border-color: #3b2e1e;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #3b2e1e;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #3b2e1e;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.modal-footer .approve-btn {
  background: #4caf50;
  color: #fff;
}

.modal-footer .approve-btn:hover {
  background: #388e3c;
}
</style>

