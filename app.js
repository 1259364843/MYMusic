// app.js
App({
  onLaunch: function (params) {
    const info = wx.getSystemInfoSync()
    console.log(info);
  },
  globalData: {
    // 屏幕宽高
    screenWidth: 0,
    screenHeight: 0
  }
})
