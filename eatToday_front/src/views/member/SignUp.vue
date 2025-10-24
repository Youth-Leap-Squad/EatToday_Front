<template>
    <div class="signup-container">
      <img src="@/assets/images/logo.png" alt="로고" width="150" height="150">
        <h2 class="signup-title">회원가입</h2>

        <!-- 이메일 -->
        <h3 class="signup-instruction">이메일</h3>
        <input 
          type="email"
          placeholder="아이디로 사용할 이메일을 입력해 주세요"
          class="signup-input"
        >
          <button class="email-button">이메일 인증</button>

        <!-- 닉네임 -->
        <h3 class="signup-instruction">닉네임</h3>

        <input 
          type="text"
          placeholder="한글,영문,숫자 2~20자"
          class="signup-input"
        >

        <div class="email-option">
        <input type="checkbox" id="useEmailPrefix" v-model="useEmailPrefix" />
        <label for="useEmailPrefix">이메일 앞자리 사용</label>
        </div>

        <!-- 비밀번호   -->
        <h3 class="signup-instruction">비밀번호</h3>
        <input 
          type="password"
          placeholder="한글,영문,숫자,특수문자가 모두 들어간 8~20자"
          class="signup-input"
        >        
        <input 
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요."
          class="signup-input"
        >

        <button class="signup-submit-button">가입</button>

      

    </div>

</template>

<script setup>

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
</style>