<template>
  <footer class="footer">
    <div class="footer-container">
      <img src="@/assets/images/logo.png" alt="오늘 뭐랑 로고" class="footer-logo" />

      <div class="footer-links">
        <a href="#">회사 소개</a>
        <a href="#">이용약관</a>
        <a href="#">개인정보 처리방침</a>
      </div>

      <p class="footer-copy">
        ⓒ 2025 오늘 뭐랑? All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>


</script>

<style scoped>
.footer {
  background-color: #fff7e6;
  border-top: 1px solid #e0cda9;
  padding: 20px 0;
  text-align: center;

  font-size: 14px;
  color: #5a4632;
}

.footer-container {
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
}

.footer-links a {
  text-decoration: none;
  color: #5a4632;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #c7a468; 
}

.footer-copy {
  font-size: 13px;
  color: #8b7760;
  margin-top: 8px;
}
</style>
