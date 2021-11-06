const uuid = function(){
  var s = [];
  var hexDigits = "0123456789abcdef"
  for(var i = 0;i<36;i++){
    s[i] = hexDigits.substr(Math.floor(Math.random()*0x10),1)
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19]&0x3)|0x8,1);
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("").replace("-","");
  return uuid
}

const wxuuid = function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime1(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formattime(date) {

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

//当天的00:00:00
function formatTimeToday(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = 0
  var minute = 0
  var second = 0
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//只返回日期的格式化方法
function formatDate(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}

function formatDate1(date){
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatDate1_oneyear(date){
  var year = date.getFullYear() + 1
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

//当天的00:00:00
function formatTimeMonth(date) {
  var year = date.getFullYear()
  var month = 0
  console.log('获取到的month',date.getMonth())
  if(date.getMonth()==0){
    year  = year - 1
    month = 12
  }else{
    month = date.getMonth()
  }
  console.log('哈哈哈',year,month)
  var day = date.getDate()
  var hour = 0
  var minute = 0
  var second = 0
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 删除数组中的某一个对象
 * @param arr {Array} 数组
 * @param obj {Object} 需要删除的对象
 * @returns {Array} 处理之后的数组
 */
const arrRemoveObj = (arr, obj) => {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i] === obj) {
      if (i === 0) {
        arr.shift();
        return arr;
      } else if (i === len - 1) {
        arr.pop();
        return arr;
      } else {
        arr.splice(i, 1);
        return arr;
      }
    }
  }
}
 
// 后台
//将时间转换为字符串
// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()
//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
//设置分类
const catelist=()=>{
  return ["景点","酒店","美食","租车","娱乐","特产","门票"]
}
//设置分类对应的图标
const imagelist=()=>{
  return ["景点","酒店","美食","租车","娱乐","特产","门票"]
}

//将时间转换为字符对象
const timerarr = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return {
    year, month, day, hour, minute, second
  }
}

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }
// 这里返回 星期 时间 日期
const week = date => {
  let weekarr=['周日','周一','周二','周三','周四','周五','周六']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  console.log('周几',week)
  const hour = date.getHours()
  const minute = date.getMinutes()
  return {
    week:weekarr[week],
    date:[year, month, day].map(formatNumber).join('-'),
    time:[hour, minute].map(formatNumber).join(':'),
  }
}


module.exports = {
  arrRemoveObj: arrRemoveObj,
  uuid:uuid,
  wxuuid:wxuuid,
  formatTime:formatTime,
  formatTime1:formatTime1,
  formattime:formattime,
  formatTimeToday:formatTimeToday,
  formatDate:formatDate,
  formatDate1:formatDate1,
  formatDate1_oneyear:formatDate1_oneyear,
  formatTimeMonth:formatTimeMonth,
  timerarr:timerarr,
  week,
  catelist
}


