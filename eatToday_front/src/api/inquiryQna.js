function parseJwt(t) {
    try {
      const p = t.split('.')[1]
      if (!p) return null
      const b64 = p.replace(/-/g, '+').replace(/_/g, '/')
      const pad = b64 + '='.repeat((4 - (b64.length % 4 || 4)) % 4)
      return JSON.parse(
        decodeURIComponent(
          atob(pad).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        )
      )
    } catch { return null }
  }
  
  export async function fetchMyInquiryQnas({ token, page = 0, size = 10 }) {
    if (!token) throw new Error('토큰이 없습니다.')
    const payload = parseJwt(token)
    const memberNo = payload?.memberNo
    if (!memberNo) throw new Error('토큰에 memberNo가 없습니다.')
    const url = `/api/qna/posts/member?memberNo=${memberNo}&page=${page}&size=${size}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`문의 조회 실패(${res.status}): ${text}`)
    }
    return res.json()
  }
  
  export async function fetchQnaDetail({ id, token }) {
    if (!id) throw new Error('id가 없습니다.')
    const res = await fetch(`/api/qna/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`상세 조회 실패(${res.status}): ${text}`)
    }
    return res.json()
  }
  
  export const fetchQnaComments = async ({ qnaPostNo, page = 0, size = 10, token }) => {
    const qs = new URLSearchParams({ qnaPostNo, page, size }).toString()
    const res = await fetch(`/api/qna/comments?${qs}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`댓글 조회 실패(${res.status}): ${text}`)
    }
    return res.json()
  }
  
  export async function updateQnaContent({ id, newContent, token }) {
    if (!id) throw new Error('id가 없습니다.')
    const res = await fetch(`/api/qna-posts/${id}?newContent=${encodeURIComponent(newContent)}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`수정 실패(${res.status}): ${text}`)
    }
    return res.text().catch(() => '')
  }
  
  export async function deleteQnaPost({ id, token }) {
    if (!id) throw new Error('id가 없습니다.')
    const res = await fetch(`/api/qna-posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`삭제 실패(${res.status}): ${text}`)
    }
    return true
  }