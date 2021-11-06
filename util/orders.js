const app = getApp()
const db = wx.cloud.database()
const _ = db.command
/*
  获取订单列表
 */
function list(obj) {
  return new Promise(function(resolve, reject) {
    let query = {
      status:1
    }
    if (obj.title&&/^(\s*\S+\s*)+$/.test(obj.title)) {
    // title不为空字符串
      query.title=db.RegExp({
        regexp: obj.title,
        options: 'i',//大小写不区分
      })
    }
    let depagesize = obj.page * obj.pagesize
    db.collection('order').where(query).limit(obj.pagesize).skip(depagesize).orderBy('create_time','desc').get().then(res => {
      resolve(res.data)
    })
  })
}
module.exports = {
  list,
}