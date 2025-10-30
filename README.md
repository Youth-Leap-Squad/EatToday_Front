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

#### [📋 와이어 프레임](#-와이어-프레임) <br>

#### [🗂️ 스토리보드](#-스토리-보드) <br>

#### [🏗️ WBS](#-WBS) <br>

#### [✅ 테스트 케이스](#-테스트-케이스) <br> 

#### [🔌 결과 보고서](#-결과-보고서) <br>

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
  <details>
          <summary>home</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EA%B3%B5%ED%86%B5/%ED%99%88.png" width = "600"/><br>
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
<details>
	<summary><b>라운지</b></summary><br>
  <details>
          <summary>라운지</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%9D%BC%EC%9A%B4%EC%A7%80/%EB%9D%BC%EC%9A%B4%EC%A7%80.png" width = "600"/><br>
	          </p>
  </details>
</details>
<details>
	<summary><b>문의사항</b></summary><br>
  <details>
          <summary>고객센터</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD/%EA%B3%A0%EA%B0%9D%EC%84%BC%ED%84%B0.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>내 문의사항 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD/%EB%82%B4%20%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EC%A1%B0%ED%9A%8C.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>문의사항 작성</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EC%9E%91%EC%84%B1.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>문의사항 수정 및 삭제</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD/%EB%82%B4%20%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EC%88%98%EC%A0%95%20%EB%B0%8F%20%EC%82%AD%EC%A0%9C.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>관리자 문의사항 조회</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD/%EA%B4%80%EB%A6%AC%EC%9E%90%20%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EC%A1%B0%ED%9A%8C.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>관리자 문의사항 답변</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD/%EA%B4%80%EB%A6%AC%EC%9E%90%20%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EB%8B%B5%EB%B3%80.png" width = "600"/><br>
	          </p>
  </details>
</details>
<details>
     <summary><b>마이페이지</b></summary><br>
  <details>
          <summary>내 마이페이지</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80/%EB%82%B4%20%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80.png" width = "600"/><br>
	          </p>
  </details>
  <details>
          <summary>다른사람 마이페이지</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80/%EB%8B%A4%EB%A5%B8%EC%82%AC%EB%9E%8C%20%EB%A7%88%EC%9D%B4%20%ED%8E%98%EC%9D%B4%EC%A7%80.png" width = "600"/><br>
	          </p>
  </details>
</details>
<details>
     <summary><b>신고</b></summary><br>
  <details>
          <summary>신고 모달</summary><br>
	          <p alian="center">
	          <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/storyboard/%EC%8B%A0%EA%B3%A0/%EC%8B%A0%EA%B3%A0%20%EB%AA%A8%EB%8B%AC.png" width = "600"/><br>
	          </p>
  </details>
</details>
  
  <br><br>

## 📰 WBS

🔗 <a href="https://docs.google.com/spreadsheets/d/1wRZSPEhjhj0SsW3NB7papSM6vu2WulmTOoR9Q8WDOJY/edit?gid=1596719811#gid=1596719811"> WBS 자세히 보기 </a>

<br>

<img src ="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/img/Front_WBS.png" width ="800" />

<br><br>



## 📱 테스트 케이스


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

### 📷 사진 리뷰
<details>
	  <summary>메시지</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EB%A9%94%EC%8B%9C%EC%A7%80.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>작성</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%20%EC%9E%91%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>댓글 작성</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%20%EB%8C%93%EA%B8%80%20%EC%9E%91%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>댓글 수정&삭제</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%EB%8C%93%EA%B8%80%EC%88%98%EC%A0%95%3A%EC%82%AD%EC%A0%9C.gif" width = "600"/><br>
		  </p>
</details>
<details>

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

