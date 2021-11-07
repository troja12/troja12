// components/shoppingCart/shoppingCart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shoppingList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _showModal:function(evt){
      let datas = evt.currentTarget.dataset
      this.triggerEvent("showModel",{dataInfo:datas},{})
    },
    _subFood:function(evt){
      let datas = evt.currentTarget.dataset
      this.triggerEvent("subFood",{subDataInfo:datas},{})
    }

  }
})
