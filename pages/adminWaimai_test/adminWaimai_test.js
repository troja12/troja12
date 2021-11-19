
var app = getApp()
let orderStatus = 1; //0新下单待制作,1待用户评价,2订单已完成
let isWaimai = 1;
let status_2 = 1;
let db = wx.cloud.database();
var socketOpen = false
var socketMsgQueue = []


//监听用户新下单的watch
let watcher = null

//音频播放相关
const innerAudioContext = wx.createInnerAudioContext()
// innerAudioContext.autoplay = true //自动播放
innerAudioContext.loop = true //循环播放
innerAudioContext.src = app.globalData.mp3Src
// innerAudioContext.src = "cloud://test-ec396a.7465-test-ec396a-1257654106/mp3/laidanle.wav"
let isPlaying = false //是否在播放中



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
    time: '12:00',
    // 发送通知
    userInfo: {},
    user: '',
    dish: '',
    pay: '',
    detail: '',
    address: '',
    ps: '',
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

  onShow: function () {
    orderStatus = 1
    this.getMyOrderList();
    this.initWatcher()
    //防止问题，再做一次音频资源初始化
    innerAudioContext.src = app.globalData.mp3Src
  },
  //初始化watcher
  initWatcher() {
    let that = this
    watcher = db.collection('order')
      .watch({
        onChange: function (res) {
          console.log('更新监听到的数据', res)
          if (!res.type && res.docChanges && res.docChanges.length > 0) {
            let obj = res.docChanges[0].doc
            if (obj && obj.status == 0 && !isPlaying) {
              console.log('有用户新下单了')
              //用户如果下单，会播放音频
              innerAudioContext.play() //播放订单提示音频
              innerAudioContext.onPlay(() => {
                console.log('开始播放')
                isPlaying = true
              })
              wx.showModal({
                title: '有新订单！',
                content: '新订单来啦，请及时制作',
                showCancel: false,
                success(res) {
                  //停止音乐
                  innerAudioContext.stop()
                  isPlaying = false
                  // 请求新下单数据
                  that.setData({
                    currentTab: 0
                  })
                  orderStatus = 0
                  that.getMyOrderList()
                }
              })
            }
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
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
        console.log("用户订单列表", res.result.data[0].address)
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
      }).catch(res => {
        console.log("用户订单列表失败", res)
      })
  },

  // 定义一个数组



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

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
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
      url: '/pages/adminWaimai/adminWaimai?address=' + e.currentTarget.dataset.address,
    })
  },

  //退出页面
  onUnload() {
    console.log("onUnload")
    innerAudioContext.destroy() //退出页面时销毁音频
    watcher.close() //关闭监听
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
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // user: function (e) {
  //   this.setData({
  //     user: e.detail.value
  //   })
  // },
  dish: function (e) {
    this.setData({
      dish: e.detail.value
    })
  },
  pay: function (e) {
    this.setData({
      pay: e.detail.value
    })
  },
  detail: function (e) {
    this.setData({
      detail: e.detail.value
    })
  },
  address: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  ps: function (e) {
    this.setData({
      ps: e.detail.value
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
  sendMessageBtnTap: function () {
    wx.login({ 
   
    }).then((res)=>{	
      if (res.code) {
          console.log('登录成功！'+res.code);
          // this.setData({
          //  tempcode : res.code
          // })
        
        }else{
        console.log('登录失败！'+res.errMsg);
    }
    var key = "root"
    // 订单号
    var order_number = 12345698
    var time = 15
    var order_time = '2021/10/27 01:54:03'
    var user = this.data.user
    var dish = this.data.dish
    var pay = this.data.pay
    var detail = this.data.detail
    var address = this.data.address
    var ps = this.data.ps    //  备注
    var tempcode = res.code
    var msg = `{'info_art': 5 ,'dish':'${dish}','pay':'${pay}','detail':'${detail}',
               'address':'${address}','ps':'${ps}','tempcode':'${tempcode}',
               'order_number':'${order_number}' , 'time':'${time}', 'order_time':'${order_time}',
                                                                           }`
    this.socket()
    this.sendSocketMessage(key)
    this.sendSocketMessage(msg)
      })
  }, 

  getlist(e){
    orderStatus = 1;
    isWaimai = 1;
    status_2 = 1; 
    wx.cloud.database().collection("order")
      .orderBy('_createTime', 'desc')
      .where({
        status: orderStatus,
        isWaimai:isWaimai,
        status_2:status_2,
        address:e.address
      }).get().then(res => {
        console.log("读取成功",res.data)
        this.setData({
          liste: res.data
        })
      }).catch(res => {
        console.log("失败")
      })
  },

  test(e){
    console.log("点击结果",e.currentTarget.dataset.address)
    orderStatus = 1;
    isWaimai = 1;
    status_2 = 1; 
    wx.cloud.database().collection("order")
      .orderBy('_createTime', 'desc')
      .where({
        status: orderStatus,
        isWaimai:isWaimai,
        status_2:status_2,
        address:e.currentTarget.dataset.address
      }).get().then(res => {
        


        wx.login({ 
   
        }).then((ress)=>{	
          if (ress.code) {
              console.log('登录成功！'+ress.code);
              // this.setData({
              //  tempcode : res.code
              // })
            
            }else{
            console.log('登录失败！'+ress.errMsg);
        }



        console.log("读取成功",res.data)
        this.setData({
          liste: res.data
        })
        for(var num = 0 ; num < res.data.length ; num++){
          console.log(res.data[num])
          
          var key = "root"
          // 订单号
          var order_number = res.data[num]._id
          var time = 15//选择还剩多久到
          var order_time = res.data[num]._createTime
          var dish = res.data[num].orderList
          var pay = res.data[num].totalPrice
          var detail = []
          // var detail = this.data.detail
          var address = res.data[num].address
          var ps = res.data[num].totalPrice    //  备注
          var tempcode = res.code
          var msg = `{'info_art': 5 ,'dish':'${dish}','pay':'${pay}','detail':'${detail}',
                     'address':'${address}','ps':'${ps}','tempcode':'${tempcode}',
                     'order_number':'${order_number}' , 'time':'${time}', 'order_time':'${order_time}',
                                                                                 }`
        this.socket()
        this.sendSocketMessage(key)
        this.sendSocketMessage(msg)
        
        }
      })
      }).catch(res => {
        console.log("失败")
      })

    // test

  //   var arrs = [];
  //   for(var num = 0 ; num < res.result.data.length ; num++){
  //     if(res.result.data[num].isWaimai == 1){
  //         console.log(res.result.data[num].address);//1,2,3,4,5,6,7,8,9
  //         // if(res.result.data[i].address in  ){
  //         // }
  //         var option = {address:res.result.data[num].address,number:1}
  //         if (arrs.findIndex(function(item) { return item.address === res.result.data[num].address; }) == -1) {
  //           arrs.push(option)
  //         }
  //         else{
  //           // arrs[0]['number'] += 1
  //           var index = arrs.findIndex(function(item) { return item.address === res.result.data[num].address; })
  //           arrs[index]['number'] += 1
  //         }
  //       }
  //   }
  //   // option = {address: "江苏省启东 ", number: 1}
  //   // console.log("新增结果", arrs.findIndex(option))
  //   console.log("新增结果", arrs)
  //   // arrs.indexOf(option)

  // // test
  }
})