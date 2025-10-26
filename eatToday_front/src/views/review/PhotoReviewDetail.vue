<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getReview, likeReview, toggleFollow,
  listComments, addComment, updateComment, deleteComment
} from '@/mock/review.js';

const route = useRoute();
const router = useRouter();
const review = ref(null);
const comments = ref([]);
const input = ref('');
const editingId = ref(null);
const editText = ref('');

// ✅ 메뉴 상태/참조
const menuOpen = ref(false);
const menuRef = ref(null);
const moreBtnRef = ref(null);

function timeAgo(ts){ const h = Math.max(1, Math.floor((Date.now()-ts)/3600000)); return `${h}시간 전`; }

onMounted(() => {
  const r = getReview(route.params.id);
  if(!r){ alert('리뷰를 찾을 수 없어요.'); router.replace('/reviews'); return; }
  review.value = {...r};
  comments.value = listComments(r.id);
});

function onLike(){ review.value.likeCount = likeReview(review.value.id); }

function toggleFollowBtn(){
  const next = !review.value.following;
  review.value.following = toggleFollow(review.value.id, next);
}


// ✅ 메뉴 토글
function toggleMenu(){ menuOpen.value = !menuOpen.value; }

// ✅ 메뉴 동작 1: 메시지 보내기 (DM 페이지로 이동, 쿼리 전달)
function sendMessage(){
  menuOpen.value = false;
  router.push({ path: '/dm', query: { to: review.value.authorName } });
}

// ✅ 메뉴 동작 2: 신고
function report(){
  menuOpen.value = false;
  const ok = confirm('이 리뷰를 신고하시겠습니까?');
  if(!ok) return;
  reportReview(review.value.id, { reporter: 'user', reason: '부적절한 콘텐츠' });
  alert('신고가 접수되었습니다.');
}

function submitComment(){
  if(!input.value.trim()) return;
  const c = addComment(review.value.id, { authorName:'user', content: input.value });
  comments.value = listComments(review.value.id);
  input.value = '';
}
function startEdit(c){ editingId.value = c.id; editText.value = c.content; }
function cancelEdit(){ editingId.value = null; editText.value=''; }
function saveEdit(c){
  if(!editText.value.trim()) return cancelEdit();
  updateComment(review.value.id, c.id, editText.value);
  comments.value = listComments(review.value.id);
  cancelEdit();
}
function removeComment(c){
  deleteComment(review.value.id, c.id);
  comments.value = listComments(review.value.id);
}
</script>

