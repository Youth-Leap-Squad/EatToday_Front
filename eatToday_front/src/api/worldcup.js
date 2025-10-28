import api from "./index";


// // 이번 주에 해당 술로 이미 참여했는지 체크[재참여 기능]  (사용 X)
// export const checkWorldcupPlayed = async (memberNo, worldcupNo, alcoholId) => {
//   return api.get(`/worldcup/check`, {
//     params: { memberNo, worldcupNo, alcoholId },
//   });
// };


  // (월드컵게임) 우승안주 저장
  export const joinWorldcup = async (memberNo, worldcupNo, alcoholId, foodId) => {
      const res = await api.post("/worldcup/join", {
          memberNo,
          worldcupNo,
          alcoholId,
          foodId,
      });
      return res.data;
  };

// (월드컵게임) 주간 월드컵 순위 조회
export const getWorldcupRank = async (alcoholNo, weekNo) => {
    const res = await api.get(`/worldcup/getworldcupresult`, {params: { alcoholNo, weekNo }});
    return res.data;
};
