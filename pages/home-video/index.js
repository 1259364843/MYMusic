// pages/home-video/index.js
import {
    getTopMV
} from '../../service/api_video'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMVs: [],
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function () {
        this.getTopMVData(0)
    },
    // 封装网络请求方法
    getTopMVData: async function (offset) {
        // 判断是否可以请求数据
        if (!this.data.hasMore && offset !== 0) return;
        // 展示加载动画
        wx.showNavigationBarLoading();
        if (offset === 0) {
            // wx.startPullDownRefresh();
        }
        const res = await getTopMV(offset);
        let newData = this.data.topMVs;
        // 判断数据加载情况
        if (offset === 0) {
            // 重新加载
            newData = res.data;
        } else {
            // 加载更多
            newData = newData.concat(res.data);
        }

        // 设置数据
        this.setData({
            topMVs: newData
        });
        this.setData({
            hasMore: res.hasMore
        });
        // 关闭加载动画
        wx.hideNavigationBarLoading();
        if (offset === 0) {
            wx.stopPullDownRefresh();
        }
    },

    // 封装事件处理方法
    handleVideoItemClick: function (evnet) {
        // 获取id
        const id = evnet.currentTarget.dataset.item.id;
        // 页面跳转
        wx.navigateTo({
            url: `/packageDetail/pages/detail-video/index?id=${id}`,
        })

    },
    onPullDownRefresh: async function () {
        console.log(1);
        this.getTopMVData(0)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
        this.getTopMVData(this.data.topMVs.length);
    }
})