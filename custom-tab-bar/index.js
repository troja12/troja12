Component({
  data: {
    selected: 0,
    color: "cc543a",
    selectedColor: "cc543a",
    
    list: [
      {
        "pagePath": "/pages/frist/frist",
        "iconPath": "/image/目前全部页面png 1/首页/首页2.png",
        "selectedIconPath": "/image/目前全部页面png 1/首页/首页.png",
        "text": "首页"
      },

      {
        "pagePath": "/pages/me/me",
        "iconPath": "/image/目前全部页面png 1/首页/我的2.png",
        "selectedIconPath": "/image/目前全部页面png 1/首页/我的.png",
        "text": "我的"
      }
    ]


  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
      console.log("tabbar is", data.index)
    }
  }
})