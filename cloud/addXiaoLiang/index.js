//添加销量
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  let res = await cloud.database().collection('order')
    .doc(event.id) //这个传你的订单id
    .get()

  let arr = []
  const db = cloud.database()
  const _ = db.command
  res.data.orderList.forEach(item => {
    let pro = db.collection('food').doc(item._id)
      .update({
        data: {
          sell: _.inc(item.quantity)
        }
      })
    arr.push(pro)
  })

  return await Promise.all(arr).then(res => {
    return res
  }).catch(res => {
    return res
  })

}