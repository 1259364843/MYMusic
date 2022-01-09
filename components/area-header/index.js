// components/area-header/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认标题"
    },
    rightText: {
      type: String,
      value: "更多"
    },
    showRight: {
      type: Boolean,
      value: true
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
    handleRightClick: function() {
      // 向外部发送一个事件
      this.triggerEvent("click")
    }
  }
})
