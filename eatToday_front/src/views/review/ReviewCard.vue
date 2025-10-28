<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { likeReview } from '@/mock/review.js'
import { fetchReviewDetail, fetchMemberProfile } from '@/api/photoReviewAnju'
import { getProfileImageUrl, getMyInfo } from '@/api/member'

const router = useRouter()

const props = defineProps({
  item: { type: Object, required: true }
})

// ---------------- 상태 ----------------
const likes = ref(props.item?.likeCount ?? 0)
const thumbnail = ref('')
const authorAvatar = ref('/images/photo_review/userexample.png')
const authorProfile = ref(null)
const authorProfileLoading = ref(false)

// ---------------- 좋아요 ----------------
watch(() => props.item?.likeCount, v => (likes.value = v ?? 0))

async function onLike(e) {
  e.stopPropagation()
  const id = props.item?.id || props.item?.reviewNo
  if (!id) return
  likes.value = await likeReview(id)
}

// ---------------- 라우팅 ----------------
function goDetail() {
  const id = props.item?.id || props.item?.reviewNo
  if (!id) return
  router.push({ path: `/reviews/${id}` })
}

// ---------------- 작성자 ----------------
const defaultAvatar = '/images/photo_review/userexample.png'

const authorMemberNo = computed(() => {
  const i = props.item
  if (!i) return null
  const candidates = [
    i.memberNo, i.member_no, i.authorNo, i.author_no,
    i.member?.memberNo, i.member?.member_no
  ]
  const hit = candidates.map(Number).find(Number.isFinite)
  return Number.isFinite(hit) ? hit : null
})

const authorName = computed(() => {
  const i = props.item
  if (!i) return '익명'

  const direct = [
    i.member_id, i.memberId, i.memberNickname, i.member_nickname,
    i.nickname, i.name, i.authorName, i.writerName,
    i.member?.member_id, i.member?.memberNickname, i.member?.name,
    i.author?.name, i.writer?.name
  ].find(v => typeof v === 'string' && v.trim())

  if (direct) return direct.trim()
  const memberNo = authorMemberNo.value
  if (memberNo) return `회원#${memberNo}`
  return '익명'
})

/* 프로필 이미지 경로 생성 */
function profileImageFromMemberNo(memberNo) {
  if (!Number.isFinite(memberNo)) return ''
  const bust = Date.now()
  return getProfileImageUrl(memberNo, bust) || 
         `${import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'}/members/profile-image/${memberNo}?bust=${bust}`
}

/* 프로필 로드 */
async function loadAuthorProfile() {
  const memberNo = authorMemberNo.value
  if (!Number.isFinite(memberNo)) return

  try {
    authorProfileLoading.value = true
    const profile = await fetchMemberProfile(memberNo)
    if (profile) {
      authorProfile.value = profile
      if (profile.profileImageUrl) {
        authorAvatar.value = profile.profileImageUrl.startsWith('http')
          ? profile.profileImageUrl
          : `${import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'}${profile.profileImageUrl}`
      } else {
        authorAvatar.value = profileImageFromMemberNo(memberNo)
      }
    } else {
      authorAvatar.value = profileImageFromMemberNo(memberNo)
    }
  } catch (err) {
    console.warn('⚠️ 프로필 이미지 로드 실패:', err)
    authorAvatar.value = profileImageFromMemberNo(memberNo)
  } finally {
    authorProfileLoading.value = false
  }
}

// ---------------- 썸네일 ----------------
async function loadThumbnail() {
  const id = Number(props.item?.reviewNo || props.item?.id)
  if (!Number.isFinite(id)) return
  try {
    const detail = await fetchReviewDetail(id)
    const candidate =
      detail.thumbnailUrl || detail.imageUrl || detail.photoUrl ||
      (Array.isArray(detail.files) && detail.files[0]?.fileUrl)
    thumbnail.value = candidate?.startsWith('http')
      ? candidate
      : `${import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080'}${candidate}`
  } catch (err) {
    console.warn('⚠️ 썸네일 로드 실패:', err)
  }
}

/* 로드 실패 시 기본 이미지 */
function handleAvatarError(e) {
  e.target.src = defaultAvatar
}

// ---------------- 라이프사이클 ----------------
onMounted(async () => {
  await loadAuthorProfile()
  await loadThumbnail()
})
</script>

<template>
  <article class="card" @click="goDetail">
    <div class="thumb">
      <img v-if="thumbnail" :src="thumbnail" alt="리뷰 이미지" />
      <div v-else class="placeholder">이미지 없음</div>

      <button class="like-badge" @click.stop="onLike">
        <span class="heart">♡</span>
        <span class="cnt">{{ likes }}</span>
      </button>
    </div>

    <div class="meta">
      <div class="row">
        <!-- ✅ 작성자 프로필 이미지 -->
        <img
          :src="authorAvatar"
          class="avatar"
          :alt="authorName"
          @error="handleAvatarError"
        />

        <div class="text">
          <div class="name">{{ authorName }}</div>
          <div class="desc">{{ item?.title || item?.reviewTitle || '제목 없음' }}</div>
          <div class="sub">{{ item?.content || item?.reviewContent || '' }}</div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background:#f6efe2;
  border-radius:18px;
  padding:12px;
  box-shadow:0 8px 24px rgba(50,30,0,.07);
  cursor:pointer;
  transition:transform .15s ease, box-shadow .15s ease;
}
.card:hover{ transform:translateY(-2px); box-shadow:0 10px 28px rgba(50,30,0,.10); }

.thumb {
  position:relative;
  width:100%;
  aspect-ratio:16/10;
  background:#ece5dc;
  border-radius:14px;
  overflow:hidden;
}
.thumb img { width:100%; height:100%; object-fit:cover; }
.placeholder { display:grid; place-items:center; color:#9a8b7a; height:100%; font-weight:800; }

.like-badge {
  position:absolute; top:10px; right:10px;
  background:#fff; border:none;
  border-radius:999px; box-shadow:0 6px 16px rgba(0,0,0,.12);
  padding:6px 10px; font-weight:900;
  display:flex; align-items:center; gap:6px;
}
.heart { font-size:16px; }
.meta { padding:12px 6px 4px; }
.row { display:flex; align-items:flex-start; gap:10px; }
.avatar {
  width:36px; height:36px; border-radius:50%;
  object-fit:cover; background:#f0eadf;
}
.text { display:grid; gap:2px; }
.name { font-weight:900; color:#2f2419; }
.desc { color:#2f2419; font-weight:800; }
.sub { color:#6b5b4a; font-size:13px; }
</style>