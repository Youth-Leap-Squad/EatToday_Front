<!-- @/components/dm/Dm.vue -->

<script setup>
import { ref, onMounted } from 'vue';
import DmSidebar from '@/components/dm/DmSidebar.vue';
import DmChatPanel from '@/components/dm/DmChatPanel.vue';

const rooms = ref([]);
const selected = ref(null);
const messages = ref([]);
const tab = ref('all');
const query = ref('');

onMounted(() => {
  rooms.value = [
    { id: 1, name: 'user2', last: '안녕하세요.', unread: 1, following: false },
    { id: 2, name: 'user3', last: '반가워요', unread: 0, following: true  },
  ];
});

function onSelectRoom(r) {
  // ✅ 방 진입 시 읽지 않음 0으로
  const idx = rooms.value.findIndex(x => x.id === r.id);
  if (idx !== -1) rooms.value[idx] = { ...rooms.value[idx], unread: 0 };

  selected.value = { ...r, unread: 0 };
  messages.value = [
    { id: 1, sender: r.name, content: '안녕하세요!', time: '오전 9:30', mine: false },
    { id: 2, sender: '나',   content: '반가워요 🙌', time: '오전 9:31', mine: true  },
  ];
}


function onSendMessage(text) {
  if (!text?.trim()) return;

  const now = new Date().toLocaleString('ko-KR', { hour: 'numeric', minute: '2-digit' });

  // ✅ 메시지 추가
  messages.value.push({
    id: Date.now(),
    sender: '나',
    content: text,
    time: now,
    mine: true
  });

  // ✅ 사이드바 최신 메시지 반영
  if (selected.value) {
    const idx = rooms.value.findIndex(r => r.id === selected.value.id);
    if (idx !== -1) {
      rooms.value[idx] = { ...rooms.value[idx], last: text };
      selected.value = { ...selected.value, last: text };
    }
  }
}

function onToggleFollow(roomId, next) {
  const idx = rooms.value.findIndex(r => r.id === roomId);
  if (idx !== -1) rooms.value[idx] = { ...rooms.value[idx], following: next };
  if (selected.value?.id === roomId) selected.value = { ...selected.value, following: next };
  // TODO: axios.post(`/api/follow/${roomId}`, { follow: next })
}

/* 파일 전송: 이미지면 미리보기 URL, 그 외 파일 링크로 표시 */
function onSendFile(roomId, file) {
  const url = URL.createObjectURL(file);
  const isImage = file.type.startsWith('image/');
  const now = new Date().toLocaleString('ko-KR', { hour: 'numeric', minute: '2-digit' });

  messages.value.push({
    id: Date.now(),
    type: isImage ? 'image' : 'file',
    url,
    filename: file.name,
    content: isImage ? undefined : file.name,
    time: now,
    mine: true
  });

    const lastText = isImage ? '[사진]' : file.name;
  if (selected.value) {
    const idx = rooms.value.findIndex(r => r.id === selected.value.id);
    if (idx !== -1) {
      rooms.value[idx] = { ...rooms.value[idx], last: lastText };
      selected.value = { ...selected.value, last: lastText };
    }
  }
  // TODO: 업로드 API 연동
}
</script>

<template>
  <div class="dm-grid">
    <DmSidebar
      :rooms="rooms"
      v-model:tab="tab"
      v-model:query="query"
      @select-room="onSelectRoom"
    />
    <DmChatPanel
      :room="selected"
      :messages="messages"
      @send="onSendMessage"
      @toggle-follow="onToggleFollow"
      @send-file="onSendFile"
    />
  </div>
</template>

<style scoped>
.dm-grid{
  display:grid;
  grid-template-columns:300px 1fr;
  gap:24px;
  padding:20px 24px 40px;
  background:#faf5ea;
  min-height:calc(100vh - 100px);
}
@media (max-width: 960px){ .dm-grid{ grid-template-columns:1fr; } }
</style>
