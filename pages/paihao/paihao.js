const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    index: 0,
    myxiaozhuonum: 0,
    mydazhuonum: 0
  },
  onLoad() {
    let num = wx.getStorageSync('renshu') //获取保存的就餐人数
    if (num > 0) {
      this.setData({
        index: num
      })
    }
    this.getNum()
  },
  //选择就餐人数
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //重新排号
  chongxinpaihao() {
    this.setData({
      myxiaozhuonum: 0,
      mydazhuonum: 0
    })
  },
  //排号
  paihao(e) {
    //type： 1小桌，2大桌
    let type = e.currentTarget.dataset.type
    let num = this.data.array[this.data.index] //就餐人数
    console.log('就餐人数', num)
    console.log('就餐人数', 5 <= num <= 10)
    wx.setStorageSync('renshu', num) //保存就餐人数
    if (num <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择就餐人数',
      })
      return
    } else if (num < 5 && type == 2) {
      wx.showToast({
        icon: 'none',
        title: '1-4人只能排小桌',
      })
      return
    } else if (num >= 5 && num <= 10 && type == 1) {
      wx.showToast({
        icon: 'none',
        title: '5-10人请排大桌',
      })
      return
    }
    //1，查询今日排号信息
    wx.cloud.callFunction({
        name: 'paihao',
        data: {
          action: 'today',
          id: app._getNianYuiRi()
        }
      })
      .then(res => {
        console.log('查询成功', res)
        this.addPaiHaoInfo(type, res.result.data)
      }).catch(res => {
        console.log('查询失败', res)
        this.addPaiHaoInfo(type, null)
      })
  },
  //添加排号信息到数据库
  addPaiHaoInfo(type, paihaoInfo) {
    let dataObj = {}
    if (paihaoInfo) { //今日已经存在排号数据   
      wx.cloud.callFunction({
          name: 'paihao',
          data: {
            action: 'user',
            id: paihaoInfo._id,
            type: type
          }
        })
        .then(res => {
          console.log('更新添加成功', res)
          this.getNum()
        }).catch(res => {
          console.log('更新添加失败', res)
        })
    } else { //今日不存在排号数据
      dataObj = {
        _id: app._getNianYuiRi(),
        xiaozhuo: type == 1 ? [app.globalData.openid] : [],
        dazhuo: type == 2 ? [app.globalData.openid] : [],
        xiaozhuonum: 1,
        dazhuonum: 1
      }
      db.collection('paihao')
        .add({
          data: dataObj
        }).then(res => {
          console.log('添加成功', res)
          this.getNum()
        }).catch(res => {
          console.log('添加失败', res)
        })
    }

  },

  //查看自己的排号信息
  getNum() {
    wx.cloud.callFunction({
        name: 'paihao',
        data: {
          action: 'today',
          id: app._getNianYuiRi()
        }
      }).then(res => {
        console.log('获取排号信息成功', res)
        if (res.result&&res.result.data) {
          let paihao = res.result.data
          let myxiaozhuonum = paihao.xiaozhuo.lastIndexOf(app.globalData.openid)
          let mydazhuonum = paihao.dazhuo.lastIndexOf(app.globalData.openid)
          console.log('myxiaozhuonum', myxiaozhuonum)
          console.log('mydazhuonum', mydazhuonum)
          this.setData({
            xiaozhuonum: paihao.xiaozhuonum,
            dazhuonum: paihao.dazhuonum,
            myxiaozhuonum: myxiaozhuonum > -1 ? myxiaozhuonum + 1 : 0,
            mydazhuonum: mydazhuonum > -1 ? mydazhuonum + 1 : 0
          })
        }
      })
      .catch(res => {
        console.log('获取排号信息失败', res)
      })
  },


})