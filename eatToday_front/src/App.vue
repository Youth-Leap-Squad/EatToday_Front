<script setup>
import SignUp from './views/member/SignupPage.vue/SignUp.vue'; '@/views/member/SignupPage.vue/SignUp.vue';
import Header from '@/common/header/NonLoginHeader.vue'
import Footer from '@/common/footer/Footer.vue'

</script>

<template>
  <div>
    <Header />   <!-- 헤더 (비로그인) -->
    <SignUp />   <!-- 회원가입 페이지 -->
    <Footer />   <!-- 공통 푸터 -->

  </div>

</template>


<style scoped>

</style>