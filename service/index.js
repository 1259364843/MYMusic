// 封装网络请求
const BASE_URL = 'http://123.207.32.32:9001';
const LOGIN_BASE_URL = "http://123.207.32.32:3000";
class MYRequest {
    constructor(baseURL) {
        this.baseURL = baseURL
    }
    request(url, method, params) {
        // 返回promise
        return new Promise((resolve, reject) => {
            wx.request({
                url: BASE_URL + url,
                method: method,
                data: params,
                success: function (res) {
                    resolve(res.data);
                },
                fail: reject
            })
        })

    }
    get(url, params) {
        return this.request(url, 'GET', params);
    }
    post(url, data) {
        return this.request(url, 'POST', data);
    }
}
const myRequest = new MYRequest();

// 登录用
const myLoginRequest = new MYRequest(LOGIN_BASE_URL)
export default myRequest;
export {
    myLoginRequest
}