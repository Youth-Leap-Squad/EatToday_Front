# 오늘! 뭐랑? : 술-안주 페어링 커뮤니티 & 추천 서비스

<p align="center">
  <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%ED%8F%AC%EC%8A%A4%ED%84%B0_%EC%9C%84%EC%95%84%EB%9E%98%20%EC%9E%90%EB%A5%B8%20%EB%B2%84%EC%A0%84.jpg" width="45%"/>
</p>


<h1>오늘의 술, 딱 맞는 안주. 오늘! 뭐랑?</h1>

> **오늘 마실 술, 뭐랑 먹을까?** 취향 기반으로 술-안주 페어링을 추천하고, 후기와 레시피, 페어링 팁을 공유하는 커뮤니티입니다.

---

## 📖 목차

#### [😊 조원 소개](#-조원-소개)  <br>

#### [📌 프로젝트 소개](#-프로젝트-소개)  <br>

#### [🧷 프로젝트 배경](#-프로젝트-배경)  <br>

#### [⭐ 주요 기능](#-주요-기능)  <br>

#### [🛠️ 기술 스택](#-기술-스택)  <br>

#### [🧱 아키텍처 & CQRS](#-아키텍처--cqrs)  <br>

#### [📋 관리 및 계획](#-관리-및-계획) <br>

#### [🗂️ 데이터 및 구조](#data-structure) <br>

#### [🏗️ 설계 및 아키텍처](#architecture) <br>

#### [🔌 인터페이스 및 API](#interface) <br> 

#### [✅ 테스트 및 품질](#-테스트-및-품질) <br>

#### [🔭 회고록](#-회고록)  <br>

---

## 😊 조원 소개

<table style="width:100%;">
  <thead>
    <tr align="center">
      <th>팀원</th>
      <th>팀원</th>
      <th>팀원</th>
      <th>팀원</th>
      <th>팀원</th>
    </tr>
  </thead>
  <tbody>
    <tr align="center">
      <td>
        <a href="https://github.com/Yunji458" target="_blank">
          <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%EC%9D%B4%EA%B5%AC%EB%A1%9C.jpg" width="210" style="border-radius:100%" alt="김윤지"/><br/>
          <b>김윤지</b>
        </a>
      </td>
      <td>
        <a href="https://github.com/pilltong22" target="_blank">
          <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%ED%95%98%EC%BF%A0%EC%A7%80.jpg" width="210" style="border-radius:100%" alt="김진호"/><br/>
          <b>김진호</b>
        </a>
      </td>
      <td>
        <a href="https://github.com/woo-kyoung-nam" target="_blank">
          <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%EA%B5%90%EB%A9%94%EC%9D%B4_%EC%9A%B0%E3%85%95%E3%84%B1%E3%85%87.jpg" width="210" style="border-radius:100%" alt="배태용"/><br/>
          <b>남우경</b>
        </a>
      </td>
      <td>
        <a href="https://github.com/leejaeguen" target="_blank">
          <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%EC%A0%A0%EC%9D%B4%EC%B8%A0.jpg" width="210" style="border-radius:100%" alt="송형석"/><br/>
          <b>이재근</b>
        </a>
      </td>
      <td>
        <a href="https://github.com/golealda" target="_blank">
          <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%ED%98%84%EC%88%98_%EC%9D%B4%EB%85%B8%EC%8A%A4%EC%BC%80.jpg" width="210" style="border-radius:100%" alt="허창훈"/><br/>
          <b>이현수</b>
        </a>
      </td>
    </tr>
  </tbody>
</table>


---

## 📌 **프로젝트 소개**

