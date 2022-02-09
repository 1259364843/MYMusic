import {
  HYEventStore
} from 'hy-event-store';

// 网络请求方法
import {
  getSongDetail,
  getSongLyric
} from '../service/api_player';
// 解析歌词方法
import {
  parseLyric
} from '../utils/parse-lyric';
// const audioContext = wx.createInnerAudioContext();
const audioContext = wx.getBackgroundAudioManager();
// 新建
const playerStore = new HYEventStore({
  state: {
    // 是否是第一次播放歌曲
    isFirstPlay: true,
    // 当前播放歌曲信息
    currentSong: {},
    // 歌曲时长
    durationTime: 0,
    // 歌词数据
    lyricInfos: [],
    // 当前时间
    currentTime: 0,
    currentLyricIndex: 0,
    // 当前歌词
    currentLyricText: "",
    // 播放模式
    playModeIndex: 0, //0 循环播放 1 单曲循环 2 随机播放,
    playModeIndex: 0,
    isPlaying: false,
    // 播放列表数据
    playListSongs: [],
    playListIndex: 0,
    isStoping: false
  },

  actions: {
    playMusicWithSongIdAction(ctx, {
      id,
      isRefresh = false
    }) {
      // 判断和正在播放的歌曲是否是同一首
      if (ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStateAction", true);
        return;
      }
      ctx.id = id;

      // 重置播放状态
      ctx.isPlaying = true;
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = "";
      // 修改播放的状态
      ctx.isPlaying = true;
      // 1.根据id请求歌曲详情
      getSongDetail(id).then(res => {
          ctx.currentSong = res.songs[0]
          ctx.durationTime = res.songs[0].dt
          audioContext.title = res.songs[0].name
        }),
        // 请求歌词数据
        getSongLyric(id).then(res => {
          const lyricString = res.lrc.lyric;
          // 解析
          const lyrics = parseLyric(lyricString);
          console.log(lyrics);
          // 存储歌词
          ctx.lyricInfos = lyrics;
        })
      // 2.播放对应id的歌曲
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id;
      // 立即播放
      audioContext.autoplay = true;

      // 3.监听audioContext的事件
      if (ctx.isFirstPlay) {
        console.log("不是");
        // 是第一播放才监听
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
      // this.dispatch("setupAudioContextListenerAction");
    },
    setupAudioContextListenerAction(ctx) {
      // 1.监听歌曲可以播放,准备好后才播放歌曲
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 2.监听时间改变
      // 对时间更新监听,监听时间改变
      audioContext.onTimeUpdate(() => {
        // console.log(audioContext.currentTime);
        // 1.获取当前播放进度
        const currentTime = audioContext.currentTime * 1000;

        // 2.获取silder进度条的位置
        // 拖动结束才更改时间,根据当前时间修改currentTime
        ctx.currentTime = currentTime;
        
        // 3.根据当前时间去查找播放的歌词
        if (!ctx.lyricInfos.length) return;
        let i = 0;
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i];
          if (currentTime < lyricInfo.time) {
            break;
          }
        }
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1;
        // 判断索引
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex];
          ctx.currentLyricIndex = currentIndex;
          ctx.currentLyricText = currentLyricInfo.text;

        }
      })
      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicNextAction");
      })
      // 4.监听音乐播放/暂停/停止
      audioContext.onPlay(() => {
        ctx.isPlaying = true;
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false;
      })
      audioContext.onStop(() => {
        ctx.isPlaying = false;
      })
    },
    changeMusicPlayStateAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = currentSong.name;
        audioContext.seek(ctx.currentTime);
        ctx.isStoping = false;
        
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
      
    },
    // 切换下一首音乐
    changeNewMusicNextAction(ctx) {
      // 1.获取当前音乐索引
      let index = ctx.playListIndex;

      // 2.根据不同的播放模式获取下一首歌曲的索引
      switch (ctx.playModeIndex) {
        case 0://顺序播放
          index = index + 1;
          // 如果已经是最后一首歌曲,则回到开头
          if (index === ctx.playListSongs.length) index = 0;
          break;
        case 1://单曲循环
          break;
        case 2: //随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          break;
      }
      // 3.获取歌曲
      const currentSong = ctx.playListSongs[index];
      if (!currentSong) {
        currentSong = ctx.currentSong;
      } else {
        // 记录新的索引
        ctx.playListIndex = index;
      }
      // 4.播放新歌曲
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true });
    },
    // 播放上一首
    changeNewMusicPrevAction(ctx) {
      // 1.获取当前音乐索引
      let index = ctx.playListIndex;

      // 2.根据不同的播放模式获取下一首歌曲的索引
      switch (ctx.playModeIndex) {
        case 0://顺序播放
          index = index - 1;
          // 如果已经是最后一首歌曲,则回到开头
          if (index === -1) index = ctx.playListSongs.length - 1;
          break;
        case 1://单曲循环
          break;
        case 2: //随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          break;
      }
      // 3.获取歌曲
      const currentSong = ctx.playListSongs[index];
      if (!currentSong) {
        currentSong = ctx.currentSong;
      } else {
        // 记录新的索引
        ctx.playListIndex = index;
      }
      // 4.播放新歌曲
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true });
    }
  }
});
export {
  audioContext,
  playerStore
}