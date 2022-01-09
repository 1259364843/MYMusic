// components/song-item-v1/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到歌曲的播放详情页
    handleSongItemClick: function() {
      const id = this.properties.item.id
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + id,
      })
    }
  }
})
