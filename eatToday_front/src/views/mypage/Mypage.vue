<template>
  <div class="mypage">
    <div class="inner">
      <!-- 프로필 헤더 -->
      <section class="profile">
        <img class="avatar-lg" :src="avatarLg" alt="avatar" />
        <div class="profile-main">
          <div class="row-1">
            <h1 class="nickname">
              {{ nickname }}
              <img class="badge" :src="badgeImg" alt="badge" />
            </h1>

            <!-- ✅ 다른 사람 페이지에서만 노출 -->
            <div class="actions" v-if="!isMine">
              <button class="btn solid">팔로우</button>
              <RouterLink to="/dm" class="btn solid">메시지</RouterLink>
              <button class="btn report">신고</button>
            </div>

            <!-- ✅ 내 마이페이지에서만 노출 -->
            <div class="actions" v-else>
              <RouterLink to="/updateprofile" class="btn solid edit">내 정보 수정</RouterLink>
            </div>
          </div>

          <div class="row-2">
            <span class="level">{{ levelLabel }}</span>
          </div>
          <div class="row-3">
            <span class="link" @click="openFollow('followers')">팔로워 {{ follower.toLocaleString() }}</span>
            <span class="sep">|</span>
            <span class="link" @click="openFollow('following')">팔로잉 {{ following.toLocaleString() }}</span>
          </div>
        </div>
      </section>

      <!-- 카운트/탭 -->
      <section class="counts">
        <button class="count" :class="{ active: tab==='review' }" @click="tab='review'">
          <span class="label">리뷰</span>
          <span class="num">{{ reviews }}</span>
        </button>
        <button class="count" :class="{ active: tab==='post' }" @click="tab='post'">
          <span class="label">게시물</span>
          <span class="num">{{ posts.length }}</span>
        </button>
      </section>

      <hr class="line" />

      <!-- 그리드(하단 콘텐츠 그대로 유지) -->
      <section class="grid">
        <PhotoReviewCard
          v-for="(p, i) in shown"
          :key="i"
          :photo-src="p.photoSrc"
          :avatar-src="p.avatarSrc"
          :nickname="nickname"
          :content="p.content"
          :like-count="p.likeCount"
          :is-liked="p.isLiked"
          @toggle-like="onToggleLike(i, $event)"
        />
      </section>
    </div>

    <!-- 팔로우/팔로잉 모달 -->
    <Follow
      :open="showFollowModal"
      :title="followType === 'followers' ? '팔로워' : '팔로잉'"
      :users="followType === 'followers' ? followerUsers : followingUsers"
      @close="showFollowModal = false"
    />
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import PhotoReviewCard from '@/components/photo_review/PhotoReviewCard.vue'
import Follow from '@/components/mypage/follow.vue'

import avatarLg from '@/assets/images/photo_review/userexample.png'
import defaultPhoto1 from '@/assets/images/photo_review/reviewexample.png'
import defaultPhoto2 from '@/assets/images/photo_review/reviewexample.png'
import defaultPhoto3 from '@/assets/images/photo_review/reviewexample.png'
import bronzeBadge from '@/assets/images/bronze.png'
import silverBadge from '@/assets/images/silver.png'
import goldBadge from '@/assets/images/gold.png'

import { findMyLevel } from '@/api/member'

const route = useRoute()

/* ---------------- JWT 파싱/내 memberNo ---------------- */
const token = computed(() => localStorage.getItem('token') || '')

function parseJwt(t) {
  try {
    const part = t.split('.')[1]
    if (!part) return null
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4 || 4)) % 4)
    return JSON.parse(decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
  } catch {
    return null
  }
}
const myMemberNo = computed(() => {
  const p = parseJwt(token.value)
  return p?.memberNo ?? null
})

/* ---------------- 타겟 멤버(내/다른사람) ---------------- */
const targetMemberNo = computed(() => {
  const p = Number(route.params.memberNo)
  return Number.isFinite(p) && p > 0 ? p : myMemberNo.value
})
const isMine = computed(() => targetMemberNo.value === myMemberNo.value)

/* ---------------- 프로필 표시 데이터 ---------------- */
const nickname = ref('')
const levelLabel = ref('')
const badgeImg = ref(goldBadge)

