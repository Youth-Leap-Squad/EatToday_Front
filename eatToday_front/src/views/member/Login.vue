<template>
  <div class="login-container">
    <img src="@/assets/images/logo.png" alt="로고" class="logo" />
    <p class="sub">로그인 하고 나만의 술 조합을 찾아보세요</p>

    <label for="email" class="label">이메일</label>
    <input id="email" type="email" class="input" placeholder="example@eattoday.com" />

    <label for="pw" class="label">비밀번호</label>
    <input id="pw" type="password" class="input" placeholder="********" />

    <div class="row">
      <label class="remember">
        <input type="checkbox" /> 로그인 유지
      </label>
      <router-link to="/reset" class="aux">비밀번호를 잊으셨나요?</router-link>
    </div>

    <button class="login-btn">로그인</button>

    <hr class="divider" />

    <!-- 여기! 회원가입 진입 -->
    <p class="join">
      오늘 뭐람? 계정이 없으신가요?
      <router-link to="/signup" class="join-link">회원가입</router-link>
    </p>
  </div>
</template>

<style scoped>
.login-container{max-width:420px;margin:60px auto;padding:24px 20px;background:#fff7e9;border-radius:12px;text-align:center}
.logo{width:90px;height:auto;margin:0 auto 8px}
.sub{margin:4px 0 18px;color:#6b543f;font-size:14px}
.label{text-align:left;display:block;font-weight:700;margin:12px 0 6px}
.input{width:100%;padding:12px 14px;border:none;border-radius:6px;background:#f9eeda;margin-bottom:10px;box-sizing:border-box}
.row{display:flex;justify-content:space-between;align-items:center;margin:6px 0 16px}
.remember{display:flex;align-items:center;gap:6px;color:#3a2b20}
.aux{font-size:13px;color:#7b5d3d;text-decoration:none}
.login-btn{width:100%;padding:12px;border:none;border-radius:6px;background:#dabb8b;color:#fff;font-weight:700;cursor:pointer}
.divider{border:none;height:1px;background:#ead7b7;margin:20px 0}
.join{font-size:14px;color:#3a2b20}
.join-link{margin-left:6px;font-weight:700;color:#4c0707;text-decoration:underline}
</style>
