<!-- src/views/mypage/Mypage.vue -->
<template>
  <div class="mypage">
    <div class="inner">
      <section class="profile">
        <img
          class="avatar-lg"
          :class="{ clickable: isMine }"
          :src="avatarSrc"
          alt="avatar"
          @click="onClickAvatar"
          @error="e => { e.target.onerror = null; e.target.src = basicProfile }"
        />
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden-file"
          @change="onPickAvatar"
        />
        <div class="profile-main">
          <div class="row-1">
            <h1 class="nickname">
              {{ nickname }}
              <img class="badge" :src="badgeImg" alt="badge" />
            </h1>
            <div class="actions" v-if="!isMine">
              <button class="btn solid">팔로우</button>
              <RouterLink to="/dm" class="btn solid">메시지</RouterLink>
              <button class="btn report" @click="showReport = true">신고</button>
            </div>
            <div class="actions" v-else>
              <RouterLink to="/updateprofile" class="btn solid edit">내 정보 수정</RouterLink>
            </div>
          </div>
          <div class="row-2">
            <span class="level">{{ albtiCategory || '신비함' }}</span>
          </div>
          <div class="row-3">
            <span class="link" @click="openFollow('followers')">팔로워 {{ follower.toLocaleString() }}</span>
            <span class="sep">|</span>
            <span class="link" @click="openFollow('following')">팔로잉 {{ following.toLocaleString() }}</span>
          </div>
        </div>
      </section>

      <section class="counts">
        <button class="count" :class="{ active: tab==='review' }" @click="tab='review'">
          <span class="label">리뷰</span>
          <span class="num">{{ reviews }}</span>
        </button>
        <button class="count" :class="{ active: tab==='post' }" @click="tab='post'">
          <span class="label">게시물</span>
          <span class="num">{{ postsTotal }}</span>
        </button>
      </section>

      <hr class="line" />

      <section class="grid" v-if="tab==='review'">
        <PhotoReviewCard
          v-for="(r, i) in reviewsRows"
          :key="r.id ?? i"
          :member-no="r.memberNo"
          :review-id="r.reviewId"
          :my-member-no="myMemberNo"
          :photo-src="r.photo"
          :avatar-src="r.avatar"
          :nickname="r.nickname"
          :content="r.content"
          :like-count="r.likes"
          :is-liked="r.isLiked"
          @toggle-like="onToggleLike(i, $event)"
        />
      </section>

      <section class="grid" v-else>
        <PostCard
          v-for="p in postsRows"
          :key="p.postId"
          :id="p.postId"
          :title="p.title"
          :likes="p.likes"
          :views="p.views"
          :comment="p.comment"
          :author="p.author"
          :avatar="p.avatar || basicProfile"
          :thumbnail="p.thumbnail || defaultPhoto1"
        />
      </section>

      <p v-if="loading" class="center">불러오는 중…</p>
      <p v-else-if="!loading && tab==='review' && reviewsRows.length===0" class="center">리뷰가 없습니다.</p>
      <p v-else-if="!loading && tab==='post' && postsRows.length===0" class="center">게시물이 없습니다.</p>
    </div>

    <Follow
      :open="showFollowModal"
      :title="followType === 'followers' ? '팔로워' : '팔로잉'"
      :users="followType === 'followers' ? followerUsers : followingUsers"
      @close="showFollowModal = false"
    />
    <ReportModal
      :open="showReport"
      @close="showReport = false"
      @submit="submitReport"
    />
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import PhotoReviewCard from '@/components/photo_review/PhotoReviewCard.vue'
import PostCard from '@/components/post/PostCard.vue'
import Follow from '@/components/mypage/follow.vue'
import ReportModal from '@/components/report/ReportModal.vue'
import { createReport } from '@/api/createreport'
import basicProfile from '@/assets/images/basic_profile.jpg'
import defaultPhoto1 from '@/assets/images/photo_review/reviewexample.png'
import bronzeBadge from '@/assets/images/bronze.png'
import silverBadge from '@/assets/images/silver.png'
import goldBadge from '@/assets/images/gold.png'
import { findMyLevel, uploadProfileImage, getProfileImageUrl } from '@/api/member'
import { fetchMyPhotoReviews, fetchUserPhotoReviews } from '@/api/photoReview'
import { getAlbtiResult } from '@/api/albti'
import { fetchUserPosts } from '@/api/post'

const route = useRoute()
const router = useRouter()

const token = computed(() => localStorage.getItem('token') || '')
function parseJwt(t) {
  try {
    const part = t.split('.')[1]
    if (!part) return null
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4 || 4)) % 4)
    return JSON.parse(
      decodeURIComponent(
        atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      )
    )
  } catch { return null }
}
const myMemberNo = computed(() => {
  const p = parseJwt(token.value)
  return p?.memberNo ?? null
})

