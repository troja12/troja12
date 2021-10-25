
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    isShowUserName: false,
    userInfo: null,
  },
  //获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人sssss信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        user.openid = app.globalData.openid;
        app._saveUserInfo(user);
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  //退出登录
  tuichu() {
    wx.setStorageSync('user', null)
    this.setData({
      userInfo: null,
      isShowUserName: false
    })
  },
  goToMyOrder: function () {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },

  goToMyComment: function () {
    wx.navigateTo({
      url: '../mycomment/mycomment?type=1',
    })
  },

  change() {
    wx.navigateTo({
      url: '../change/change',
    })
  },
  //去管理员页
  goAdmin() {
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  //去评论页面
  goCommentPage() {
    wx.navigateTo({
      url: '/pages/mycomment/mycomment?type=' + 1,
    })
  },
  //去我的排号页
  goToPaiHao() {
    wx.navigateTo({
      url: '/pages/paihao/paihao',
    })
  },
  onShow(options) {
    var user = app.globalData.userInfo;
    if (user && user.nickName) {
      this.setData({
        isShowUserName: true,
        userInfo: user,
      })
    }
    
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    var user = app.globalData.userInfo;
    // if (user) {
    //   // that.setData({
    //   //  isShowUserName: true,
    //   //  userInfo: user,
    //   // })
    // } else {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     that.setData({
    //       userInfo: res.userInfo,
    //       isShowUserName: true
    //     })
    //   }
    // }
  },
})

// Component({
//   pageLifetimes: {
//     show() {
//       if (typeof this.getTabBar === 'function' &&
//         this.getTabBar()) {
//         this.getTabBar().setData({
//           selected: 3
//         })
//       }
//     }
//   }
// })