function pickBadge(label) {
  const l = (label || '').toLowerCase()
  if (l.includes('gold') || l.includes('골드')) return goldBadge
  if (l.includes('silver') || l.includes('실버')) return silverBadge
  return bronzeBadge
}

async function loadProfile() {
  if (!token.value || !targetMemberNo.value) return
  const data = await findMyLevel(targetMemberNo.value, token.value)
  nickname.value = data?.memberName ?? '알 수 없음'
  levelLabel.value = data?.memberLevelLabel ?? '등급 없음'
  badgeImg.value = pickBadge(levelLabel.value)
}

/* ---------------- 하단 콘텐츠(원래 그대로 유지) ---------------- */
const follower = 0
const following = 0
const reviews = 0

const posts = reactive([
  { photoSrc: defaultPhoto1, avatarSrc: avatarLg, content: '일요일은 내가 요리사!', likeCount: 100, isLiked: false },
  { photoSrc: defaultPhoto2, avatarSrc: avatarLg, content: '주말에 와인 먹고 왔어요!!', likeCount: 11, isLiked: false },
  { photoSrc: defaultPhoto3, avatarSrc: avatarLg, content: '용용선생 노량진찐!!', likeCount: 11, isLiked: false }
])

const followerUsers = reactive(Array.from({ length: 30 }, (_, i) => `user${i + 1}`))
const followingUsers = reactive(Array.from({ length: 35 }, (_, i) => `user${i + 21}`))

const tab = ref('review')
const shown = computed(() => posts)

function onToggleLike(index, payload) {
  posts[index].isLiked = payload.liked
  posts[index].likeCount = payload.count
}

/* ---------------- 모달 ---------------- */
const showFollowModal = ref(false)
const followType = ref('followers')

function openFollow(type) {
  followType.value = type
  showFollowModal.value = true
  document.body.style.overflow = 'hidden'
}
watch(showFollowModal, v => { if (!v) document.body.style.overflow = 'auto' })

/* ---------------- 라우트 변경 시 재로딩 ---------------- */
watch(() => route.params.memberNo, loadProfile)
onMounted(loadProfile)
</script>

<style scoped>
.mypage { background: #FFF7E9; min-height: 100vh; }
.inner { width: 92%; max-width: 1200px; margin: 0 auto; padding: 20px 0 60px; }

.profile { display: grid; grid-template-columns: 110px 1fr; align-items: center; gap: 18px; padding: 16px 10px 8px 10px; }
.avatar-lg { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 2px solid #E2D8C7; background: #fff; }
.profile-main { display: grid; gap: 2px; }
.row-1 { display: flex; align-items: center; gap: 12px; }
.nickname { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 28px; font-weight: 900; color: #2B1F14; }
.badge { width: 30px; height: 30px; }

.actions { display: flex; gap: 8px; margin-left: 8px; }
.btn { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; cursor: pointer; transition: transform .05s ease; }
.btn, .actions a { text-decoration: none; }
.btn.solid { background: #F2D5A7; border: 1px solid #F2D5A7; color: #2B1F14; }
.btn.solid.edit { background: #f0c97a; border-color: #f0c97a; }

.btn.report { background: transparent; border: 1px solid #E2D8C7; color: #2B1F14; }

.row-2 { display: inline-flex; align-items: center; margin-left: 6px; margin-top: -22px; }
.level { background: #FADFA1; color: #2B1F14; padding: 8px 20px; border-radius: 12px; font-size: 17px; font-weight: 900; }

.row-3 { color: #2B1F14; font-size: 15px; font-weight: 700; opacity: 0.9; display: flex; align-items: center; margin-top: 10px; gap: 8px; }
.link { cursor: pointer; }
.sep { opacity: .5; }

.counts { display: flex; gap: 28px; align-items: center; padding: 4px 8px 0; margin-top: 20px; }
.count { display: inline-flex; align-items: baseline; gap: 8px; padding: 2px 4px; border: none; background: transparent; cursor: pointer; }
.count .label, .count .num { font-size: 22px; font-weight: 900; color: #2B1F14; }
.count.active .label, .count.active .num { color: #D2B382; }

.line { border: none; border-top: 1.5px solid #D9D0C1; margin: 10px 0 20px; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px 46px; padding: 16px 6px 6px; }
</style>