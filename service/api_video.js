// video相关的请求逻辑
import myRequest from './index';

export function getTopMV(offset, limit = 10) {
    return myRequest.get('/top/mv', {
        offset,
        limit
    })
}

/**
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVUrl(id) {
    return myRequest.get("/mv/url", {
        id
    })
}

/**
 * 请求MV的详情
 * @param {number} mvid MV的id 
 */
export function getMVDetail(mvid) {
    return myRequest.get("/mv/detail", {
        mvid
    })
}

/**
 * 获取当前MV的相关视频
 * @param {number} id MVid
 */
export function getRelatedVideo(id) {
    return myRequest.get("/related/allvideo", {
        id
    })
}