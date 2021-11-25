//app.js
App({
  //创建towxml对象，供小程序页面使用
  globalData: {
    
    //要设置的地方
    isNeedSaoMa: false, //是否需要扫码点餐： true需要，false不需要
    address: '', //isNeedSaoMa为true时是桌号，false时店内随意下单
    isNeedFenLei: true, //是否需要分类，true需要：适合菜品多的时候，false不需要：适合菜品少的时候
    userInfo: {},
    openid: null,
    unionid:'',
  },
  onLaunch: function () {
    //云开发初始化
    wx.cloud.init({
      env: 'cloud1-3gpl3dnv29eed7ff', //2-src替换成你自己的云开发环境id
      traceUser: true,
    })
    this.getOpenid();
    this.getunionid();
    this.selectMember();
  },
  // 获取用户openid
  getOpenid: function () {
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      console.log('本地获取openid:' + openidStor);
      app.globalData.openid = openidStor;
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          console.log('云函数获取openid成功', res.result.openid)
          var openid = res.result.openid;
          wx.setStorageSync('openid', openid)
          app.globalData.openid = openid;
        },
        fail(res) {
          console.log('云函数获取失败', res)
        }
      })
    }
  },

  getunionid(){
    var app = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res1 => {
        console.log('唯一识别',res1.result.unionid)
        app.globalData.unionid = res1.result.unionid
      }  
      })
  },

      //查询会员是否存在
  selectMember:function(){
        const db = wx.cloud.database()
        //表权限为默认权限，只有创建者openid可以读写
        db.collection('member').get({
          success:(res)=>{
            var member = res.data
            if(member.length === 0){
              //当会员不存在时，为用户创建会员信息
              wx.showModal({
                title: '请登录',
                content: '请到个人中心登录',
                showCancel: false, //去掉取消按钮
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../me/me',
                    })
                  }
                }
              })
            }else{
              this.globalData.userInfo = member[0];
              console.log('用户信息',this.globalData.userInfo)
            }
          },
          fail:err=>{
            wx.showToast({
              icon:'none',
              title: '调用会员失败，请稍后再试',
              duration:2000
            })
          }
    })
  },
  _checkOpenid() {
    let app = this
    let openid = this.globalData.openid;
    if (!openid) {
      app.getOpenid();
      wx.showLoading({
        title: 'openid不能为空，请重新登录',
      })
      return null;
    } else {
      return openid;
    }
  },

  // 保存userinfo
  _saveUserInfo: function (user) {
    this.globalData.userInfo = user;
    wx.setStorageSync('user', user)
  },

  //获取今天是本月第几周
  _getWeek: function () {
    // 将字符串转为标准时间格式
    let date = new Date();
    let month = date.getMonth() + 1;
    let week = this.getWeekFromDate(date);
    if (week === 0) { //第0周归于上月的最后一周
      month = date.getMonth();
      let dateLast = new Date();
      let dayLast = new Date(dateLast.getFullYear(), dateLast.getMonth(), 0).getDate();
      let timestamp = new Date(new Date().getFullYear(), new Date().getMonth() - 1, dayLast);
      week = this.getWeekFromDate(new Date(timestamp));
    }
    let time = month + "月第" + week + "周";
    return time;
  },

  getWeekFromDate: function (date) {
    // 将字符串转为标准时间格式
    let w = date.getDay(); //周几
    if (w === 0) {
      w = 7;
    }
    let week = Math.ceil((date.getDate() + 6 - w) / 7) - 1;
    return week;
  },
  // 获取当前时间
  _getCurrentTime() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();

    var curDateTime = d.getFullYear() + '年';
    if (month > 9)
      curDateTime += month + '月';
    else
      curDateTime += month + '月';

    if (date > 9)
      curDateTime = curDateTime + date + "日";
    else
      curDateTime = curDateTime + date + "日";
    if (hours > 9)
      curDateTime = curDateTime + hours + "时";
    else
      curDateTime = curDateTime + hours + "时";
    if (minutes > 9)
      curDateTime = curDateTime + minutes + "分";
    else
      curDateTime = curDateTime + minutes + "分";
    return curDateTime;
  },
  // 获取当前的年月日
  _getNianYuiRi() {
    let date = new Date()
    let year = date.getFullYear()
    // 我们的月份是从0开始的 0代表1月份，11代表12月
    let month = date.getMonth() + 1
    let day = date.getDate()
    let key = '' + year + month + day
    console.log('当前的年月日', key)
    return key
  }
})