const targetMemberNo = computed(() => {
  const p = Number(route.params.memberNo)
  return Number.isFinite(p) && p > 0 ? p : myMemberNo.value
})
const isMine = computed(() => targetMemberNo.value === myMemberNo.value)

const nickname = ref('')
const albtiCategory = ref('')
const badgeImg = ref(goldBadge)

const avatarBust = ref('')
const avatarSrc = computed(() => {
  const no = targetMemberNo.value
  return no ? getProfileImageUrl(no, avatarBust.value) : basicProfile
})
const fileInput = ref(null)

function pickBadge(label) {
  const l = (label || '').toLowerCase()
  if (l.includes('gold') || l.includes('골드')) return goldBadge
  if (l.includes('silver') || l.includes('실버')) return silverBadge
  return bronzeBadge
}

async function loadProfile() {
  if (!token.value || !targetMemberNo.value) return
  const data = await findMyLevel(targetMemberNo.value, token.value)
  nickname.value = data?.memberId ?? data?.memberName ?? '알 수 없음'
  const label = data?.memberLevelLabel ?? ''
  badgeImg.value = pickBadge(label)
}

async function loadAlbti() {
  if (!targetMemberNo.value) return
  try {
    const res = await getAlbtiResult(targetMemberNo.value)
    const item = Array.isArray(res) ? res[0] : res
    albtiCategory.value = item?.albti_dto?.alBTI_category ?? ''
  } catch {
    albtiCategory.value = ''
  }
}

function onClickAvatar() {
  if (!isMine.value) return
  fileInput.value?.click()
}

async function onPickAvatar(e) {
  const file = e.target.files?.[0]
  if (!file || !myMemberNo.value) return
  try {
    await uploadProfileImage(myMemberNo.value, file)
    avatarBust.value = String(Date.now())
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || '업로드 실패'
    alert(msg)
  } finally {
    e.target.value = ''
  }
}

const loading = ref(false)

const reviews = ref(0)
const reviewsRows = ref([])
const normalizeReview = r => {
  const rawPhoto =
    r?.files?.[0]?.prFileUrl ??
    r?.files?.[0]?.url ??
    r?.files?.[0]?.fileUrl ??
    r?.files?.[0]?.path ??
    r?.files?.[0]?.fileName ?? ''
  const rawAvatar =
    r?.member?.profileImage?.url ??
    r?.member?.avatarUrl ??
    r?.member?.profilePath ?? ''
  return {
    id: r.reviewNo,
    reviewId: r.reviewNo ?? r.reviewId ?? null,
    memberNo: r?.member?.memberNo ?? null,
    nickname: r?.member?.memberName ?? '익명',
    content: r.reviewContent ?? r.reviewTitle ?? '',
    likes: r.reviewLike ?? 0,
    isLiked: r.isLiked ?? false,
    photo: rawPhoto,
    avatar: rawAvatar
  }
}
async function loadReviews() {
  if (!token.value) return
  loading.value = true
  try {
    const fn = isMine.value ? fetchMyPhotoReviews : fetchUserPhotoReviews
    const res = await fn({
      memberNo: isMine.value ? undefined : targetMemberNo.value,
      page: 0,
      size: 12,
      token: token.value
    })
    const rows = Array.isArray(res?.content) ? res.content.map(normalizeReview) : []
    reviewsRows.value = rows
    reviews.value = typeof res?.totalElements === 'number' ? res.totalElements : rows.length
  } finally {
    loading.value = false
  }
}

const postsRows = ref([])
const postsTotal = ref(0)
const normalizePost = p => ({
  postId: p.boardNo ?? p.postId ?? p.id ?? null,
  title: p.boardTitle ?? p.title ?? '',
  likes:
    (Number(p.likesNo1) || 0) +
    (Number(p.likesNo2) || 0) +
    (Number(p.likesNo3) || 0) +
    (Number(p.likesNo4) || 0),
  views: Number(p.boardSeq) || Number(p.views) || 0,
  comment: Number(p.commentCount) || Number(p.comment) || 0,
  author: p.memberId ?? p.member?.memberId ?? p.writer ?? p.author ?? '',
  avatar: p.memberAvatar ?? p.avatar ?? '',
  thumbnail:
    p.foodPicture ??
    p.thumbnail ??
    p.coverImage ??
    p.images?.[0]?.url ??
    p.files?.[0]?.url ?? ''
})
async function loadPosts() {
  if (!token.value || !targetMemberNo.value) return
  loading.value = true
  try {
    const res = await fetchUserPosts({
      memberNo: targetMemberNo.value,
      page: 0,
      size: 12,
      token: token.value
    })
    const list = Array.isArray(res?.content) ? res.content : Array.isArray(res) ? res : []
    postsRows.value = list.map(normalizePost)
    postsTotal.value = typeof res?.totalElements === 'number' ? res.totalElements : postsRows.value.length
  } finally {
    loading.value = false
  }
}
function goPost(postId) {
  if (!postId) return
  router.push(`/post/${postId}`)
}

