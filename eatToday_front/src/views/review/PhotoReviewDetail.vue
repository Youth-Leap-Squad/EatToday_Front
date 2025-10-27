<!-- src/views/review/PhotoReviewDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchReviewDetail,
  listComments,
  addComment,
  updateComment,
  deleteComment
} from '@/api/photoReviewAnju'

const route = useRoute()
const router = useRouter()
const reviewNo = Number(route.params.id || route.params.reviewNo)

const review = ref(null)
const comments = ref([])
const input = ref('')
const editingId = ref(null)
const editText = ref('')

/** ✅ 로그인 체크 */
function requireLogin() {
  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')
  if (!token || token === 'null' || token === 'undefined') {
    alert('로그인이 필요합니다.')
    router.replace('/login')
    return false
  }
  return true
}

/** ✅ 시간 표시 */
function timeAgo(isoOrTs) {
  const ts = typeof isoOrTs === 'number' ? isoOrTs : Date.parse(isoOrTs)
  const h = Math.max(1, Math.floor((Date.now() - ts) / 3600000))
  return `${h}시간 전`
}

/** ✅ 데이터 로드 */
async function load() {
  try {
    const r = await fetchReviewDetail(reviewNo)
    if (!r) {
      alert('리뷰를 찾을 수 없어요.')
      router.replace('/reviews')
      return
    }
    review.value = r
    comments.value = await listComments(reviewNo)
  } catch (e) {
    console.error('❌ 리뷰 로드 실패:', e)
    alert('데이터를 불러오지 못했습니다.')
  }
}

onMounted(load)

/** ✅ 댓글 등록 */
async function submitComment() {
  if (!requireLogin()) return
  const text = input.value?.trim()
  if (!text) return alert('댓글을 입력해 주세요.')

  try {
    await addComment(reviewNo, { memberNo: 1, content: text })
    comments.value = await listComments(reviewNo)
    input.value = ''
  } catch (e) {
    console.error('댓글 등록 실패:', e?.response?.data || e)
    alert('댓글 등록 실패: ' + (e.response?.data?.message || e.message))
  }
}

/** ✅ 댓글 수정 시작 */
function startEdit(c) {
  const id = Number(c.prcNo ?? c.commentNo ?? c.id)
  if (!Number.isFinite(id)) {
    alert('댓글 ID가 유효하지 않습니다.')
    return
  }
  editingId.value = id
  editText.value = c.prcDetail ?? c.content ?? ''
}

/** ✅ 수정 취소 */
function cancelEdit() {
  editingId.value = null
  editText.value = ''
}

/** ✅ 댓글 저장 */
async function saveEdit() {
  if (!requireLogin()) return
  const id = Number(editingId.value)
  if (!Number.isFinite(id)) {
    alert('댓글 ID가 유효하지 않습니다.')
    return
  }
  const text = editText.value?.trim()
  if (!text) {
    cancelEdit()
    return
  }

  try {
    await updateComment(id, { memberNo: 1, content: text })
    comments.value = await listComments(reviewNo)
    cancelEdit()
  } catch (e) {
    console.error('댓글 수정 실패:', e?.response?.data || e)
    alert('댓글 수정 실패: ' + (e.response?.data?.message || e.message))
  }
}

/** ✅ 댓글 삭제 */
async function removeComment(c) {
  if (!requireLogin()) return
  const id = Number(c.prcNo ?? c.commentNo ?? c.id)
  if (!Number.isFinite(id)) {
    alert('댓글 ID가 유효하지 않습니다.')
    return
  }

  try {
    await deleteComment(id, 1)
    comments.value = await listComments(reviewNo)
  } catch (e) {
    console.error('댓글 삭제 실패:', e?.response?.data || e)
    alert('댓글 삭제 실패: ' + (e.response?.data?.message || e.message))
  }
}
</script>

