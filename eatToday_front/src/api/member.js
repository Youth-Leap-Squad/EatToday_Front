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

// 관리자: 회원 목록 조회
export const getMemberList = async (page = 0, size = 10) => {
  const response = await api.get(`/members?page=${page}&size=${size}`)
  return response.data
}

// 관리자: 회원 상태 변경
export const updateMemberStatus = async (memberId, status) => {
  const response = await api.put(`/admin/members/${memberId}/status`, { status })
  return response.data
}

// 비밀번호 변경
export const changePassword = async (currentPassword, newPassword) => {
  const params = new URLSearchParams()
  params.append('currentPassword', currentPassword)
  params.append('newPassword', newPassword)
  
  const response = await api.post('/members/change-password', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return response.data
}

// 회원 탈퇴
export const withdrawMember = async (password) => {
  const response = await api.delete('/members', {
    params: { password }

  })
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

// 내 정보 조회 (이메일로 프로필 조회)
export const getMyInfo = async (email) => {
  const response = await api.get(`/members/getprofile-by-email?email=${email}`)
  return response.data
}


export const uploadProfileImage = async (memberNo, file, { direct = false } = {}) => {
  if (!memberNo) throw new Error('memberNo가 없습니다.')
  if (!file) throw new Error('업로드할 파일이 없습니다.')

  const fd = new FormData()
  fd.append('memberNo', String(memberNo)) // @RequestParam("memberNo")
  fd.append('file', file, file.name)      // @RequestPart("file")

  if (!direct) {
    const res = await api.post('/members/profile-image', fd) // 프록시 경유
    return res.data
  }

  // ✅ 프록시 우회(문제 원인 단번에 분리)
  const token = localStorage.getItem('token') || ''
  const res = await fetch('http://localhost:8080/members/profile-image', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// api/member.js
export const getProfileImageUrl = (memberNo, bust = '') => {
  const base = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')
  return `${base}/members/profile-image/${memberNo}${bust ? `?bust=${bust}` : ''}`
}