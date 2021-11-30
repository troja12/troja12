// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
        return await cloud.database().collection("umzugorder")
          .orderBy('_createTime', 'desc')
          .where({
            status: event.orderStatus,
          }).get()
}