<template>
  <section v-if="review" class="page">
    <!-- 상단 제목/작성자 -->
    <header class="top">
      <button class="back" @click="router.back()">←</button>

      <img class="mini" :src="review.imgUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='" />
      <div class="titlebox">
        <h1>{{ review.title }}</h1>
        <div class="authorline">
          <div class="avatar">👤</div>
          <div class="name-time">
            <div class="name">{{ review.authorName }}</div>
            <div class="time">{{ timeAgo(review.createdAt) }}</div>
          </div>
        </div>
      </div>

      <div class="top-actions">
        <button
          class="follow"
          :data-state="review.following ? 'on' : 'off'"
          @click="toggleFollowBtn"
        >
          {{ review.following ? '팔로잉' : '팔로우' }}
        </button>

      <!-- ✅ 점 3개 버튼 -->
        <button ref="moreBtnRef" class="more" @click.stop="toggleMenu" aria-haspopup="true" aria-expanded="menuOpen">⋯</button>

        <!-- ✅ 말풍선 메뉴 -->
        <div v-if="menuOpen" ref="menuRef" class="popover" role="menu">
          <button class="row" role="menuitem" @click.stop="sendMessage">
            <!-- 종이비행기 아이콘 대체 -->
            <span class="ico">🕊️</span>
            <span>메시지 보내기</span>
          </button>
          <button class="row warn" role="menuitem" @click.stop="report">
            <span class="ico">🚫</span>
            <span>신고</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 메인 이미지 -->
    <div class="photo-box">
      <img v-if="review.imgUrl" :src="review.imgUrl" class="photo" alt="" />
      <div v-else class="photo placeholder">이미지 없음</div>
    </div>

    <!-- 해시태그 + 좋아요 -->
    <div class="subhead">
      <div class="hashtags">
        <span class="h1">사진리뷰 1</span>
        <span v-for="h in review.hashtags" :key="h" class="tag">{{ h }}</span>
      </div>
      <button class="like" @click="onLike">♡ {{ review.likeCount }}</button>
    </div>

    <!-- 댓글 -->
    <section class="comments">
      <div class="count">댓글 <b>{{ comments.length }}</b></div>

      <div class="write">
        <div class="me">🙂 user</div>
        <input v-model="input" placeholder="댓글을 작성해 주세요." />
        <button class="ok" @click="submitComment">댓글 작성</button>
      </div>

      <ul class="list">
        <li v-for="c in comments" :key="c.id" class="item">
          <div class="left">👤</div>
          <div class="right">
            <div class="who">{{ c.authorName }}</div>

            <div v-if="editingId!==c.id" class="bubble">{{ c.content }}</div>
            <div v-else class="edit-row">
              <input v-model="editText" />
              <div class="edit-actions">
                <button @click="saveEdit(c)">완료</button>
                <button @click="cancelEdit">취소</button>
              </div>
            </div>

            <div class="actions">
              <button class="chip warn">신고</button>
              <button class="chip" @click="startEdit(c)">수정</button>
              <button class="chip" @click="removeComment(c)">삭제</button>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.page{max-width:860px;margin:12px auto 60px;padding:0 10px;color:#2e2318}
.top{display:flex;align-items:center;gap:12px;margin:8px 0 16px; position:relative;}
.back{border:none;background:transparent;font-size:28px;cursor:pointer}
.mini{width:60px;height:60px;object-fit:cover;border-radius:10px;background:#ece5dc}
.titlebox h1{margin:2px 0 8px;font-size:22px;font-weight:900}
.authorline{display:flex;align-items:center;gap:8px}
.avatar{width:34px;height:34px;border-radius:50%;background:#f0eadf;display:grid;place-items:center}
.name-time .name{font-weight:900}
.name-time .time{font-size:12px;color:#8a7a6a}
.top-actions{margin-left:auto;display:flex;align-items:center;gap:8px; position:relative;}
.follow{border:none;border-radius:999px;padding:8px 14px;font-weight:900;cursor:pointer}
.follow[data-state="off"]{background:#d2b382;color:#2a1f16}
.follow[data-state="on"]{
  background:#f6e8c6;color:#2a1f16;
  text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:4px;text-decoration-color:#f6e8c6;
}
.more{border:none;background:transparent;font-size:22px;cursor:pointer}

.photo-box{display:flex;justify-content:center;margin:8px 0 16px}
.photo{width:100%;max-width:720px;border-radius:8px;object-fit:cover}
.photo.placeholder{width:100%;max-width:720px;aspect-ratio:16/10;background:#ece5dc;display:grid;place-items:center;color:#9a8b7a}

.subhead{display:flex;align-items:center;justify-content:space-between;margin:14px 6px}
.hashtags{display:flex;gap:10px;align-items:center}
.h1{font-weight:900}
.tag{color:#3a2e23;background:#fff3de;border-radius:10px;padding:4px 8px;font-weight:800}
.like{border:none;background:transparent;font-weight:900;color:#3a2e23;cursor:pointer}

.comments{background:#eae2d6;border-radius:12px;padding:14px}
.count{margin:4px 2px 10px}
.write{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.write .me{min-width:70px;color:#6b5b4a}
.write input{flex:1;background:#fff;border:1px solid #e0d5c4;border-radius:8px;padding:10px}
.write .ok{margin-left:6px;background:#fff;border:1px solid #c9ae86;border-radius:8px;padding:8px 10px;cursor:pointer}

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

/* ✅ 말풍선 메뉴 */
.popover{
  position:absolute;
  top:42px; right:0;
  background:#fff; border:2px solid #1f1a1411; border-radius:12px;
  box-shadow: 0 6px 18px rgba(0,0,0,.12);
  padding:8px; width:180px; z-index:10;
}
.popover::after{
  content:""; position:absolute; top:-10px; right:18px; width:14px; height:14px;
  background:#fff; border-left:2px solid #1f1a1411; border-top:2px solid #1f1a1411;
  transform: rotate(45deg);
}
.row{
  width:100%; display:flex; align-items:center; gap:10px;
  padding:10px 8px; background:transparent; border:none; text-align:left;
  border-radius:10px; cursor:pointer; font-weight:800; color:#2e2318;
}
.row:hover{ background:#f6f0e6; }
.row.warn{ color:#b01212; }
.ico{ width:20px; text-align:center; }
</style>
