<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ReviewCard from '@/views/review/ReviewCard.vue';
import { listReviews } from '@/mock/review.js';

const router = useRouter();
const items = ref([]);

onMounted(() => { items.value = listReviews(); });

function goCreate(){ router.push('/reviews/new'); }
</script>

<template>
  <section class="wrap">
    <div class="head">
      <h2>사진 리뷰</h2>
      <button class="create" @click="goCreate">+ 리뷰 등록하기</button>
    </div>

    <div class="grid">
      <ReviewCard v-for="it in items" :key="it.id" :item="it" />
    </div>
  </section>
</template>

<style scoped>
.wrap{max-width:1100px;margin:16px auto;padding:0 16px}
.head{display:flex;align-items:center;justify-content:space-between;margin:10px 0 16px}
.head h2{font-size:20px;font-weight:900;color:#2e2318;margin:0}
.create{background:#d2b382;color:#2a1f16;border:none;border-radius:12px;padding:10px 14px;font-weight:900;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}
</style>
