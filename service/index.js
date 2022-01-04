// 封装网络请求
const BASE_URL = 'http://123.207.32.32:9001'
class MYRequest {
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
export default myRequest;