<template>
  <div class="card" :class="{ hl: highlight }">
    <div class="label">{{ label }}</div>
    <div class="value">
      <b>{{ value.toLocaleString() }}</b>
      <small v-if="unit">{{ unit }}</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  highlight: { type: Boolean, default: false },
})
</script>

<style scoped>
.card {
  background:#fff; border:1px solid #ecdcc5; border-radius:14px;
  padding:16px; display:flex; flex-direction:column; gap:6px;
}
.hl { background:#fff5e4 }
.label { color:#6b5843; font-weight:700 }
.value { font-size:22px; color:#9a7c56; display:flex; align-items:baseline; gap:6px }
.value b { font-size:26px; color:#c7a468 }
</style>
