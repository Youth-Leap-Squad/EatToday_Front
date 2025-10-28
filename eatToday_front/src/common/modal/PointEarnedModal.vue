<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="overlay" @click.self="close">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="point-title">
        <!-- 포인트 아이콘 -->
        <div class="point-icon">
          ⭐
        </div>

        <!-- 메인 메시지 -->
        <h3 class="title" id="point-title">포인트를 획득했습니다!</h3>
        
        <!-- 활동 설명 -->
        <p class="description">{{ description }}</p>

        <!-- 포인트 수치 -->
        <div class="point-display">
          <span class="point-value">+{{ points }}</span>
          <span class="point-label">점</span>
        </div>

        <!-- 확인 버튼 -->
        <button class="btn-confirm" @click="close">확인</button>
      </section>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: '활동 완료'
  },
  points: {
    type: Number,
    default: 0
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  autoCloseDelay: {
    type: Number,
    default: 3000 // 3초 후 자동 닫기
  }
})

const emit = defineEmits(['close'])

let autoCloseTimer = null

function close() {
  emit('close')
}

// autoClose가 true면 지정된 시간 후 자동으로 닫기
watch(() => props.visible, (newVal) => {
  if (newVal && props.autoClose) {
    // 이전 타이머가 있으면 제거
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
    }
    
    // 새 타이머 설정
    autoCloseTimer = setTimeout(() => {
      close()
    }, props.autoCloseDelay)
  } else if (!newVal) {
    // 모달이 닫힐 때 타이머 제거
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }
})
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal */
.modal {
  position: relative;
  width: 400px;
  max-width: calc(100% - 32px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  padding: 40px 30px 30px;
  text-align: center;
  animation: modal-bounce 0.4s ease-out;
}

@keyframes modal-bounce {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 포인트 아이콘 */
.point-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: icon-spin 0.6s ease-out;
}

@keyframes icon-spin {
  0% {
    transform: rotate(-20deg) scale(0);
  }
  50% {
    transform: rotate(10deg) scale(1.2);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

/* 제목 */
.title {
  font-size: 24px;
  font-weight: 600;
  color: #3a2b20;
  margin: 0 0 12px;
}

/* 설명 */
.description {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.5;
}

/* 포인트 표시 */
.point-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-bottom: 28px;
  animation: point-pop 0.5s ease-out 0.2s both;
}

@keyframes point-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.point-value {
  font-size: 48px;
  font-weight: 700;
  color: #FFA500;
  line-height: 1;
}

.point-label {
  font-size: 20px;
  color: #3a2b20;
  font-weight: 500;
}

/* 확인 버튼 */
.btn-confirm {
  width: 100%;
  padding: 14px;
  background: #3a2b20;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Ownglyph PDH', sans-serif;
}

.btn-confirm:hover {
  background: #2e1b0e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(58, 43, 32, 0.3);
}

.btn-confirm:active {
  transform: translateY(0);
}

/* 모달 페이드 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
