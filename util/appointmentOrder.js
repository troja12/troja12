const app = getApp()
const db = wx.cloud.database()
const _ = db.command
/*
  获取商品分类列表
 */
function list(obj) {
  return new Promise(function(resolve, reject) {
    let query = {}
    let keywords = ''
    const _ = db.command
    if(!obj.isManage){
      query._openid = obj.openid
    }
    
    
    if (obj.title&&/^(\s*\S+\s*)+$/.test(obj.title)) {
      keywords = db.RegExp({
        regexp: obj.title,
        options: 'i',//大小写不区分
      })
      console.log('keywords',keywords)  
    }
    let depagesize = obj.page * obj.pagesize
    console.log('参数',query,obj.pagesize,depagesize)
    if(obj.isAppointment){//如果为预约订单查询预约表
      if(obj.tabCur >= 0){
        if(obj.tabCur <= 3){
          query.status = obj.tabCur
        }
        else{
          query.status = _.or(4,5)
        }
      }

      if(keywords){
        db.collection('appointments')
        .orderBy('_createTime','desc')
        .where(
          _.and([
            query,
            _.or([
              {
                setmeal:({title:keywords})
              },
              {
                nickname:keywords
              },
              {
                outTradeNo:obj.title
              }
            ])
          ])
        )
        .limit(obj.pagesize).skip(depagesize).get().then(res => {
          resolve(res.data)
          console.log('在util中的',res.data)
        })       
      }
      else{
        db.collection('appointments')
        .orderBy('_createTime','desc')
        .where(query)
        .limit(obj.pagesize).skip(depagesize).get().then(res => {
          resolve(res.data)
          console.log('在util中的',res.data)
        })
      }
    }else{
      query.status = 1
      if(keywords){
        console.log('点餐订单搜寻')
        db.collection('order').orderBy('create_time','desc').where(
          _.and([
            query,
            _.or([
              {
                shopping_list:_.all([
                  _.elemMatch({
                    name:keywords
                  })
                ])
              },
              {
                takeNo:parseInt(obj.title)
              },
              {
                nickname:keywords
              },
              {
                outTradeNo:obj.title
              },              

            ])
          ])
        )
        .limit(obj.pagesize).skip(depagesize)
        .get()
        .then(res=>{
          resolve(res.data)
          console.log('在util中的',res.data)
          
        })
      }
      else{
        db.collection('order')
        .orderBy('create_time','desc').where(query).limit(obj.pagesize).skip(depagesize).get().then(res => {
          resolve(res.data)
          console.log('在util中的',res.data)
        })
      }

    }
    
  })
}
/*
  获取商品分类列表
 */
function listall() {
  return new Promise(function(resolve, reject) {
    let query = {}
    db.collection('appointments').where(query).get().then(res => {
     
      resolve(res.data)
    })
  })
}



/*
  添加商品分类
  title-标题
  content:描述
  faceimage:封面图片
  create_time-添加时间
  sort int 顺序
  isshow int 是否显示
  update_time 更新时间
  _openid
 */
function add(obj) {
  return new Promise(function(resolve, reject) {
    obj.update_time=obj.create_time=new Date().getTime()
    db.collection('appointments').add({
      data: obj
    }).then(res => {
      resolve(res)
    })
  })
}

/*
  编辑商品分类
  title-标题
  content:描述
  faceimage:封面图片
  create_time-添加时间
  update_time 更新时间
  sort int 顺序
  isshow int 是否显示
  _openid
 */
function modify(obj) {
  return new Promise(function(resolve, reject) {
    let _id=obj._id
    delete obj._id
    obj.update_time=new Date().getTime()
    db.collection('appointments').doc(_id).update({
      data: obj,
      success: function (res) {
        console.log(res)
        resolve(res)
      }
    })
  })
}
/*
  删除商品分类
  id
 */
function mydelete(obj) {
  return new Promise(function (resolve, reject) {
    db.collection('appointments').doc(obj.id).remove({
      success: function (res) {
        resolve({ status:1,'info':'删除成功'})
      }
    })
  })
}

/*
  查看商品分类详情
  id
 */
function detail(obj) {
  return new Promise(function(resolve, reject) {
    db.collection('appointments').doc(obj._id).get().then(res => {
      console.log(res)
      resolve(res)
    })
  })
}

module.exports = {
  list,
  listall,
  add,
  modify,
  detail,
  mydelete
}