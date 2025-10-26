<!-- 모달창 닫는 X 버튼 컴포넌트 (김진호) -->
<template>
  <button 
    class="modal-close-btn" 
    @click="$emit('close')" 
    :aria-label="ariaLabel"
    :title="title"
  >
    ✕
  </button>
</template>

<script setup>
defineProps({
  ariaLabel: {
    type: String,
    default: '닫기'
  },
  title: {
    type: String,
    default: '닫기'
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-close-btn {
  position: absolute;
  right: 6px;
  top: 2px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #3a2b20;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.modal-close-btn:hover {
  background: rgba(58, 43, 32, 0.1);
  color: #2e1b0e;
}

.modal-close-btn:active {
  background: rgba(58, 43, 32, 0.2);
  transform: scale(0.95);
}


.modal-close-btn:focus {
  outline: 2px solid #dabb8b;
  outline-offset: 2px;
}
</style>
