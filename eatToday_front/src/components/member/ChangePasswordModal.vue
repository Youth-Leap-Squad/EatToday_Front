<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="pw-title">
      <!-- 헤더 -->
      <header class="modal-head">
        <h3 id="pw-title" class="title">비밀번호 변경</h3>
        <ModalCloseButton @close="close" />
      </header>

      <!-- 안내문 -->
      <ul class="guide">
        <li>비밀번호는 영문(대/소문자), 숫자, 특수문자를 조합해 사용해 주세요.</li>
        <li>생일, 전화번호 등 추측 가능한 정보는 사용하지 마세요.</li>
        <li>다른 서비스와 동일한 비밀번호는 위험합니다.</li>
      </ul>

      <!-- 폼 -->
      <div class="form">
        <label class="label" for="currentPw">현재 비밀번호</label>
        <input id="currentPw" type="password" v-model.trim="currentPw" class="input" placeholder="현재 비밀번호를 입력하세요" />

        <label class="label" for="pw">새로운 비밀번호</label>
        <input id="pw" type="password" v-model.trim="pw" class="input" placeholder="새로운 비밀번호" />

        <label class="label" for="pw2">새로운 비밀번호 확인</label>
        <input id="pw2" type="password" v-model.trim="pw2" class="input" placeholder="다시 입력해주세요" />

        <p v-if="msg" :class="{'ok': ok, 'err': !ok}" class="msg">{{ msg }}</p>

        <button class="btn-confirm" :disabled="!canSubmit" @click="submit">확인</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ModalCloseButton from '@/common/modal/ModalCloseButton.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'submit']) // submit 시 새 비밀번호 전달

const currentPw = ref('')
const pw = ref('')
const pw2 = ref('')
const msg = ref('')
const ok = ref(false)

const rule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/  // 영문+숫자+특수문자 8~20
const canSubmit = computed(() => 
  currentPw.value.length > 0 && 
  rule.test(pw.value) && 
  pw.value === pw2.value
)

function submit() {
  if (!canSubmit.value) {
    ok.value = false
    msg.value = '모든 항목을 정확히 입력해 주세요.'
    return
  }
  ok.value = true
  msg.value = '사용 가능한 비밀번호입니다.'
  console.log('현재 비밀번호:', currentPw.value)
  console.log('새 비밀번호:', pw.value)
  emit('submit', currentPw.value, pw.value)  // 현재 비밀번호와 새 비밀번호 전달
}

function close() {
  currentPw.value = ''
  pw.value = ''
  pw2.value = ''
  msg.value = ''
  ok.value = false
  emit('close')
}

</script>

<style scoped>
/* Overlay */
.overlay{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}

/* Modal */
.modal{
  width: 540px; max-width: calc(100% - 32px);
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
  padding: 18px 20px 20px;
  background: #FFFDFB;
}

/* Head */
.modal-head{ display:flex; align-items:center; justify-content:center; position: relative; margin-bottom: 8px; }
.title{ font-size: 20px; font-weight: 800; color:#2e1b0e; }

/* Guide list */
.guide{
  background:#fff; border:1px solid #ead7b7; border-radius:10px;
  padding:12px 14px; margin:10px 0 14px; color:#4b3a2a; font-size:14px;
}
.guide li{ margin-left: 18px; list-style: disc; }

/* Form */
.form{ background:#ffffff; }
.label{ display:block; margin:10px 0 6px; font-weight:800; color:#2e1b0e; }
.input{
  width:100%; padding:12px 14px; border:2px solid #ead7b7; border-radius:10px;
  background:#F9EEDA; outline:none; box-sizing:border-box;
}
.input:focus{ border-color:#DABB8B; }

/* Message */
.msg{ margin:8px 0; text-align:center; }
.ok{ color:#256b2f; }
.err{ color:#a01818; }


.btn-confirm{
  width: 100%; padding: 12px; margin-top: 6px;
  border:none; border-radius: 10px; cursor:pointer;
  background:#DABB8B; color:#fff; font-weight:800;
}
.btn-confirm:disabled{ opacity:.5; cursor:not-allowed; }
</style>
