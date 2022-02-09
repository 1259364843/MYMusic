// components/navigation-bar/index.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "我是默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 状态栏高度
    statusBarHeight: getApp().globalData.statusBarHeight
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    ready: function () {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 处理左部分点击
    handleLeftClick() {
      // 向外发送事件
      this.triggerEvent('click');
    }
  }
})
