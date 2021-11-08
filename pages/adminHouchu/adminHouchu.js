
var app = getApp()
let orderStatus = 0; //0新下单待制作,1待用户评价,2订单已完成
let db = wx.cloud.database();

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
    navbar: ["待制作菜品", "已上餐待用户评价", "已完成"],
    // 默认选中菜单
    currentTab: 0,
    isShowComment: false, //是否显示评论框
    list: [],
    user_id:[]
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
    } else if (index == 2) {
      orderStatus = 2;
    } else {
      orderStatus = 0;
    }
    this.getMyOrderList();
  },

  onShow: function () {
    orderStatus = 0
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
          orderStatus: orderStatus
        }
      })
      .then(res => {
        console.log("用户订单列表", res)
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
    console.log("oppenid为",app.globalData.openid)

    wx.cloud.callFunction({
      name: 'getMember',
      data: {
       }
    })
    .then(res => {
      let user_id = res.result.data[0]._id
      wx.cloud.callFunction({
        name: 'changepoint',
        data: {
          userid: user_id
         }
      })
      .then(ress => {
        console.log("积分成功",ress)
      }).catch(ress => {
         console.log("积分失败", ress)
      })
      
      console.log("res为", res.result.data[0]._id)

    }).catch(res => {
       console.log("userid获取失败", res)
    })
    
    // wx.cloud.callFunction({
    //   name: 'changepoint',
    //   data: {
    //     userid: res.result.data[0]._id
    //    }
    // })
    // .then(ress => {
    //   console.log("积分成功",ress)
    // }).catch(ress => {
    //    console.log("积分失败", ress)
    // })

    wx.cloud.callFunction({
      name: 'houchu',
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
    console.log("onUnload")
    innerAudioContext.destroy() //退出页面时销毁音频
    watcher.close() //关闭监听
  }

})