<script setup>
import SignUp from './views/member/SignUp.vue'; '@/views/member/SignupPage.vue/SignUp.vue';
import Header from '@/common/header/Header.vue'
import Footer from '@/common/footer/Footer.vue'

</script>

<template>

    <Header />   <!-- 헤더 (비로그인) -->
    <!-- <SignUp />   회원가입 페이지 -->
     <router-view />          
    <Footer />   <!-- 공통 푸터 -->


</template>


<style scoped>

</style>