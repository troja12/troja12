//JS
var app = getApp()
let DB = wx.cloud.database()
Page({
  data: {
    // 顶部菜单切换
    navbar: ['全部评价', "我的评价"],
    // 默认选中菜单
    currentTab: 0,
    list: []
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 1) {
      this.getMyCommentList();
    } else {
      this.getCommentList();
    }
  },
  onLoad() {
    this.getCommentList();
  },
  //获取所有评论列表
  getCommentList() {
    wx.cloud.callFunction({
      name: "getpinglun",
    })
    .then(res => {
      console.log("查询全部评论成功", res)
      if (res && res.result) {
        let dataList = res.result.data;
        this.setData({
          list: dataList
        })
      } else {
        this.setData({
          list: []
        })
      }
    }).catch(res => {
      console.log("查询全部评论失败", res)
    })
  },

  //获取我的所有评论列表
  getMyCommentList() {
    let that = this;
    //请求自己后台获取用户openid
    DB.collection("pinglun").get()
      .then(res => {
        console.log("查询评论成功", res)
        if (res && res.data) {
          let dataList = res.data;
          that.setData({
            list: dataList
          })
        } else {
          that.setData({
            list: []
          })
        }
      }).catch(res => {
        console.log("查询评论失败", res)
      })
  },
})