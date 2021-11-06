/**
 * 表单检查控件
 */
function validate(data) {
  let regexarr = {
    required: /^(\s*\S+\s*)+$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    price: /^[0-9]+(.[0-9]{1,2})?$/,
    qq: /^[1-9][0-9]{4,}$/,
    number: /^\d+$/,
    zhongwen: /[\u4e00-\u9fa5]/
  }
  let status = true
  for (let i = 0; i < data.length; i++) {
    status = regexarr[data[i].type].test(data[i].value);
    if (!status) {
      wx.showModal({
        title: '提示',
        content: data[i].info,
        cancelColor: 'red',
        confirmColor: 'green',
      })
      return false;
    }
  }
  return true;
}
module.exports = {
  validate,
};