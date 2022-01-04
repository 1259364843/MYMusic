// music相关请求逻辑
import myRequest from './index';

/**
 * 获取首页轮播图
 */
export function getBanners() {
  return myRequest.get("/banner", {
    type: 2
  })
}

export function getRankings(idx) {
  return myRequest.get("/top/list", {
    idx
  });
}

// 获取歌单
export function getSongMenu(cat = '全部', limit = 6, offset = 0) {
  return myRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}