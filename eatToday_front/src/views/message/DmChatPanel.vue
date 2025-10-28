<!-- @/components/dm/DmChatPanel.vue -->
<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  room: { type: Object, default: null },
  messages: { type: Array, default: () => [] }
});
const emit = defineEmits(['send','send-file','toggle-follow']);

const text = ref('');
const fileInput = ref(null);
const bottomAnchor = ref(null);

function send() {
  const t = text.value?.trim();
  if (!t) return;
  emit('send', t);
  text.value = '';
}

function onKeydown(e){
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}

function openFilePicker() { fileInput.value?.click(); }
function onFilePicked(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  if (!props.room) return;
  emit('send-file', props.room.id, f);
  e.target.value = '';
}

function toggleFollow() {
  if (!props.room) return;
  const next = !props.room.following;
  emit('toggle-follow', props.room.id, next);
}

// ✅ 엄지 버튼: 👍 단독 메시지 전송
function like() {
  emit('send', '👍');
}

// ✅ 메시지 바뀌면 아래로 스크롤
watch(() => props.messages.length, async () => {
  await nextTick();
  bottomAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'end' });
});
</script>

<template>
  <section class="panel">
    <div v-if="!room" class="empty">대화를 선택해 주세요.</div>

    <div v-else class="chat">
      <header class="chat-head">
        <div class="who">
          <div class="avatar">👤</div>
          <div class="names">
            <div class="name">{{ room?.name }}</div>
            <div class="sub">1:1 채팅</div>
          </div>
        </div>
      </header>

      <div class="messages">
        <div v-for="m in messages" :key="m.id" :class="['msg', m.mine ? 'me' : 'other']">
          <div class="bubble" :class="{ sticker: m.content === '👍' }">
            <template v-if="m.type === 'image'">
              <img :src="m.url" class="img-msg" alt="attachment"/>
            </template>
            <template v-else-if="m.type === 'file'">
              <a :href="m.url" target="_blank" class="file-msg">📎 {{ m.filename }}</a>
            </template>
            <template v-else>
              <div class="text">{{ m.content }}</div>
            </template>
            <div class="time">{{ m.time }}</div>
          </div>
        </div>
        <!-- 스크롤 앵커 -->
        <div ref="bottomAnchor"></div>
      </div>

      <footer class="composer">
        <button class="icon" title="이모티콘">😄</button>

        <button class="icon" title="파일 보내기" @click="openFilePicker">📎</button>
        <input ref="fileInput" type="file" accept="image/*,application/pdf" hidden @change="onFilePicked"/>

        <textarea
          v-model="text"
          placeholder="메시지를 입력하세요 (Enter: 전송, Shift+Enter: 줄바꿈)"
          @keydown="onKeydown"
          rows="1"
        />
        <button class="send" @click="send">➤</button>

        <!-- ✅ 엄지 버튼 동작 연결 -->
        <button class="icon" title="좋아요" @click="like">👍</button>
      </footer>
    </div>
  </section>
</template>

<!-- @/components/dm/DmChatPanel.vue -->
<style scoped>
:root{ --panel:#f4ecdf; --line:#e7ddcf; --btn:#d2b382; --btnOn:#f6e8c6; --ink:#2a1f16; }

/* ✅ 패널 자체 높이를 뷰포트 기준으로 고정 */
.panel{
  background:var(--panel);
  border-radius:18px;
  padding:14px;
  /* 기존: min-height:600px;  →  고정 높이로 전환 */
  height: calc(100vh - 160px); /* 상단 헤더/여백에 맞춰 필요시 숫자 조정 */
  display:flex;
}

/* ✅ flex 컨테이너에서 내부 영역이 커져도 부모가 늘어나지 않게 */
.chat{
  display:flex;
  flex-direction:column;
  width:100%;
  min-height:0;   /* 중요! 자식 flex가 부모 높이를 넘지 않게 */
}

/* 헤더/푸터는 줄어들지 않게 고정 */
.chat-head{ 
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 16px; border-bottom:1px solid var(--line); background:#fff; border-radius:12px;
  flex-shrink:0;     /* ✅ 헤더가 줄어들지 않도록 */
}

.messages{
  /* ✅ 가운데 영역만 내부 스크롤 */
  flex:1;
  min-height:0;              /* 중요! */
  overflow:auto;
  padding:16px;
  display:flex; flex-direction:column; gap:12px;
  overscroll-behavior: contain; /* 윈도우/바디 스크롤 전파 방지 */
}

.msg{ display:flex; }
.msg.me{ justify-content:flex-end; }
.bubble{ max-width:65%; background:#fff; border-radius:16px; padding:10px 14px; box-shadow:0 1px 2px rgba(0,0,0,.06); }
.msg.me .bubble{ background:#ffecc9; }
.text{ white-space:pre-wrap; font-size:15px; line-height:1.4; }
.time{ font-size:11px; color:#9c8c7c; margin-top:4px; text-align:right; }
.img-msg{ max-width:260px; border-radius:10px; display:block; }
.file-msg{ color:#2a1f16; text-decoration:underline; }

/* 👍 스티커 */
.bubble.sticker .text{ font-size:28px; line-height:1; text-align:center; }

/* ✅ 푸터(작성창)는 고정 높이 + 줄어들지 않게 */
.composer{
  display:flex; align-items:center; gap:8px; background:#fff; border-radius:12px;
  padding:10px; border:1px solid var(--line); margin-top:10px;
  flex-shrink:0;  /* 중요! */
}
.icon{ background:transparent; border:none; cursor:pointer; font-size:16px; color:#7a6957; }
.composer textarea{
  flex:1; border:none; outline:none; background:#f5efe7; padding:8px 10px; border-radius:10px;
  resize:none; height:38px;  /* ✅ 한 줄 고정 (길어져도 스크롤은 messages가 담당) */
}
.send{ background:var(--btn); color:#2a1f16; border:none; border-radius:10px; padding:8px 14px; font-weight:900; cursor:pointer; }

/* 모바일에서 높이 조금 더 확보하고 싶으면 */
@media (max-width: 960px){
  .panel{ height: calc(100vh - 120px); }
}
</style>
