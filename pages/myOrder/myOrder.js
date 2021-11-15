//JS
var app = getApp()
let orderStatus = 0; //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
let isWaimai = 0;
let status_2 = 0;
let db = wx.cloud.database();
Page({
  data: {
    // 顶部菜单切换
    navbar: ["待上餐", "待配送", "已完成"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
    list: []
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index
    })
    if (index == 0) {
      orderStatus = 0;
      isWaimai = 0;
      status_2 = 0; 
    } else if (index == 1) {
      orderStatus = 1;
      isWaimai = 1;
      status_2 = 1; 
    } else if (index == 2) {
      orderStatus = 1;
      isWaimai = 0;
      status_2 = 1; 
    } else if (index == 3) {
      orderStatus = -1;
    } else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    this.getMyOrderList();
  },

  getMyOrderList() {
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    wx.cloud.callFunction({
        name: 'getOrderList',
        data: {
          action: 'user',
          orderStatus: orderStatus,
          isWaimai:isWaimai,
          status_2:status_2
        }
      })
      .then(res => {
        console.log("我的订单列表", res)
        this.setData({
          list: res.result.data
        })
      }).catch(res => {
        console.log("我的订单列表失败", res)
      })
  },
  //去评论页面
  goCommentPage() {
    wx.navigateTo({
      url: '../mycomment/mycomment?type=' + 1,
    })
  },
  //弹起评论框
  showComment(event) {
    let orderId = event.currentTarget.dataset.orderid;
    this.setData({
      isShowComment: true,
      orderId: orderId
    })
  },
  //隐藏评论框
  cancelComment() {
    this.setData({
      isShowComment: false
    })
  },
  //获取评论内容
  setValue(input) {
    this.setData({
      content: input.detail.value
    })
  },
  //提交评论
  submitComment() {
    let orderId = this.data.orderId;
    this.cancelComment(); //隐藏评论框
    let content = this.data.content;
    if (!content) {
      wx.showToast({
        title: '评论内容为空',
      })
      return;
    }
    let openid = app._checkOpenid();
    if (!openid) {
      return;
    }
    db.collection("order").where({
        _id: orderId
      })
      .update({
        data: {
          status: 2
        },
      }).then(res => {
        console.log("修改状态成功", res)
        db.collection("pinglun")
          .add({
            data: {
              orderId: orderId,
              name: app.globalData.userInfo.nickName,
              avatarUrl: app.globalData.userInfo.avatarUrl,
              content: content,
              // _createTime: db.serverDate() //创建的时间
              _createTime: new Date().getTime() //创建的时间
            }
          }).then(res => {
            console.log("评论成功", res)
            wx.showToast({
              title: '评论成功',
            })
            this.getMyOrderList()
          }).catch(res => {
            console.log("评论失败", res)
            wx.showToast({
              icon: "none",
              title: '评论失败',
            })
          })
      }).catch(res => {
        console.log("修改状态失败", res)
      })


  },

  //取消订单
  cancleOrder(event) {
    /**
     * 如果允许用户随意取消订单，就把下面注释解开
     */
    // let orderId = event.currentTarget.dataset.orderid;
    // db.collection('order').doc(orderId).update({
    //   data: {
    //     status: -1
    //   }
    // }).then(res => {
    //   console.log('取消订单成功', res)
    //   this.getMyOrderList()
    // }).catch(res => {
    //   console.log('取消订单失败', res)
    // })
    // return

    /**
     * 如果不允许用户随意取消订单，就用下面这段代码
     */
    wx.showModal({
      title: '提示!',
      content: '菜品已在制作中,请去收银台联系店员进行取消',
    })




  }
})