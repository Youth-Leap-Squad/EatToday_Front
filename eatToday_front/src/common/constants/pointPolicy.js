/**
 * 백엔드 포인트 정책과 동일한 상수
 * PointPolicy.java 와 매칭
 */
export const POINT_POLICY = {
  LOGIN: { points: 30, description: '로그인' },
  POST_CREATE: { points: 50, description: '게시물 등록' },
  COMMENT_CREATE: { points: 5, description: '댓글 작성' },
  ALBTI_PARTICIPATE: { points: 10, description: '술BTI 이벤트 참여' },
  WORLDCUP_PARTICIPATE: { points: 10, description: '월드컵 게임 참여' },
  PHOTO_REVIEW_CREATE: { points: 25, description: '사진 리뷰 작성' }
}

/**
 * 포인트 정책을 쉽게 사용하기 위한 헬퍼 함수
 */
export function getPointInfo(type) {
  return POINT_POLICY[type] || { points: 0, description: '알 수 없음' }
}
