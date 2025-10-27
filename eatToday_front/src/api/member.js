import api from './index'

// 회원가입
export const signup = async (userData) => {
  const response = await api.post('/members', userData)
  return response.data
}

// 이메일 중복 확인
export const checkEmail = async (email) => {
  const response = await api.get(`/members/check-email/${email}`)
  return response.data
}

// 이메일 인증 코드 발송
export const sendEmailCode = async (email) => {
  const response = await api.post(`/members/resend-verification?email=${email}`)
  return response.data
}

// 이메일 인증 코드 확인
export const verifyEmailCode = async (email, code) => {
  const response = await api.post(`/members/verify-code?email=${email}&code=${code}`)
  return response.data
}

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
  const response = await api.get(`/members/check-nickname/${nickname}`)
  return response.data
}

// 로그인
export const login = async (loginData) => {
  const response = await api.post('/login', loginData)
  return response.data
}

// 내 등급/이름 조회
export const findMyLevel = async (memberNo, token) => {
  const response = await api.get('/members/findmylevel', {
    params: { memberNo },
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}
