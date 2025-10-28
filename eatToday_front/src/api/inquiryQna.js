// src/api/inquiryQna.js

function parseJwt(t) {
  try {
    const p = t.split('.')[1];
    if (!p) return null;
    const b64 = p.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64 + '='.repeat((4 - (b64.length % 4 || 4)) % 4);
    return JSON.parse(
      decodeURIComponent(
        atob(pad)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
  } catch {
    return null;
  }
}

// "yyyy-MM-dd HH:mm:ss"
function nowYmdHms() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/* ========================= 내 문의 ========================= */

export async function fetchMyInquiryQnas({ token, page = 0, size = 10 }) {
  if (!token) throw new Error('토큰이 없습니다.');
  const memberNo = parseJwt(token)?.memberNo;
  if (!memberNo) throw new Error('토큰에 memberNo가 없습니다.');

  const url = `/api/qna/posts/member?memberNo=${memberNo}&page=${page}&size=${size}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`문의 조회 실패(${res.status}): ${text}`);
  }
  return res.json();
}

/* ========================= 상세/댓글 조회 ========================= */

export async function fetchQnaDetail({ id, token }) {
  if (!id) throw new Error('id가 없습니다.');
  const res = await fetch(`/api/qna/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`상세 조회 실패(${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchQnaComments({ qnaPostNo, page = 0, size = 10, token }) {
  const qs = new URLSearchParams({ qnaPostNo, page, size }).toString();
  const res = await fetch(`/api/qna/comments?${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`댓글 조회 실패(${res.status}): ${text}`);
  }
  return res.json();
}

/* ========================= 글 수정/삭제 ========================= */

export async function updateQnaContent({ id, newContent, token }) {
  if (!id) throw new Error('id가 없습니다.');
  const res = await fetch(`/api/qna/posts/${id}?newContent=${encodeURIComponent(newContent)}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`수정 실패(${res.status}): ${text}`);
  }
  return res.text().catch(() => '');
}

export async function deleteQnaPost({ id, token }) {
  if (!id) throw new Error('id가 없습니다.');
  const res = await fetch(`/api/qna/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`삭제 실패(${res.status}): ${text}`);
  }
  return true;
}

/* ========================= 관리자 목록/검색 ========================= */

export async function fetchAllQnaDate({ page, size, token }) {
  const qs = new URLSearchParams({ page, size }).toString();
  const res = await fetch(`/api/qna/posts/date?${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`목록 조회 실패(${res.status}): ${text}`);
  }
  return res.json();
}

export async function searchQna({ keyword, page, size, token }) {
  const qs = new URLSearchParams({ keyword, page, size }).toString();
  const res = await fetch(`/api/qna/posts/search?${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`검색 실패(${res.status}): ${text}`);
  }
  return res.json();
}

/* ========================= 댓글 등록/수정/삭제 ========================= */

export async function createQnaComment({ qnaPostNo, content, token }) {
  if (!qnaPostNo) throw new Error('qnaPostNo가 없습니다.');
  const memberNo = parseJwt(token)?.memberNo;
  if (!memberNo) throw new Error('토큰에서 memberNo를 찾을 수 없습니다.');

  const payload = {
    qnaPostNo: Number(qnaPostNo),
    commentMemberNo: Number(memberNo), // DTO 요구
    comment: content,                  // DTO 요구
    createdAt: nowYmdHms(),            // DTO 요구
  };

  const res = await fetch(`/api/qna-comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`답변 등록 실패(${res.status}): ${t}`);
  }
  return res.json();
}

export async function updateQnaComment({ commentId, content, token }) {
  if (!commentId) throw new Error('commentId가 없습니다.');
  const res = await fetch(`/api/qna-comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ comment: content }) // DTO 요구
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`답변 수정 실패(${res.status}): ${t}`);
  }
  return true;
}

export async function deleteQnaComment({ commentId, token }) {
  if (!commentId) throw new Error('commentId가 없습니다.');
  const res = await fetch(`/api/qna-comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`답변 삭제 실패(${res.status}): ${t}`);
  }
  return true;
}