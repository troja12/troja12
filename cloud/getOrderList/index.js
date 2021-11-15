// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action == 'user') {
    if(event.orderStatus == 1){
      if(event.isWaimai == 1){
        return await cloud.database().collection("order")
          .orderBy('_createTime', 'desc')
          .where({
            _openid: wxContext.OPENID,
            status: event.orderStatus,
            isWaimai:event.isWaimai,
            status_2:event.status_2
          }).get()
        }
        else{
          return await cloud.database().collection("order")
          .orderBy('_createTime', 'desc')
          .where({
            _openid: wxContext.OPENID,
            status: event.orderStatus,
            isWaimai:event.isWaimai,
          }).get()
        }
      }
      else{
        return await cloud.database().collection("order")
        .orderBy('_createTime', 'desc')
        .where({
          _openid: wxContext.OPENID,
          status: event.orderStatus,
        }).get()
      }
  } 
  else {
    return await cloud.database().collection("order")
      .orderBy('_createTime', 'desc')
      .where({
        status: event.orderStatus,
        isWaimai:event.isWaimai,
        status_2:event.status_2
      }).get()
  }

}