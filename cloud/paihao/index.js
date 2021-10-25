// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  let dataObj = {}
  if (event.action == 'user') { //用户排号  
    if (event.type == 1) { //type: 1小桌，2大桌
      dataObj = {
        xiaozhuo: _.push(wxContext.OPENID)
      }
    } else if (event.type == 2) {
      dataObj = {
        dazhuo: _.push(wxContext.OPENID)
      }
    }
    return await db.collection('paihao').doc(event.id)
      .update({
        data: dataObj
      })
  } else if (event.action == 'admin') { //管理员叫号
    if (event.type == 1) { //type: 1小桌，2大桌
      dataObj = {
        xiaozhuonum: _.inc(1)
      }
    } else if (event.type == 2) {
      dataObj = {
        dazhuonum: _.inc(1)
      }
    }
    return await db.collection('paihao').doc(event.id)
      .update({
        data: dataObj
      })
  } else if (event.action == 'today') { //查询今日排号情况
    return await db.collection('paihao').doc(event.id).get()
  }

}