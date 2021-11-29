
var app = getApp()
let orderStatus = 1; //0新下单待制作,1待用户评价,2订单已完成
let isWaimai = 1;
let status_2 = 1;
let db = wx.cloud.database();
Page({
  data: {
    // 顶部菜单切换
    navbar: ["当前配送地点订单详情"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
    list: [],
    user_id:[],
    _price:[],
    address:[]
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = 1;
      isWaimai = 1;
      status_2 = 1; 
    } else if (index == 1) {
      orderStatus = 1;
      isWaimai = 0;
      status_2 = 1; 
    } else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  getMyOrderList() {
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    //请求自己后台获取用户openid
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action:'admin',
          orderStatus: orderStatus,
          isWaimai:isWaimai,
          status_2:status_2,
          
        }
      })
      .then(res => {
        console.log("用户订单列表", res)
        console.log("用户订单列表具体信息", res.result.data)
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
      name: 'waimai',
      data: {
        id: e.currentTarget.dataset.id,
      }
    }).then(resl => {
      console.log('配送完成ok', resl)
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


  onLoad(opt) {
    console.log("页面携带数据",opt.address)
    this.setData({
      address: opt.address
    })
    
    console.log('传入地址为',opt.address)
    orderStatus = 1;
    isWaimai = 1;
    status_2 = 1; 
    wx.cloud.database().collection("order")
      .orderBy('_createTime', 'desc')
      .where({
        status: orderStatus,
        isWaimai:isWaimai,
        status_2:status_2,
        address:opt.address
      }).get().then(res => {
        console.log("读取成功",res.data)
        this.setData({
          list: res.data
        })
      }).catch(res => {
        console.log("失败")
      })
  },



})