// pages/detail-songs/index.js
import { rankingStore, playerStore } from '../../../store/index'
import { getSongMenuDetail } from '../../../service/api_music'

Page({
  data: {
    // 用来区分歌单类别
    type: "",
    ranking: "",
    // 歌单数据
    songInfo: {}
  },
  onLoad: function (options) {
    const type = options.type
    this.setData({ type })

    // 推荐歌单
    if (type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
      // 榜单
    } else if (type === "rank") {
      const ranking = options.ranking
      this.setData({ ranking })

      // 1.获取数据
      rankingStore.onState(ranking, this.getRankingDataHanlder)
    }
  },
  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
    }
  },

  getRankingDataHanlder: function(res) {
    this.setData({ songInfo: res })
  },
  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index;
    console.log(index, this.data.recommendSongs);
    playerStore.setState("playListSongs", this.data.songInfo.tracks);
    playerStore.setState("playListIndex", index);
  }
})