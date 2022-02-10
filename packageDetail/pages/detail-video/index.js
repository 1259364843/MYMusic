import {
    getMVDetail,
    getRelatedVideo,
    getMVUrl
} from "../../../service/api_video";

// pages/detail-video/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvURLInfo: {},
        mvDetail: {},
        relatedVideos: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //  1.获取传递的id
        const id = options.id;
        console.log(id);
        // 2.获取页面的数据
        this.getPageData(id);
        // 3.其他逻辑

    },
    getPageData: function (id) {
        // 1.请求播放地址
        getMVUrl(id).then(res => {
            // console.log(res);
            this.setData({
                mvURLInfo: res.data
            });
        })

        // 2.请求视频信息
        getMVDetail(id).then(res => {
            // console.log(res);
            this.setData({
                mvDetail: res.data
            });
        })

        // 3.请求相关视频
        getRelatedVideo(id).then(res => {
            // console.log(res);
            this.setData({
                relatedVideos: res.data
            });
            console.log(this.data.relatedVideos);
        })
        
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})