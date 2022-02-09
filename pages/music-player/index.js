// pages/music-player/index.js
// import {
//   getSongDetail,
//   getSongLyric
// } from '../../service/api_player';
// // 解析歌词方法
// import { parseLyric } from '../../utils/parse-lyric';
// 播放
import {
  audioContext,
  playerStore
} from '../../store/index'

// 播放模式数组
const playModeNames = ["order", "repeat", "random"];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    // 当前播放歌曲信息
    currentSong: {},
    // 当前在哪一页
    currentPage: 0,
    contentHeight: 0,
    // 是否显示歌词
    isMusicLyric: true,
    // 歌曲时长
    durationTime: 0,
    // 当前播放时长
    currentTime: 0,
    // 当前播放进度
    sliderValue: 0,
    // 是否在改变进度条
    isSliderChanging: false,
    // 歌词数据
    lyricInfos: [],
    // 当前歌词索引
    currentLyricIndex: 0,
    // 当前时间的歌词
    currentLyricText: '',
    lyricScrollTop: 0,
    // 播放模式index
    playModeIndex: 0,
    // 播放模式
    playModeName: "order",
    // 歌曲是否播放
    isPlaying: false,
    playingName: "pause"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id;
    this.setData({
      id
    });

    // 2.根据id获取歌曲信息
    // this.getPageData(id);
    this.setupPlayStoreListener();

    // 3.计算内容部分高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    // 获取机型宽高比
    const deviceRadio = globalData.deviceRadio;
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    });

    // 4.使用audioContext播放歌曲
    // audioContext.stop();
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // // 立即播放
    // audioContext.autoplay = true;

    // 5.audioContext的事件监听
    // this.setupAudioContextListener()

  },
  // ****************事件处理****************

  handleSwiperChange: function (event) {
    // 获取当前页
    const current = event.detail.current;
    this.setData({
      currentPage: current
    });
  },
  // 处理进度改变
  handleSliderChange: function (event) {
    // console.log(event.detail.value);
    // 1.获取slider变化的值
    const value = event.detail.value;

    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100;

    // 3.设置context播放当前位置的音乐
    // audioContext.pause();
    audioContext.seek(currentTime / 1000);

    // 4.记录最新的sliderValue
    this.setData({
      sliderValue: value,
      isSliderChanging: false
    });
  },

  // 处理进度条拖动
  handleSliderChanging: function (event) {
    const value = event.detail.value;
    const currentTime = this.data.durationTime * value / 100;

    this.setData({
      isSliderChanging: true,
      currentTime
    });
  },
  handleBackClik: function () {
    // 返回上一级
    wx.navigateBack({});
  },
  // 切换模式
  handleModeBtnClick: function () {
    console.log('切换播放模式');
    // 计算最新播放模式的index
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) playModeIndex = 0;
    // 设置播放模式
    playerStore.setState("playModeIndex", playModeIndex);
  },
  // 播放暂停逻辑
  handlePlayBtnClik: function () {
    // 改变音乐的播放状态
    playerStore.dispatch("changeMusicPlayStateAction", !this.data.isPlaying);
  },
  // 播放上一首
  handlePrevBtnClick: function () {
    playerStore.dispatch("changeNewMusicPrevAction");
  },
  // 播放下一首
  handleNextBtnClick: function () {
    playerStore.dispatch("changeNewMusicNextAction");
  },
  // ****************数据监听****************
  setupPlayStoreListener: function () {
    // 监听多个数据
    playerStore.onStates([
      "currentSong",
      "durationTime",
      "lyricInfos"
    ], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong });
      if (durationTime) this.setData({ durationTime });
      if (lyricInfos) this.setData({ lyricInfos });
    })

    // 监听currentTime,currentLyricIndex,currentLyricText
    playerStore.onStates([
      "currentTime",
      "currentLyricIndex",
      "currentLyricText"
    ],({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        // 计算进度条的值
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({ currentTime, sliderValue });
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText });
      }
    })

    // 监听播放模式相关数据
    playerStore.onStates([
      "playModeIndex",
      "isPlaying"
    ], ({ playModeIndex, isPlaying }) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] });
      }
      if (isPlaying !== undefined) {
        this.setData({ isPlaying, playingName: isPlaying ? "pause" : "resume" });
      }
    });
  }
})