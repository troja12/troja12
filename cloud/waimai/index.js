// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('order').doc(event.id)
    .update({
      data: {
        isWaimai: 0, //制作完成
      }
    })
}