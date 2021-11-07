// miniprogram/pages/member/myPoints/myPoints.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    havePoints:false,
    consum_points:'',
    openid:'',
    manageid:'',

  },



  //查询会员是否存在
  selectMember:function(){
    const db = wx.cloud.database()
    //表权限为默认权限，只有创建者openid可以读写
    db.collection('member').get({
      success:(res)=>{
        var member = res.data
        let len = member.length
        if(len === 0){
          wx.navigateBack({
            delta:1,
            complete: (res) => {
              wx.showToast({
                icon:'none',
                title: '请您点击头像授权后登录！',
                duration:5000
              })
            },
          })
        }
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '登录失败，请稍后再试',
          duration:2000
        })
      }
    })
  },


    //获取当前超级管理员
    getUserid:function(){
      wx.cloud.callFunction({
        name:'getManage',
        data:{
          type:1
        },
        success:(res)=>{
          var user_id = res.result.data[0].user_id
          this.setData({
            manageid:user_id
          })
        },
        fail:(err)=>{
          console.log('发生错误',err)
        }
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('跳转数据获取', options)

    //获取当前超级管理员
    this.getUserid()
    //检查是否登录
    this.selectMember()
    let point     =  options.point

    console.log('积分', point)
    this.setData({
      consum_points:point,
      // balance: options.balance,
      
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