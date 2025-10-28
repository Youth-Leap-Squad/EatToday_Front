import api from './index'

// 신고 목록 조회
export const getReportList = async (page = 0, size = 10) => {
  const response = await api.get(`/report?page=${page}&size=${size}`)
  return response.data
}

// 신고 승인 (report_yn을 1로 변경)
export const approveReport = async (reportNo) => {
  const response = await api.post(`/api/reports/${reportNo}/confirm`)
  return response.data
}