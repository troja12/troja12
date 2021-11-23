// miniprogram/pages/address/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:{},
    popErrorMsg:''
  },
  _toAuth:function(){
    //获取用户授权
    wx.authorize({
      scope: 'scope.userLocation',
    })
    var that = this
    //打开地图选择位置
    wx.chooseLocation({
      complete: (res) => {
        let address = res.address
        let add = "addressList.address"
        that.setData({
          [add]:address
        })
      },
    })
  },
  _focus:function(evt){
    if(evt.currentTarget.dataset.id == 1){
      this.setData({
        'addressList.username': ''
      })
    }else if(evt.currentTarget.dataset.id == 2){
      this.setData({
        'addressList.telephone':''
      })
    }else if(evt.currentTarget.dataset.id == 3){
      this.setData({
        'addressList.address':''
      })
    }
  },
  _blur:function(evt){
    let value = evt.detail.value
    if(evt.currentTarget.dataset.id == 1 ){
      this.setData({
        'addressList.username':value
      })
    }else if(evt.currentTarget.dataset.id == 2){
      this.setData({
        'addressList.telephone':value
      })
      console.log("电话是",this.data.addressList.telephone)
      console.log("电话是1",this.mobile)
      //正则验证电话是否合格
      var mobile = /^[0-1][0-9]{9}[0-9]*$/
      var isMobile = mobile.exec(this.data.addressList.telephone)

      setTimeout(()=>{
        
        if(!isMobile){
          this.setData(
            { popErrorMsg: "请输入正确格式的电话号码" }
          ); 
          this.ohShitfadeOut(); 
          return;  
        }

      },100)

    }else if(evt.currentTarget.dataset.id == 3){
      this.setData({
        'addressList.address':value
      })
    }
  },
  //定时器提示框3秒消失
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },

  formSubmit(e) {
    let username = e.detail.value.username
    let telephone = e.detail.value.telephone
    let address = e.detail.value.address
    var mobile = /^[0-1][0-9]{9}[0-9]*$/
    var isMobile = mobile.exec(this.data.addressList.telephone)
    console.log(e.detail.value)
    setTimeout(()=>{
      if(username==''||telephone==''||address==''){
        this.setData(
          { popErrorMsg: "请将信息填写完整再提交" }
        ); 
        this.ohShitfadeOut(); 
        return;  
      }
      if(!isMobile){
        this.setData(
          { popErrorMsg: "请输入正确格式的电话号码" }
        ); 
        this,this.ohShitfadeOut();
        return;
      }
      
      let addresses = e.detail.value
      //获取数据库引用
      const db = wx.cloud.database()
      let id = e.detail.value.id
      //数据库新增操作
      if(id == ''){
       db.collection('address').add({
         data:{
           username:addresses.username,
           sex:addresses.sex,
           telephone:addresses.telephone,
           tag:'',
           address:addresses.address,
           isDefault:false,
           isOpen:false,
           isSelect:false
         },
         success:res => {
           wx.showToast({
             title: '新增成功',
           })
           console.log("3")
           wx.navigateBack({
             delta: 1,
           })
         },
         fail: err => {
           wx.showToast({
             icon: 'none',
             title: '新增失败'
           })
         }
       })
      }else{
        //数据库修改操作
        const _ = db.command
        db.collection('address').doc(id).set({
          data:{
           username:addresses.username,
           sex:addresses.sex,
           telephone:addresses.telephone,
           tag:'',
           address:addresses.address,
           isDefault:false,
           isOpen:false,
           isSelect:false
          },
           success:res => {
             wx.showToast({
               title: '修改成功',
             })
             console.log("1")
             wx.navigateBack({
               delta: 1,
             })
           },
           fail: err => {
             wx.showToast({
               icon: 'none',
               title: '修改失败'
             })
           }
        })
      }

    },100)

   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    //遍历数据库渲染数据
    var that = this
    //获取数据库引用
    const db = wx.cloud.database()
    console.log(id)
    if(id != undefined){
      //数据库条件ID查询操作
      db.collection('address').doc(id)
      .get({
        success(res){
          that.setData({
            addressList:res.data
          })
          console.log("2")
        }
      })
    }else{
      that.setData({
        addressList:[]
      })
      console.log("4")
    }

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