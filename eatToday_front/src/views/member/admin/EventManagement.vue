<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">이벤트 관리</h1>

      <!-- 이벤트 선택 버튼 -->
      <div class="event-selection">
        <router-link to="/admin/event/worldcup" class="event-card">
          <div class="event-icon">⚽</div>
          <h2 class="event-title">월드컵 게임</h2>
          <p class="event-description">술 월드컵 게임 상세 및 통계</p>
        </router-link>
        
        <router-link to="/admin/event/albti" class="event-card">
          <div class="event-icon">🍺</div>
          <h2 class="event-title">술BTI 통계</h2>
          <p class="event-description">술BTI 설문 통계 및 결과</p>
        </router-link>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #fafafa;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #3b2e1e;
  margin-bottom: 40px;
}

/* 이벤트 선택 카드 */
.event-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.event-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 50px 40px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.event-card:hover {
  border-color: #dabb8b;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.event-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.event-title {
  font-size: 28px;
  font-weight: 700;
  color: #3b2e1e;
  margin-bottom: 12px;
}

.event-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}
</style>
