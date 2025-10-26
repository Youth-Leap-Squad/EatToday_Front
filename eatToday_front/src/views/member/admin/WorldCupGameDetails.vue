<template>
  <div class="admin-page">
    <AdminHeader />
    
    <div class="admin-content">
      <!-- 페이지 타이틀 -->
      <h1 class="page-title">이벤트 관리</h1>
      <h2 class="sub-title">월드컵 게임 상세</h2>

      <!-- 음료 통계 카드 그리드 -->
      <div class="beverage-grid">
        <div v-for="beverage in beverages" :key="beverage.name" class="beverage-card">
          <div class="beverage-illustration">
            <img :src="beverage.image" :alt="beverage.name" />
          </div>
          <div class="beverage-name">{{ beverage.name }}</div>
        </div>
      </div>
    </div>

    <AdminFooter />
  </div>
</template>

<script setup>
import AdminHeader from '@/common/header/AdminHeader.vue'
import AdminFooter from '@/common/footer/AdminFooter.vue'

import beerImg from '@/assets/images/맥주-Photoroom.png'
import sojuImg from '@/assets/images/soju.png'
import makgeolliImg from '@/assets/images/막걸리-Photoroom.png'
import champagneImg from '@/assets/images/샴페인-Photoroom.png'
import goryangjuImg from '@/assets/images/고량주-Photoroom.png'
import highballImg from '@/assets/images/하이볼-Photoroom.png'
import wineImg from '@/assets/images/와인-Photoroom.png'
import etcImg from '@/assets/images/기타-Photoroom.png'

const beverages = [
  { name: '맥주', image: beerImg },
  { name: '소주', image: sojuImg },
  { name: '막걸리', image: makgeolliImg },
  { name: '샴페인', image: champagneImg },
  { name: '고량주', image: goryangjuImg },
  { name: '하이볼', image: highballImg },
  { name: '와인', image: wineImg },
  { name: '기타', image: etcImg },
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

/* 음료 카드 그리드 */
.beverage-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.beverage-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.beverage-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.beverage-illustration {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.beverage-illustration img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.beverage-name {
  font-size: 18px;
  font-weight: 600;
  color: #3b2e1e;
}
</style>
