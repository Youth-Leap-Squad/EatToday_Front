<template>
  <header class="header">
    <div class="header-container">
      <!-- 왼쪽: 로고 + 내비 -->
      <div class="header-left">
        <router-link to="/" class="logo-wrap">
          <img src="@/assets/images/logo.png" alt="로고" class="logo" />
          <span class="logo-text">오늘 뭐랑?</span>
        </router-link>

        <nav class="nav">
          <router-link to="/" class="nav-item" active-class="active-link">Home</router-link>
          <router-link to="/rounge" class="nav-item" active-class="active-link">Rounge</router-link>
          <router-link to="/event" class="nav-item" active-class="active-link">Event</router-link>
        </nav>
      </div>

      <!-- 오른쪽: 로그인/로그아웃 영역 -->
      <div class="header-right">
        <!-- 비로그인 상태 -->
        <template v-if="!loginStatus">
          <button class="login-btn" @click="toggleLogin">로그인</button>
        </template>

        <!-- 로그인 상태 -->
        <template v-else>
          <router-link to="/qna" class="cs-btn link-btn" active-class="active-link">고객센터</router-link>
          <router-link to="/mypage" class="mypage-btn link-btn" active-class="active-link">마이페이지</router-link>
          <button class="scrap-btn">스크랩</button>
          <button class="logout-btn" @click="toggleLogin">로그아웃</button>  <!--로그아웃 버튼 누르면 로그아웃 -> 
                                                                               나중에 진짜 로그아웃 되게 변경
                                                                            -->
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// 로그인 여부 (true면 로그인 상태)
const loginStatus = ref(false)

// 버튼 누를 때 상태 변경 (로그인 <-> 로그아웃) 임시!! 나중에 진짜 로그인 상태 받아와야함
function toggleLogin() {
  loginStatus.value = !loginStatus.value
}
</script>

<style scoped>
.header {
  background: linear-gradient(to bottom, #D2B382 0%, #F2D5A7 50%, #FFF7E9 100%);
  border-bottom: 1px solid #d8c29d;
  padding: 10px 40px;
}

.header-container {
  display: flex;
  justify-content: space-between; 
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  width: 40px;
  height: auto;
}
.logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-text {
  font-weight: 700;
  font-size: 18px;
  color: #4a3a28;
}

.nav {
  display: inline-flex;
  gap: 30px;
  margin-left: 50px;
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

.header-right {
  display: flex;
  gap: 10px;
}

button {
  background: none;
  border: none;
  font-size: 15px;
  color: #3b2e1e;
  cursor: pointer;
  transition: color 0.2s ease;
}

.link-btn {
  background: none;
  border: none;
  font-size: 15px;
  color: #3b2e1e;
  cursor: pointer;
  text-decoration: none;
  padding: 0;           
}

.link-btn:hover {
  color: #c7a468;
}

.active-link {
  color: #c7a468;
  font-weight: 700;
}

button:hover {
  color: #c7a468;
}
</style>