### 📷 사진 리뷰
<details>
	  <summary>메시지</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EB%A9%94%EC%8B%9C%EC%A7%80.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>작성</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%20%EC%9E%91%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>댓글 작성</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%20%EB%8C%93%EA%B8%80%20%EC%9E%91%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>댓글 수정&삭제</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/photoReview/%EC%82%AC%EC%A7%84%EB%A6%AC%EB%B7%B0%EB%8C%93%EA%B8%80%EC%88%98%EC%A0%95%3A%EC%82%AD%EC%A0%9C.gif" width = "600"/><br>
		  </p>
</details>

### 💬 문의사항
<details>
	  <summary>고객센터</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/qna/%EA%B3%A0%EA%B0%9D%EC%84%BC%ED%84%B0.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>문의사항 생성</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/qna/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EC%83%9D%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>문의사항 수정 및 삭제</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/qna/%EB%AC%B8%EC%9D%98%EC%82%AC%ED%95%AD%20%EC%88%98%EC%A0%95%20%EB%B0%8F%20%EC%82%AD%EC%A0%9C.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>관리자 문의사항 조회</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/qna/%EA%B4%80%EB%A6%AC%EC%9E%90%20%EB%AC%B8%EC%9D%98%20%EC%A1%B0%ED%9A%8C.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>관리자 문의사항 답변</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/qna/%EA%B4%80%EB%A6%AC%EC%9E%90%20%EB%AC%B8%EC%9D%98%20%EC%83%9D%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>관리자 문의사항 수정 및 삭제</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/qna/%EA%B4%80%EB%A6%AC%EC%9E%90%20%EB%AC%B8%EC%9D%98%20%EC%82%AD%EC%A0%9C%20%EB%B0%8F%20%EB%B3%80%EA%B2%BD.gif" width = "600"/><br>
		  </p>
</details>

### 🍻 라운지
<details>
	  <summary>라운지</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/rounge/%EB%9D%BC%EC%9A%B4%EC%A7%80.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>라운지 페이지 이동</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/rounge/%EB%9D%BC%EC%9A%B4%EC%A7%80%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9D%B4%EB%8F%99.gif" width = "600"/><br>
		  </p>
</details>

### 👤 마이페이지
<details>
	  <summary>마이페이지</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/mypage/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>마이페이지 페이지 이동</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/mypage/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9D%B4%EB%8F%99.gif" width = "600"/><br>
		  </p>
</details>

### 🚨 신고
<details>
	  <summary>신고</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/report/%EC%8B%A0%EA%B3%A0.gif" width = "600"/><br>
		  </p>
</details>

### 📷 게시물
<details>
	  <summary>게시글 작성</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/post/%EA%B2%8C%EC%8B%9C%EA%B8%80%EC%9E%91%EC%84%B1.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>게시글 반응, 댓글</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/post/%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EB%B0%98%EC%9D%91%2C%EB%8C%93%EA%B8%80.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>스크랩</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/post/%EC%8A%A4%ED%81%AC%EB%9E%A9.gif" width = "600"/><br>
		  </p>
</details>
<details>
	  <summary>조회순, 반응순, 댓글순 조회</summary><br>
		  <p alian="center">
		  <img src="https://github.com/Youth-Leap-Squad/EatToday_Front/blob/main/Readme/testcase/post/%EC%A1%B0%ED%9A%8C%EC%88%9C%2C%EB%B0%98%EC%9D%91%EC%88%9C%2C%EB%8C%93%EA%B8%80%EC%88%9C%20%EC%A1%B0%ED%9A%8C.gif" width = "600"/><br>
		  </p>
</details>

## 🔭 결과 보고서

