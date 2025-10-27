import axios from "axios";
// src/api/photoReviewAnju.js
import { queryApi, commandApi } from '@/api/http' // ✅ 공용 인스턴스 불러오기

/* =====================================================
   🌐 Axios 전역 설정
===================================================== */

// ✅ 기본 URL 및 공통 설정
axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true; // CORS 시 쿠키 포함

// ✅ JWT 토큰 자동 첨부
axios.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("Authorization")

  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`
  }
  return config
})

/* =====================================================
   🧩 공통 유틸
===================================================== */
function normalizeBoardParams(input) {
  if (typeof input === "number" || typeof input === "string") {
    const n = Number(input);
    if (!Number.isFinite(n)) throw new Error("boardNo가 유효한 숫자가 아닙니다");
    return { boardNo: n };
  }

  if (input && typeof input === "object") {
    const n = Number(input.boardNo);
    if (!Number.isFinite(n)) throw new Error("boardNo가 유효한 숫자가 아닙니다");
    const params = { boardNo: n };
    if (input.page !== undefined) params.page = input.page;
    if (input.size !== undefined) params.size = input.size;
    return params;
  }

  throw new Error("boardNo가 유효한 숫자가 아닙니다");
}

/* =====================================================
   📸 사진 리뷰 관련
===================================================== */

/** 게시판(안주)별 최신 리뷰 6개 조회 */
// src/api/photoReviewAnju.js 의 fetchReviewsByBoard 교체
export async function fetchReviewsByBoard(boardNoOrOptions) {
  const params = normalizeBoardParams(boardNoOrOptions)

  try {
    // ✅ 신버전 엔드포인트
    const { data } = await queryApi.get('/query/photo-reviews/latest', { params })
    return data
  } catch (err) {
    // 404면 구버전 엔드포인트로 폴백
    const status = err?.response?.status
    if (status === 404) {
      const { data } = await queryApi.get('/photoReview/date', { params })
      return data
    }
    throw err
  }
}

/** 사진 리뷰 상세 조회 */
export async function fetchReviewDetail(reviewNo) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error("reviewNo가 유효한 숫자가 아닙니다");
  const { data } = await queryApi.get(`/query/photo-reviews/${n}`);
  return data;
}

/** 최신순 조회 */
export async function fetchAnjuReviewsByDate({ anjuNo, page = 0, size = 10 }) {
  return fetchReviewsByBoard({ boardNo: anjuNo, page, size });
}

/** 좋아요순 조회 (현재 동일) */
export async function fetchAnjuReviewsByLike({ anjuNo, page = 0, size = 10 }) {
  return fetchReviewsByBoard({ boardNo: anjuNo, page, size });
}

/** 리뷰 생성 */
export async function createReview(review, files = []) {
  const fd = new FormData();
  fd.append("review", new Blob([JSON.stringify(review)], { type: "application/json" }));
  files.forEach((f) => fd.append("files", f));

  const { data } = await commandApi.post("/command/photo-reviews", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("📤 리뷰 등록 응답:", data);
  return data;
}

/** 리뷰 수정 (본문만) */
export async function updateReviewText(reviewNo, patch) {
  const { data } = await commandApi.patch(`/command/photo-reviews/${reviewNo}`, patch, {
    headers: { "Content-Type": "application/json" },
  });
  console.log("✏️ 리뷰 수정 응답:", data);
  return data;
}

/** 리뷰 수정 (파일 포함) */
export async function updateReviewWithFiles(reviewNo, patch, addFiles = [], deleteFileNos = []) {
  const fd = new FormData();
  if (patch && Object.keys(patch).length > 0) {
    fd.append("review", new Blob([JSON.stringify(patch)], { type: "application/json" }));
  }
  addFiles.forEach((f) => fd.append("addFiles", f));
  if (deleteFileNos && deleteFileNos.length > 0) {
    fd.append("deleteFileNos", new Blob([JSON.stringify(deleteFileNos)], { type: "application/json" }));
  }

  const { data } = await commandApi.patch(`/command/photo-reviews/${reviewNo}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("📸 리뷰 수정(파일) 응답:", data);
  return data;
}

/** 리뷰 삭제 */
export async function deleteReview(reviewNo) {
  const { data } = await commandApi.delete(`/command/photo-reviews/${reviewNo}`);
  console.log("🗑️ 리뷰 삭제 응답:", data);
  return data;
}

/* =====================================================
   💬 사진 리뷰 댓글 관련 (PRC 엔드포인트)
===================================================== */

/** 댓글 목록 조회
 * GET /prc/{reviewNo}
 */
export async function listComments(reviewNo) {
  const { data } = await queryApi.get(`/prc/${reviewNo}`);
  console.log("💬 댓글 목록:", data);
  return data;
}

/** 댓글 작성
 * POST /command/prc/reviews/{reviewNo}
 * body = { memberNo, content }
 */
// src/api/photoReviewAnju.js
export async function addComment(reviewNo, { memberNo, content }) {
  const text = String(content ?? '').trim()
  if (!text) throw new Error('댓글 내용을 입력하세요.')

  const payload = {
    memberNo,         // 필수
    prcDetail: text,  // ✅ 가장 유력한 DTO 필드명
    detail: text      // ✅ 혹시 DTO가 detail이면 이쪽으로 매핑됨
  }
  console.log('🛰 보내는 댓글 payload:', payload)

  const { data } = await commandApi.post(
    `/command/prc/reviews/${reviewNo}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  )
  return data
}

/** 댓글 수정
 * PATCH /command/prc/{prcNo}
 * body = { memberNo, content }
 */
export async function updateComment(prcNo, { memberNo, content }) {
  const id = Number(prcNo)
  if (!Number.isFinite(id)) throw new Error('prcNo가 유효하지 않아요.')

  const text = String(content ?? '').trim()
  if (!text) throw new Error('수정 내용을 입력하세요.')

  const payload = {
    memberNo,
    prcDetail: text,   // ✅ 핵심: content → prcDetail 로 전송
  }

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('Authorization')

  const { data } = await commandApi.patch(
    `/command/prc/${id}`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` } : {})
      },
      withCredentials: true,
    }
  )
  return data
}

/** 댓글 삭제
 * DELETE /command/prc/{prcNo}
 * body = { memberNo }
 */
export async function deleteComment(prcNo, memberNo) {
  const { data } = await commandApi.delete(`/command/prc/${prcNo}`, {
    data: { memberNo },
  });
  console.log("🗑️ 댓글 삭제 응답:", data);
  return data;
}

/* =====================================================
   📚 Export 묶음
===================================================== */
export default {
  fetchReviewsByBoard,
  fetchReviewDetail,
  fetchAnjuReviewsByDate,
  fetchAnjuReviewsByLike,
  createReview,
  updateReviewText,
  updateReviewWithFiles,
  deleteReview,
  listComments,
  addComment,
  updateComment,
  deleteComment,
};