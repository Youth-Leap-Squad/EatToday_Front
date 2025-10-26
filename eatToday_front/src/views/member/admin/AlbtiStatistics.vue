<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">이벤트 관리</h1>
      <h2 class="sub-title">술BTI 통계</h2>

      <!-- 술BTI 이벤트 정보 -->
      <div class="albti-info">
        <div class="event-header">
          <h3 class="event-name">술BTI</h3>
          <p class="participants">참여자 751명</p>
        </div>
      </div>

      <!-- 결과 섹션 -->
      <div class="results-section">
        <h3 class="results-title">결과</h3>
        <div class="stat-grid">
          <div v-for="stat in statistics" :key="stat.name" class="stat-item">
            <span class="stat-name">{{ stat.name }}</span>
            <span class="stat-percentage">{{ stat.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'

const statistics = [
  { name: '활발함', percentage: 14 },
  { name: '전통파', percentage: 8 },
  { name: '감성파', percentage: 11 },
  { name: '로맨틱', percentage: 10 },
  { name: '힐링러', percentage: 10 },
  { name: '차분함', percentage: 10 },
  { name: '도전적', percentage: 12 },
  { name: '테이스팅러버', percentage: 9 },
  { name: '정열적', percentage: 9 },
  { name: '클래식', percentage: 7 },
]
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
  margin-bottom: 8px;
}

.sub-title {
  font-size: 20px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 32px;
}

/* 술BTI 정보 */
.albti-info {
  margin-bottom: 40px;
}

.event-header {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px 40px;
}

.event-name {
  font-size: 32px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 12px;
}

.participants {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* 결과 섹션 */
.results-section {
  margin-top: 32px;
}

.results-title {
  font-size: 20px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 20px;
}

/* 통계 그리드 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  font-size: 16px;
  font-weight: 600;
  color: #3b2e1e;
}

.stat-percentage {
  font-size: 16px;
  font-weight: 700;
  color: #dabb8b;
}
</style>
