// src/api/createreport.js
import api from './index'

const two = n => String(n).padStart(2, '0')
const nowString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${two(d.getMonth()+1)}-${two(d.getDate())} ${two(d.getHours())}:${two(d.getMinutes())}`
}

export const createReport = async ({ reporterId, reportedId, title, content, source = 'MEMBER', reportDate }) => {
  const payload = {
    reporterId: Number(reporterId),
    reportedId: Number(reportedId),
    title,
    content,
    source,                              // 서버 enum이면 "MEMBER" 그대로
    reportDate: reportDate || nowString() // ← 꼭 넣기 (yyyy-MM-dd HH:mm)
  }

  // 디버깅 도움
  // console.log('createReport payload', payload)

  const { data } = await api.post('/reports', payload)
  return data
}