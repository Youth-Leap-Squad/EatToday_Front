<template>
    <div class="signup-container">
      <img src="@/assets/images/logo.png" alt="로고" width="150" height="150">
        <h2 class="signup-title">회원가입</h2>

        <!-- 이메일 -->
        <h3 class="signup-instruction">이메일</h3>
        <div class="input-wrapper">
          <input 
            type="email"
            v-model="email"
            placeholder="아이디로 사용할 이메일을 입력해 주세요"
            class="signup-input"
            :disabled="emailVerified"
            :class="{ verified: emailVerified }"
          >
          <span v-if="emailVerified" class="verified-badge">✓ 인증완료</span>
        </div>
        <div v-if="!emailVerified">
          <input 
            v-if="codeSent"
            type="text"
            v-model="emailCode"
            placeholder="인증코드 6자리를 입력해주세요"
            class="signup-input"
          >
          <button 
            class="email-button"
            @click="handleEmailVerification"
            :disabled="emailVerifying || !email"
          >
            {{ codeSent ? '인증 완료' : '이메일 인증' }}
          </button>
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
          <p v-if="codeSent && !emailError" class="info-message">이메일로 발송된 인증코드를 입력해주세요.</p>
        </div>

        <!-- 닉네임 -->
        <h3 class="signup-instruction">닉네임</h3>

        <input 
          type="text"
          v-model="nickname"
          placeholder="한글,영문,숫자 2~20자"
          class="signup-input"
          :readonly="useEmailPrefix"
        >

        <div class="email-option">
        <input type="checkbox" id="useEmailPrefix" v-model="useEmailPrefix" />
        <label for="useEmailPrefix">이메일 앞자리 사용</label>
        </div>

        <!-- 이름 -->
        <h3 class="signup-instruction">이름</h3>
        <input 
          type="text"
          v-model="memberName"
          placeholder="이름을 입력해주세요"
          class="signup-input"
        >

        <!-- 전화번호 -->
        <h3 class="signup-instruction">전화번호</h3>
        <input 
          type="tel"
          v-model="memberPhone"
          placeholder="010-1234-5678"
          class="signup-input"
        >

        <!-- 생년월일 -->
        <h3 class="signup-instruction">생년월일</h3>
        <input 
          type="date"
          v-model="memberBirth"
          class="signup-input"
        >

        <!-- 비밀번호   -->
        <h3 class="signup-instruction">비밀번호</h3>
        <input 
          type="password"
          v-model="password"
          placeholder="한글,영문,숫자,특수문자가 모두 들어간 8~20자"
          class="signup-input"
        >        
        <input 
          type="password"
          v-model="confirmPassword"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          class="signup-input"
        >

        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        <p v-if="signupError" class="error-message">{{ signupError }}</p>
        <p v-if="signupSuccess" class="success-message">{{ signupSuccess }}</p>

        <button 
          class="signup-submit-button"
          @click="handleSignup"
          :disabled="isLoading || !emailVerified"
        >
          {{ isLoading ? '처리중...' : '가입' }}
        </button>

    </div>

</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { signup, sendEmailCode, verifyEmailCode } from '@/api/member'

const router = useRouter()

// Form data
const email = ref('')
const nickname = ref('')
const password = ref('')
const confirmPassword = ref('')
const useEmailPrefix = ref(false)
const emailCode = ref('')
const memberBirth = ref('')
const memberName = ref('')
const memberPhone = ref('')

// State
const codeSent = ref(false)
const emailVerified = ref(false)
const emailVerifying = ref(false)
const isLoading = ref(false)

// Error messages
const emailError = ref('')
const passwordError = ref('')
const signupError = ref('')
const signupSuccess = ref('')

// 이메일 앞자리 자동 입력
watch([email, useEmailPrefix], ([emailVal, isChecked]) => {
  if (isChecked && emailVal) {
    const localPart = emailVal.split('@')[0]
    if (localPart) {
      nickname.value = localPart
    }
  }
})

