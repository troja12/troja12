// components/foodList/foodList.js
Component({
  
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    garotoryList:{
      type:Array,
      value:[]
    },
    shoppingList:{
      type:Array,
      value:[]
    },
    categoryId:Number,
    navH:Number,
    manageid:String,
    openid:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    garotoryList:[]
  },
 /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function(options) {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handlescroll:function(evt){
      let scrollTop = evt.detail.scrollTop
      /**自定义触发事件 */
      this.triggerEvent("scrollChange",{currentTop: scrollTop},{})
    },
    _showModal:function(evt){
      let datas = evt.currentTarget.dataset
      this.triggerEvent("showModel",{dataInfo:datas},{})
    },
    _subFood:function(evt){
      let datas = evt.currentTarget.dataset
      this.triggerEvent("subFood",{subDataInfo:datas},{})
    },
    _showInfo:function(evt){
      let datas = evt.currentTarget.dataset
      this.triggerEvent("showInfo",{foodInfo:datas},{})
    },
    toAdd:function(evt){
      this.triggerEvent("toAdd",{},{})
    },
    putawayfood:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("putawayfood",{id:id},{})
    },
    pushtop:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("pushtop",{id:id},{})
    },
    downawayfood:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("downawayfood",{id:id},{})
    },
    updateshop:function(evt){
      let id = evt.currentTarget.dataset.id
      this.triggerEvent("updateshop",{id:id},{})
    }
  }
})
