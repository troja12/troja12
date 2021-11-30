
var app = getApp()
let orderStatus = 0; //0新下单,1管理员已接单
let db = wx.cloud.database();


Page({
  data: {
    // 顶部菜单切换
    // navbar: ["待制作菜品", "已上餐待用户评价", "已完成"],
    navbar: ["未接单物流", "已接单物流"],
    // 默认选中菜单
    currentTab: 0,
    list: [],
    user_id:[],
    _price:[]
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = 0;
    } else if (index == 1) {
      orderStatus = 1;
    } else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    orderStatus = 0
    this.getMyOrderList();
  
  },
 
  getMyOrderList() {
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    //请求自己后台获取用户openid
    wx.cloud.callFunction({
        name: 'getWuliuOrder',
        data: {
          action:'admin',
          orderStatus: orderStatus
        }
      })
      .then(res => {
        console.log("用户订单", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        console.log("用户订单列表失败", res)
      })
  },
  //制作完成
  zhizuowancheng(e) {
    console.log("data：",e.currentTarget)
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.price)
    console.log("oppenid为",app.globalData.openid)
    console.log("curent的数据是", e.currentTarget.dataset)
    wx.cloud.callFunction({
      name: 'wuliu_done',
      data: {
        id: e.currentTarget.dataset.id,
      }
    }).then(resl => {
      console.log('制作完成ok', resl)
      if (resl.result && resl.result.stats && resl.result.stats.updated > 0) {
        wx.showToast({
          title: '修改成功',
        })
        this.getMyOrderList()
      } else {
        wx.showToast({
          icon: 'none',
          title: '提交失败',
        })
      }
    }).catch(resl => {
      console.log('制作完成no', resl)
      wx.showToast({
        icon: 'none',
        title: '提交失败',
      })
    })
 
  },

  //退出页面
  onUnload() {
    
  }

})