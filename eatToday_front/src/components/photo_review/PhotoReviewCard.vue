<script setup>
import { ref, watch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import defaultPhoto from '@/assets/images/photo_review/reviewexample.png'
import defaultAvatar from '@/assets/images/photo_review/userexample.png'
import heart from '@/assets/images/photo_review/unfilledHeart.png'
import heartFilled from '@/assets/images/photo_review/filledHeart.png'

const props = defineProps({
  memberNo:   { type: [Number, String], required: false },
  myMemberNo: { type: [Number, String], required: false },
  reviewId:   { type: [Number, String], required: false },   // 리뷰 상세용(있으면 활용)
  boardId:    { type: [Number, String], required: false },   // ★ 원본 게시물 이동용
  photoSrc:   { type: String, default: '' },
  avatarSrc:  { type: String, default: '' },
  nickname:   { type: String, default: '익명' },
  content:    { type: String, default: '' },
  likeCount:  { type: Number, default: 0 },
  isLiked:    { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-like'])
const isLikedLocal   = ref(props.isLiked)
const likeCountLocal = ref(props.likeCount)
watch(() => props.isLiked,  v => (isLikedLocal.value  = v))
watch(() => props.likeCount,v => (likeCountLocal.value = v))

const safePhoto  = computed(() => props.photoSrc?.trim()  ? props.photoSrc  : defaultPhoto)
const safeAvatar = computed(() => props.avatarSrc?.trim() ? props.avatarSrc : defaultAvatar)

// 프로필 이동 계산 기존 그대로…
const linkTo = computed(() => {
  const owner = props.memberNo == null ? null : String(props.memberNo)
  const mine  = props.myMemberNo == null ? null : String(props.myMemberNo)
  if (!owner) return { name: 'mypage.self' }
  if (mine && owner === mine) return { name: 'mypage.self' }
  return { name: 'mypage.user', params: { memberNo: owner } }
})

// ★ 게시물(원본 글) 이동 경로: /post/:id
const postTo = computed(() => {
  if (props.boardId != null) return `/post/${props.boardId}`      // 경로 기반
  // 라우트 이름을 쓰고 싶다면:
  // if (props.boardId != null) return { name: 'post.detail', params: { id: String(props.boardId) } }
  return null
})

function onToggleLike() {
  isLikedLocal.value = !isLikedLocal.value
  likeCountLocal.value += isLikedLocal.value ? 1 : -1
  emit('toggle-like', { liked: isLikedLocal.value, count: likeCountLocal.value })
}
</script>

<template>
  <div class="card">
    <!-- ★ 메인 사진 클릭 시 게시물로 -->
    <RouterLink v-if="postTo" :to="postTo" class="photo-link">
      <img class="photo" :src="safePhoto" alt="photo" @error="e => (e.target.src = defaultPhoto)" />
    </RouterLink>
    <img v-else class="photo" :src="safePhoto" alt="photo" @error="e => (e.target.src = defaultPhoto)" />

    <div class="top">
      <RouterLink class="profile" :to="linkTo">
        <img class="avatar" :src="safeAvatar" alt="avatar" @error="e => (e.target.src = defaultAvatar)" />
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

<style scoped>
.card { width: 340px; border-radius: 16px; padding: 10px; }
.photo { width: 100%; object-fit: cover; border-radius: 14px; display: block; }
.photo-link { cursor: pointer; }                       /* 클릭 느낌 */
.top { margin-top: 8px; display: flex; justify-content: space-between; align-items: center; }
.profile { display: flex; align-items: center; gap: 6px; text-decoration: none; cursor: pointer; }
.avatar { width: 28px; height: 28px; border-radius: 50%; }
.nickname { font-size: 14px; font-weight: 600; color: #646466; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.content { font-size: 13px; color: #0D0C11; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.like { display: inline-flex; align-items: center; gap: 4px; border: none; background: transparent; padding: 2px; cursor: pointer; }
.like img { width: 16px; height: 16px; }
.like span { font-size: 13px; font-weight: 600; color: #2d2d2f; }
</style>