function onToggleLike(index, payload) {
  const list = tab.value === 'review' ? reviewsRows.value : postsRows.value
  list[index].isLiked = payload.liked
  list[index].likes = payload.count
}

const follower = 0
const following = 0
const followerUsers = reactive(Array.from({ length: 30 }, (_, i) => `user${i + 1}`))
const followingUsers = reactive(Array.from({ length: 35 }, (_, i) => `user${i + 21}`))
const showFollowModal = ref(false)
const followType = ref('followers')
function openFollow(type) {
  followType.value = type
  showFollowModal.value = true
  document.body.style.overflow = 'hidden'
}

const tab = ref('review')

const showReport = ref(false)

watch(showFollowModal, v => { if (!v) document.body.style.overflow = 'auto' })
watch(() => route.params.memberNo, () => {
  loadProfile()
  loadAlbti()
  loadReviews()
  loadPosts()
  avatarBust.value = ''
})

onMounted(() => {
  loadProfile()
  loadAlbti()
  loadReviews()
  loadPosts()
})
const submitReport = async ({ title, content }) => {
  try {
    await createReport({
      reporterId: myMemberNo.value,
      reportedId: targetMemberNo.value,
      title,
      content,
      // reportDate: dayjs().format('YYYY-MM-DD HH:mm')  // dayjs 쓰시면 이렇게
    })
    alert('신고가 접수되었습니다.')
    showReport.value = false
  } catch (e) {
    const msg = e?.response?.data?.message || e?.response?.data || e?.message || '신고 전송 실패'
    console.error('createReport error:', e?.response || e)
    alert(msg)
  }
}
</script>

<style scoped>
.mypage { background: #FFF7E9; min-height: 100vh; }
.inner { width: 92%; max-width: 1200px; margin: 0 auto; padding: 20px 0 60px; }
.profile { display: grid; grid-template-columns: 110px 1fr; align-items: center; gap: 18px; padding: 16px 10px 8px 10px; }
.avatar-lg { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 2px solid #E2D8C7; background: #fff; }
.avatar-lg.clickable { cursor: pointer; box-shadow: 0 0 0 0 transparent; transition: box-shadow .15s ease; }
.avatar-lg.clickable:hover { box-shadow: 0 0 0 3px rgba(242, 213, 167, .6); }
.hidden-file { display: none; }
.profile-main { display: grid; gap: 2px; }
.row-1 { display: flex; align-items: center; gap: 12px; }
.nickname { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 28px; font-weight: 900; color: #2B1F14; }
.badge { width: 30px; height: 30px; }
.actions { display: flex; gap: 8px; margin-left: 8px;}
.btn { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; cursor: pointer; transition: transform .05s ease; }
.btn, .actions a { text-decoration: none; }
.btn.solid { background: #F2D5A7; border: 1px solid #F2D5A7; color: #2B1F14; }
.btn.solid.edit { background: #f0c97a; border-color: #f0c97a; }
.btn.report { background: transparent; border: 1px solid #E2D8C7; color: #2B1F14; }
.row-2 { display: inline-flex; align-items: center; gap: 10px; margin-left: 6px; margin-top: -12px; }
.level { background: #FADFA1; color: #2B1F14; padding: 8px 20px; border-radius: 12px; font-size: 17px; font-weight: 900; }
.link { cursor: pointer; }
.sep { opacity: .5; }
.row-3 { margin-top: 10px; }

.counts { display: flex; gap: 28px; align-items: center; padding: 4px 8px 0; margin-top: 20px; }
.count { display: inline-flex; align-items: baseline; gap: 8px; padding: 2px 4px; border: none; background: transparent; cursor: pointer; }
.count .label, .count .num { font-size: 22px; font-weight: 900; color: #2B1F14; }
.count.active .label, .count.active .num { color: #D2B382; }

.line { border: none; border-top: 1.5px solid #D9D0C1; margin: 10px 0 20px; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px 46px; padding: 16px 6px 6px; }

.center { text-align: center; margin-top: 12px; color: #2B1F14; font-weight: 600; }
</style>