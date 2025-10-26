<template>
    <div class="card">
      <img class="photo" :src="photoSrc" alt="photo" />
      <div class="top">
        <div class="profile">
          <img class="avatar" :src="avatarSrc" alt="avatar" />
          <div class="nickname">{{ nickname }}</div>
        </div>
        <button class="like" @click="onToggleLike">
          <img :src="isLikedLocal ? heartFilled : heart" alt="like" />
          <span>{{ likeCountLocal }}</span>
        </button>
      </div>
      <div class="content">{{ content }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import defaultPhoto from '@/assets/images/photo_review/reviewexample.png'
  import defaultAvatar from '@/assets/images/photo_review/userexample.png'
  import heart from '@/assets/images/photo_review/unfilledHeart.png'
  import heartFilled from '@/assets/images/photo_review/filledHeart.png'
  
  const props = defineProps({
    photoSrc: { type: String, default: defaultPhoto },
    avatarSrc: { type: String, default: defaultAvatar },
    nickname: { type: String, default: '짱구야 놀자' },
    content: { type: String, default: '일요일은 내가 요리사!' },
    likeCount: { type: Number, default: 100 },
    isLiked: { type: Boolean, default: false }
  })
  
  const emit = defineEmits(['toggle-like'])
  const isLikedLocal = ref(props.isLiked)
  const likeCountLocal = ref(props.likeCount)
  
  watch(() => props.isLiked, v => (isLikedLocal.value = v))
  watch(() => props.likeCount, v => (likeCountLocal.value = v))
  
  function onToggleLike() {
    isLikedLocal.value = !isLikedLocal.value
    likeCountLocal.value += isLikedLocal.value ? 1 : -1
    emit('toggle-like', { liked: isLikedLocal.value, count: likeCountLocal.value })
  }
  </script>
  
  <style scoped>
  .card {
    width: 340px;
    border-radius: 16px;
    padding: 10px;
  }
  
  .photo {
    width: 100%;
    object-fit: cover;
    border-radius: 14px;
    display: block;
  }
  
  .top {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .profile {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
  
  .nickname {
    font-size: 14px;
    font-weight: 600;
    color: #646466;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .content {
    font-size: 13px;
    color: #0D0C11;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .like {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: none;
    background: transparent;
    padding: 2px;
    cursor: pointer;
  }
  
  .like img {
    width: 16px;
    height: 16px;
  }
  
  .like span {
    font-size: 13px;
    font-weight: 600;
    color: #2d2d2f;
  }
  </style>