// miniprogram/pages/person/personInfo/personInfo.js
var time = require('../../../util/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // refbalance:'',
    // refid:'',
    checked1: '',
    checked0: '',
    member: {},
    birthday: '请选择日期',
    sex2: '',
    memberList: {},
    popErrorMsg: '',
    phone: '',
    buttonClicked: false,
  },
  //检测
  _focus: function (evt) {
    if (evt.currentTarget.dataset.id == 1) {
      this.setData({
        'memberList.username': ''
      })
    } else if (evt.currentTarget.dataset.id == 2) {
      this.setData({
        'memberList.telephone': ''
      })
    } else if (evt.currentTarget.dataset.id == 3) {
      this.setData({
        'memberList.sex': ''
      })
    }
  },

  //输入
  _blur: function (evt) {
    let value = evt.detail.value
    if (evt.currentTarget.dataset.id == 1) {
      this.setData({
        'memberList.username': value
      })
    } else if (evt.currentTarget.dataset.id == 2) {
      this.setData({
        'memberList.telephone': value
      })
      console.log(this.data.memberList.telephone)
      //正则验证电话是否合格
      var mobile = /^[0-1][0-9]{9}[0-9]*$/
      var isMobile = mobile.exec(this.data.memberList.telephone)

      setTimeout(() => {

        if (!isMobile) {
          this.setData({
            popErrorMsg: "请输入正确格式的电话号码"
          });
          this.ohShitfadeOut();
          return;
        }

      }, 100)

    } else if (evt.currentTarget.dataset.id == 3) {
      this.setData({
        'memberList.sex': value
      })
    }
  },

  //定时器提示框3秒消失
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({
        popErrorMsg: ''
      });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },
  //性别选择
  radioChange(e) {
    var sex2 = this.data.member.sex
    console.log('sex2值为：', sex2)

  },
  //生日选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let mydate = new Date(e.detail.value)
    console.log(mydate)
    var week = time.week(mydate)
    console.log(week)
    this.setData({
      birthday: e.detail.value,
      week: week.week
    })
  },

  //保存会员资料
  formSubmit(e) {
    let username = e.detail.value.username
    let telephone = e.detail.value.telephone
    var birthday1 = this.data.birthday
    console.log("生日", birthday1)
    console.log(e.detail.value)
    setTimeout(() => {
      if ((username == '' || telephone == '' || birthday1 == undefined)) {
        this.setData({
          popErrorMsg: "请将信息填写完整"
        });
        this.ohShitfadeOut();
        return;
      }
        //正则验证电话是否合格
  
    var mobile = /^[0-1][0-9]{9}[0-9]*$/
    var isMobile = mobile.exec(this.data.memberList.telephone)
    if (!isMobile) {
      this.setData({
        popErrorMsg: "请输入正确格式的电话号码"
      });
      this.ohShitfadeOut();
      return;
    }
      //获取数据库引用
      //数据库操作
      let addresses = e.detail.value
      console.log(addresses)
      var id = this.data.member._id //系统生成id
      const db = wx.cloud.database()
      var myDate = new Date()
      var birthday = this.data.birthday
      var currentTime = time.formatTime(myDate, 'Y/M/D h:m:s')
      console.log(id, currentTime)
      //判断是否新用户 （用户自己进来）
      var telmember = this.data.member.tel
      console.log("判断电话是否为空", telmember)
      console.log("判断是否有推荐人", app.globalData.refereeId)
      console.log("是否推荐人openid已经存入", this.data.member.refereeId) //防止反复推送
      if (telmember == '') {
        var balancemember = this.data.member.balance // 获取当前余额
        var points = this.data.member.consum_points // 获取当前余额
        console.log(balancemember)
        var balancemember1 = 5 //奖励金额
        var balancemember2 = balancemember + balancemember1
        db.collection('member').doc(id).update({
          data: {
            consum_points: points ,
            balance: balancemember2,
            // refid: app.globalData.refereeId, //有推荐人就录入推荐人id
          },
          success: res => {
            wx.showToast({
              title: '新用户奖励成功',
            })
            console.log("新用户余额奖励成功")
            //  wx.navigateBack({
            //    delta: 1,
            //  })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '失败'
            })
          }
        })

      }
      //有推荐人,双方奖励
      console.log("是否有推荐人", this.data.member.refid)
      if (this.data.member.refid && telmember == '') {
        //var myopenid = this.data.member._openid //本人的openid
        console.log("本人openid值", this.data.member._openid)
        const db = wx.cloud.database()
        //var id2 = app.globalData.refereeId //推荐人的openid
        console.log("推荐人openid", app.globalData.refereeId)
        //调用云函数查看会员表
        wx.cloud.callFunction({
          name: 'genewmember',
          data: {
            _openid: app.globalData.refereeId,
          },
          success: (res) => {
            console.log("推荐次数", res.result.data[0].ref_number)
            if(res.result.data[0].ref_number < 3){
            wx.cloud.callFunction({
              name: 'updatabalance',
              data: {
                _id: res.result.data[0]._id, //推荐人的系统id传入
                ref_number:res.result.data[0].ref_number + 1,
                balance: res.result.data[0].balance + 3,
                consum_points: res.result.data[0].consum_points
                // updatetime:currentTime
              },
              success: (res) => {
                wx.showToast({
                  title: '推荐人奖励成功',
                })
                console.log("推荐人收到奖励", balance)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '奖励失败，请稍后再试',
                  duration: 2000
                })
              }
            })
          }


          },
          fail: (err) => {
            wx.showToast({
              icon: 'none',
              title: '查看失败',
              duration: 2000
            })
          }
        })


      }

      // 数据库修改操作
      const _ = db.command
      // db.collection('member').doc(id).set({  set直接改了数据库格式 条目 不行
      db.collection('member').doc(id).update({
        data: {
          birthday: birthday,
          nickname: addresses.username,
          sex: addresses.sex,
          tel: addresses.telephone,
          update_time: currentTime
        },
        success: res => {
          wx.showToast({
            title: '信息修改成功',
          })
          console.log("信息修改成功")
    
           wx.navigateBack({
             delta: 1,
           })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '修改失败！！！'
          })
        }
      })
    }, 100)
  },


  getPhoneNumber: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //用户点击拒绝
      wx.hideLoading({
        complete: (res) => {},
      })
      return
    }
    const that = this
    wx.cloud.callFunction({
      name: 'getPhone',
      data: {
        weRunData: wx.cloud.CloudID(e.detail.cloudID)
      }
    }).then(res => {
      that.setData({
        phone: res.result.phone
      })

      var id = this.data.member._id
      var phone = res.result.phone
      var myDate = new Date()
      var currentTime = time.formatTime(myDate, 'Y/M/D h:m:s')
      console.log(id, currentTime)
      //调用云函数修改会员表
      wx.cloud.callFunction({
        name: 'updatemember',
        data: {
          _id: id,
          tel: phone,
          updatetime: currentTime
        },
        success: res => {
          wx.hideLoading({
            complete: (res) => {},
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '更新电话失败，请稍后再试',
            duration: 2000
          })
        }
      })


    }).catch(err => {
      console.error(err)
    })
  },


  //查询会员是否存在
  selectMember: function () {
    const db = wx.cloud.database()
    //表权限为默认权限，只有创建者openid可以读写
    db.collection('member').get({
      success: (res) => {
        var member = res.data
        let memberList = member[0]
        memberList.telephone = member[0].tel
        this.setData({
          member: member[0],
          memberList: memberList,
          birthday: member[0].birthday,
          phone: member[0].tel,
          sex2: member[0].sex,
        })
        console.log("sex2", this.data.sex2)
        if (this.data.sex2 == 1) {

          this.setData({
            'checked1': '1',
            'checked0': ''
          })
          console.log('radio发生change事件，携带checked1值为：', this.data.checked1)
        } else if (this.data.sex2 == 0) {
          this.setData({
            'checked0': '0',
            'checked1': '',
          })
          console.log('radio发生change事件，携带checked0值为：', this.data.checked0)
        }
        console.log("phone", this.data.phone)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '登录失败，请稍后再试',
          duration: 2000
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用遍历用户信息的方法

    // var myDate = new Date()
    // var week = time.week(myDate)
    // console.log(week)
    // this.setData({
    //   birthday: week.date,
    //   week: week.week,
    //   myDate: myDate
    // })
    this.selectMember()

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