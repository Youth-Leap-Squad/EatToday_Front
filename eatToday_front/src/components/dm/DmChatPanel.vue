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
        <button
          v-if="room && !room.isGroup"
          class="follow"
          :data-state="room.following ? 'on' : 'off'"
          @click="toggleFollow"
        >
          {{ room.following ? '팔로잉' : '팔로우' }}
        </button>
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
        <!-- ✅ 스크롤 앵커 -->
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

<style scoped>
:root{ --panel:#f4ecdf; --line:#e7ddcf; --btn:#d2b382; --btnOn:#f6e8c6; --ink:#2a1f16; }
.panel{ background:var(--panel); border-radius:18px; padding:14px; min-height:600px; display:flex; }
.empty{ margin:auto; color:#9a8b7a; }
.chat{ display:flex; flex-direction:column; width:100%; }

.chat-head{ display:flex; align-items:center; justify-content:space-between;
  padding:10px 16px; border-bottom:1px solid var(--line); background:#fff; border-radius:12px; }
.who{ display:flex; align-items:center; gap:10px; }
.avatar{ width:46px; height:46px; border-radius:50%; background:#f0eadf; display:grid; place-items:center; }
.names .name{ font-weight:900; }
.names .sub{ font-size:12px; color:#8a7a6a; }

.follow{ border:none; border-radius:999px; padding:10px 18px; font-weight:900; cursor:pointer; }
.follow[data-state="off"]{ background:var(--btn); color:var(--ink); }
.follow[data-state="on"]{
  background:var(--btnOn); color:var(--ink);
  text-decoration: underline; text-underline-offset: 6px; text-decoration-thickness: 4px; text-decoration-color:#7a4bff;
}

.messages{ flex:1; overflow:auto; padding:16px; display:flex; flex-direction:column; gap:12px; }
.msg{ display:flex; }
.msg.me{ justify-content:flex-end; }
.bubble{ max-width:65%; background:#fff; border-radius:16px; padding:10px 14px; box-shadow:0 1px 2px rgba(0,0,0,.06); }
.msg.me .bubble{ background:#ffecc9; }
.text{ white-space:pre-wrap; font-size:15px; line-height:1.4; }
.time{ font-size:11px; color:#9c8c7c; margin-top:4px; text-align:right; }
.img-msg{ max-width:260px; border-radius:10px; display:block; }
.file-msg{ color:#2a1f16; text-decoration:underline; }

/* ✅ 👍 이모티콘을 스티커처럼 크게 보여주기 */
.bubble.sticker .text{ font-size:28px; line-height:1; text-align:center; }
.composer{
  display:flex; align-items:center; gap:8px; background:#fff; border-radius:12px;
  padding:10px; border:1px solid var(--line); margin-top:10px;
}
.icon{ background:transparent; border:none; cursor:pointer; font-size:16px; color:#7a6957; }
.composer textarea{
  flex:1; border:none; outline:none; background:#f5efe7; padding:8px 10px; border-radius:10px; resize:none; height:38px;
}
.send{ background:var(--btn); color:#2a1f16; border:none; border-radius:10px; padding:8px 14px; font-weight:900; cursor:pointer; }
</style>
