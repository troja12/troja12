function done(key, desc) {
  return function (a, b) {
    return desc ? a[key] - b[key] : b[key] - a[key];
  }
}

function uploadimg(imglist,fold) {
  return new Promise((resolve, reject) => {
    let imgarr = [];
    let resultarr = [];
    if (typeof imglist == 'string') {
      imgarr.push(imglist)
    } else if (typeof imglist == 'object') {
      imgarr = imglist;
    } else {
      console.log('图片路径错误')
      return
    }
    if (imgarr.length == 0) {
      resolve(resultarr);
      return;
    }
    let resultlist = []
    for (let i = 0; i < imgarr.length; i++) {
      wx.showLoading({
        title: '正在上传第' + (i + 1) + '张图片中……',
      })
      let filePath = imgarr[i]
      let cloudPath =fold+ new Date().getTime()+''+i + filePath.match(/\.[^.]+?$/)[0]
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log(i, res)
          resultarr.push({
            'index': i,
            'path': res.fileID
          })
          if (resultarr.length == imgarr.length) {
            wx.hideLoading()
            let sortarr = resultarr.sort(done('index', true))
            console.log('sortarr', sortarr)
            for (let k = 0; k < sortarr.length; k++) {
              resultlist.push(sortarr[k].path)
            }
            resolve(resultlist);
          }
        },
        fail: e => {
          resultarr.push(e)
          if (resultarr.length == imgarr.length) {
            wx.hideLoading()
            resolve(resultarr);
          }
        },
        complete: () => {}
      })
    }

  })
}
module.exports = {
  uploadimg,
};