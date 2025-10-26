<!-- 관리자용 페이지 헤더 -->
<template>
  <header class="admin-header">
    <div class="admin-header-container">
      <!-- 왼쪽: 로고 + 내비 -->
      <div class="admin-header-left">
        <img src="@/assets/images/logo.png" alt="로고" class="logo" />
        <span class="logo-text">오늘 뭐랑? <b>관리자용</b></span>

        <nav class="nav">
          <router-link to="/admindashboard" class="nav-item" active-class="active-link">대시보드</router-link>
          <router-link to="/admin/member" class="nav-item" active-class="active-link">회원관리</router-link>
          <router-link to="/admin/report" class="nav-item" active-class="active-link">신고 관리</router-link>
          <router-link to="/admin/post" class="nav-item" active-class="active-link">게시글 관리</router-link>
          <router-link to="/admin/event" class="nav-item" active-class="active-link">이벤트관리</router-link>
        </nav>
      </div>

      <!-- 오른쪽: 로그아웃 버튼 -->
      <div class="admin-header-right">
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('isAdmin')
  router.push('/')
}
</script>

<style scoped>
.admin-header {
  background: linear-gradient(to bottom, #D2B382 0%, #F2D5A7 50%, #FFF7E9 100%);
  border-bottom: 1px solid #d8c29d;
  padding: 10px 40px;
}

.admin-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  width: 35px;
  height: auto;
}

.logo-text {
  font-weight: 700;
  font-size: 18px;
  color: #4a3a28;
}

.logo-text b {
  color: #d32f2f;
}

.nav {
  display: inline-flex;
  gap: 24px;
  margin-left: 40px;
}

.nav-item {
  font-size: 16px;
  color: #3b2e1e;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: #c7a468;
}

.active-link {
  color: #c7a468;
  font-weight: 700;
}

.admin-header-right {
  display: flex;
  gap: 12px;
}

.logout-btn {
  background: none;
  border: none;
  font-size: 15px;
  color: #3b2e1e;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.logout-btn:hover {
  color: #c7a468;
}
</style>
