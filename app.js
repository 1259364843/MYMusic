// app.js


App({
  onLaunch: function (params) {
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    // 机型宽高比
    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;
    console.log(info);
  },
  globalData: {
    // 屏幕宽高
    screenWidth: 0,
    screenHeight: 0,
    // 状态栏高度
    statusBarHeight: 0,
    // 导航栏高度
    navBarHeight: 44,
    deviceRadio:  0
  }
})
