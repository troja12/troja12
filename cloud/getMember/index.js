// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  
  try {
    //这里需要在data中传入会员_id
    return await db.collection('member').where({
      _openid:OPENID
    }).get()
  } catch (error) {
    console.error(error)
  }
}