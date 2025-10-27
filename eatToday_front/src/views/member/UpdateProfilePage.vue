<template>
  <div class="page">
    <div class="card">
      <h2 class="page-title">마이페이지</h2>

      <form class="form" @submit.prevent="onSubmit">
        <h3 class="form-title">회원 정보 수정</h3>

        <!-- 이메일 (읽기 전용) -->
        <div class="row">
          <label for="email" class="label">이메일</label>
          <div class="field with-btn">
            <input id="email" v-model="form.email" type="email" class="input" readonly />
          </div>
        </div>

        <!-- 닉네임 -->
        <div class="row">
          <label for="nickname" class="label">닉네임</label>
          <div class="field">
            <input id="nickname" v-model.trim="form.nickname" type="text" maxlength="20" class="input" />
          </div>
        </div>

        <!-- 비밀번호 (마스킹 + 변경 버튼) -->
        <div class="row">
          <span class="label">비밀번호</span>
          <div class="field with-btn">
            <input type="password" class="input" value="********" readonly />
            <!-- 비번 변경 버튼 -->
            <button type="button" class="small-btn" @click="openChangePassword">비밀번호 변경</button>
          </div>
        </div>

        <!-- 이름 -->
        <div class="row">
          <label for="name" class="label">이름</label>
          <div class="field">
            <input id="name" v-model.trim="form.name" type="text" class="input" />
          </div>
        </div>

        <!-- 생년월일 -->
        <div class="row">
          <label for="birth" class="label">생년월일</label>
          <div class="field with-icon">
            <input id="birth" v-model="form.birth" type="date" class="input" />
            <span class="cal-ico" aria-hidden="true">📅</span>
          </div>
        </div>

        <!-- 전화번호 -->
        <div class="row">
          <label for="phone" class="label">전화번호</label>
          <div class="field">
            <input
              id="phone"
              v-model.trim="form.phone"
              type="tel"
              class="input"
              placeholder="010-1234-5678"
            />
          </div>
        </div>

        <!-- 회원 탈퇴/상태 -->
        <div class="row">
          <span class="label">회원 탈퇴</span>
          <div class="field with-btn">
            <input class="input" :value="statusText" readonly />
            <button type="button" class="small-btn" @click="toggleStatus">회원 탈퇴</button>
          </div>
        </div>

        <!-- 버튼들 -->
        <div class="actions">
          <button type="button" class="btn ghost" @click="onCancel">취소</button>
          <button type="submit" class="btn primary" :disabled="!canSubmit">
            수정 완료
          </button>
        </div>

        <!-- 메시지 -->
        <p v-if="msg" :class="{'ok': msgType==='ok', 'err': msgType==='err'}" class="msg">{{ msg }}</p>
      </form>
    </div>

    <!-- 비밀번호 변경 모달 -->
    <ChangePasswordModal 
      :visible="showChangePasswordModal" 
      @close="closeChangePasswordModal"
      @submit="onPasswordChangeSubmit"
    />

    <!-- 회원 탈퇴 모달 -->
    <WithdrawalModal 
      :visible="showWithdrawalModal" 
      @close="closeWithdrawalModal"
      @confirm="confirmWithdrawal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ChangePasswordModal from '@/components/member/ChangePasswordModal.vue'
import WithdrawalModal from '@/components/member/WithdrawalModal.vue'
import { changePassword, withdrawMember } from '@/api/member'

const router = useRouter()

const showChangePasswordModal = ref(false) // 비밀번호 변경 모달 표시 여부 관리
const showWithdrawalModal = ref(false) // 회원 탈퇴 모달 표시 여부 관리

// 로그인한 사용자 정보 불러오기
const getUserInfo = () => {
  const userEmail = localStorage.getItem('userEmail') || ''
  return {
    email: userEmail,
    nickname: '',
    name: '',
    birth: '',
    phone: '',
    active: true,
  }
}

// 실제 데이터는 API로 받아와 초기화해야함. (더미데이터임)
const form = ref(getUserInfo())

