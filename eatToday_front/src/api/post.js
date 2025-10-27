import api from './index'

// 전체 게시물 조회
export const getAllPosts = async () => {
  const response = await api.get('/foods/all')
  return response.data
}

// 게시글 승인/거부
export const approvePost = async (boardNo, approved = true) => {
  const response = await api.patch(`/command/foods/${boardNo}/approve?approved=${approved}`)
  return response.data
}
