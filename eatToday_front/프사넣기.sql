-- ============================================
-- 프로필 이미지 할당 SQL 쿼리
-- ============================================

-- 옵션 1: 모든 회원에게 기본 이미지 할당 (가장 간단)
UPDATE member
SET profile_image_url = 'http://localhost:5173/images/user_profile/basic_profile.jpg'
WHERE profile_image_url IS NULL;


-- 옵션 2: 모든 회원에게 순차적으로 member_2.jpg부터 할당
-- (member_no 기준으로 순차 할당)
UPDATE member m1
INNER JOIN (
    SELECT 
        member_no,
        ROW_NUMBER() OVER (ORDER BY member_no) as rn
    FROM member
) m2 ON m1.member_no = m2.member_no
SET m1.profile_image_url = CONCAT('http://localhost:5173/images/user_profile/member_', (m2.rn + 1), '.jpg')
WHERE m2.rn <= 27;  -- member_2부터 member_28까지 총 27개 (모든 회원 덮어쓰기)

-- NULL만 업데이트하려면 아래 쿼리 사용:
-- WHERE m2.rn <= 27 AND m1.profile_image_url IS NULL;


-- 옵션 3: 특정 회원에게만 특정 이미지 할당 (예시)
-- UPDATE member
-- SET profile_image_url = 'http://localhost:5173/images/user_profile/member_3.jpg'
-- WHERE member_email = 'user@example.com';


-- 확인용: 프로필 이미지가 할당된 회원 확인
SELECT member_no, member_email, member_name, profile_image_url 
FROM member 
WHERE profile_image_url IS NOT NULL
ORDER BY member_no;


-- 확인용: 프로필 이미지가 없는 회원 확인
SELECT member_no, member_email, member_name, profile_image_url 
FROM member 
WHERE profile_image_url IS NULL
ORDER BY member_no;
