
var app = getApp()
let orderStatus = 1; //0新下单待制作,1待用户评价,2订单已完成
let isWaimai = 1;
let status_2 = 1;
let db = wx.cloud.database();
var socketOpen = false
var socketMsgQueue = []

Page({
  data: {
    // 顶部菜单切换
    navbar: ["待配送菜品", "已完成配送菜品"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
    list: [],
    liste:[],
    user_id:[],
    _price:[],
    // 当前订单所有地址汇总
    addtype:[],
    // 发送通知
    array: ['10', '15', '20', '25'],
    userInfo: {},
    timeindex:0,
  },
  //顶部tab切换
  navbarTap: function (e) {
    let index = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: index,
      list: [],
      addtype: []
    })
    wx.showToast({
      title: '数据加载中',
      icon:'loading',
      duration:500
    })
    if (index == 0) {
      orderStatus = 1;
      isWaimai = 1;
      status_2 = 1; 

    } else if (index == 1) {
      orderStatus = 1;
      isWaimai = 0;
      status_2 = 1; 
    } 
    this.getMyOrderList();
  },

  onShow: function () {
    orderStatus = 1
    this.getMyOrderList();
  },
  
  onLoad: function () {
    this.getMyOrderList()
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
          status_2:status_2
        }
      })
      .then(res => {
        console.log("用户订单列表", res.result.data.length)
        console.log("用户订单列表具体信息", res.result.data)
        console.log("全部信息", res)
        if(res.result.data.length == 0){
          wx.showToast({
            title: '当前暂无订单',
            icon:'none',
          })
        }
        //console.log("用户订单列表", res.result.data[0].address)
        // test

          var arrs = [];
          for(var num = 0 ; num < res.result.data.length ; num++){
            if(res.result.data[num].isWaimai == 1){
                console.log(res.result.data[num].address);//1,2,3,4,5,6,7,8,9
                // if(res.result.data[i].address in  ){
                // }
                var option = {address:res.result.data[num].address,number:1}
                if (arrs.findIndex(function(item) { return item.address === res.result.data[num].address; }) == -1) {
                  arrs.push(option)
                }
                else{
                  // arrs[0]['number'] += 1
                  var index = arrs.findIndex(function(item) { return item.address === res.result.data[num].address; })
                  arrs[index]['number'] += 1
                }
              }
          }
          // option = {address: "江苏省启东 ", number: 1}
          // console.log("新增结果", arrs.findIndex(option))
          console.log("新增结果", arrs)
          // arrs.indexOf(option)

        // test
        this.setData({
          list: res.result.data,
          addtype: arrs
        })
        console.log("外卖分类", this.data.addtype)
      }).catch(res => {
        
        console.log("用户订单列表失败")
        
        this.setData({
          list: [],
          addtype: []
        })

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



  onekeydone(e) {
    console.log("data_onekey：",e.currentTarget)
    console.log("data_onekey的数据是", e.currentTarget.dataset.address)
    wx.cloud.callFunction({
      name: 'waimaionekey',
      data: {
        address: e.currentTarget.dataset.address,
      }
    }).then(resl => {
      console.log('一键配送完成done', resl)
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

  sd(e){
    console.log(e.currentTarget.dataset.address)
    wx.navigateTo({
      url: '/pages/adminWaimai/adminWaimai?address='+ e.currentTarget.dataset.address,
    })
  },

  //退出页面
  onUnload() {

  },

  //发送通知
  socket: function () {
    var that = this
    //创建一个 WebSocket 连接；
    //一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
    wx.connectSocket({
      url: 'wss://www.dexiangit.com/wss'
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


  test(e){
  console.log("点击结果",e.currentTarget.dataset.address)
   var orderStatus = 1;
   var isWaimai = 1;
   var status_2 = 1; 
    var key = "root"
    var address = e.currentTarget.dataset.address
    wx.cloud.callFunction({
      name: 'getwaimai',
      data: {
        orderStatus: orderStatus,
        isWaimai:isWaimai,
        status_2:status_2,
        address: address,
      }
    }).then(res => {
        console.log("外卖结果",res)
        console.log("读取成功",res.result.data)
        var timeindex = this.data.timeindex 
        var time = this.data.array[timeindex]//选择还剩多久到
        var arr = res.result.data
        var obj = {time:time, info_art:3}

        arr.push(obj)
        console.log("发送内容对象",arr)
        var jsonstr = JSON.stringify(arr)
        this.socket()
        this.sendSocketMessage(key)
        console.log("发送内容",jsonstr)
        this.sendSocketMessage(jsonstr)
      }).catch(res => {
        console.log("失败",res)
      })

  
  },
  testlate(e){
    console.log("点击结果",e.currentTarget.dataset.address)
    var orderStatus = 1;
    var isWaimai = 1;
    var status_2 = 1; 
     var key = "root"
     var address = e.currentTarget.dataset.address
     wx.cloud.callFunction({
       name: 'getwaimai',
       data: {
         orderStatus: orderStatus,
         isWaimai:isWaimai,
         status_2:status_2,
         address: address,
       }
     }).then(res => {
        console.log("外卖结果",res)
        console.log("读取成功",res.result.data)
        var arr = res.result.data
        var obj = {time:3, info_art:5}
        arr.push(obj)
        console.log("发送内容对象",arr)
        var jsonstr = JSON.stringify(arr)
        this.setData({
          liste: res.data
        })
        this.socket()
        this.sendSocketMessage(key)
        console.log("发送内容",jsonstr)
        this.sendSocketMessage(jsonstr)
      }).catch(res => {
        console.log("失败")
      })

  
  },
  testok(e){
    console.log("点击结果",e.currentTarget.dataset.address)
    var orderStatus = 1;
    var isWaimai = 1;
    var status_2 = 1; 
     var key = "root"
     var address = e.currentTarget.dataset.address
     wx.cloud.callFunction({
       name: 'getwaimai',
       data: {
         orderStatus: orderStatus,
         isWaimai:isWaimai,
         status_2:status_2,
         address: address,
       }
     }).then(res => {
        console.log("外卖结果",res)
        console.log("读取成功",res.result.data)
        var arr = res.result.data
        var obj = {time:0, info_art:4}
        arr.push(obj)
        console.log("发送内容对象",arr)
        var jsonstr = JSON.stringify(arr)
        this.setData({
          liste: res.data
        })
        this.socket()
        this.sendSocketMessage(key)
        console.log("发送内容",jsonstr)
        this.sendSocketMessage(jsonstr)
      }).catch(res => {
        console.log("失败")
      })

  
  },
})