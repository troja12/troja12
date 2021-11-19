// pages/frist/frist.js
const app = getApp()
let db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cm_point:[],
    isNeedSaoMa: app.globalData.isNeedSaoMa,
    banner: [
      // {
      //   picUrl: 'cloud://yangguang-6g36d3ftdb1346d4.7961-yangguang-6g36d3ftdb1346d4-1307798933/头图长版 拷贝.png'
      // },
      {
        picUrl: 'https://7875-xuzhihui-test-1gkq2fi3f9c13aa6-1306456580.tcb.qcloud.la/image/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E5%8C%85%E5%AD%90.jpeg?sign=14c5d7d192d13ac5a29f7c31752ea2b8&t=1633731200'
      }, {
        picUrl: 'https://7875-xuzhihui-test-1gkq2fi3f9c13aa6-1306456580.tcb.qcloud.la/image/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E9%9D%A2%E5%8C%85.jpeg?sign=b5dcb4105e6728397773954b0404c388&t=1633731208'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTopBanner() //请求顶部轮播图
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goFood() {
    wx.switchTab({
      url: "/pages/food2/food2"
    })
  },
  gotest() {
    wx.switchTab({
    
      url: "/pages/test/test"
    })
  },
  gowaimaifood2(){
    wx.navigateTo({
      url: "/pages/waimaifood2/waimaifood2",
    })
  },
  // checkFoodPage() {
  //   if (app.globalData.isNeedFenLei) {
  //     return '/pages/food2/food2'
  //   } else {
  //     return '/pages/food/food'
  //   }
  // },
  


  getMemberid:function(){
    wx.cloud.callFunction({
      name: 'getMember',
      data: {
        
      }
    })
    .then(res => {
                console.log("res为", res.result.data[0]._id)
                
                db.collection('member').where({
                  _id:res.result.data[0]._id
                }).get({
                  success:(ress)=>{
                    console.log("ress是sss",ress.data[0].consum_points)
                    db.collection('member').doc(ress.data[0]._id)
                    .update({
                      data: {
                        consum_points: ress.data[0].consum_points + 20  , //制作完成
                      }
                    })
                  },fail:err=>{
                  }                 
                })
    }).catch(res => {
      console.log("用户订单列表失败", res)
    })
  },



  getTopBanner() {
    wx.cloud.database().collection("lunbotu")
      .get()
      .then(res => {
        console.log("首页banner成功", res.data)
        if (res.data && res.data.length > 0) {
          //如果后台配置轮播图就用后台的，没有的话就用默认的
          this.setData({
            banner: res.data
          })
        }
      }).catch(res => {
        console.log("首页banner失败", res)
      })
  },
})



// Component({
//   pageLifetimes: {
//     show() {
//       if (typeof this.getTabBar === 'function' &&
//         this.getTabBar()) {
//         this.getTabBar().setData({
//           selected: 0
//         })
//       }
//     }
//   }
// })







