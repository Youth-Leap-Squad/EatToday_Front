import api from "./index";

// (술BTI) 설문 목록 조회
export const getAlbtiSurveyList = async () => {
  const res = await api.get("/albti/survey/list");
  return res.data;
};

// (술BTI) 답변 저장 (bulk)
export const submitAlbtiAnswers = async (memberNo, answers) => {
  const res = await api.post("/albti/member/add-bulk", {
    memberNo,
    answers,
  });
  return res.data;
};

// (술BTI) 결과 조회
export const getAlbtiResult = async (memberNo) => {
  const res = await api.get(`/albti/getalbtiresult?member_no=${memberNo}`);
  return res.data;
};



