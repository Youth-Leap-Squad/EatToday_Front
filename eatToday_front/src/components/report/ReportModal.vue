<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click.self="onClose">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <button class="close" aria-label="닫기" @click="onClose">×</button>

        <h2 id="report-title" class="sr-only">신고 작성</h2>

        <div class="field">
          <label class="label">신고 제목:</label>
          <input
            class="input"
            type="text"
            v-model.trim="title"
            maxlength="100"
            placeholder="예) 욕설 신고"
            @keyup.enter="trySubmit"
          />
        </div>

        <div class="field">
          <label class="label">신고 내용</label>
          <textarea
            class="textarea"
            v-model.trim="content"
            rows="8"
            placeholder="상세 내용을 적어주세요."
          />
        </div>

        <div class="actions">
          <button class="btn ghost" type="button" :disabled="submitting" @click="onClose">취소</button>
          <button
            class="btn solid"
            type="button"
            :disabled="!canSubmit || submitting"
            @click="trySubmit"
          >
            {{ submitting ? '전송 중…' : '신고하기' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'submit'])

const title = ref('')
const content = ref('')
const submitting = ref(false)

const reset = () => {
  title.value = ''
  content.value = ''
  submitting.value = false
}

watch(
  () => props.open,
  v => {
    document.body.style.overflow = v ? 'hidden' : 'auto'
    if (v) reset()
  }
)

const onClose = () => emit('close')

// 최소 1자 이상 입력 시 활성화
const canSubmit = computed(() => {
  const t = title.value.trim()
  const c = content.value.trim()
  return t.length >= 1 && c.length >= 1
})

const trySubmit = async () => {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    emit('submit', { title: title.value, content: content.value })
  } finally {
    submitting.value = false
  }
}

// ESC로 닫기
const onKey = e => { if (e.key === 'Escape' && props.open) onClose() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: grid; place-items: center; z-index: 9999;
}
.modal {
  position: relative;
  width: min(720px, 92vw);
  background: #fff;
  border: 3px solid #1f1f1f;
  border-radius: 16px;
  padding: 28px 22px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}
/* 넘침 방지 */
.modal, .modal * { box-sizing: border-box; }

.close {
  position: absolute; top: 10px; right: 10px;
  width: 34px; height: 34px; border-radius: 8px; border: 2px solid #1f1f1f;
  background: #fff; font-size: 22px; line-height: 1; cursor: pointer;
}
.field { margin-top: 14px; }
.label { display: block; font-weight: 900; font-size: 18px; margin: 8px 4px; }

.input {
  width: 100%; max-width: 100%;
  padding: 10px 12px; border-radius: 10px; border: 2px solid #222; outline: none;
}
.textarea {
  width: 100%; max-width: 100%;
  padding: 12px; border-radius: 16px; border: 3px solid #222; outline: none; min-height: 220px;
}

.actions {
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;
}
.btn { padding: 10px 16px; border-radius: 999px; font-weight: 800; cursor: pointer; border: 1px solid transparent; }
.btn.ghost { background: #fff; border-color: #ddd; }
.btn.solid { background: #F2D5A7; border-color: #F2D5A7; color: #2B1F14; }
.sr-only { position: absolute; width: 1px; height: 1px; clip: rect(0,0,0,0); overflow: hidden; white-space: nowrap; }
</style>