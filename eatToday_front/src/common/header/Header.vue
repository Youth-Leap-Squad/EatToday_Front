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
          <router-link to="/" class="nav-item" active-class="router-link-active">Home</router-link>
          <router-link to="/rounge" class="nav-item" active-class="router-link-active">Rounge</router-link>
          <router-link to="/event" class="nav-item" active-class="router-link-active">Event</router-link>
        </nav>
      </div>

      <!-- 오른쪽: 로그인/로그아웃 영역 -->
      <div class="header-right">
        <!-- 비로그인 상태 -->
        <template v-if="!loginStatus">
          <router-link to="/login" class="login-btn link-btn">로그인</router-link>
        </template>

        <!-- 로그인 상태 -->
        <template v-else>
          <router-link to="/qna" class="cs-btn link-btn" active-class="router-link-active">고객센터</router-link>
          <router-link to="/mypage" class="mypage-btn link-btn" active-class="router-link-active">마이페이지</router-link>
          <router-link to="/post/scrap" class="scrap-btn link-btn" active-class="router-link-active">스크랩</router-link>
          <button class="logout-btn" @click="logout">로그아웃</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goScrap = () => {
  if (!loginStatus.value) {
    router.push({ path: '/login', query: { redirect: '/post/scrap' } })
    return
  }
  router.push('/post/scrap')
}

// 로그인 여부 (localStorage에서 읽어옴)
const loginStatus = ref(false)

// 로그인 상태 확인 함수
const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const token = localStorage.getItem('token')
  const wasLoggedIn = loginStatus.value
  loginStatus.value = (isLoggedIn === 'true' && !!token)
}

// 컴포넌트 마운트 시 로그인 상태 확인
onMounted(() => {
  checkLoginStatus()
  
  // localStorage 변경 감지 (다른 탭에서 로그인/로그아웃 했을 때)
  window.addEventListener('storage', checkLoginStatus)
  
  // 같은 탭에서 localStorage 변경 감지를 위한 커스텀 이벤트
  window.addEventListener('loginStatusChanged', checkLoginStatus)
})

// 라우트 변경 시 로그인 상태 확인
watch(() => route.path, () => {
  checkLoginStatus()
})

// 언마운트 시 모든 리스너 제거
onUnmounted(() => {
  window.removeEventListener('storage', checkLoginStatus)
  window.removeEventListener('loginStatusChanged', checkLoginStatus)
})

// 로그아웃 처리
const logout = () => {
  // localStorage에서 토큰 및 로그인 정보 제거
  localStorage.removeItem('token')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('rememberMe')
  
  // 로그인 상태 업데이트
  loginStatus.value = false
  
  // 같은 탭 헤더 즉시 갱신
  window.dispatchEvent(new Event('loginStatusChanged'))
  
  // 메인 페이지로 이동
  router.push('/')
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

.nav-item.router-link-active,
.link-btn.router-link-active {
  color: #c7a468;
  font-weight: 700;
}

button:hover {
  color: #c7a468;
}
</style>