<template>
  <section v-if="review" class="page">
    <!-- 상단 -->
    <header class="top">
      <button class="back" @click="router.back()">←</button>
      <div class="titlebox">
        <h1>{{ review.reviewTitle || review.title }}</h1>
        <div class="authorline">
          <div class="avatar">👤</div>
          <div class="name-time">
            <div class="name">{{ review.memberEmail || review.authorName || '익명 사용자' }}</div>
            <div class="time">{{ timeAgo(review.reviewDate || review.createdAt) }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 이미지 -->
    <div class="photo-box">
      <template v-if="review.files && review.files.length">
        <img
          v-for="f in review.files"
          :key="f.fileNo || f.id"
          :src="f.urlOrPath || f.url || f.fileUrl || f.file_path || f.path"
          class="photo"
          alt=""
        />
      </template>
      <div v-else class="photo placeholder">이미지 없음</div>
    </div>

    <!-- 본문 -->
    <article class="content">
      <p style="white-space: pre-wrap">{{ review.reviewContent || review.content }}</p>
    </article>

    <!-- 댓글 -->
    <section class="comments">
      <div class="count">댓글 <b>{{ comments.length }}</b></div>

      <div class="write">
        <div class="me">🙂 user</div>
        <input
          v-model="input"
          placeholder="댓글을 작성해 주세요."
          @keyup.enter="submitComment"
        />
        <button class="ok" @click="submitComment">등록</button>
      </div>

      <ul class="list">
        <li v-for="c in comments" :key="c.prcNo ?? c.commentNo ?? c.id" class="item">
          <div class="left">👤</div>
          <div class="right">
            <div class="who">{{ c.memberEmail || c.authorName || '익명' }}</div>

            <!-- 수정 중이 아닐 때 -->
            <div v-if="editingId !== (c.prcNo ?? c.commentNo ?? c.id)" class="bubble">
              {{ c.prcDetail ?? c.content }}
            </div>

            <!-- 수정 중일 때 -->
            <div v-else class="edit-row">
              <input v-model="editText" />
              <div class="edit-actions">
                <button @click="saveEdit()">완료</button>
                <button @click="cancelEdit">취소</button>
              </div>
            </div>

            <div class="actions">
              <button class="chip" @click="startEdit(c)">수정</button>
              <button class="chip warn" @click="removeComment(c)">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </section>

  <section v-else class="page">불러오는 중...</section>
</template>

<style scoped>
.page{max-width:860px;margin:12px auto 60px;padding:0 10px;color:#2e2318}
.top{display:flex;align-items:center;gap:12px;margin:8px 0 16px;position:relative;}
.back{border:none;background:transparent;font-size:28px;cursor:pointer}
.titlebox h1{margin:2px 0 8px;font-size:22px;font-weight:900}
.authorline{display:flex;align-items:center;gap:8px}
.avatar{width:34px;height:34px;border-radius:50%;background:#f0eadf;display:grid;place-items:center}
.name-time .name{font-weight:900}
.name-time .time{font-size:12px;color:#8a7a6a}
.photo-box{display:flex;justify-content:center;margin:8px 0 16px;flex-wrap:wrap;gap:10px}
.photo{width:100%;max-width:720px;border-radius:8px;object-fit:cover}
.photo.placeholder{width:100%;max-width:720px;aspect-ratio:16/10;background:#ece5dc;display:grid;place-items:center;color:#9a8b7a}
.content{background:#fff;border-radius:10px;padding:14px;line-height:1.7}
.comments{background:#eae2d6;border-radius:12px;padding:14px;margin-top:14px}
.count{margin:4px 2px 10px}
.write{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.write input{flex:1;background:#fff;border:1px solid #e0d5c4;border-radius:8px;padding:10px}
.write .ok{background:#fff;border:1px solid #c9ae86;border-radius:8px;padding:8px 10px;cursor:pointer}
.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.item{display:flex;gap:10px}
.left{width:32px;height:32px;border-radius:50%;background:#f0eadf;display:grid;place-items:center}
.right{flex:1}
.who{font-size:13px;color:#6b5b4a;margin-bottom:4px}
.bubble{background:#fff;border-radius:10px;padding:10px}
.actions{display:flex;gap:6px;margin-top:6px}
.chip{border:none;background:#fff;border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer}
.chip.warn{background:#ffe8e8}
.edit-row{display:flex;gap:8px;align-items:center}
.edit-row input{flex:1;background:#fff;border:1px solid #d5c9ba;border-radius:8px;padding:8px}
.edit-actions button{margin-left:4px;border:1px solid #d5c9ba;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer}
</style>