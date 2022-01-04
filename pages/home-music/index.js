// pages/home-music/index.js
import {
  rankingStore
} from '../../store/index'
import {
  getBanners,
  getSongMenu
} from '../../service/api_music'
import queryRect from '../../utils/query-rect'
// 节流
import throttle from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect, 1000)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    banners: [],
    swiperHeight: 120,
    // 推荐歌曲数据
    recommendSongs: [],
    // 歌单数据
    hotSongMenu: [],
    recommendSongMenu: [],

    // 榜单的数据
    rankings: {
      0: {},
      2: {},
      3: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData();
    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction')
    // 从store中获取数据
    rankingStore.onState('hotRanking', res => {
      if (!res.tracks) return;
      // 取到前六条数据
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({
        recommendSongs: recommendSongs
      });
      // 榜单数据
      rankingStore.onState("newRanking", this.getRankingHandler(0))
      rankingStore.onState("originRanking", this.getRankingHandler(2))
      rankingStore.onState("upRanking", this.getRankingHandler(3))
    })
  },

  // 网络请求

  getPageData: function () {
    // 获取轮播图数据
    getBanners().then(res => {
      this.setData({
        banners: res.banners
      });
    })
    // 获取热门歌单数据
    getSongMenu().then(res => {
      this.setData({
        hotSongMenu: res.playlists
      })
    })
    // 获取华语歌单
    getSongMenu('华语').then(res => {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })
  },

  // 事件处理

  // 搜索框点击处理
  handleSearchClick: function () {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleSwiperImageLoaded: function () {
    // 获取图片的高度(如果去获取某一个组件的高度)
    throttleQueryRect('.swiper-image').then(res => {
      console.log('查询图片高度');
      const rect = res[0];
      this.setData({
        swiperHeight: rect.height
      })
    })
  },
  onUnload: function () {

  },

  // 从store中获取共享数据
  getRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      console.log("idx:", idx)
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {
        name,
        coverImgUrl,
        playCount,
        songList
      }
      const newRankings = {
        ...this.data.rankings,
        [idx]: rankingObj
      }
      this.setData({
        rankings: newRankings
      })
      console.log(this.data.rankings)
    }
  }
})