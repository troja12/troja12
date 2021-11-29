// pages/address/address.js

let startP = 0;
Page({


  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    initaddressList:[],
    pages:[],
    isManage:false
  },


  go_details:function(evt){
    console.log('当前id',evt.currentTarget.id)
    let id = evt.currentTarget.id
    console.log(id)
    wx.navigateTo({
    url: '/pages/address_me/detail/detail?id='+id,
  })
  },

  _toAdd:function(evt){
    wx.navigateTo({
      url: '/pages/address_me/detail/detail',
    })
  },

  
  _toEdit:function(evt){
      let id = evt.currentTarget.id
      console.log(id)
      wx.navigateTo({
      url: '/pages/address/add/add?id='+id,
    })
  },

  _toEditZitidian:function(evt){
    let id = evt.currentTarget.id
    console.log(id)
    wx.navigateTo({
    url: '/pages/address_me/detail/detail?id='+id,
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
    console.log("传参",options)
    this.setData({
      isManage:options.isManage
    })
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


})