**오늘! 뭐랑?** 은 사용자의 **술 취향**과 **상황**을 기반으로, 가장 잘 어울리는 **안주/요리 페어링**을 추천하고 그 결과를 **커뮤니티**에서 공유·토론할 수 있게 만든 서비스입니다.
<br>
* 🧪 **페어링 추천 엔진**: 술(소주/맥주/와인/사케/위스키 등)과 안주 태그(매콤/담백/기름짐/바삭/풍미 등) 매칭 점수 기반 추천
<br><br>
* 📝 **레시피/후기/사진 공유**: 누구나 요리·페어링 레시피와 맛 노트를 카드 형태로 게시
<br><br>
* 💬 **취향형 반응(리액션) 4종**: `술술 들어가요` · `참신해요` · `맛없어요` · `궁금해요`
<br><br>
* 🛡️ **안전한 커뮤니티**: 신고/블랙리스트, 운영자 승인 게시물 업로드 로직, 버전 이력 관리
<br><br>
* 📅 **SNS 기능**: 내가 쓴 글/댓글/즐겨찾기/팔로우, 사진 리뷰와 라운지 기능
<br><br>
  
   

---

## 🧷 프로젝트 배경

<div style="display: flex; justify-content: center; gap: 20px;">
  <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%EC%88%A0%20%EA%B5%AC%EB%8F%85%20%EC%84%9C%EB%B9%84%EC%8A%A4%20%EC%9D%B4%EC%9A%A9%20%EA%B3%A0%EA%B0%9D%20%EB%B9%84%EC%A4%91%20%EC%A6%9D%EA%B0%80(20,30%EB%8C%80).jpg?raw=true" width="400" />
  <img src="https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/%ED%99%88%EC%88%A0%20%ED%8A%B8%EB%A0%8C%EB%93%9C_%EC%88%98%EC%A0%95%EB%B3%B8.jpg?raw=true" width="400" />
</div>


### (1). 20‧30대 술 구독 서비스 증가 → 다양한 술과 안주에 대한 관심 증가

* 구독 서비스로 접하는 새로운 주류가 많아지면서, 소비자들은 어떤 안주와 조합해야 할지 고민이 늘어남.

### (2). 홈술 / 혼술 트렌드 → 집에서 즐길 수 있는 술-안주 페어링 수요 증가

* 집에서 혼자 또는 소규모로 술을 즐기는 문화 확산 → 간편하지만 잘 어울리는 안주 정보 필요.

### (3). 후기·레시피 공유 니즈 증가 → 커뮤니티 기반 페어링 플랫폼 필요

*  사용자들은 단순히 먹고 마시는 것을 넘어서 직접 경험을 공유하고 싶어 함.

*  SNS, 블로그 등 파편화된 정보 대신 한 곳에서 후기·레시피·페어링 팁을 교류할 수 있는 장이 부족함.

---

## ⭐ 주요 기능

### 🧪 추천 & 탐색

* **즉석 추천**: 술 종류 선택 → 안주 후보 (조회순/최신순) 탐색 가능 

* **카테고리 탐색**: 술 종류/조리법/맛 태그/지역 안주 필터

* **설명 가능한 추천**: 매칭 근거(향/지방/매운맛 등 점수) 배지 표기

### 📰 커뮤니티

* **게시글/댓글/파일첨부/라운지**: 자유로운 정보 공유와 참여
  
* **리액션 4종**: `술술 들어가요` · `참신해요` · `맛없어요` · `궁금해요`
  
* **신고/블랙리스트**: 운영자 승인시 게시글 게시 / 신고 일정 횟수시 활동정지

### 📸 SNS

* 내 페어링 기록, 즐겨찾기(북마크), 작성글/댓글/신고내역
  
* **사진 리뷰/라운지**: 다른 사용자에게 추천받은 안주에 대한 리뷰 / 리뷰들을 한눈에 볼 수 있는 라운지 기능

### 🎉 이벤트

* **술BTI**:  설문 기반으로 주량·주종 성향을 재미있게 알아보는 테스트

* **월드컵 게임**: 후보(술/안주)를 토너먼트 방식으로 선택해 최종 우승자 결정 -> 랭킹으로 조회 가능

---


## 📡 기술 스택

### Backend
![Java 17](https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### Test & Docs
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)