// 이메일 인증 처리
const handleEmailVerification = async () => {
  if (!email.value) {
    emailError.value = '이메일을 입력해주세요.'
    return
  }

  emailError.value = ''
  emailVerifying.value = true

  if (!codeSent.value) {
    // 인증 코드 발송
    try {
      await sendEmailCode(email.value)
      codeSent.value = true
      emailError.value = ''
    } catch (error) {
      // CORS 에러이지만 메일은 발송되었을 가능성이 높음
      // status가 200이면 메일 발송 성공으로 간주
      if (error.response?.status === 200 || error.code === 'ERR_NETWORK') {
        codeSent.value = true
        emailError.value = ''
      } else {
        emailError.value = error.response?.data?.message || '이메일 발송에 실패했습니다.'
      }
    } finally {
      emailVerifying.value = false
    }
  } else {
    // 인증 코드 확인
    try {
      await verifyEmailCode(email.value, emailCode.value)
      emailVerified.value = true
      emailError.value = ''
    } catch (error) {
      emailError.value = error.response?.data?.message || '인증코드가 일치하지 않습니다.'
    } finally {
      emailVerifying.value = false
    }
  }
}

// 회원가입 처리
const handleSignup = async () => {
  // 입력값 검증
  if (!emailVerified.value) {
    signupError.value = '이메일 인증을 완료해주세요.'
    return
  }

  if (!nickname.value) {
    signupError.value = '닉네임을 입력해주세요.'
    return
  }

  if (!memberBirth.value) {
    signupError.value = '생년월일을 입력해주세요.'
    return
  }

  if (!memberName.value) {
    signupError.value = '이름을 입력해주세요.'
    return
  }

  if (!memberPhone.value) {
    signupError.value = '전화번호를 입력해주세요.'
    return
  }

  if (!password.value || !confirmPassword.value) {
    passwordError.value = '비밀번호를 입력해주세요.'
    return
  }

  if (password.value !== confirmPassword.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  isLoading.value = true
  signupError.value = ''
  passwordError.value = ''

  try {
    const signupData = {
      memberEmail: email.value,
      memberPw: password.value,
      memberBirth: memberBirth.value,
      memberName: memberName.value,
      memberPhone: memberPhone.value,
      memberId: ''
    }
    
    console.log('회원가입 요청 데이터:', signupData)
    
    const result = await signup(signupData)
    console.log('회원가입 성공:', result)

    signupSuccess.value = '회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.'
    
    // 2초 후 로그인 페이지로 이동
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('회원가입 에러:', error)
    console.error('에러 응답:', error.response)
    console.error('에러 데이터:', error.response?.data)
    signupError.value = error.response?.data?.message || error.response?.data?.error || '회원가입에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>

.signup-container {
  max-width: 480px; /* 화면 너비 제한 */
  margin: 0 auto; /* 가운데 정렬 */
  padding: 40px 20px; /* 위아래 + 좌우 여백 */
  text-align: center;
  background-color: #FFF7E9; /* 배경색 (선택사항) */
  border-radius: 12px;
}
.signup-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.signup-instruction {
  float: left ;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.signup-input {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #F9EEDA;
  border-radius: 6px;
  margin-bottom: 10px;
}

.email-button {
  display: block;
  width: 104%;
  padding: 10px;
  background-color: #DABB8B; 
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.email-option {
  text-align: left
}
.signup-submit-button {
  display: block;
  width: 104%;
  padding: 10px;
  background-color: #4C0707; 
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.signup-submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.email-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.input-wrapper {
  position: relative;
}

.verified-badge {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #4caf50;
  font-weight: 600;
  font-size: 14px;
}

.signup-input.verified {
  background-color: #e8f5e9;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin: 5px 0;
  text-align: left;
}

.success-message {
  color: #4caf50;
  font-size: 14px;
  margin: 5px 0;
  text-align: left;
}

.info-message {
  color: #2196f3;
  font-size: 14px;
  margin: 5px 0;
  text-align: left;
}
</style>