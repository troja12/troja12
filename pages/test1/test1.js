// pages/test1/test1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  geDetail(e){
    console.log(e.currentTarget.dataset.item._id)
    let id=e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/test1detail/test1detail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.database().collection('news').get()
    .then(res=>{
      console.log("新闻列表",res)
      this.setData({
        list:res.data
      })
    })
    .catch(res=>{
      console.log("错误",res)
    })
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

  }
})