// pages/address/address.js

let startP = 0;
Page({


  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    initaddressList:[],
    pages:[]
  },

  _selectAddress:function(evt){
    console.log("当前地址为",evt.currentTarget.dataset.address)
    
    let _id = evt.currentTarget.dataset.id
    const db = wx.cloud.database()
 
      db.collection('address').doc(_id).update({
        data:{
          isSelect:true
        },
        success:res=>{
          wx.redirectTo({
            url: '/pages/waimaipay/waimaipay?address='+evt.currentTarget.dataset.address,
          })
        },
        fail:err =>{
          wx.showToast({
            icon:'none',
            title: '操作失败，请稍后再试',
            duration:2000
          })
        }
      })


  },

  _selectAddress1:function(evt){
    console.log("当前地址为",evt.currentTarget.dataset.address)
    console.log("当前page",getCurrentPages().length)
    let _id = evt.currentTarget.dataset.id
    const db = wx.cloud.database()

  
            db.collection('init-address').doc(_id).update({
              data:{
                isSelect:true
              },
              success:res=>{
                wx.redirectTo({
                  url: '/pages/waimaipay/waimaipay?address='+evt.currentTarget.dataset.address,
                })
              },
              fail:err =>{
                wx.showToast({
                  icon:'none',
                  title: '操作失败，请稍后再试',
                  duration:2000
                })
              }
            })
      
  },

  _toAdd:function(evt){
    wx.navigateTo({
      url: '../add/add',
    })
  },

  
  _toEdit:function(evt){
    let id = evt.currentTarget.id
    console.log(id)
    wx.navigateTo({
      url: '../add/add?id='+id,
    })
  },

  _del:function(evt){
    var that = this
    let id = evt.currentTarget.id
    //获取数据库引用
    const db = wx.cloud.database()
    //数据库删除操作
    db.collection('address').doc(id).remove({
      success(res) {
        that.onShow()
      }
    })

  },
  _touchstart:function(evt){
    startP = evt.changedTouches[0].pageX
  },
  _touchend:function(evt){
    let endP = evt.changedTouches[0].pageX
    let id = evt.currentTarget.id
    var isOpen = "addressList["+id+"].isOpen"
    if(startP - endP>50){
      this.setData({
        [isOpen]:true
      })
    }else if(startP - endP<-50){
      this.setData({
        [isOpen]:false
      })
    }else{
      let addressLists = this.data.addressList
      this.setData({
        [isOpen]:addressLists[id].isOpen
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("当前页面信息",getCurrentPages().length)
    //遍历数据库渲染数据
    var that = this
     //获取数据库引用
     const db = wx.cloud.database()
     //数据库新增操作
     db.collection('address').get({
      success(res){
        that.setData({
          addressList:res.data,
          pages:getCurrentPages().length
        })
      }
     })
    //  console.log("page信息",this.pages)
     db.collection('init-address').get({
      success(res){
        that.setData({
          initaddressList:res.data
        })
      }
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

    //遍历数据库渲染数据
    var that = this
    
     //获取数据库引用
     const db = wx.cloud.database()
     //数据库新增操作
     db.collection('address').get({
      success(res){
        that.setData({
          addressList:res.data
        })
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

  }
})