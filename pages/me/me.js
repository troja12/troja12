var time = require('../../util/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'data:image/png;base64,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',
    userInfo: null,
    newuser:'',
    isuser:'',
    nickName:'',
    logged: false,
    memberInfo:{},
    manageid:'',
    isSupermanage:false,
    openid:'',
    isManage:false,
    isShowUserName:false
  },

  tui() {
    console.log("推出成功")
    wx.setStorageSync('user', null)
    this.setData({
      newuser:2,
      userInfo: null,
      isShowUserName: false
    })
  },
  //查询该用户是否授权，
  // queryAuthByOpenid1:function(sb){
  //   var that = this
  //   //获取用户的详情
  //   wx.cloud.callFunction({
  //     name:'getMember',
  //     complete:res=>{
  //       if(res.result.data.length !== 0){  
  //         if(sb !== 1){
  //           //跳转到个人信息页面
  //           wx.navigateTo({
  //             url: '../me/personInfo/personInfo',
  //           })
  //         }
  //       }
  //       else{
  //         // this.getUserProfile()
  //         // 获取用户信息
  //         wx.showModal({
  //           title: '温馨提示',
  //           content: '正在请求您的个人信息',
  //           success(res) {
  //             if (res.confirm) {
  //               wx.getUserProfile({
  //               desc: "获取你的昵称、头像",
  //               success: res => {
  //                 wx.showLoading({
  //                   title: '加载中...',
  //                 })
  //                 let userInfo = res.userInfo;
  //                 that.setData({
  //                   userInfo:userInfo
  //                 })
  //                 //调用创建用户信息的方法
  //                 that.creatMember()
  //               },
  //               fail: res => {
  //                 //拒绝授权
  //                 wx.showToast({
  //                   title: '请求失败，请稍后重试',
  //                   icon:'none',
  //                   duration: 2000
  //                 })
  //                 return;
  //               }
  //             })} else if (res.cancel) {
  //               //拒绝授权 showErrorModal是自定义的提示
  //               wx.showToast({
  //                 title: '您已拒绝授权',
  //                 icon:'none',
  //                 duration: 2000
  //               })
  //               return;
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },

  //查询该用户是否授权，
  queryAuthByOpenid:function(){
    this.setData({
      buttonClicked: true
    }) 
    
    if(this.data.newuser == 2){ 

      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log("获取用户信息成功", res)
          let user = res.userInfo
          this.setData({
            newuser:1,
            isShowUserName: true,
            userInfo: user,
          })
          user.openid = app.globalData.openid;
          app._saveUserInfo(user);
        },
        fail: res => {
          console.log("获取用户信息失败", res)
        }
      })
        }
    if(this.data.newuser == 1){ 
           
            //跳转到个人信息页面
            wx.navigateTo({
              url: '../me/personInfo/personInfo',
            })
            this.setData({
              buttonClicked: false
            }) 
            
        }
      
    var that = this
    if(this.data.newuser == ''){ 

          wx.getUserProfile({
            desc: "获取你的昵称、头像",
            success: res => {
              wx.showLoading({
                title: '加载中...',
              })
              console.log("获取用户信息成功", res)
              let user = res.userInfo;
              this.setData({
                isShowUserName: true,
                userInfo:user,               
                newuser:1
              })
              
              //调用创建用户信息的方法
              that.creatMember()
            },
            fail: res => {
              //拒绝授权
              this.setData({
                buttonClicked: false 
              })
              wx.showToast({
                title: '请求失败，请稍后重试',
                icon:'none',
                duration: 2000
              })
              return;
            }
          })
         
        }
    
  },
     
  //  //获取管理员列表中是否存在当前用户openid
  //  getUserid:function(){
  //   wx.cloud.callFunction({
  //     name:'getManage',
  //     data:{
  //       type:2
  //     },
  //     success: res=>{
  //       if(!app.globalData.openid){
  //         wx.cloud.callFunction({
  //           name: 'login',
  //           success: res1 => {
  //             console.log('login',res1)
  //             let openid = res1.result.openid
  //             app.globalData.openid = openid
  //             this.setData({
  //               openid:app.globalData = openid
  //             })
  //             let manages = res.result.data
  //             manages.forEach(item => {
  //               if(item.user_id == openid){
  //                 this.setData({
  //                   isManage:true
  //                 })
  //               }
  //             })             
  //           }
  //         })
  //       }else{
  //         let openid = app.globalData.openid
  //         let manages = res.result.data
  //         manages.forEach(item => {
  //           // console.log('manages',item.user_id,openid)
  //           if(item.user_id == openid){
  //             this.setData({
  //               isManage:true
  //             })
  //           }
  //         })
  //       }
  //     },
  //     fail:(err)=>{
  //       console.log('发生错误',err)
  //     }
  //   })
  // },
  // //获取当前超级管理员的openid
  // getManageId:function(){
  //   wx.cloud.callFunction({
  //     name:'getManage',
  //     data:{
  //       type:1
  //     },
  //     success:(res)=>{
  //       var user_id = res.result.data[0].user_id
  //       if(user_id == app.globalData.openid){
  //         this.setData({
  //           isSupermanage:true
  //         })
  //       }

  //     },
  //     fail:(err)=>{
  //       console.log('发生错误',err)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
    
  //   if (!wx.cloud) {
  //     wx.redirectTo({
  //       url: '../chooseLib/chooseLib',
  //     })
  //     return
  //   }
    
  //   let sb = 1
  //   //调用
  //   this.queryAuthByOpenid(sb)

  // },
  
  //查询会员是否存在
  selectMember:function(){
    const db = wx.cloud.database()
    //表权限为默认权限，只有创建者openid可以读写
    db.collection('member').get({
      success:(res)=>{
        var member = res.data
        if(member.length === 0){
          //当会员不存在时，为用户创建会员信息
          this.creatMember()
        }else if(member[0].nickname == ''){
          //如果已经存在，传入会员id进行修改操作
          let id = member[0]._id
          this._updateMember(id)
        }else{
          wx.hideLoading({
            complete: (res) => {
            },
          })
          //跳转到个人信息页面
          wx.navigateTo({
            url: '../me/personInfo/personInfo',
          })
        }
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '创建会员失败，请稍后再试',
          duration:2000
        })
      }
    })
  },
  _updateMember:function(id){
    var myDate = new Date()
    var currentTime = time.formatTime(myDate,'Y/M/D h:m:s')
    var userInfo = this.data.userInfo
    //调用云函数修改会员表
    wx.cloud.callFunction({
      name:'updatemember',
      data:{
        _id:id,
        avatarUrl:userInfo.avatarUrl,
        nickname:userInfo.nickName,
        sex:userInfo.gender,
        language:userInfo.language,
        city:userInfo.city,
        province:userInfo.province,
        country:userInfo.country,
        updatetime:currentTime
      },
      success:res =>{
        wx.hideLoading({
          complete: (res) => {
          },
        })
        //跳转到个人信息页面
        wx.navigateTo({
          url: '../me/personInfo/personInfo',
        })
      },
      fail:err =>{
        wx.showToast({
          icon:'none',
          title: '创建会员失败，请稍后再试',
          duration:2000
        })
      }
    })
  },


