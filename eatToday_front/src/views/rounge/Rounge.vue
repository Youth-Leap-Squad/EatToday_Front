<template>
    <div class="rounge-page">
      <RoungeHeader />
      <hr class="boundary">
      <div class="sort-bar">
        <button class="sort-btn" :class="{ active: sort === 'latest' }" @click="sort = 'latest'">최신순</button>
        <button class="sort-btn" :class="{ active: sort === 'likes' }" @click="sort = 'likes'">좋아요순</button>
      </div>
  
      <section class="card-grid">
        <PhotoReviewCard
          v-for="item in sortedList"
          :key="item.id"
          :photo-src="item.photo"
          :avatar-src="item.avatar"
          :nickname="item.nickname"
          :content="item.content"
          :like-count="item.likes"
          :is-liked="item.isLiked"
        />
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import RoungeHeader from '@/components/rounge/RoungeHeader.vue'
  import PhotoReviewCard from '@/components/photo_review/PhotoReviewCard.vue'
  
  import photo1 from '@/assets/images/photo_review/reviewexample.png'
  import photo2 from '@/assets/images/photo_review/reviewexample.png'
  import photo3 from '@/assets/images/photo_review/reviewexample.png'
  import photo4 from '@/assets/images/photo_review/reviewexample.png'
  import photo5 from '@/assets/images/photo_review/reviewexample.png'
  import photo6 from '@/assets/images/photo_review/reviewexample.png'
  import avatar from '@/assets/images/photo_review/userexample.png'
  
  const sort = ref('latest')
  
  const items = ref([
    { id: 1, photo: photo1, avatar, nickname: '짱구', content: '본문~~', likes: 11, isLiked: false, createdAt: '2025-06-10T12:00:00' },
    { id: 2, photo: photo2, avatar, nickname: '짱구', content: '본문~~', likes: 11, isLiked: false, createdAt: '2025-06-12T18:00:00' },
    { id: 3, photo: photo3, avatar, nickname: '짱구', content: '본문~~!', likes: 12, isLiked: false, createdAt: '2025-06-15T09:30:00' },
    { id: 4, photo: photo4, avatar, nickname: '짱구', content: '본문~~!', likes: 100, isLiked: false, createdAt: '2025-06-05T21:10:00' },
    { id: 5, photo: photo5, avatar, nickname: '짱구', content: '본문~~!', likes: 100, isLiked: false, createdAt: '2025-05-30T20:00:00' },
    { id: 6, photo: photo6, avatar, nickname: '짱구', content: '본문~~~~', likes: 900, isLiked: false, createdAt: '2025-06-01T14:20:00' },
  ])
  
  const sortedList = computed(() =>
    [...items.value].sort((a, b) =>
      sort.value === 'likes'
        ? b.likes - a.likes
        : new Date(b.createdAt) - new Date(a.createdAt)
    )
  )
  </script>
  
  <style scoped>
  .rounge-page {
    background-color: #FFF7E9;
    height: 100%;
  }
  
  .boundary {
    border: none;
    border-top: 1px solid #BFBFBF;
    width: 85%;
    margin: 0 auto;
  }
  
  .sort-bar {
    width: 85%;
    margin: 20px auto 0;
    display: flex;
    justify-content: flex-end;
    gap: 24px;
  }
  
  .sort-btn {
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 600;
    color: #2D2D2F;
    cursor: pointer;
  }
  
  .sort-btn.active {
    color: #D2B382;
  }
  
  .card-grid {
    width: 85%;
    margin: 16px auto 48px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 28px;
  }
  
  </style>