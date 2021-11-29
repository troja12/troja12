// miniprogram/pages/address/add/add.js
var util = require('../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temp_img:'cloud://cloud1-3gpl3dnv29eed7ff.636c-cloud1-3gpl3dnv29eed7ff-1308423562/system-icon/图片添加.png',
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
    }else if(evt.currentTarget.dataset.id == 4){
      this.setData({
        'addressList.arrive':''
      })
    }else if(evt.currentTarget.dataset.id == 5){
      this.setData({
        'addressList.date':''
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
      console.log(this.data.addressList.telephone)
      //正则验证电话是否合格
      var mobile = /^[1][0-9][0-9]{9}$/
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
    let arrive = e.detail.value.arrive
    let date = e.detail.value.date
    console.log(e.detail.value)
    console.log('当前图片',this.data.temp_img)
    console.log('当前shijian',Date.parse(new Date()))
    setTimeout(()=>{
      if(username==''||telephone==''||address==''){
        this.setData(
          { popErrorMsg: "请将信息填写完整再提交" }
        ); 
        this.ohShitfadeOut(); 
        return;  
      }
      let addresses = e.detail.value
      //获取数据库引用
      const db = wx.cloud.database()
      let id = e.detail.value.id
      console.log('当前图片',this.data.temp_img)
      var date = new Date();
      var createTime = util.formatTime1(date)
      var createTime1 =  createTime.replace(/-/g, '/')
      //数据库新增操作
      if(id == ''){
       db.collection('umzugorder').add({
         data:{
           username:addresses.username,
           sex:addresses.sex,
           telephone:addresses.telephone,
           tag:'',
           address:addresses.address,
           arrive:addresses.arrive,
           date:addresses.date,
           isDefault:false,
           isOpen:false,
           isSelect:false,
           status:0,
           img:this.data.temp_img,
           _createTime: createTime1 //创建的时间
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
        var date = new Date();
        var createTime = util.formatTime1(date)
        var createTime1 =  createTime.replace(/-/g, '/')
        db.collection('umzugorder').doc(id).set({
          data:{
           username:addresses.username,
           sex:addresses.sex,
           telephone:addresses.telephone,
           tag:'',
           address:addresses.address,
           arrive:addresses.arrive,
           date:addresses.date,
           isDefault:false,
           isOpen:false,
           isSelect:false,
           _createTime: createTime1 //创建的时间
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

  },
  
// 上传照片
  insertImage() {
    var _this = this;
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage_editor('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage_editor('camera')
          }
        }
      }
    })
  },
  // 选择图片本地路径
  chooseWxImage_editor: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        that.upload_picture(res.tempFilePaths[0]) //调用上传方法
      }
    })
  },
  /**编辑器图片上传至服务器**/
  upload_picture: function(name) {
    console.log('传参',name)
    console.log('this',this)
    var that = this
    const cloudPath = 'umzug_img/' + Date.parse(new Date()) 
        //选择完成会先返回一个临时地址保存备用
        //将照片上传至云端需要刚才存储的临时地址
        wx.cloud.uploadFile({
          cloudPath,
          filePath: name,
          success(res) {
          //上传成功后会返回永久地址
             console.log(res.fileID) 
             console.log('that',that) 
             that.setData({
              temp_img:res.fileID
             })
             
          }
        })
    
  }

})