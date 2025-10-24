
<template>
  <header class="header">
    <div class="header-container">
      <!-- 로고 -->
      <div class="header-left">
        <img src="@/assets/images/logo.png" alt="로고" class="logo" />
        <span class="logo-text">오늘 뭐랑?</span>


      <!-- 네비게이션 -->
      <!-- <nav class="nav">
        <a href="#" class="nav-item">Home</a>
        <a href="#" class="nav-item">Rounge</a>
        <a href="#" class="nav-item">Event</a>
      </nav> -->

      <nav class="nav">
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link to="/rounge" class="nav-item">Rounge</router-link>
        <router-link to="/event" class="nav-item">Event</router-link>
      </nav>
    

      </div>
      
      <!-- 로그인 버튼 -->
      <div class="header-right">
        <button class="login-btn">로그인</button>
      </div>
    </div>
  </header>
</template>

<script setup>

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

.login-btn {
  background: none;
  border: none;
  font-size: 15px;
  color: #3b2e1e;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-btn:hover {
  color: #c7a468;
}
</style>
