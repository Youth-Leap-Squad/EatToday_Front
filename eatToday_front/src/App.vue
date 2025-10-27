<script setup>
import SignUp from '@/views/member/SignUp.vue';
import Header from '@/common/header/Header.vue'
import Footer from '@/common/footer/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 관리자 페이지 여부 확인
const isAdminPage = computed(() => route.path.startsWith('/admin'))
</script>

<template>

    <!-- 관리자 페이지가 아닐 때만 Header/Footer 표시 -->
    <template v-if="!isAdminPage">
      <Header />
      <router-view />
      <Footer />
    </template>
    
    <!-- 관리자 페이지는 AdminHeader/AdminFooter가 따로 있으므로 router-view만 -->
    <template v-else>
      <router-view />
    </template>
</template>

<style scoped>
/* 필요시 스타일 추가 */
</style>
