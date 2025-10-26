<script setup>
import Header from '@/common/header/NonLoginHeader.vue'
import SignUp from '@/views/member/SignUp.vue';
// import Header from '@/common/header/Header.vue'
import Footer from '@/common/footer/Footer.vue'
</script>

<template>
    <Header />   <!-- 헤더 (비로그인) -->
    <!-- <SignUp />   회원가입 페이지 -->
     <router-view />          
    <Footer />   <!-- 공통 푸터 -->
</template>

<style scoped>
/* 필요시 스타일 추가 */
</style>
