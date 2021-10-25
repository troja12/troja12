//index.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    array: ['请选择跟车人数', '不跟车', '1人跟车', '2人跟车'],
    objectArray: [
      {
        id: 0,
        name: '选择跟车人数'
      },
      {
        id: 1,
        name: '不跟车'
      },
      {
        id: 2,
        name: '1人跟车'
      },
      {
        id: 3,
        name: '2人跟车'
      }
    ],
    index: 0,

    date: '2018-10-01',
    time: '12:00',
    dateTime: null,
    dateTimeArray: null,
    startYear: 2000,
    endYear: 2050,
    day: '',
  },
  onLoad() {

    // --- 
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var time = dateTimePicker.getHourMinu();
    obj.dateTime[2] = parseInt((obj.defaultDay).substring(0, 2)) - 1; //day 字符串 'xx日' 转 'int'
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      day: obj.defaultDay,
      time: time
    });
  },


  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //---- 改变时间
  // changedateTime(e) {
  //   console.log(e);
  //   this.setData({
  //     dateTime: e.detail.value

  //   });
  //   console.log(dateTime);
  // },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    //console.log(arr);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      day: dateArr[2][arr[2]].substring(0, 3),
    });
  },


  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }
})