-  [📄 발표자료 (PDF 보기)](https://github.com/Youth-Leap-Squad/EatToday_store/blob/main/src/assets/img/19_2nd_backendproject_presentation.pdf)

<br>

## 🔭 회고록

<br>

|   조원 이름	  |   회고   |
|---------------|----------|
|   **김윤지**   | 이번 프로젝트는 제게 개발자로서 한 단계 성장할 수 있는 중요한 경험이었습니다. DDD, ERD, MyBatis, JPA, MSA 등 낯설고 방대한 기술들을 실제로 적용하면서 처음에는 막막했지만 시간이 지날수록 두려움이 자신감으로 바뀌었습니다. 특히 게시글 기능을 담당하며 CRUD 구현 과정에서 JPA 매핑 오류와 MyBatis 쿼리 처리 문제로 어려움을 겪었지만 이를 해결하며 각 기술의 장단점을 체득할 수 있었습니다. 특히 게시글 도메인을 정의하고 ERD로 관계를 구조화하는 과정에서 데이터 흐름을 이해하는 능력이 크게 향상되었습니다. 또한 MSA 기반으로 서비스를 독립적으로 설계하면서 다른 팀원이 맡은 인증이나 추천 기능과 안정적으로 연동되도록 고민했던 경험은 협업적 관점에서 의미가 컸습니다. 프로젝트 초반 충분한 설계 덕분에 후반부 개발이 수월했음을 체감했고 문제 상황마다 팀원들과 의견을 나누며 해결책을 찾아가는 과정에서 함께 일하는 즐거움을 느낄 수 있었습니다. 동시에 오류를 마주할 때마다 끝까지 파고들어 해결한 경험은 제 스스로의 문제 해결 능력과 자신감을 키워주었습니다. 이번 프로젝트는 단순한 기능 구현을 넘어 협업 속에서 배우고 성장하는 개발자의 자세를 다질 수 있었던 값진 여정이었습니다. |
|   **김진호**   | 두번째 프로젝트 이후 약 한달 동안의 시간이 있었는데, 10일 가량의 긴 연휴동안 지난 백엔드 프로젝트에서 부족했던 점들을 보완하고, 프론트엔드 수업을 들었다. HTML 과 CSS를 배우면서 웹 페이지의 구조와 시각적인 요소를 배우고, Node.js와 JavaScript를 통해 함수형 프로그래밍 언어와 이벤트, 비동기적 데이터 처리에 대해 배우고, 이것들을 SPA로 개발하기 위한 프레임워크인 Vue를 배웠다. 프론트엔드 프로젝트는 특히나 시간이 많이 부족해 보여서 최대한 처음에 프로젝트 구조를 잘 짜놔야겠다고 생각해서, 수업 내용과 다른 프로젝트들을 참고해서 폴더 구조를 만들었다. 예를들어, 팀원간 분업을 효율적으로 하기 위해 공통된 컴포넌트는 같이 관리/개발해서 코드 중복을 피하고 라우터 구조를 먼저 설계해서 그 라우터가 뿌려주는 페이지 구조에 맞춰 체계적으로 개발을 진행했다. 지금까지의 프로젝트와는 달리 사용자에게 직접 보이고, 상호작용하는 웹을 처음 만드는 과정은 굉장히 흥미로웠다. 단순히 백엔드와 연동하고 동작하는것에 집중하는것이 아니라, "내가 진짜 사용자라면 어떻게 생각할까"라는 생각을 가지고 우리 웹사이트의 철학과 킥/아하 모먼트등을 생각해서 UX/UI도 신경써서 만들었다. 짧은 시간이였지만 후회없이 최선을 다했고, 결과도 만족스러웠다.|
|   **남우경**   | 백엔드 프로젝트가 끝난 후 기능 수정 및 추가해야하는 리펙토링들이 많았습니다. 프론트 프로젝트 하기 전에 리펙토링들을 진행하였고, 대부분 완료를 하였으나 프론트 프로젝트를 진행하면서 리펙토링이 더 추가되고 수정되어야 하는 것들이 점점 늘어났습니다. 곰곰히 생각하여 사전에 리펙토링을 정의하고 수정하였지만, 프론트적 관점으로 보았을 때 필요한 것들이 많았습니다. 여기서 제가 느낀 점은 백엔드를 개발하면서 프론트적 관점에서도 생각하면서 기능을 개발을 해야겠다는 점입니다. Vue를 통해 프론트 개발을 진행 중 한 가지를 깨달았습니다. 프론트에서 백엔드 기능을 개발 할 수도 있는 것이었습니다. 하지만 이렇게 백엔드 기능을 프론트에서 다 처리한다면 유지보수에 힘들다는 점입니다. 처음 페이지를 구성하면서 새롭기도 했지만, 제가 세세하게 생각했던것보다 많은 기능을 구현하지 못해서 아쉬웠습니다. 특히 이벤트의 월드컵게임 같은 파트는 백엔드에서 하드 코딩을 통해 알고리즘을 작성해 그것을 프론트에서 불러와서 진행하고 싶었지만 프론트 상에서 알고리즘을 통해 작성하였습니다. 다음 데브옵스, 최종프로젝트 때는 하고자하는 기능들을 명확히 정의하고 100% 구현하려고 할 것이며 지금보다 더 발전된 모습으로 우상향을 그릴 것입니다.  |
|   **이재근**   | 이번 프로젝트는 이전 프로젝트에서 구축한 백엔드를 기반으로 시작했다. 초기 단계에서 전체적인 화면 구성이나 웹의 컨셉은 정했었지만, 프론트엔드를 본격적으로 구현하면서 세부적인 화면 구성과 흐름이 달라진다는 걸 느꼈다. 이에 따라 프론트엔드 변경 사항을 반영하기 위해 백엔드 로직을 수정해야 하는 경우가 있었다. 이 과정에서 프론트, 백엔드, 디자인이 단순히 역할을 나누는 것이 아니라, 서로 유기적으로 맞물리며 발전해야 한다는 점을 몸소 느꼈다. 결국 이번 경험을 통해, 설계를 잘 하는 것도 물론 중요하지만 개발 과정에서의 지속적인 소통과 조율 또한 매우 중요하다는 것을 깨달았다. 프론트, 백엔드, 디자인이 조화롭게 어우러질 때 비로소 완성도 높은 서비스가 만들어진다는 점을 배울 수 있었고, 프로젝트 결과 또한 만족스러웠다. |
|   **이현수** 	 | 이번 프로젝트에서는 처음으로 Vue를 사용해 보았다. 막연히 컴포넌트를 나눠서 개발한다는 말은 알고 있었지만, 실제로 화면을 쪼개고 상태를 흘려보내고, 재사용 가능한 조각으로 쌓아 올리는 과정을 거치면서 컴포넌트 단위 설계의 중요성을 느꼈다. 특히 리스트/상세/작성 같은 흐름을 구성할 때 UI를 기능별로 분리하지 않으면, 한 파일이 비대해지고 상태 관리가 꼬여 수정도 위험해진다는 사실을 뼈저리게 경험했다. 결과적으로 처음부터 과감하게 쪼개기—작은 책임을 가진 컴포넌트로 구획하기—명확한 props/emit 설계하기가 생산성과 유지보수성 모두에 이롭다는 걸 배웠다. 백엔드는 완벽하지 않아도 기본 골격과 계약(API 스펙)이 단단해야 프론트가 편하다는 것도 크게 느꼈다. 실제로 엔드포인트 주소, HTTP 메서드, 요청/응답 DTO, 에러 코드 규칙 등 최소한의 약속이 먼저 잡혀 있어야 Axios 모듈과 뷰 컴포넌트를 빠르게 붙일 수 있었다. 반대로 이 약속이 비어 있거나 중간에 자주 바뀌면, 프론트는 더미 데이터와 임시 분기문을 늘려가며 시간을 태우게 된다. 이번에 경험해 보니 초기 설계 단계에서 Swagger로 문서화하고, Postman으로 샘플 요청/응답을 확정해 두는 것만으로도 시행착오가 크게 줄었다. |

---
