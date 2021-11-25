var app = getApp();
var util = require('../../util/util.js');
var socketOpen = false
var socketMsgQueue = []
const db = wx.cloud.database()
Page({
  data: { //页面的初始数据   
    address:"点击选择配送地址",
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
    cartlist_1: [], // 购物车数据
    totalPrice_1: 0, //总价
    totalNum_1: 0, //总数量
    maskFlag: true, // 遮罩
    status_2:0,
    isWaimai:0,
  },
  onLoad(opt) {
    console.log('app地址', app.globalData.address)
    console.log("页面携带数据",opt.address)
    this.setData({
      address: opt.address
    })
    //购物车的数据
    var arr = wx.getStorageSync('cart_1') || [];
    for (var i in arr) {
      this.data.totalPrice_1 += arr[i].quantity * arr[i].price;
      this.data.totalNum_1 += arr[i].quantity
    }
    this.setData({
      cartlist_1: arr,
      totalPrice_1: this.data.totalPrice_1.toFixed(2),
      totalNum_1: this.data.totalNum_1
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
    console.log("当前地址为",this.__data__.address)
    if(this.__data__.address!= undefined){
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
    }
    else{
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
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

  // 地址选择
  addselect:function(){
    wx.navigateTo({
      url: '/pages/address/index/address',
    })
  },
  //提交订单
  submitOrder: function (e) {
    var outTradeNo = util.wxuuid(5, 10)
    let arr = wx.getStorageSync('cart_1') || [];
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

    var date = new Date();
    var createTime = util.formatTime1(date)
    
    var createTime1 =  createTime.replace(/-/g, '/')
    console.log("支付成功", createTime1)
    db.collection("order").add({
      data: {
        outTradeNo:outTradeNo,
        name: app.globalData.userInfo.nickName,
        unionid:app.globalData.unionid,
        renshu: parseInt(this.data.diner_num), //用餐人数,
        beizhu: this.data.beizhu,
        address: this.data.address,
        totalPrice_1: this.data.totalPrice_1, //总价钱
        orderList: arrNew, //存json字符串
        status: 0, 
        status_2:1,
        isWaimai:1,
        //-1订单取消,0新下单待上餐,1待用户评价,2订单已完成
        // _createTime: db.serverDate() //创建的时间
        _createTime: createTime1 //创建的时间
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
        this.orderok(outTradeNo)
        wx.setStorageSync('cart_1', "")
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

  //发送通知
  socket: function () {
    var that = this
    //创建一个 WebSocket 连接；
    //一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
    wx.connectSocket({
      url: 'ws://43.132.246.14:1235'
    })
    //监听WebSocket错误
    wx.onSocketError(function (res) {
      socketOpen = false
      console.log('WebSocket连接打开失败，请检查！')
      wx.hideToast()
    })
    //监听WebSocket连接打开事件。
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      wx.hideToast()
      socketOpen = true
      for (var i = 0; i < socketMsgQueue.length; i++) {
        that.sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })
    //监听WebSocket接受到服务器的消息事件
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      wx.closeSocket()
    })
    //监听WebSocket关闭
    wx.onSocketClose(function (res) {
      socketOpen = false
      console.log('WebSocket 已关闭！')
      wx.hideToast()
      that.setData({
        socktBtnTitle: '连接socket'
      })
    })
  },

  
  sendSocketMessage: function (msg) {
    if (socketOpen) {
      //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      socketMsgQueue.push(msg)
    }
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeindex: e.detail.value
    })
  },

  orderok(outTradeNo){
    var date = new Date();
    var createTime = util.formatTime1(date )
    var createTime1 =  createTime.replace(/-/g, '/')
    console.log("支付成功", createTime1)
   
    var key = "root"
   
    var arr = {
      outTradeNo:outTradeNo,
      name: app.globalData.userInfo.nickName,
      unionid:app.globalData.unionid,
      beizhu: this.data.beizhu,
      address: this.data.address,
      totalPrice: this.data.totalPrice_1, //总价钱
      _createTime: createTime1 , //创建的时间
      
        }
        console.log("内容数组",arr)
        var obj = {time:0, info_art:1}
        var arr1= []
        arr1.push(arr)
        arr1.push(obj)

        console.log("发送内容对象",arr1)
        var jsonstr = JSON.stringify(arr1)
        this.socket()
        this.sendSocketMessage(key)
        console.log("发送内容",jsonstr)
        this.sendSocketMessage(jsonstr)
      

  
  },


})