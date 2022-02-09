// pages/home-music/index.js
import {
  rankingStore,
  rankingMap,
  playerStore
} from '../../store/index'
import {
  getBanners,
  getSongMenu
} from '../../service/api_music'
import queryRect from '../../utils/query-rect'
// 节流
import throttle from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })
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
    recommendSongs: [],
    // 榜单的数据
    rankings: {
      0: {},
      2: {},
      3: {}
    },
    currentSong: {},
    // 当前歌曲是否在播放
    isPlaying: false
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
    this.setupPlayerStoreListener();
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
  // 监听更多点击
  handleMoreClick: function() {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick: function(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    console.log(rankingMap[idx]);
    this.navigateToDetailSongsPage(rankingName)
  },
  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      // &type=rank表示是榜单的数据
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index;
    console.log(index, this.data.recommendSongs);
    playerStore.setState("playListSongs", this.data.recommendSongs);
    playerStore.setState("playListIndex", index);
  },
  // 从store中获取共享数据
  getRankingHandler: function (idx) {
    // 返回一个函数
    return (res) => {
      // 判断对象中有没有值
      if (Object.keys(res).length === 0) return
      console.log("idx:", idx)
      const name = res.name
      // 封面图
      const coverImgUrl = res.coverImgUrl
      // 播放量
      const playCount = res.playCount
      // 获取榜单中的三条数据
      const songList = res.tracks.slice(0, 3)
      // 榜单数据对象
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
      // 响应式赋值
      this.setData({
        rankings: newRankings
      })
      console.log(this.data.rankings)
    }
  },
  setupPlayerStoreListener: function () {
    // 排行榜监听
    rankingStore.onState('hotRanking', res => {
      if (!res.tracks) return;
      // 取到前六条数据
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({
        recommendSongs: recommendSongs
      });
      // 获取三种榜单的数据
      rankingStore.onState("newRanking", this.getRankingHandler(0))
      rankingStore.onState("originRanking", this.getRankingHandler(2))
      rankingStore.onState("upRanking", this.getRankingHandler(3))
    })
    // 播放器监听
    playerStore.onStates(["currentSong", "isPlaying"], ({ currentSong, isPlaying }) => {
      if (currentSong) this.setData({ currentSong });
      if (isPlaying !== undefined) this.setData({ isPlaying,  });
    })
  },
  // 播放控制栏播放暂停
  handlePlayBtnClick: function (event) {
    playerStore.dispatch("changeMusicPlayStateAction", !this.data.isPlaying);
  },
  // 跳转到播放详情页
  handlePlayBarClick: function () {
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  }


})