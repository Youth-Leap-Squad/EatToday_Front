<!-- src/components/photo_review/PhotoReviewCard.vue -->
<template>
  <div class="card">
    <img
      class="photo"
      :src="safePhoto"
      alt="photo"
      @error="e => (e.target.src = defaultPhoto)"
    />

    <div class="top">
      <RouterLink class="profile" :to="linkTo">
        <img
          class="avatar"
          :src="safeAvatar"
          alt="avatar"
          @error="e => (e.target.src = defaultAvatar)"
        />
        <div class="nickname">{{ nickname }}</div>
      </RouterLink>

      <button class="like" @click.stop="onToggleLike" aria-label="toggle like">
        <img :src="isLikedLocal ? heartFilled : heart" alt="like" />
        <span>{{ likeCountLocal }}</span>
      </button>
    </div>

    <div class="content">{{ content }}</div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink } from 'vue-router'

import defaultPhoto from '@/assets/images/photo_review/reviewexample.png'
import defaultAvatar from '@/assets/images/photo_review/userexample.png'
import heart from '@/assets/images/photo_review/unfilledHeart.png'
import heartFilled from '@/assets/images/photo_review/filledHeart.png'

const props = defineProps({
  memberNo:   { type: [Number, String], required: false },
  myMemberNo: { type: [Number, String], required: false },

  photoSrc: { type: String, default: '' },   // ← 기본값 빈문자열
  avatarSrc:{ type: String, default: '' },
  nickname: { type: String, default: '익명' },
  content:  { type: String, default: '' },
  likeCount:{ type: Number, default: 0 },
  isLiked:  { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-like'])

const isLikedLocal   = ref(props.isLiked)
const likeCountLocal = ref(props.likeCount)
watch(() => props.isLiked,  v => (isLikedLocal.value  = v))
watch(() => props.likeCount,v => (likeCountLocal.value = v))

function onToggleLike() {
  isLikedLocal.value = !isLikedLocal.value
  likeCountLocal.value += isLikedLocal.value ? 1 : -1
  emit('toggle-like', { liked: isLikedLocal.value, count: likeCountLocal.value })
}

/** 안전한 이미지 src (빈문자열, null, undefined면 기본 이미지) */
const safePhoto  = computed(() => props.photoSrc  && props.photoSrc.trim()  ? props.photoSrc  : defaultPhoto)
const safeAvatar = computed(() => props.avatarSrc && props.avatarSrc.trim() ? props.avatarSrc : defaultAvatar)

/** 라우팅 계산 */
const linkTo = computed(() => {
  const owner = props.memberNo == null ? null : String(props.memberNo)
  const mine  = props.myMemberNo == null ? null : String(props.myMemberNo)
  if (!owner) return { name: 'mypage.self' }
  if (mine && owner === mine) return { name: 'mypage.self' }
  return { name: 'mypage.user', params: { memberNo: owner } }
})
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
  cursor: pointer;
  text-decoration: none;
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