<script setup>
import Header from '@/common/header/NonLoginHeader.vue'
import Footer from '@/common/footer/Footer.vue'
</script>

<template>
  <div>
    <Header /> <!-- 공통 헤더 -->
    <router-view /> <!-- 여기서 모든 페이지(Post, SignUp 등)를 렌더링 -->
    <Footer /> <!-- 공통 푸터 -->
  </div>
</template>

<style scoped>
/* 필요시 스타일 추가 */
</style>
