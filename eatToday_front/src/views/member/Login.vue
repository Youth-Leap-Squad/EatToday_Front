<template>
  <div class="login-container">
    <img src="@/assets/images/logo.png" alt="로고" class="logo" />
    <p class="sub">로그인 하고 나만의 술 조합을 찾아보세요</p>

    <label for="email" class="label">이메일</label>
    <input 
      id="email" 
      type="email" 
      class="input" 
      placeholder="example@eattoday.com"
      v-model="email"
    />

    <label for="pw" class="label">비밀번호</label>
    <input 
      id="pw" 
      type="password" 
      class="input" 
      placeholder="********"
      v-model="password"
    />

    <div class="row">
      <label class="remember">
        <input type="checkbox" v-model="rememberMe" /> 로그인 유지
      </label>
      <router-link to="/reset" class="aux">비밀번호를 잊으셨나요?</router-link>
    </div>

    <button class="login-btn" @click="handleLogin" :disabled="isLoading">
      {{ isLoading ? '로그인 중...' : '로그인' }}
    </button>

    <p v-if="errorMessage" :class="errorMessage.includes('성공') ? 'success-message' : 'error-message'">{{ errorMessage }}</p>

    <hr class="divider" />

    <!-- 여기! 회원가입 진입 -->
    <p class="join">
      오늘 뭐랑? 계정이 없으신가요?
      <router-link to="/signup" class="join-link">회원가입</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/member'

const router = useRouter()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// 로그인 처리
const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

    try {
    const response = await login({
      memberEmail: email.value,
      memberPw: password.value
    })

    console.log('로그인 응답:', response)

    // 토큰 저장 (백엔드는 accessToken으로 보내므로 맞춰줌)
    const token = response.accessToken || response.token
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('isLoggedIn', 'true')
      
      // 로그인 상태 저장 (rememberMe 옵션에 따라)
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      // 같은 탭 헤더 즉시 갱신
      console.log('로그인 성공! 이벤트 발행:', token)
      window.dispatchEvent(new Event('loginStatusChanged'))
    } else {
      console.error('토큰이 없습니다:', response)
    }

    // 성공 메시지 표시
    errorMessage.value = '로그인에 성공했습니다!'
    
    // 1초 후 메인 페이지로 이동
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '로그인에 실패했습니다.'
    console.error('로그인 에러:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container{
  max-width:420px;
  margin:60px auto;
  padding:24px 20px;background:#fff7e9;
  border-radius:12px;
  text-align:center
}
.logo{
  width:90px;
  height:auto;
  margin:0 auto 8px}

.sub{
  margin:4px 0 18px;
  color:#6b543f;
  font-size:14px
}

.label{
  text-align:left;
  display:block;
  font-weight:700;
  margin:12px 0 6px
}

.input{
  width:100%;
  padding:12px 14px;border:none;
  border-radius:6px;background:#f9eeda;
  margin-bottom:10px;box-sizing:border-box}
.row{display:flex;justify-content:space-between;
  align-items:center;margin:6px 0 16px}
.remember{display:flex;align-items:center;gap:6px;
  color:#3a2b20
}

.aux{
  font-size:13px;
  color:#7b5d3d;
  text-decoration:none
}

.login-btn
{
  width:100%;padding:12px;
  border:none;
  border-radius:6px;background:#dabb8b;
  color:#fff;font-weight:700;
  cursor:pointer
}

.divider{
  border:none;
  height:1px;
  background:#ead7b7;
  margin:20px 0
}

.join{
  font-size:14px;
  color:#3a2b20
}

.join-link{
  margin-left:6px;
  font-weight:700;
  color:#4c0707;
  text-decoration:underline
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 10px;
}

.success-message {
  color: #4caf50;
  font-size: 14px;
  margin-top: 10px;
  font-weight: 600;
}

</style>
