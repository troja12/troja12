let app = getApp();
const db = wx.cloud.database()
Page({
  data: { //页面的初始数据   
    address: app.globalData.address,
    diner_num: '', // 输入框中的用餐人数 
    beizhu: "", // 备注信息
    payWayList: [{ //模拟支付方式列表
      "id": 1,
      "package": "会员卡支付"
    }, {
      "id": 2,
      "package": "微信支付"
    }, {
      "id": 3,
      "package": "银行卡支付"
    }],
    cartList: [], // 购物车数据
    totalPrice: 0, //总价
    totalNum: 0, //总数量
    maskFlag: true, // 遮罩
    status_2:0,
    isWaimai:0,
  },
  onLoad() {
    console.log('app地址', app.globalData.address)
    this.setData({
      address: app.globalData.address
    })
    //购物车的数据
    var arr = wx.getStorageSync('cart') || [];
    for (var i in arr) {
      this.data.totalPrice += arr[i].quantity * arr[i].price;
      this.data.totalNum += arr[i].quantity
    }
    this.setData({
      cartList: arr,
      totalPrice: this.data.totalPrice.toFixed(2),
      totalNum: this.data.totalNum
    })
  },
  // 点击数字，输入框出现对应数字
  getDinnerNUM(e) {
    this.setData({
      diner_num: e.currentTarget.dataset.num
    });
  },
  // 获取输入的用餐人数
  getInputNum(e) {
    this.setData({
      diner_num: e.detail.value
    })
  },
  // 获取备注信息
  getRemark(e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  //打开支付方式弹窗
  choosePayWay() {
    var that = this;
    var rd_session = wx.getStorageSync('rd_session') || [];

    // 支付方式打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    that.setData({
      maskFlag: false,
    });
  },
  // 支付方式关闭方法
  closePayWay() {
    var that = this
    // 支付方式关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    that.setData({
      maskFlag: true
    });
  },


  //提交订单
  submitOrder: function (e) {
    let arr = wx.getStorageSync('cart') || [];
    let arrNew = []
    arr.forEach(item => {
      arrNew.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })
    });

    if (!this.data.diner_num) {
      wx.showToast({
        icon: 'none',
        title: '请选择就餐人数',
      })
      return
    }
    db.collection("order").add({
      data: {
        name: app.globalData.userInfo.nickName,
        renshu: parseInt(this.data.diner_num), //用餐人数,
        beizhu: this.data.beizhu,
        address: app.globalData.address,
        totalPrice: this.data.totalPrice, //总价钱
        orderList: arrNew, //存json字符串
        status: 0, 
        status_2:0,
        isWaimai:0,
        //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
        // _createTime: db.serverDate() //创建的时间
        _createTime: new Date().getTime() //创建的时间
      }
    }).then(res => {
      console.log("支付成功", res)
      // 支付方式关闭动画
      this.animation.translate(0, 285).step();
      this.setData({
        animationData: this.animation.export()
      });
      this.setData({
        maskFlag: true
      });
      wx.showToast({
        title: '下单成功！',
      })
      //支付成功后，把购买的菜品销量增加
      wx.cloud.callFunction({
        name: "addXiaoLiang",
        data: {
          id: res._id
        }
      }).then(res => {
        console.log('添加销量成功', res)
        wx.setStorageSync('cart', "")
        wx.switchTab({
          url: '../me/me',
        })
      }).catch(res => {
        console.log('添加销量失败', res)
        wx.showToast({
          icon: 'none',
          title: '支付失败',
        })
      })

    }).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '支付失败',
      })
      console.log("支付失败", res)
    })
  },


})