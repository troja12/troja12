const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    xiaozhuonum: 0,
    dazhuonum: 0,
    xiaozhuoAll: 0,
    dazhuoAll: 0
  },
  onLoad() {
    this.getNum()
  },
  //叫号
  jiaohao(e) {
    //type： 1小桌，2大桌
    let type = e.currentTarget.dataset.type
    wx.cloud.callFunction({
        name: 'paihao',
        data: {
          action: 'admin',
          id: app._getNianYuiRi(),
          type: type
        }
      })
      .then(res => {
        console.log('更新成功', res)
        this.getNum()
      }).catch(res => {
        console.log('更新失败', res)
      })
  },
  //获取当前排号信息
  getNum() {
    db.collection('paihao').doc(app._getNianYuiRi()).get()
      .then(res => {
        console.log('获取排号信息成功', res)
        if (res.data) {
          let paihao = res.data
          this.setData({
            xiaozhuonum: paihao.xiaozhuonum,
            dazhuonum: paihao.dazhuonum,
            xiaozhuoAll: paihao.xiaozhuo.length,
            dazhuoAll: paihao.dazhuo.length
          })
        }
      })
      .catch(res => {
        console.log('获取排号信息失败', res)
      })
  },
})