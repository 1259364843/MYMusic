// pages/music-player/index.js
import {
  getSongDetail,
  getSongLyric
} from '../../service/api_player';
// 解析歌词方法
import { parseLyric } from '../../utils/parse-lyric';
// 播放
import {
  audioContext
} from '../../store/index'
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
    this.getPageData(id);

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
    audioContext.stop();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // 立即播放
    audioContext.autoplay = true;

    // 5.audioContext的事件监听
    this.setupAudioContextListener()

  },

  // ****************网络请求方法****************
  getPageData: function (id) {
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      });
    }),
    // 获取歌词
    getSongLyric(id).then(res => {
      const lyricString = res.lrc.lyric;
      // 解析
      const lyrics = parseLyric(lyricString);
      console.log(lyrics);
      // 存储歌词
      this.setData({ lyricInfos: lyrics });
    })
  },
  // ****************事件监听****************
  setupAudioContextListener: function () {
    // 准备好后才播放歌曲
    audioContext.onCanplay(() => {
      audioContext.play()
    })
    // 对时间更新监听,监听时间改变
    audioContext.onTimeUpdate(() => {
      // console.log(audioContext.currentTime);
      // 1.获取当前播放进度
      const currentTime = audioContext.currentTime * 1000;

      // 2.获取silder进度条的位置
      // 拖动结束才更改时间,根据当前时间修改currentTime
      if (!this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({
          sliderValue,
          currentTime
        });
      }
      // console.log(sliderValue);

      // 3.根据当前时间去查找播放的歌词
      let i = 0;
      for (; i < this.data.lyricInfos.length; i++) {
        const lyricInfo = this.data.lyricInfos[i];
        if (currentTime < lyricInfo.time ) {
          break;
        }
      }
      // 设置当前歌词的索引和内容
      const currentIndex = i - 1;
      // 判断索引
      if( this.data.currentLyricIndex !== currentIndex ) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex];
        console.log(currentLyricInfo);
        // 设置歌词
        this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
      }
    })
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
    audioContext.pause();
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
      currentTime,
      sliderValue: value
    });
  }
})