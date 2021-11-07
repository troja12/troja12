// components/order/order.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orders:{
      type:Array,
      value:[]
    },
    isManage:Boolean
  },
  

  /**
   * 组件的初始数据
   */
  data: {
    // 倒计时
    targetTime: 0,
    clearTimer: false,
    orders:[]
  },

  ready() {
    // var that = this
    // setTimeout(function(){
    //   var orders = that.properties.orders
    //   //给data中的orders赋值
    //   that.setData({
    //     orders:orders
    //   })
    //   console.log(that.data)
    // },1000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
     /**
     * 定时器回调
     */
    countDownCallbackFn (res) {
      this.triggerEvent('callback',res)
    },
    toDetail:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("toDetail",{id:id})
    },
    cancel:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("cancel",{id:id})
    },
    goPay:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("goPay",{id:id})
    },
    confirmCome:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("confirmCome",{id:id})
    },
    confirmPay:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("confirmPay",{id:id})
    },
    modifyAppointment:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("modifyAppointment",{id:id})     
    }
  }
})