###  Tools & Collaboration
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![ERD_Cloud](https://img.shields.io/badge/ERD_Cloud-4A90E2?style=for-the-badge&logo=cloud&logoColor=white)
![IntelliJ](https://img.shields.io/badge/IntelliJIDEA-4CAF50.svg?style=for-the-badge&logo=intellij-idea&logoColor=white)
![HeidiSQL](https://img.shields.io/badge/HeidiSQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

<br>




## 🧵 와이어 프레임

🔗 <a href="https://www.figma.com/design/90WPzr1D3kITviLanI7y3Z/%EC%98%A4%EB%8A%98--%EB%AD%90%EB%9E%91-?node-id=1397-484&t=bzCRavLa4pprtiJd-1"> 와이어 프레임 자세히 보기 </a>

<br>

<img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/img/%EC%99%80%EC%9D%B4%EC%96%B4%ED%94%84%EB%A0%88%EC%9E%84.png" alt="와이어-프레임-최종본" width="800"/><br>

<br><br>

## 🪄 스토리 보드

<details>
     <summary><b>공통</b></summary><br>
  <details>
          <summary>header</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EA%B3%B5%ED%86%B5/%ED%97%A4%EB%8D%94.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>footer</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EA%B3%B5%ED%86%B5/%ED%91%B8%ED%84%B0.png" width = "600"/><br>
	          </p>
  </details>
</details>

<details>
     <summary><b>사진 리뷰</b></summary><br>
  <details>
	  <summary>목록</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%EB%AA%A9%EB%A1%9D.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>작성</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%EC%9E%91%EC%84%B1.png" width = "600"/><br>
	          </p>
  </details>
	<details>
        <summary>상세페이지</summary><br>
	        <p alian="center">
	        <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80.png" width = "600"/><br>
	          </p>
  </details>
</details>

<details>
     <summary><b>이벤트</b></summary><br>
	<p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%9D%B4%EB%B2%A4%ED%8A%B8%ED%99%88%ED%99%94%EB%A9%B4.png" width = "600"/><br>
	          </p>
		<details>
          <summary>월드컵 게임</summary><br>
			<details>
          <summary>술 선택 화면</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B2%8C%EC%9E%84%20%EC%88%A0%EC%84%A0%ED%83%9D%20%ED%99%94%EB%A9%B4.png" width = "600"/><br>
	          </p>
  	</details>
	<details>
          <summary>게임 진행</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B2%8C%EC%9E%84%20%EC%A7%84%ED%96%89.png" width = "600"/><br>
	          </p>
  	</details>
	<details>
          <summary>최종 우승 안주</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B2%8C%EC%9E%84%20%EC%B5%9C%EC%A2%85%EC%9A%B0%EC%8A%B9%EC%95%88%EC%A3%BC.png" width = "600"/><br>
	          </p>
  	</details>
				<details>
          <summary>주간 월드컵 순위</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B2%8C%EC%9E%84%20%EC%A3%BC%EA%B0%84%EC%9B%94%EB%93%9C%EC%BB%B5%EC%88%9C%EC%9C%84.png" width = "600"/><br>
	          </p>
  	</details>
  		</details>
  			<details>
	  			<summary>술BTI</summary><br>
				<details>
          <summary>설문지</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%88%A0Bti%20%EC%84%A4%EB%AC%B8%EC%A7%80.png" width = "600"/><br>
	          </p>
  	</details>
		<details>
          <summary>결과 화면</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%9D%B4%EB%B2%A4%ED%8A%B8/%EC%88%A0Bti%20%EA%B2%B0%EA%B3%BC%ED%99%94%EB%A9%B4.png" width = "600"/><br>
	          </p>
		</details>
  </details>
</details>

  
  <br><br>

## 📰 WBS

🔗 <a href="https://docs.google.com/spreadsheets/d/1wRZSPEhjhj0SsW3NB7papSM6vu2WulmTOoR9Q8WDOJY/edit?gid=1596719811#gid=1596719811"> WBS 자세히 보기 </a>

<br>

<img src ="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/img/Front_WBS.png" width ="800" />

<br><br>



## 📱 테스트 케이스

### 📄 공통 부분
<details>
     <summary><b>공통 부분</b></summary><br>
  <details>
          <summary>메인 페이지 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/common/mainpage.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>오류 페이지</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/common/TEST_오류_페이지.gif" width = "600"/><br>
	          </p>
  </details>
</details>

### 👤 회원
<details>
     <summary><b>회원</b></summary><br>
  <details>
          <summary>회원가입</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/SignUp.gif" width = "600"/><br>
	          </p>
  </details>
	<details>
		<summary>로그인</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/Login.gif" width = "600"/><br>
	          </p>
	</details>
	<details>
		<summary>회원 정보 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/MemberInfo.gif" width = "600"/><br>
	          </p>
	</details>
	<details>
		<summary>회원 정보 수정</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/MemberInfo-fetch.gif" width = "600"/><br>
	          </p>
	</details>
	<details>
		<summary>프로필 페이지 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/MemberProfile.gif" width = "600"/><br>
	          </p>
	</details>
	<details>
		<summary>깃허브 연결하기</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/info/TEST_회원_깃_인증하기.gif" width = "600"/><br>
	          </p>
	</details>
	<details>
		<summary>로그아웃</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/member/MemberLogout.gif" width = "600"/><br>
	          </p>
	</details>
</details>

### 📜 게시글
<details>
	<summary><b>게시판</b></summary>
	<details>
		<summary>자유 게시판 조회</summary>
		<p alian="center">
		<img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/post/post-게시판 사이드바-단일 게시글 조회.gif"  width="600"/>
		</p>
	</details>
	<details>
		<summary>단일 게시글 조회</summary>
		<p alian="center">
		<img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/post/post-게시판 사이드바-단일 게시글 조회.gif"  width="600"/>
		</p>
	</details>
	<details>
		<summary>게시글 쓰기 페이지</summary>
		<p alian="center">
		<img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/post/post-글쓰기창 진입.gif"  width="600"/>
		</p>
	</details>
</details>

### 🤼 매칭
<details>
     <summary><b>매칭</b></summary><br>
  <details>
          <summary>랜덤 매칭 생성</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/랜덤매칭생성.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>매칭 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/매칭조회.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>사설 매칭 생성</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/사설매칭생성.gif" width = "600"/><br>
	          </p>
  </details>  
  <details>
          <summary>사설 매칭 입장</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/사설매칭입장.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>사이드 바 매칭 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/사이드바로매칭조회.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>헤더 랜덤 매칭 생성</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/프로젝트매칭_랜덤매칭생성.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>헤더 랜덤 매칭 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/프로젝트매칭_매칭조회.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>헤더 사설 매칭 생성</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/프로젝트매칭_사설매칭생성.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>헤더 사설 매칭 입장</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/프로젝트매칭_사설매칭입장.gif" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>헤더 프로젝트 매칭 페이지</summary><br>
	          <p alian="center">
	          <img src="https://github.com/BE14-NoB/pick-frontend/blob/main/resources/test_result/matching/프로젝트매칭페이지.gif" width = "600"/><br>
	          </p>
  </details>
</details>

### 🎖️ 이벤트
<details>
	  <summary>월드컵 게임</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/event/%EC%9B%94%EB%93%9C%EC%BB%B5%EA%B2%8C%EC%9E%84.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>술BTI</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/event/%EC%88%A0Bti.gif" width = "600"/><br>
		  </p>
</details>



## 🔭 회고록


-  [📄 발표자료 (PDF 보기)](https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/19_2nd_backendproject_presentation.pdf)
<br>

|   조원 이름	  |   회고   |
|---------------|----------|
|   **김윤지**   | 이번 프로젝트는 제게 개발자로서 한 단계 성장할 수 있는 중요한 경험이었습니다. DDD, ERD, MyBatis, JPA, MSA 등 낯설고 방대한 기술들을 실제로 적용하면서 처음에는 막막했지만 시간이 지날수록 두려움이 자신감으로 바뀌었습니다. 특히 게시글 기능을 담당하며 CRUD 구현 과정에서 JPA 매핑 오류와 MyBatis 쿼리 처리 문제로 어려움을 겪었지만 이를 해결하며 각 기술의 장단점을 체득할 수 있었습니다. 특히 게시글 도메인을 정의하고 ERD로 관계를 구조화하는 과정에서 데이터 흐름을 이해하는 능력이 크게 향상되었습니다. 또한 MSA 기반으로 서비스를 독립적으로 설계하면서 다른 팀원이 맡은 인증이나 추천 기능과 안정적으로 연동되도록 고민했던 경험은 협업적 관점에서 의미가 컸습니다. 프로젝트 초반 충분한 설계 덕분에 후반부 개발이 수월했음을 체감했고 문제 상황마다 팀원들과 의견을 나누며 해결책을 찾아가는 과정에서 함께 일하는 즐거움을 느낄 수 있었습니다. 동시에 오류를 마주할 때마다 끝까지 파고들어 해결한 경험은 제 스스로의 문제 해결 능력과 자신감을 키워주었습니다. 이번 프로젝트는 단순한 기능 구현을 넘어 협업 속에서 배우고 성장하는 개발자의 자세를 다질 수 있었던 값진 여정이었습니다. |
|   **김진호**   | 첫번째 프로젝트 이후 두달여만에 두번째 프로젝트를 진행했다. 자바와 Servlet, Spring 등을 배웠는데, 특히 MyBatis / JPA 부분과 Spring Security 부분이 잘 이해가 되지 않아 이것들로 프로젝트를 진행한다고 했을때는 잘 할수 있을까 하는 걱정이 들었는데 수업 영상을 두세번 돌려보다 보니 처음에는 이해가 되지 않았던 부분도 이해가 되기 시작했고, "대략적으로 프로젝트를 이렇게 하면 되겠다." 라는 생각이 들었다. 먼저 설계 부분에서는 DDD를 처음 해보았는데, 평소에 개발할 때  도메인 중심으로 생각하는 게 아니라 습관적으로API나 화면 흐름 중심적으로 생각하는 습관이 있어서 진짜 해결해야 할 문제를 놓치는 경우가 있었는데, DDD를 활용해서 복잡한 비즈니스 로직을 도메인 중심적으로 생각하는 법을 배웠다. 개발 부분에서는 팀원들과 Github를 이용한 협업규칙과 PR규칙등을 세우면서 branch 개념과 이슈 템플릿등에 대해 더 이해하게 되었다. 또, 내가 회원,관리자 파트와 Spring Security에 대해 제대로 이해하고 싶어서 이를 이용한 로그인/회원가입 인가/인증 파트를 맡았는데, 토큰 발급과 인증부분에서 애를 먹었다. 아직 한참 부족하고 더 노력해야겠다는 생각이 들었고 한편으로는 그래도 수업시간에는 "이걸 어떻게 하지" 라는 생각이 들었는데 막상 해보니 생각보다 할만 하다다고 느꼈고 강사님께서 말씀하셨던로 롤러코스터의 가장 높은 부분이 이정도면 다른 프로젝트에서는 더 잘 할 수 있겠다는 자신감을 가지게 된 프로젝트인 것 같다. 프론트 프로젝트 전까지 리펙토링과 구조 개선을 통해 프론트 프로젝트에서는 100%의 결과를 내야겠다고 생각했다. |
|   **남우경**   | 쿼리와 DB에 관해 이해도가 있어 원활했던 첫번째 DB 프로젝트와 달리 두번째 벡엔드 프로젝트에서는 처음 배운 것들이 많아 조금은 두렵기도 했지만 기대감이 더 컸습니다. 새로운 것을 한다는 것과 평상시에 하고 싶었던 벡엔드 관련 개발을 한다는 것은 저에게 큰 기대감을 주었습니다. 개발을 어떤 방향으로 진행할 지와 관련하여 DDD, ERD, 요구사항 기능 등을 자세하게 작성하느랴 초반에 시간과 노력이 많은 소요가 있었지만 앞부분에서 틀을 잘 잡아놔야 개발이 원활하겠다는 마음가짐으로 진행하였고, 팀원들과 많은 의사소통을 통해 구체적으로 설정할 수 있었습니다. 앞서 설정한 것들을 기반으로 기능에 따라 조회 부분은 MyBatis로, 삽입/업데이트/삭제는 JPA로 개발을 시작하였는데 많은 시행착오가 있었습니다. 초반에 구성한 테이블로는 요구사항 기능 개발을 진행할 수 없어 테이블 구조를 변경한다거나 실행결과가 하고자 하는 방향에 맞게 출력되어야 함으로 고난도의 쿼리 및 코드 작성 등 이슈가 있었지만 차근차근 해결해 나아가면서 스스로 발전되고 있다고 느꼈습니다. 특히 MSA로 서버들을 구현하여 개발이 완료된 기능들을 http로 기능별 port번호를 입력해 출력값이 나타난 것에 대해 큰 보람을 느꼈습니다. 다음 프론트엔드 프로젝트에서는 두번째 프로젝트보다 개발자로서 더욱 발전된 역량을 나타낼 수 있도록 더 노력할 것입니다. |
|   **이재근**   | 백엔드 개발은 저에게 조금은 멀게만 느껴졌습니다. 프론트엔드 위주로 프로젝트를 진행해왔던 터라, 이론으로 접하는 백엔드는 낯설었습니다. 하지만 실제로 백엔드 프로젝트를 직접 진행하면서, 오히려 그 두려움이 흥미와 이해로 바뀌는 과정을 경험할 수 있었습니다. 특히 DDD, ERD와 같은 초반 설계 단계의 중요성을 깊이 느꼈습니다. 단순히 코드를 짜는 것이 아니라 구조와 흐름을 설계하는 과정이 백엔드의 토대가 된다는 것을 몸소 체험할 수 있었습니다. 또한 Mybatis를 활용한 조회, JPA를 통한 삽입/삭제/수정 기능을 구현하며 직접 결과를 확인하는 순간, 백엔드 개발에 대한 자신감도 생겼습니다. 물론 아쉬움도 있었습니다. 프론트엔드와 실제로 연결해보며 더 구체적이고 현실적인 흐름을 확인하지 못한 점, 그리고 폴더 구조나 코드 아키텍처를 좀 더 리팩토링하지 못한 점은 다음 프로젝트에서 꼭 보완하고 싶습니다. 이번 경험을 통해 저는 단순히 프론트엔드 개발에 머무르지 않고, 백엔드까지 이해하며 더 넓은 시야를 가진 개발자로 성장할 수 있다는 가능성을 보았습니다. 앞으로 다가올 프로젝트에서는 이번 경험을 토대로 보다 발전된 모습의 개발자가 되기 위해 꾸준히 노력할 것입니다. |
|   **이현수** 	 |  진행한 백엔드 프로젝트는 나한테 정말 새로운 경험이다. 처음 사용해보는 DDD를 해보고 ERD를 하면서 데이터 모델링만  했을 때하고는 다르게 구조를 더 쓴게 되었다. 초반에는 모델링과 문서에 시간을 너무 쓰다보니 걱정했는데 막상 개발에 들어가 보니 그 과정이 없었으면 진짜 힘들었을 거다. 아직 MyBatis와 JPA를 잘하지 못하지만 이번에 프로젝트를 하면서 배운 내용에 대해서 확실하게 정리는 된거 같다. 앞으로도 혼자 프로젝트와 앞으로 남은 프로젝트를 하면서 보완해 나갈 예정이다. MyBatis XML 매핑할 때랑 JPA 엔티티 매핑할 때 오류가 계속 나서 로그만 붙잡고 본 적도 많았다. 외래 키 제약 때문에 테이블 설계도 몇 번이나 수정했다. 그래도 하나씩 해결하고 나니까 점점 감이 잡히고, 기술에 대한 이해가 됐다. DM, 팔로우, 포토리뷰 같은 SNS 기능을 직접 구현하면서 이런 게 실제 서비스에선 이렇게 동작하는구나 라는 걸 느낄 수 있었다. 단순히 코드만 짠 게 아니라, 서비스가 돌아가기 위해 필요한 흐름 전체를 고민한 게 의미 있었다. 무엇보다 팀원들이랑 같이 맞춰가는 게 진짜 도움이 됐다. 깃 브랜치 충돌이나 머지 문제도 계속 터졌지만, 서로 얘기하면서 풀어가다 보니 협업 경험 자체가 값지게 느껴졌다. 혼자였다면 훨씬 더 오래 걸렸을 것 같다.	 |

---
