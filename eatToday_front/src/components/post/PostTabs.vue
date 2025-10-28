<template>
  <div class="tabs">
    <button
      v-for="t in tabs"
      :key="t.value"
      :class="['tab', { active: modelValue === t.value }]"
      @click="$emit('update:modelValue', t.value)"
    >
      {{ t.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "PostTabs",
  props: {
    tabs: { type: Array, required: true },
    modelValue: String,
  }, 
  emits: ["update:modelValue"],
};
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.tab {
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  background: #f8f6f1;
  cursor: pointer;
}
.tab.active {
  background: #000;
  color: #fff;
}
</style>