//退出登录



  //创建会员积分表方法
  creatMember:function(evt){
    var userInfo = this.data.userInfo
    var that = this
    var myDate = new Date()
    var currentTime = time.formatTime(myDate,'Y/M/D h:m:s')
    var appid =''
    var env=''
    var arr = [];
    arr.push(0);
    wx.cloud.callFunction({
      name:'getOpenid',
      success:function(res){
        console.log(res)
        appid=res.result.appid
        env=res.result.env
        const db = wx.cloud.database()
        db.collection('member').add({
          data:{
            nickname:userInfo.nickName,
            avatarUrl:userInfo.avatarUrl,
            sex:userInfo.gender,
            tel:'',
            language:userInfo.language,
            city:userInfo.city,
            country:userInfo.country,
            province:userInfo.province,
            balance:0,
            consum_points:0,
            member_level:1,
            coupon_id:arr,
            card_id:[],
            appid:appid,
            env:env,
            isManage:false,
            refid: app.globalData.refereeId,
            ref_number:0,
            create_time:currentTime,
            update_time:currentTime
          },
          success:re=>{
            //返回订单ID
            that.setData({
              memberId:re._id,
              buttonClicked: false 
            })
            //跳转到个人信息页面
            wx.navigateTo({
              url: '../me/personInfo/personInfo',
            })
            
            wx.hideLoading({
              complete: (res) => {
              },
            })
          },
          fail:er=>{
            wx.showToast({
              icon:'none',
              title: '创建会员失败',
              duration:2000
            })
          }
        })
      },
      fail:err=>{
        wx.showToast({
          icon:'none',
          title: '创建会员失败',
          duration:2000
        })
      }
    })
  },
//   getcard(){
// //跳转到充值页面
//     wx.navigateTo({
//       // url:'../vip/valueCard/valueCard',
//        url:'../vip/valueCard/valueCard?balance=' + this.data.memberInfo.balance,
// })

//   },

  getpoint(){
    //跳转到积分页面
        wx.navigateTo({
          // url:'../vip/valueCard/valueCard',
           url:'../member/myPoints/myPoints?point=' + this.data.memberInfo.consum_points,
    })
    
      },

  selectbalance:function(){
    const db = wx.cloud.database()
    //表权限为默认权限，只有创建者openid可以读写
    db.collection('member').get({
      success:(res)=>{
        var member = res.data       
        console.log("huiyuan",member)
        if(res.data.length !== 0){ 
          this.setData({
            newuser:1,          
          })
          // console.log('daol')
          
        }
        this.setData({
          memberInfo:member[0],
          // sex2:member[0].balance
        })
      },fail:err=>{
        wx.showToast({
          icon:'none',
          title: '登录失败，请稍后再试',
          duration:2000
        })
      }
      })

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    
    // let sb = 1
    // //调用
    // this.queryAuthByOpenid(sb)
    if(app.globalData.openid == ''){
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
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

  }
})