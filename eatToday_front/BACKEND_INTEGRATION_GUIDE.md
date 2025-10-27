# 백엔드 API 연동 가이드

## 현재 상황

1. ✅ API 함수 생성 완료: `src/api/report.js`
2. ⏳ ReportManagement.vue 백엔드 연동 필요

## 필요한 작업

### ReportManagement.vue에 추가할 내용:

```javascript
// 1. import 추가
import { ref, computed, onMounted, watch } from 'vue'
import { getReportList, approveReport } from '@/api/report'

// 2. 변수 추가
const reports = ref([]) // 더미 데이터 대신
const totalPages = ref(0)

// 3. onMounted 추가
onMounted(() => {
  fetchReports()
})

// 4. fetchReports 함수
const fetchReports = async () => {
  try {
    const response = await getReportList(currentPage.value, itemsPerPage)
    reports.value = response.content.map(report => ({
      id: report.reportNo,
      reporter: report.reporter?.memberName || report.memberNo,
      target: report.accused?.memberName || report.memberNo2,
      type: report.reportSource,
      reason: report.reportContent,
      date: report.reportDate,
      status: report.reportYn ? 'resolved' : 'pending'
    }))
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('신고 목록 가져오기 실패:', error)
  }
}

// 5. handleApprove 수정
const handleApprove = async (report) => {
  try {
    await approveReport(report.id)
    report.status = 'resolved'
    alert('신고가 승인되었습니다.')
  } catch (error) {
    alert('신고 승인에 실패했습니다.')
  }
}

// 6. 거부 버튼은 제거 (백엔드에 API 없음)
```

**백엔드 API가 작동하는지 테스트하세요!**
POSTMAN이나 브라우저에서 직접 API를 호출해서 응답이 오는지 확인하세요.