const statusText = computed(() => (form.value.active ? '활동 중' : '정지/탈퇴'))  // 

function toggleStatus() {
  showWithdrawalModal.value = true // 회원 탈퇴 모달 열기
}

function openChangePassword() {
  showChangePasswordModal.value = true // 버튼 클릭 시 모달 열기
}

function closeChangePasswordModal() {
  showChangePasswordModal.value = false // 모달 닫기
}

async function onPasswordChangeSubmit(currentPassword, newPassword) {
  try {
    await changePassword(currentPassword, newPassword)
    msgType.value = 'ok'
    msg.value = '비밀번호가 성공적으로 변경되었습니다.'
    showChangePasswordModal.value = false // 모달 닫기
  } catch (e) {
    msgType.value = 'err'
    msg.value = e.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.'
  }
}

function closeWithdrawalModal() {
  showWithdrawalModal.value = false // 회원 탈퇴 모달 닫기
}

async function confirmWithdrawal() {
  try {
    // TODO: 비밀번호 입력받아야 함 (임시로 빈 문자열 전달)
    await withdrawMember('')
    msgType.value = 'ok'
    msg.value = '회원 탈퇴가 완료되었습니다.'
    showWithdrawalModal.value = false // 모달 닫기
    
    // 탈퇴 후 로그인 페이지로 이동
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (e) {
    msgType.value = 'err'
    msg.value = e.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.'
  }
}



// 정규 표현식 이용해서 간단한 유효성 검사 (닉네임 2글자 이상 이름은 1자 이상 )
const canSubmit = computed(() =>
  form.value.nickname.length >= 2 &&
  form.value.name.length >= 1 &&
  /^\d{4}-\d{2}-\d{2}$/.test(form.value.birth) &&
  form.value.phone.length >= 10
)

const msg = ref('')
const msgType = ref('ok') // 'ok' | 'err'

async function onSubmit() {
  try {
    // TODO: 실제 API 호출
    // await http.put('/me', form.value)
    msgType.value = 'ok'
    msg.value = '수정이 완료되었습니다.'
  } catch (e) {
    msgType.value = 'err'
    msg.value = '수정 중 오류가 발생했습니다. 다시 시도해 주세요.'
  }
}

function onCancel() {
  // 이전 화면으로 이동하거나 원본 값으로 되돌리기
  history.back()
}
</script>

<style scoped>
/* 레이아웃 */
.page {
  max-width: 920px;
  margin: 40px auto;
  padding: 0 16px;
}
.card {
  background: #f6e9d3;
  border: 2px solid #e7d3b7;
  border-radius: 14px;
  padding: 18px;
}
.page-title {
  font-size: 18px;
  color: #6a513a;
  margin: 6px 0 14px 8px;
}
.form {
  background: #fdf4e5;
  border-radius: 12px;
  padding: 22px 18px;
}
.form-title {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 18px 4px;
  color: #2e1b0e;
}

/* 그리드 행 */
.row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 14px;
}
.label {
  text-align: left;
  font-weight: 800;
  color: #2e1b0e;
}

/* 입력 공통 */
.input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #ead7b7;
  background: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  outline: none;
}
.input:focus {
  border-color: #dabb8b;
}

/* 버튼들 */
.with-btn {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}
.small-btn {
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: #e5e1dd;
  color: #3a2b20;
  font-weight: 700;
  cursor: pointer;
}
.small-btn:hover { filter: brightness(0.96); }

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 18px;
}
.btn {
  padding: 14px 12px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}
.btn.ghost {
  background: #ddd2c7;
  color: #3a2b20;
}
.btn.primary {
  background: #d0ae7a;
  color: #fff;
}
.btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 달력 아이콘 */
.with-icon {
  position: relative;
}
.cal-ico {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 18px;
}

/* 메시지 */
.msg { margin-top: 10px; text-align: center; }
.ok { color: #256b2f; }
.err { color: #a01818; }

/* 반응형 */
@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; }
  .label { margin-bottom: -6px; }
}
</style>
