// components/coupon/coupon.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    getcoupon:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

  
  
// Page({

//  /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     const db = wx.cloud.database()
//     db.collection('member').get({
//     success: (res) => {
//       var member = res.data
//       //let memberList = member[0]
//       var getcoupon = member[0].coupon_id[0]
//       console.log('查看', getcoupon )
//       this.setData({
//         getcoupon:getcoupon
//       })
      
//     }

    
//     })
    

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })
