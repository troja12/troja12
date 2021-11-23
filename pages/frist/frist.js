// pages/frist/frist.js
const app = getApp()
let db = wx.cloud.database();
Page({

 
  /**
   * 页面的初始数据
   */
  data: {
    cm_point:[],
    consum_points:'',
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
    console.log("查看结果",app.globalData.openid)
    if(app.globalData.openid == ''){
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
          // console.log("res为",res)
        }
      })
    }
        //调用遍历用户信息的方法
    // this.selectbalance()
     
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

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0

      })

    }    //自定义tabbar的onshow


    this.getTopBanner() //请求顶部轮播图
    if(this.data.openid=''){
      this.setData({
        openid:app.globalData.openid
      })
    }
    // //获取当前管理员
    // this.getUserid()
    // //获取当前超级管理员
    // this.getManageId()
    var that = this
    //获取用户的详情
    wx.cloud.callFunction({
      name:'getMember',
      complete:res=>{
        if(res.result !== undefined){
          let data =  res.result.data
          if(data.length != 0){
            //该用户已经注册并授权，直接获取它的头像和昵称
            let nickname=data[0].nickName
            let avatarUrl = data[0].avatarUrl
            that.setData({
              memberInfo:data[0],
              nickName:nickname,
              avatarUrl:avatarUrl
            })
          }else{
            that.setData({

              'memberInfo.balance':0,
              'memberInfo.consum_points':0,
              'memberInfo.tel': ''
            })
          }
        }
      }
    })
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
    // 跳转到酒店堂食
    wx.navigateTo({
      url: "/pages/food2/food2",
    })
  },
  getpoint(){
    //跳转到积分页面
        wx.navigateTo({
          // url:'../vip/valueCard/valueCard',
           url:'../myPoints/myPoints?point=' + this.data.memberInfo.consum_points,
    })
    
      },

  gowaimaifood2(){
    // 跳转到外卖点单
    wx.navigateTo({
      url: "/pages/waimaifood2/waimaifood2",
    })
  },

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
    wx.cloud.database().collection("banner")
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











