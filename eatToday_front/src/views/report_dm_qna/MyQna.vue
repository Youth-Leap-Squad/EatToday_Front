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
        <template v-if="loading">
          <div class="empty">불러오는 중입니다…</div>
        </template>

        <template v-else>
          <ul class="rows" v-if="qnas.length">
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
          <div v-else class="empty">작성한 문의가 없습니다.</div>
        </template>
      </div>

      <div class="pager" v-if="totalPages > 1">
        <button class="nav" @click="prevPage" :disabled="page === 0">
          <img :src="leftBtn" alt="prev" />
        </button>

        <button
          v-for="p in pages"
          :key="p"
          class="page"
          :class="{ current: p - 1 === page }"
          @click="go(p - 1)"
        >
          {{ p }}
        </button>

        <button class="nav" @click="nextPage" :disabled="page >= totalPages - 1">
          <img :src="rightBtn" alt="next" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import plusBtn from '@/assets/images/plusbutton.png'
import editBtn from '@/assets/images/editbutton.png'
import leftBtn from '@/assets/images/leftbutton.png'
import rightBtn from '@/assets/images/rightbutton.png'
import { fetchMyInquiryQnas } from '@/api/inquiryQna'

const router = useRouter()

function goToComment(id) {
  router.push(`/qna/comment?id=${id}`)
}
function goToCreate() {
  router.push('/qna/create')
}

const token = computed(() => localStorage.getItem('token') || '')

const loading = ref(false)
const qnas = ref([])
const page = ref(0)
const size = ref(4)
const totalPages = ref(1)

async function load() {
  loading.value = true
  try {
    if (!token.value) {
      qnas.value = []
      totalPages.value = 1
      return
    }

    const data = await fetchMyInquiryQnas({
      token: token.value,
      page: page.value,
      size: size.value,
    })

    const items = data?.content ?? []
    totalPages.value = data?.totalPages ?? 1

    qnas.value = items.map(i => ({
      id: i.qnaPostNo ?? i.id ?? i.postId ?? i.qnaId,
      category: i.category ?? '문의',
      subject: i.inquiryTitle ?? i.title ?? (i.inquiryContent ?? '').slice(0, 60),
      date: (i.inquiryAt ?? i.createdAt ?? '').toString().slice(0, 10),
    }))
  } catch (e) {
    qnas.value = []
    totalPages.value = 1
    alert(`목록 조회 실패: ${e.message}`)
  } finally {
    loading.value = false
  }
}

const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

function go(to) { page.value = to }
function prevPage() { if (page.value > 0) page.value-- }
function nextPage() { if (page.value < totalPages.value - 1) page.value++ }

onMounted(load)
watch([page, token], load)
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
.rows { list-style: none; margin: 0; padding: 0; }
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
.row:last-child .row-inner::after { display: none; }
.left { display: inline-flex; align-items: center; gap: 12px; }
.edit-img { width: 20px; height: 20px; opacity: 0.85; }
.category { font-size: 16px; font-weight: 800; color: #D2B382; }
.subject { font-size: 16px; font-weight: 700; color: #000; line-height: 1.6; }
.date { justify-self: end; font-size: 15px; color: #2F2A23; opacity: 0.85; }
.empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b635b;
  font-size: 14px;
}
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
}
.nav {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
}
.nav[disabled] { opacity: 0.4; cursor: default; }
.nav img { width: 18px; height: 18px; }
.page {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  color: #BFBFBF;
  padding: 4px 6px;
}
.page.current {
  color: #c4a874;
  font-size: 17px;
  font-weight: 700;
}
</style>