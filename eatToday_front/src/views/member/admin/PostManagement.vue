<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">게시글 관리</h1>

      <!-- 탭 버튼 -->
      <div class="tabs">
        <button 
          class="tab-btn active" 
          @click="activeTab = 'approved'"
          :class="{ active: activeTab === 'approved' }"
        >
          승인 게시글 <span class="count">324건</span>
        </button>
        <button 
          class="tab-btn" 
          @click="activeTab = 'pending'"
          :class="{ active: activeTab === 'pending' }"
        >
          미승인 게시글 <span class="count">294건</span>
        </button>
      </div>

      <!-- 검색 필터 -->
      <div class="search-filters">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="게시글 검색" 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <input 
            type="date" 
            v-model="dateQuery" 
            placeholder="작성일" 
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <input 
            type="text" 
            v-model="authorQuery" 
            placeholder="작성자" 
            class="filter-input"
          />
        </div>
        <button class="search-btn" @click="handleSearch">검색</button>
      </div>

      <!-- 게시글 테이블 -->
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
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.joinDate }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['status-badge', `status-${user.status}`]">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td>
                <button class="manage-btn" @click="openManageModal(user)">
                  관리
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'

const activeTab = ref('approved')
const searchQuery = ref('')
const dateQuery = ref('')
const authorQuery = ref('')

const users = ref([
  { id: 'soju_love', name: '박철수', joinDate: '2025-03-11', email: 'soju.love@example.com', status: 'normal' },
  { id: 'beer_queen', name: '김민지', joinDate: '2025-04-02', email: 'beer.queen@example.com', status: 'restricted' },
  { id: 'wine_master', name: '최영희', joinDate: '2025-05-20', email: 'wine.master@example.com', status: 'normal' },
  { id: 'makgeolli', name: '정우성', joinDate: '2025-06-01', email: 'makgeolli@example.com', status: 'normal' },
  { id: 'cocktail_girl', name: '한지민', joinDate: '2025-07-18', email: 'cocktail.girl@example.com', status: 'dormant' },
])

const getStatusText = (status) => {
  const statusMap = {
    normal: '정상',
    restricted: '제한',
    dormant: '휴면'
  }
  return statusMap[status] || status
}

const handleSearch = () => {
  console.log('검색:', { searchQuery: searchQuery.value, dateQuery: dateQuery.value, authorQuery: authorQuery.value })
  // 검색 로직 구현
}

const openManageModal = (user) => {
  console.log('관리 모달 열기:', user)
  // 관리 모달 로직 구현
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

/* 탭 버튼 */
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #3b2e1e;
}

.tab-btn.active {
  color: #3b2e1e;
  border-bottom-color: #3b2e1e;
}

.count {
  margin-left: 8px;
  font-weight: 400;
  color: #666;
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
</style>
