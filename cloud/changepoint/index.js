// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // const { OPENID } = event.userid
 
    //这里需要在data中传入会员_id
    // console.log("res为", res.result.data[0]._id)
    function(e){
    cloud.database().collection('member').where({
      // _id:res.result.data[0]._id
      _id:event.userid
    }).get({
      success:(ress)=>{
        console.log("ress是sss",ress.data[0].consum_points)
        cloud.database().collection('member').doc(ress.data[0]._id)
        .update({
          data: {
            // consum_points: ress.data[0].consum_points + event.price  , //制作完成
            consum_points: ress.data[0].consum_points + 20  , //制作完成
          }
        })
      },fail:err=>{
      }                 
    })
  }

    return await 0

    

  //  cloud.database().collection('member').where({
  //     _id:OPENID
  //   }).get()
  //   .then(ress => {
  //     cm_point = ress.result.data[0].consum_points
  //   }).catch(ress => {
  //      console.log("积分失败", ress)
  //   })


  // return await cloud.database().collection('member').doc(event.userid)
  // .update({
  //   data: {
  //     consum_points: cm_point + event.price  , //制作完成
  //   }
  // })

}