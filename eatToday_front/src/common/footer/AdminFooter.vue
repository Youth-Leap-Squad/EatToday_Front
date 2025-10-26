<!-- 관리자용 페이지 푸터 -->
<template>
  <footer class="admin-footer">
    <div class="admin-footer-container">
      <img src="@/assets/images/logo.png" alt="오늘 뭐랑 로고" class="footer-logo" />

      <div class="footer-links">
        <router-link to="/about">프로젝트 소개</router-link>
        <router-link to="/terms">용어 설명</router-link>
        <router-link to="/service-terms">이용약관</router-link>
        <router-link to="/privacy">개인정보 처리방침</router-link>
      </div>

      <p class="footer-copy">
        ⓒ 2025 오늘 뭐랑? All rights reserved. | 관리자 전용 페이지
      </p>
    </div>
  </footer>
</template>

<script setup>
// 푸터 컴포넌트는 별도 로직이 필요 없음
</script>

<style scoped>
.admin-footer {
  background-color: #fff7e6;
  border-top: 1px solid #e0cda9;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #5a4632;
  margin-top: 40px;
}

.admin-footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  width: 50px;
  height: auto;
}

.footer-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a,
.footer-links router-link {
  text-decoration: none;
  color: #5a4632;
  transition: color 0.2s ease;
}

.footer-links a:hover,
.footer-links router-link:hover {
  color: #c7a468; 
}

.footer-copy {
  font-size: 13px;
  color: #8b7760;
  margin-top: 8px;
}
</style>