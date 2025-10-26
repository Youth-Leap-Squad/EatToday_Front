<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createReview } from '@/mock/review.js';

const router = useRouter();
const title = ref('');
const content = ref('');
const file = ref(null);
const preview = ref('');

function onPick(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  file.value = f;
  preview.value = URL.createObjectURL(f);
}

async function submit() {
  if (!title.value.trim()) return alert('제목을 입력해 주세요.');
  const id = await createReview({
    title: title.value,
    content: content.value,
    authorName: 'user',
    file: file.value
  });
  router.push(`/reviews/${id}`);
}
</script>

<template>
  <section class="wrap">
    <div class="page-title">리뷰 작성하기</div>

    <label class="upload">
      <input type="file" accept="image/*" hidden @change="onPick" />
      <div class="upload-box">
        <img v-if="preview" :src="preview" class="preview" />
        <div v-else class="placeholder">이미지 업로드</div>
      </div>
    </label>

    <input class="title" v-model="title" placeholder="제목을 입력하세요" />
    <textarea class="content" v-model="content" rows="7" placeholder="안주에 대한 리뷰를 작성해주세요."></textarea>

    <div class="actions">
      <button class="primary" @click="submit">리뷰 등록하기</button>
    </div>
  </section>
</template>

<style scoped>
.wrap{max-width:900px;margin:20px auto 60px;padding:32px 28px;background:#f4ecdf;border-radius:18px}
.page-title{text-align:center;font-size:20px;font-weight:900;color:#2e2318;margin-bottom:18px}
.upload-box{width:230px;height:230px;margin:0 auto 22px;border-radius:10px;background:#E7E0D6;display:grid;place-items:center;overflow:hidden}
.preview{width:100%;height:100%;object-fit:cover}
.placeholder{color:#2f2a24}
.title{width:100%;margin:6px 0 10px;padding:14px 16px;border:none;border-radius:12px;background:#fff}
.content{width:100%;padding:16px;border:none;background:#E9E3DB;border-radius:12px;resize:vertical}
.actions{display:flex;justify-content:center;margin:22px 0 6px}
.primary{background:#d2b382;color:#2a1f16;border:none;padding:14px 26px;border-radius:14px;font-weight:900;min-width:240px}
</style>
