<template>
  <div class="chips">
    <button
      v-for="r in items"
      :key="r.key"
      class="chip"
      :class="{ active: r.me }"
      @click="$emit('toggle', r.key)"
      :title="r.label"
    >
      <span class="emoji">{{ r.emoji }}</span>
      <div class="label">{{ r.label }}</div>
      <div class="count">{{ r.count }}</div>
    </button>
  </div>
</template>

<script>
export default {
  name: "ReactionChips",
  props: {
    // [{key, emoji, label, count, me}]
    items: { type: Array, required: true }
  },
  emits: ["toggle"]
};
</script>

<style scoped>
.chips{display:flex;gap:16px;flex-wrap:wrap}
.chip{
  display:flex;flex-direction:column;align-items:center;gap:6px;
  width:120px;padding:12px 10px;border-radius:20px;border:1px solid #eee;
  background:linear-gradient(#fff,#f7f2e9);cursor:pointer;transition:all .15s ease
}
.chip .emoji{font-size:20px}
.chip .label{font-size:13px;color:#333}
.chip .count{font-weight:700}
.chip:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,.06)}
.chip.active{border-color:#111;box-shadow:0 0 0 2px #111 inset;color:#111}
</style>
