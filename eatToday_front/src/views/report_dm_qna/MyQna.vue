<template>
  <div class="myqna">
    <div class="inner">
      <h2 class="title">내 문의사항</h2>
      <hr class="title-line" />

      <div class="write-wrap">
        <button class="write-btn" @click="goToCreate">
          <img :src="plusBtn" alt="plus" class="plus-img" />
          문의사항 작성하기
        </button>
      </div>

      <div class="board">
        <ul class="rows">
          <li
            v-for="q in qnas"
            :key="q.id"
            class="row"
            @click="goToComment(q.id)"
          >
            <div class="row-inner">
              <div class="left">
                <img :src="editBtn" alt="edit" class="edit-img" />
                <span class="category">{{ q.category }}</span>
              </div>
              <span class="subject">{{ q.subject }}</span>
              <span class="date">{{ q.date }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import plusBtn from '@/assets/images/plusbutton.png'
import editBtn from '@/assets/images/editbutton.png'

const router = useRouter()

function goToComment(id) {
  router.push(`/qna/comment?id=${id}`)
}

function goToCreate() {
  router.push('/qna/create')
}

const qnas = ref([
  { id: 1, category: '이벤트 문제', subject: '이벤트 시작이 제대로 안되네요.. 조치 부탁드립니다.', date: '2025-10-20' },
  { id: 2, category: '포인트 적립', subject: '포인트 적립이 안되는 거 같아요…ㅠㅠ', date: '2025-10-19' },
  { id: 3, category: '등급 문제', subject: '포인트가 쌓였는데 아직도 브론즈예요 왜 이래요 ㅡㅡ', date: '2025-10-18' },
  { id: 4, category: '로그인 문제', subject: '비밀번호 입력이 안돼요 ㅠㅠ', date: '2025-10-18' }
])
</script>

<style scoped>
.myqna {
  background: #FFF7E9;
  min-height: 100vh;
}
.inner {
  width: 86%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 22px 0 48px;
}
.title {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 800;
  color: #2B1F14;
}
.title-line {
  border: none;
  border-top: 2px solid #BFBFBF;
  margin: 10px 0 10px 0;
}
.write-wrap {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
}
.write-btn {
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 14px;
  color: #3b3127;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.plus-img {
  width: 18px;
  height: 18px;
}
.board {
  width: 90%;
  height: 450px;
  margin: 20px auto;
  background: #F3E7D5;
  border: 1px solid #E2D8C7;
  border-radius: 14px;
  overflow: hidden;
  padding: 8px 0;
}
.rows {
  list-style: none;
  margin: 0;
  padding: 0;
}
.row {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}
.row-inner {
  width: 90%;
  display: grid;
  grid-template-columns: 210px 1fr 130px;
  align-items: center;
  column-gap: 20px;
  padding: 28px 0;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.row-inner::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.2px;
  background: #BFBFBF;
}
.row:last-child .row-inner::after {
  display: none;
}
.left {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.edit-img {
  width: 20px;
  height: 20px;
  opacity: 0.85;
}
.category {
  font-size: 16px;
  font-weight: 800;
  color: #D2B382;
}
.subject {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 1.6;
}
.date {
  justify-self: end;
  font-size: 15px;
  color: #2F2A23;
  opacity: 0.85;
}
</style>