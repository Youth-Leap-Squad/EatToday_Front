<!-- @/components/dm/DmSidebar.vue -->

<script setup>
import { computed } from 'vue';

const props = defineProps({
  rooms: { type: Array, default: () => [] },
  tab:   { type: String, default: 'all' },   // all | unread (그룹 제거)
  query: { type: String, default: '' }
});
const emit = defineEmits(['update:tab','update:query','select-room']);

const filtered = computed(() => {
  let list = props.rooms;
  if (props.tab === 'unread') list = list.filter(r => (r.unread||0) > 0);

  if (props.query.trim()) {
    const s = props.query.trim().toLowerCase();
    list = list.filter(r => r.name?.toLowerCase().includes(s));
  }
  return list;
});

function select(r){ emit('select-room', r); }
</script>

<template>
  <aside class="sidebar">
    <div class="title">채팅</div>

    <div class="search">
      <span class="icon">🔍</span>
      <input
        type="search" autocomplete="off"
        :value="query"
        @input="e => emit('update:query', e.target.value)"
        placeholder="Messenger 검색"
      />
    </div>

    <div class="tabs">
      <button :class="{on: tab==='all'}"    @click="emit('update:tab','all')">전체</button>
      <button :class="{on: tab==='unread'}" @click="emit('update:tab','unread')">읽지 않음</button>
    </div>

    <div class="room-list">
      <button
        v-for="r in filtered"
        :key="r.id"
        class="room"
        @click="select(r)"
      >
        <div class="avatar">👤</div>
        <div class="info">
          <div class="name">
            {{ r.name }}
            <span v-if="r.unread" class="badge">{{ r.unread }}</span>
          </div>
          <div class="last">{{ r.last }}</div>
        </div>
      </button>
    </div>
  </aside>
</template>

<style scoped>
:root{ --panel:#f4ecdf; --line:#e0d5c4; }
.sidebar{ background:var(--panel); border-radius:18px; padding:14px; }
.title{ font-weight:900; color:#1f1a14; margin:4px 0 10px 6px; }
.search{ display:flex; align-items:center; gap:8px; background:#fff;
  border-radius:18px; padding:10px 12px; margin:0 6px 12px; }
.search .icon{ opacity:.6; }
.search input{ border:none; outline:none; flex:1; background:transparent; }
.tabs{ display:flex; gap:8px; margin:6px 6px 10px; }
.tabs button{ background:#f7f1e6; border:none; padding:6px 10px; border-radius:10px; color:#6b5b4a; }
.tabs button.on{ background:#ffecc9; color:#3b2c1e; font-weight:800; }
.room-list{ background:#fff; border-radius:12px; overflow:hidden; border:1px solid var(--line); }
.room{ width:100%; display:flex; align-items:center; gap:10px; padding:10px 12px; border:none;
  border-bottom:1px solid var(--line); background:#fff; text-align:left; cursor:pointer; }
.room:last-child{ border-bottom:none; }
.avatar{ width:40px; height:40px; border-radius:50%; background:#f0eadf; display:grid; place-items:center; }
.info{ flex:1; }
.name{ font-weight:800; display:flex; align-items:center; gap:6px; }
.last{ font-size:13px; color:#8a7a6a; }
.badge{ background:#eee; border-radius:999px; padding:0 6px; font-size:12px; }
</style>
