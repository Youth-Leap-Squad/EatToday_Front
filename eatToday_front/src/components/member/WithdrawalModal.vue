<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="withdrawal-title">
      <!-- 헤더 -->
      <header class="modal-head">
        <h3 id="withdrawal-title" class="title">회원 탈퇴</h3>
        <ModalCloseButton @close="close" />
      </header>

      <!-- 메인 메시지 -->
      <div class="main-message">
        <p class="message">잠깐만요! 아직 마시던 잔이 남아있어요</p>
        <p class="sub-message">탈퇴하시면 지금까지 모은 페어링 기록이 모두 사라집니다. 그래도 정말 나가시겠어요?</p>
      </div>

      <!-- 경고 메시지 -->
      <div class="warning-box">
        <p class="warning-text">탈퇴 시, 모든 스크랩과 게시물이 삭제되며 복구가 어렵습니다.</p>
      </div>

      <!-- 버튼들 -->
      <div class="button-group">
        <button class="btn-withdraw" @click="confirmWithdrawal">그래도 탈퇴할래요</button>
        <button class="btn-stay" @click="close">그냥 남을래요</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import ModalCloseButton from '@/common/modal/ModalCloseButton.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'confirm'])

function close() {
  emit('close')
}

function confirmWithdrawal() {
  emit('confirm')
}
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal */
.modal {
  width: 540px;
  max-width: calc(100% - 32px);
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 18px 20px 20px;
  background: #FFFDFB;
}

/* Head */
.modal-head {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: #2e1b0e;
}

/* 메인 메시지 */
.main-message {
  text-align: center;
  margin-bottom: 20px;
}

.message {
  font-size: 18px;
  font-weight: 700;
  color: #2e1b0e;
  margin-bottom: 12px;
}

.sub-message {
  font-size: 16px;
  color: #4b3a2a;
  line-height: 1.5;
}

/* 경고 박스 */
.warning-box {
  background: #fff5f5;
  border: 2px solid #ffebee;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 24px;
}

.warning-text {
  color: #d32f2f;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

/* 버튼 그룹 */
.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-withdraw {
  padding: 14px 16px;
  border: none;
  border-radius: 10px;
  background: #d32f2f;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-withdraw:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

.btn-stay {
  padding: 14px 16px;
  border: none;
  border-radius: 10px;
  background: #dabb8b;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-stay:hover {
  background: #c4a876;
  transform: translateY(-1px);
}

/* 반응형 */
@media (max-width: 560px) {
  .button-group {
    grid-template-columns: 1fr;
  }
  
  .message {
    font-size: 16px;
  }
  
  .sub-message {
    font-size: 14px;
  }
}
</style>
