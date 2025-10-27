import dayjs from 'dayjs'

const API_BASE = '/api'

export async function createQna({ memberNo, inquiryTitle, inquiryContent, token }) {
  const body = {
    memberNo,
    inquiryTitle,
    inquiryContent,
    inquiryAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }

  const res = await fetch(`${API_BASE}/qna-posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`요청 실패(${res.status}): ${text}`)
  }

  return res.json()
}