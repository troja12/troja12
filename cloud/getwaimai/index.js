// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  return await db.collection("order")
  .orderBy('_createTime', 'desc')
  .where({
    status: event.orderStatus,
    isWaimai:event.isWaimai,
    status_2:event.status_2,
    address:event.address
  }).get()

}