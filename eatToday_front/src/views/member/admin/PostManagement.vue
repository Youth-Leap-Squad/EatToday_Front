<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">게시글 관리</h1>

      <!-- 탭 버튼 -->
      <div class="tabs">
        <button 
          class="tab-btn" 
          @click="activeTab = 'approved'"
          :class="{ active: activeTab === 'approved' }"
        >
          승인 게시글 <span class="count">{{ approvedPosts.length }}건</span>
        </button>
        <button 
          class="tab-btn" 
          @click="activeTab = 'pending'"
          :class="{ active: activeTab === 'pending' }"
        >
          미승인 게시글 <span class="count">{{ pendingPosts.length }}건</span>
        </button>
      </div>

      <!-- 검색 필터 -->
      <div class="search-filters">
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="게시글 제목 검색" 
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
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" style="text-align: center; padding: 24px;">
                데이터를 불러오는 중...
              </td>
            </tr>
            <tr v-else-if="filteredPosts.length === 0">
              <td colspan="6" style="text-align: center; padding: 24px; color: #999;">
                게시글이 없습니다.
              </td>
            </tr>
            <tr v-else v-for="post in filteredPosts" :key="post.boardNo">
              <td>{{ post.boardNo }}</td>
              <td>{{ post.boardTitle }}</td>
              <td>{{ post.memberId }}</td>
              <td>{{ formatDate(post.boardDate) }}</td>
              <td>
                <span :class="['status-badge', post.confirmedYn ? 'status-approved' : 'status-pending']">
                  {{ post.confirmedYn ? '승인' : '미승인' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="detail-btn" 
                    @click="viewDetail(post)"
                  >
                    상세
                  </button>
                  <button 
                    v-if="!post.confirmedYn"
                    class="approve-btn" 
                    @click="handleApprove(post)"
                  >
                    승인
                  </button>
                  <button 
                    v-if="post.confirmedYn"
                    class="reject-btn" 
                    @click="handleReject(post)"
                  >
                    거부
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 게시글 상세 모달 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>게시글 상세 정보</h3>
          <button class="modal-close-btn" @click="closeDetailModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="info-row">
            <span class="info-label">게시글 번호:</span>
            <span>{{ selectedPost?.boardNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">제목:</span>
            <span>{{ selectedPost?.boardTitle }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">작성자:</span>
            <span>{{ selectedPost?.memberId }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">내용:</span>
            <span>{{ selectedPost?.boardContent }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">음식 설명:</span>
            <span>{{ selectedPost?.foodExplain }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">작성일:</span>
            <span>{{ formatDate(selectedPost?.boardDate) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">상태:</span>
            <span :class="['status-badge', selectedPost?.confirmedYn ? 'status-approved' : 'status-pending']">
              {{ selectedPost?.confirmedYn ? '승인' : '미승인' }}
            </span>
          </div>
          <div class="info-row" v-if="selectedPost?.foodPictures && selectedPost.foodPictures.length > 0">
            <span class="info-label">이미지:</span>
            <div class="images-container">
              <img 
                v-for="(image, index) in selectedPost.foodPictures" 
                :key="index" 
                :src="image" 
                alt="게시글 이미지" 
                class="post-image"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeDetailModal">닫기</button>
          <button 
            v-if="!selectedPost?.confirmedYn"
            class="modal-btn approve-btn" 
            @click="handleApproveFromModal"
          >
            승인
          </button>
          <button 
            v-if="selectedPost?.confirmedYn"
            class="modal-btn reject-btn" 
            @click="handleRejectFromModal"
          >
            거부
          </button>
        </div>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'
import { getAllPosts, approvePost } from '@/api/post'

const activeTab = ref('approved')
const searchQuery = ref('')
const dateQuery = ref('')
const authorQuery = ref('')
const posts = ref([])
const loading = ref(true)

// 모달 관련
const showDetailModal = ref(false)
const selectedPost = ref(null)

// 승인된 게시글
const approvedPosts = computed(() => {
  return posts.value.filter(post => post.confirmedYn === true)
})

// 미승인 게시글
const pendingPosts = computed(() => {
  return posts.value.filter(post => post.confirmedYn !== true)
})

// 현재 탭에 따른 필터링된 게시글
const filteredPosts = computed(() => {
  let filtered = activeTab.value === 'approved' ? approvedPosts.value : pendingPosts.value
  
  // 검색 필터 적용
  if (searchQuery.value) {
    filtered = filtered.filter(post => 
      post.boardTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (authorQuery.value) {
    filtered = filtered.filter(post => 
      post.memberId.toLowerCase().includes(authorQuery.value.toLowerCase())
    )
  }
  
  if (dateQuery.value) {
    filtered = filtered.filter(post => {
      const postDate = new Date(post.boardDate).toISOString().split('T')[0]
      return postDate === dateQuery.value
    })
  }
  
  return filtered
})

// 게시글 목록 가져오기
const fetchPosts = async () => {
  try {
    loading.value = true
    const data = await getAllPosts()
    posts.value = Array.isArray(data) ? data : []
    console.log('게시글 목록:', posts.value)
  } catch (error) {
    console.error('게시글 목록 가져오기 실패:', error)
    alert('게시글 목록을 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

// 게시글 승인
const handleApprove = async (post) => {
  if (!confirm(`게시글 "${post.boardTitle}"을 승인하시겠습니까?`)) {
    return
  }
  
  try {
    await approvePost(post.boardNo, true)
    alert('게시글이 승인되었습니다.')
    activeTab.value = 'approved' // 승인 탭으로 이동
    await fetchPosts() // 목록 새로고침
  } catch (error) {
    console.error('게시글 승인 실패:', error)
    alert('게시글 승인에 실패했습니다.')
  }
}

// 게시글 거부
const handleReject = async (post) => {
  if (!confirm(`게시글 "${post.boardTitle}"을 거부하시겠습니까?`)) {
    return
  }
  
  try {
    await approvePost(post.boardNo, false)
    alert('게시글이 거부되었습니다.')
    activeTab.value = 'pending' // 미승인 탭으로 이동
    await fetchPosts() // 목록 새로고침
  } catch (error) {
    console.error('게시글 거부 실패:', error)
    alert('게시글 거부에 실패했습니다.')
  }
}

// 검색 처리
const handleSearch = () => {
  console.log('검색:', { searchQuery: searchQuery.value, dateQuery: dateQuery.value, authorQuery: authorQuery.value })
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 모달 관련 함수
const viewDetail = (post) => {
  selectedPost.value = post
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedPost.value = null
}

const handleApproveFromModal = async () => {
  if (!selectedPost.value) return
  
  if (!confirm(`게시글 "${selectedPost.value.boardTitle}"을 승인하시겠습니까?`)) {
    return
  }
  
  try {
    await approvePost(selectedPost.value.boardNo, true)
    alert('게시글이 승인되었습니다.')
    activeTab.value = 'approved' // 승인 탭으로 이동
    await fetchPosts() // 목록 새로고침
    closeDetailModal()
  } catch (error) {
    console.error('게시글 승인 실패:', error)
    alert('게시글 승인에 실패했습니다.')
  }
}

const handleRejectFromModal = async () => {
  if (!selectedPost.value) return
  
  if (!confirm(`게시글 "${selectedPost.value.boardTitle}"을 거부하시겠습니까?`)) {
    return
  }
  
  try {
    await approvePost(selectedPost.value.boardNo, false)
    alert('게시글이 거부되었습니다.')
    activeTab.value = 'pending' // 미승인 탭으로 이동
    await fetchPosts() // 목록 새로고침
    closeDetailModal()
  } catch (error) {
    console.error('게시글 거부 실패:', error)
    alert('게시글 거부에 실패했습니다.')
  }
}

onMounted(() => {
  fetchPosts()
})
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

.status-approved {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-pending {
  background: #fff3e0;
  color: #e65100;
}

/* 액션 버튼 */
.action-buttons {
  display: flex;
  gap: 8px;
}

.approve-btn,
.reject-btn,
.detail-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-btn {
  background: #2196f3;
  color: #fff;
}

.detail-btn:hover {
  background: #1976d2;
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
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.info-row:has(.images-container) {
  flex-direction: column;
  align-items: flex-start;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #3b2e1e;
  min-width: 100px;
  flex-shrink: 0;
}

.info-row > span:last-child {
  flex: 1;
  text-align: right;
  word-break: break-word;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.post-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.post-image:hover {
  transform: scale(1.05);
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

.modal-footer .reject-btn {
  background: #f44336;
  color: #fff;
}

.modal-footer .reject-btn:hover {
  background: #d32f2f;
}
</style>
