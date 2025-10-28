// src/api/photoReviewAnju.js
import axios from 'axios'

/* --------------------------------------------------------
 * 기본 설정
 * ------------------------------------------------------ */
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080';

// /query, /command 분리 (인증 쿠키/JWT를 고려해 withCredentials 켜둠)
export const queryApi = axios.create({
  baseURL: API_ORIGIN,
  withCredentials: true,
});

export const commandApi = axios.create({
  baseURL: API_ORIGIN,
  withCredentials: true,
});

function attachAuth(instance) {
  instance.interceptors.request.use((config) => {
    const raw =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('Authorization');
    if (raw) {
      const token = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
      config.headers = config.headers || {};
      config.headers.Authorization = token;
    }
    return config;
  });
}

attachAuth(queryApi);
attachAuth(commandApi);

// 공통 에러 로깅
function logErr(prefix, err) {
  const data = err?.response?.data;
  console.warn(`[${prefix}]`, data || err?.message || err);
}

/* --------------------------------------------------------
 * 유틸: 이미지 경로 정규화 (프론트/백 모두 커버)
 * ------------------------------------------------------ */
const FRONT_ORIGIN = window.location.origin;
export function resolveImg(rawUrl) {
  const url = String(rawUrl || '').replace(/\\/g, '/').trim();
  if (!url) return '';
  if (url.startsWith('data:') || /^https?:\/\//i.test(url)) return url;

  const lower = url.toLowerCase();

  // 백엔드 정적 매핑: /photo_review/**
  if (lower.includes('/photo_review/')) {
    return `${API_ORIGIN}${url.slice(lower.lastIndexOf('/photo_review/'))}`;
  }
  if (lower.includes('photoreview/')) {
    return `${API_ORIGIN}${url.slice(lower.lastIndexOf('photoreview/'))}`;
  }

  // 프론트 public 정적: /images/** 또는 images/**
  if (lower.includes('/images/')) {
    return `${FRONT_ORIGIN}${url.slice(lower.lastIndexOf('/images/'))}`;
  }
  if (lower.includes('images/')) {
    return `${FRONT_ORIGIN}/${url.slice(lower.lastIndexOf('images/'))}`;
  }

  // 기타는 API_ORIGIN 기준
  return `${API_ORIGIN}/${url.replace(/^\/+/, '')}`;
}

/* --------------------------------------------------------
 * 1) 사진 리뷰 생성 (본문만)
 *    req: { boardNo, memberNo, reviewTitle, reviewContent, reviewDate?, reviewLike? }
 *    return: { reviewNo }
 * ------------------------------------------------------ */
export async function createReview(body) {
  try {
    const { data } = await commandApi.post(`/command/photo-reviews`, body);
    // 기대 응답: { reviewNo: number }
    return data;
  } catch (err) {
    logErr('createReview', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 1-β) 사진 리뷰 생성 (본문 + 파일들)
 * files: File[] (input type="file" multiple)
 * ------------------------------------------------------ */
export async function createReviewWithFiles(body, files = []) {
  try {
    const fd = new FormData();
    // 본문 필드
    Object.entries(body || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    // 파일
    (files || []).forEach((f) => fd.append('files', f));

    const { data } = await commandApi.post(`/command/photo-reviews`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // { reviewNo }
  } catch (err) {
    logErr('createReviewWithFiles', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 2) 리뷰 상세 조회
 *  return 예시:
 *  {
 *    reviewNo, boardNo, memberNo, reviewTitle, reviewContent, reviewDate,
 *    reviewLike,
 *    files: [
 *      { prFileNo, prFileUrl, prFilePath, ... }
 *    ]
 *  }
 * ------------------------------------------------------ */
export async function fetchReviewDetail(reviewNo) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효하지 않습니다.');
  try {
    const { data } = await queryApi.get(`/query/photo-reviews/${n}`);
    return data;
  } catch (err) {
    logErr('fetchReviewDetail', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 3) 보드별 리뷰 목록 조회
 *  return: Array
 * ------------------------------------------------------ */
export async function fetchReviewsByBoard(boardNo) {
  const n = Number(boardNo)
  if (!Number.isFinite(n)) throw new Error('boardNo invalid')

  // 1) PathVariable 버전 우선 시도
  try {
    const { data } = await queryApi.get(`/query/photo-reviews/boards/${n}`)
    return Array.isArray(data) ? data : (data?.content || data?.items || data?.data || data?.list || [])
  } catch (err) {
    const code = err?.response?.status
    if (code !== 404) {
      // 404가 아니면 그대로 에러 전파
      console.warn('[fetchReviewsByBoard] boards/{id} 실패:', err?.response?.data || err)
      throw err
    }
  }

  // 2) 404면 query param 버전으로 폴백
  try {
    const { data } = await queryApi.get('/query/photo-reviews', { params: { boardNo: n } })
    return Array.isArray(data) ? data : (data?.content || data?.items || data?.data || data?.list || [])
  } catch (err) {
    console.warn('[fetchReviewsByBoard] ?boardNo= 폴백 실패:', err?.response?.data || err)
    throw err
  }
}

/* --------------------------------------------------------
 * 4) 댓글 목록
 *  return: Array
 * ------------------------------------------------------ */
export async function listComments(reviewNo) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효하지 않습니다.');
  try {
    const { data } = await queryApi.get(`/prc/${n}`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    logErr('listComments', err);
    return [];
  }
}

/* --------------------------------------------------------
 * 5) 댓글 등록
 *  body: { memberNo, content } 또는 { memberNo, prcDetail }
 * ------------------------------------------------------ */
export async function addComment(reviewNo, body) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효하지 않습니다.');

  // ① memberNo 우선, 없으면 memberId로 찾아서 치환
  let memberNo = Number(body?.memberNo ?? body?.member_no);
  if (!Number.isFinite(memberNo)) {
    // memberId만 있다면 localStorage나 별도 매핑으로 찾아보기
    const id = body?.memberId ?? body?.member_id ?? localStorage.getItem('memberId');
    if (!id) throw new Error('memberId/memberNo 둘 다 없습니다.');
    // 서버가 memberId → memberNo 조회용 API를 제공한다면 여기서 호출
    // 없으면 localStorage에서 캐시된 memberNo 사용
    const stored = Number(localStorage.getItem('memberNo'));
    if (Number.isFinite(stored)) memberNo = stored;
    else throw new Error('memberNo를 찾을 수 없습니다. 로그인 정보를 확인하세요.');
  }

  try {
    const payload = {
      memberNo,
      prcDetail: body?.prcDetail ?? body?.content ?? '',
      reviewNo: n,
    };
    const { data } = await commandApi.post(`/command/prc/reviews/${n}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (err) {
    logErr('addComment', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 6) 댓글 수정
 *  body: { memberNo, prcDetail }
 * ------------------------------------------------------ */
export async function updateComment(commentId, body) {
  const id = Number(commentId);
  if (!Number.isFinite(id)) throw new Error('commentId가 유효하지 않습니다.');
  try {
    const payload = {
      memberNo: body?.memberNo ?? body?.member_no ?? 1,
      prcDetail: body?.prcDetail ?? body?.content ?? '',
      reviewNo: body?.reviewNo,
    };
    const { data } = await commandApi.patch(`/command/prc/${id}`, payload);
    return data;
  } catch (err) {
    logErr('updateComment', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 7) 댓글 삭제
 * ------------------------------------------------------ */
export async function deleteComment(commentId, memberNo) {
  const id = Number(commentId);
  if (!Number.isFinite(id)) throw new Error('commentId가 유효하지 않습니다.');
  try {
    const params = {};
    if (memberNo != null) params.memberNo = Number(memberNo);

    const { data } = await commandApi.delete(`/command/prc/${id}`, {
      params,
    });
    return data;
  } catch (err) {
    logErr('deleteComment', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 8) 좋아요 상태 조회(내 상태)
 *  기대 엔드포인트: GET /query/photo-reviews/{id}/likes/me
 *  return: { liked: boolean, likeCount?: number }
 * ------------------------------------------------------ */
export async function fetchReviewLikeStatus(reviewNo) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효합니다.');
  try {
    const { data } = await queryApi.get(`/query/photo-reviews/${n}/likes/me`);
    return data;
  } catch (err) {
    // 404 등 미구현이면 null 반환
    if (err?.response?.status === 404) return null;
    logErr('fetchReviewLikeStatus', err);
    return null;
  }
}

/* --------------------------------------------------------
 * 9) 좋아요 토글(정석)
 *  기대 엔드포인트: POST /command/photo-reviews/{id}/likes
 *  req: { memberNo }
 *  return: { liked: boolean, likeCount: number }
 * ------------------------------------------------------ */
export async function toggleReviewLike(reviewNo, { memberNo }) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효하지 않습니다.');
  if (!Number.isFinite(Number(memberNo))) throw new Error('memberNo가 유효하지 않습니다.');
  try {
    const { data } = await commandApi.post(`/command/photo-reviews/${n}/likes`, {
      memberNo: Number(memberNo),
    });
    return data;
  } catch (err) {
    logErr('toggleReviewLike', err);
    throw err;
  }
}

/* --------------------------------------------------------
 * 10) (폴백용) 좋아요 카운트 조회
 *  기대 엔드포인트: GET /query/photo-reviews/{id}/likes/count
 *  return: number
 * ------------------------------------------------------ */
export async function fetchLikeCount(reviewNo) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효하지 않습니다.');
  try {
    const { data } = await queryApi.get(`/photo-reviews/${n}/likes/count`);
    // 서버가 { count: 10 } 또는 { likeCount: 10 } 로 줄 수도 있음
    if (typeof data === 'number') return data;
    return Number(data?.likeCount ?? data?.count ?? 0);
  } catch (err) {
    // 없으면 0
    if (err?.response?.status === 404) return 0;
    logErr('fetchLikeCount', err);
    return 0;
  }
}

/* --------------------------------------------------------
 * 11) (레거시/모킹) 좋아요 한 번 증가 전용
 *  실제로는 toggleReviewLike를 쓰는 걸 권장.
 * ------------------------------------------------------ */
export async function hitLike(reviewNo) {
  const n = Number(reviewNo);
  if (!Number.isFinite(n)) throw new Error('reviewNo가 유효하지 않습니다.');
  try {
    // 서버가 없으면 프론트만 카운트 올릴 수 있도록 폴백
    const { data } = await commandApi.post(`/photo-reviews/${n}/like-hit`);
    return Number(data?.likeCount ?? data?.count ?? 0);
  } catch (err) {
    // 엔드포인트가 없을 수도 있으니 폴백: 현재 카운트 조회 → +1
    const current = await fetchLikeCount(n);
    return current + 1;
  }
}

/* --------------------------------------------------------
 * 12) 프론트에서 상세 썸네일을 위한 헬퍼(옵션)
 *    - 리스트의 레코드에서 첫 번째 이미지를 추정
 * ------------------------------------------------------ */
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|bmp|webp|svg|heic|heif|avif)$/i;
const RAW_URL_KEYS = [
  'prFileUrl','fileUrl','url','path','pr_file_url','prFilePath','filePath','pr_file_path','file_path',
  'storedFilePath','storedFileName','stored_path','storedPath','saveFilePath','save_file_path','save_file_name',
  'uploadPath','uploadUrl','directory','location','originFilename','origin_file_name',
  'thumbnailUrl','thumbnailPath','imageUrl','imgUrl','imagePath','imgPath'
];
const FILE_COLLECTION_KEYS = [
  'files','reviewFiles','photoFiles','attachments','images','thumbnails','photos','photoList',
  'imageList','mediaList','fileDtoList','photoReviewFileList'
];
export function pickFirstImage(record) {
  if (!record || typeof record !== 'object') return '';
  // 우선 직접 키들 탐색
  const directCandidates = [
    record?.thumbnailUrl,
    record?.thumbnailPath,
    record?.imageUrl,
    record?.imgUrl,
    record?.imagePath,
    record?.imgPath,
    record?.photoUrl,
    record?.photo,
    record?.photoSrc,
    record?.photoURL,
    record?.photoPath,
    record?.mainImage,
    record?.mainImageUrl,
    record?.mainImagePath,
    record?.coverUrl,
    record?.cover,
    record?.thumbnail,
    record?.thumbnailImage,
    record?.fileUrl,
    record?.filePath,
    record?.file_path,
    record?.previewUrl,
    record?.firstImage,
    record?.image,
    record?.imageSrc,
    record?.img,
    record?.firstImageUrl,
    record?.mediaUrl,
    record?.mediaPath,
    record?.media,
    record?.resourceUrl,
  ];
  for (const c of directCandidates) {
    const resolved = resolveImg(c);
    if (resolved) return resolved;
  }

  // 배열 후보
  const arrayCandidates = [
    record?.imgUrls,
    record?.imgUrlList,
    record?.imageList,
    record?.images,
    record?.imageArray,
    record?.photos,
    record?.photoList,
    record?.thumbnails,
    record?.thumbnailList,
    record?.mediaList,
  ];
  for (const group of arrayCandidates) {
    if (!Array.isArray(group)) continue;
    const str = group.find((v) => typeof v === 'string' && v.trim());
    if (str) {
      const resolved = resolveImg(str);
      if (resolved) return resolved;
    }
    const obj = group.find((v) => v && typeof v === 'object');
    if (obj) {
      const raw = RAW_URL_KEYS.map((k) => obj[k]).find((v) => typeof v === 'string' && v.trim());
      const resolved = resolveImg(raw);
      if (resolved) return resolved;
    }
  }

  // files 같은 객체 배열 속성 탐색
  const nestedCollections = FILE_COLLECTION_KEYS.map((k) => record[k]).filter(Boolean);
  for (const col of nestedCollections) {
    const arr = Array.isArray(col) ? col : [col];
    for (const obj of arr) {
      if (!obj || typeof obj !== 'object') continue;
      for (const k of RAW_URL_KEYS) {
        const raw = obj[k];
        if (typeof raw === 'string' && raw.trim()) {
          const resolved = resolveImg(raw);
          if (resolved) return resolved;
        }
      }
      // 경로/파일명 분리되어 있는 경우 추정
      const entries = Object.entries(obj).filter(([, v]) => typeof v === 'string' && v.trim());
      const withExt = entries.filter(([, v]) => IMAGE_EXT_RE.test(v));
      const withSlash = withExt.find(([, v]) => v.includes('/') || v.includes('\\'));
      if (withSlash) {
        const resolved = resolveImg(withSlash[1]);
        if (resolved) return resolved;
      }
      if (withExt.length) {
        const filename = withExt[0][1].replace(/^\.?[/\\]+/, '');
        const pathCandidate = entries
          .map(([, v]) => v)
          .find((v) => /photo[\W_]?review/i.test(v) || /upload/i.test(v) || v.endsWith('/') || v.includes('\\'));
        const combined = pathCandidate
          ? `${pathCandidate.replace(/\\/g, '/').replace(/\/+$/, '')}/${filename}`
          : filename;
        const resolved = resolveImg(combined);
        if (resolved) return resolved;
      }
    }
  }

  return '';
}

/* --------------------------------------------------------
 * 멤버 프로필 조회 (memberNo → { memberNo, memberName, profileImageUrl })
 * 백엔드 엔드포인트는 상황에 맞게 하나라도 있으면 사용 (여러 경로 폴백)
 * ------------------------------------------------------ */
const _profileCache = new Map();

export async function fetchMemberProfile(memberNo) {
  const n = Number(memberNo);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (_profileCache.has(n)) return _profileCache.get(n);

  // 후보 엔드포인트들 중 성공하는 첫 번째를 사용
  const candidates = [
    `/query/members/${n}`,               // 권장
    `/query/profile/${n}`,               // 대안
    `/query/member/${n}`,                // 대안
    `/query/users/${n}`,                 // 대안
  ];

  for (const url of candidates) {
    try {
      const { data } = await queryApi.get(url);
      if (data) {
        const profile = normalizeProfile(data);
        _profileCache.set(n, profile);
        return profile;
      }
    } catch (_) { /* 다음 후보 시도 */ }
  }

  // 실패 시 최소 형태로 캐싱
  const fallback = { memberNo: n, memberName: `회원#${n}`, profileImageUrl: '' };
  _profileCache.set(n, fallback);
  return fallback;
}

function normalizeProfile(src) {
  // 다양한 키 호환
  const name =
    src.memberName ?? src.name ?? src.nickname ?? src.member_id ?? src.memberId ?? '익명';
  const img =
    src.profileImageUrl ?? src.profileUrl ?? src.profileImage ??
    src.avatarUrl ?? src.avatar ?? src.imageUrl ?? '';
  return { memberNo: Number(src.memberNo ?? src.id ?? src.member_no), memberName: String(name), profileImageUrl: img || '' };
}