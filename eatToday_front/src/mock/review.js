const KEY = 'demo_reviews_v2';

const seed = [
  {
    id: 1,
    title: '소주와 삼겹살 한 판!',
    authorName: '찡구야 놀자',
    authorAvatar: '',
    likeCount: 50,
    imgUrl: 'https://picsum.photos/seed/pork/1200/800',
    content: '겉바속촉 삼겹살과 칼칼한 김치의 조합 👍',
    hashtags: ['#소주와 삼겹살'],
    following: false,
    comments: [
      { id: 11, authorName: 'user10', content: '맛있겠어요.', createdAt: Date.now()-3600_000 },
      { id: 12, authorName: 'user1', content: '정성입니다..', createdAt: Date.now()-7200_000 },
    ],
    createdAt: Date.now() - 12*3600_000 // 12시간 전
  },
  {
    id: 2,
    title: '비 오는 날엔 삼겹살',
    authorName: '맹구맹구',
    authorAvatar: '',
    likeCount: 12,
    imgUrl: 'https://picsum.photos/seed/soju/1200/800',
    content: '소주 한 잔과 함께하면 최고',
    hashtags: ['#비오는 날엔 삼겹살'],
    following: true,
    comments: [],
    createdAt: Date.now() - 28*3600_000
  }
];

function load(){ try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):seed;}catch{return seed;} }
function save(db){ localStorage.setItem(KEY, JSON.stringify(db)); }
let db = load();

export function listReviews(){ return [...db].sort((a,b)=>b.id-a.id); }
export function getReview(id){ return db.find(r=>r.id===Number(id)) || null; }
export function likeReview(id){
  const r = getReview(id); if(!r) return 0;
  r.likeCount = (r.likeCount||0) + 1; save(db); return r.likeCount;
}
export async function createReview({title,content,authorName='user',file}){
  let imgUrl=''; if(file){
    imgUrl = await new Promise(res=>{ const fr=new FileReader(); fr.onload=()=>res(fr.result); fr.readAsDataURL(file); });
  }
  const id = Date.now();
  db.push({
    id, title: title?.trim()||'제목 없음', content: content||'', authorName,
    authorAvatar:'', likeCount:0, imgUrl, hashtags:['#새 리뷰'], following:false,
    comments:[], createdAt: Date.now()
  });
  save(db); return id;
}
export function toggleFollow(id, next){
  const r = getReview(id); if(!r) return false; r.following = next; save(db); return r.following;
}
export function listComments(id){ return getReview(id)?.comments || []; }
export function addComment(id, {authorName='user', content}){
  const r = getReview(id); if(!r) return;
  const c = { id: Date.now(), authorName, content, createdAt: Date.now() };
  r.comments.push(c); save(db); return c;
}
export function updateComment(id, cid, content){
  const r = getReview(id); if(!r) return;
  const c = r.comments.find(v=>v.id===cid); if(!c) return; c.content = content; save(db); return c;
}
export function deleteComment(id, cid){
  const r = getReview(id); if(!r) return;
  r.comments = r.comments.filter(v=>v.id!==cid); save(db);
}