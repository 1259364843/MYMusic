// 播放页面相关网络请求
import myRequest from './index';

/**
 * 根据歌曲id获取歌曲信息
 * @param {*} ids 
 */
export function getSongDetail(ids) {
  return myRequest.get('/song/detail', {
    ids
  })
}
/**
 * 根据歌曲id获取歌词
 * @param {*} id 
 */
export function getSongLyric(id) {
  return myRequest.get("/lyric", {
    id
  })
}