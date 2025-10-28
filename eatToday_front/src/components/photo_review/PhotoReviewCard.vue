<!-- src/components/photo_review/PhotoReviewCard.vue -->
<template>
  <div class="card">
    <img class="photo" :src="photoSrc" alt="photo" />

    <div class="top">
      <!-- 프로필 클릭 시 내/남 구분하여 이동 -->
      <RouterLink class="profile" :to="linkTo">
        <img class="avatar" :src="avatarSrc" alt="avatar" />
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
  /** 이 카드 작성자 memberNo */
  memberNo: { type: [Number, String], required: false },
  /** 현재 로그인한 내 memberNo (부모가 내려주면 내/남 구분 가능) */
  myMemberNo: { type: [Number, String], required: false },

  photoSrc: { type: String, default: defaultPhoto },
  avatarSrc: { type: String, default: defaultAvatar },
  nickname: { type: String, default: '익명' },
  content: { type: String, default: '' },
  likeCount: { type: Number, default: 0 },
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

/** 내/남 구분해서 이동할 라우트 계산 */
const linkTo = computed(() => {
  const owner = props.memberNo == null ? null : String(props.memberNo)
  const mine  = props.myMemberNo == null ? null : String(props.myMemberNo)

  // 내 번호를 모르면 단순히 상대 프로필로 보냄. 번호 없으면 내 마이페이지로.
  if (!owner) return { name: 'mypage.self' }

  // 내 번호를 알고 있고, 카드 주인이 나와 같으면 내 마이페이지
  if (mine && owner === mine) return { name: 'mypage.self' }

  // 그 외에는 상대 마이페이지
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