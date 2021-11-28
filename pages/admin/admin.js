const app = getApp()
let name = ""
let password = ""
const db = wx.cloud.database()
Page({
  data: {
    isAdmin: false,
    flag: false
  },
  //去后厨管理页
  goHouchu() {
    wx.navigateTo({
      url: '/pages/adminHouchu/adminHouchu',
    })
  },
  //去排号管理页
  goPaihao() {
    wx.navigateTo({
      url: '/pages/adminPaihao/adminPaihao',
    })
  },

  goWaimai(){
    wx.navigateTo({
      url: '/pages/adminWaimai/adminWaimai',
    })
  },

  goWaimai_test(){
    wx.navigateTo({
      url: '/pages/adminWaimai_test/adminWaimai_test',
    })
  },

  onLoad() {
    let admin = wx.getStorageSync('admin')
    if (admin && admin.name && admin.password) {
      //每次进入管理页都校验账号密码，防止离职员工登录
      this.login(admin.name, admin.password)
    }
  },
  //管理员登陆相关
  getName: function (e) {
    name = e.detail.value
  },

  getPassWord: function (e) {
    password = e.detail.value
  },
  formSubmit: function () {
    if (name == '' || name == undefined) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
      return;
    }
    if (password == '' || password == undefined) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    this.login(name, password)
  },

  //登录
  login(name, password) {
    db.collection('admin').where({
        name: name,
        password: password,
      }).get()
      .then(res => {
        console.log("登陆成功", res)
        console.log("结果为",res.data)
        if (res.data && res.data.length > 0) {
          this.setData({
            isAdmin: true,
            flag: true
          })
          let admin = {
            name: name,
            password: password
          }
          wx.setStorageSync('admin', admin)
        } else {
          this.setData({
            isAdmin: false
          })
          wx.showToast({
            icon: 'none',
            title: '账号或密码错误',
          })
        }
      }).catch(res => {
        console.log("登陆失败", res)
        wx.showToast({
          icon: 'none',
          title: '账号或密码错误',
        })
        this.setData({
          isAdmin: false
        })
      })
  }


})