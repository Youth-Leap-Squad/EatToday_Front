<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">회원 관리</h1>

      <!-- 회원 통계 카드 -->
      <div class="stat-cards">
        <StatCard label="총 회원 수" :value="1324" unit="명" />
        <StatCard label="신규 회원" :value="21" unit="명" />
        <StatCard label="정지 회원" :value="14" unit="명" />
        <StatCard label="휴면 회원" :value="12" unit="명" />
      </div>

      <!-- 검색 필터 -->
      <div class="search-filters">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchId" 
            placeholder="아이디 검색" 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <input 
            type="date" 
            v-model="searchJoinDate" 
            placeholder="가입일" 
            class="filter-input"
          />
        </div>
        <button class="search-btn" @click="applySearch">검색</button>
      </div>

      <!-- 회원 테이블 -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>가입일</th>
              <th>이메일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in paginatedMembers" :key="index">
              <td>{{ member.id }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.joinDate }}</td>
              <td>{{ member.email }}</td>
              <td>
                <span :class="['status-badge', `status-${member.status}`]">
                  {{ getStatusText(member.status) }}
                </span>
              </td>
              <td>
                <button class="manage-btn" @click="openManageModal(member)">
                  관리
                </button>
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

    <!-- 회원 관리 모달 -->
    <div v-if="showManageModal" class="modal-overlay" @click="closeManageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>회원 관리</h3>
          <button class="modal-close-btn" @click="closeManageModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="info-row">
            <span class="info-label">아이디:</span>
            <span>{{ selectedMember?.id }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">이름:</span>
            <span>{{ selectedMember?.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">이메일:</span>
            <span>{{ selectedMember?.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">가입일:</span>
            <span>{{ selectedMember?.joinDate }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">현재 상태:</span>
            <span :class="['status-badge', `status-${selectedMember?.status}`]">
              {{ getStatusText(selectedMember?.status) }}
            </span>
          </div>

          <div class="action-section">
            <h4>상태 변경</h4>
            <div class="status-options">
              <button 
                @click="changeStatus('normal')" 
                :class="['status-btn', { active: selectedMember?.status === 'normal' }]"
              >
                정상
              </button>
              <button 
                @click="changeStatus('restricted')" 
                :class="['status-btn', { active: selectedMember?.status === 'restricted' }]"
              >
                제한
              </button>
              <button 
                @click="changeStatus('dormant')" 
                :class="['status-btn', { active: selectedMember?.status === 'dormant' }]"
              >
                휴면
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeManageModal">취소</button>
          <button class="modal-btn save-btn" @click="saveChanges">저장</button>
        </div>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'
import StatCard from './AdminStatCard.vue'

const searchId = ref('')
const searchJoinDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const members = ref([
  { id: 'soju_love', name: '박철수', joinDate: '2025-03-11', email: 'soju.love@example.com', status: 'normal' },
  { id: 'beer_queen', name: '김민지', joinDate: '2025-04-02', email: 'beer.queen@example.com', status: 'restricted' },
  { id: 'wine_master', name: '최영희', joinDate: '2025-05-20', email: 'wine.master@example.com', status: 'normal' },
  { id: 'makgeolli', name: '정우성', joinDate: '2025-06-01', email: 'makgeolli@example.com', status: 'normal' },
  { id: 'cocktail_girl', name: '한지민', joinDate: '2025-07-18', email: 'cocktail.girl@example.com', status: 'dormant' },
  { id: 'new_member1', name: '새로운회원1', joinDate: '2025-08-01', email: 'new1@example.com', status: 'normal' },
  { id: 'new_member2', name: '새로운회원2', joinDate: '2025-08-05', email: 'new2@example.com', status: 'normal' },
  { id: 'suspended_user', name: '정지회원', joinDate: '2025-07-20', email: 'suspended@example.com', status: 'restricted' },
])

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesId = member.id.includes(searchId.value)
    const matchesJoinDate = searchJoinDate.value ? member.joinDate === searchJoinDate.value : true
    return matchesId && matchesJoinDate
  })
})

const totalPages = computed(() => Math.ceil(filteredMembers.value.length / itemsPerPage))

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMembers.value.slice(start, end)
})

const getStatusText = (status) => {
  const statusMap = {
    normal: '정상',
    restricted: '제한',
    dormant: '휴면'
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

const showManageModal = ref(false)
const selectedMember = ref(null)

const openManageModal = (member) => {
  console.log('관리 모달 열기:', member)
  selectedMember.value = member
  showManageModal.value = true
}

const closeManageModal = () => {
  showManageModal.value = false
  selectedMember.value = null
}

const changeStatus = (status) => {
  if (selectedMember.value) {
    selectedMember.value.status = status
  }
}

const saveChanges = () => {
  // 실제로는 API 호출로 DB 업데이트
  console.log('회원 상태 변경:', selectedMember.value)
  
  // 로컬 데이터 업데이트
  const memberIndex = members.value.findIndex(m => m.id === selectedMember.value.id)
  if (memberIndex !== -1) {
    members.value[memberIndex] = { ...selectedMember.value }
  }
  
  closeManageModal()
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

/* 통계 카드 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

/* 검색 필터 */
.search-filters {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
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

/* 상태 배지 */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-normal {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-restricted {
  background: #fff3e0;
  color: #e65100;
}

.status-dormant {
  background: #eceff1;
  color: #546e7a;
}

/* 관리 버튼 */
.manage-btn {
  padding: 6px 16px;
  background: #dabb8b;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.manage-btn:hover {
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
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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

.action-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e0e0e0;
}

.action-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #3b2e1e;
}

.status-options {
  display: flex;
  gap: 12px;
}

.status-btn {
  padding: 8px 20px;
  border: 2px solid #dabb8b;
  background: #fff;
  color: #dabb8b;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn:hover {
  background: #f5f1ea;
}

.status-btn.active {
  background: #dabb8b;
  color: #fff;
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

.save-btn {
  background: #dabb8b;
  color: #fff;
}

.save-btn:hover {
  background: #c4a876;
}
</style>
