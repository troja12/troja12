// components/categoryList/categoryList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    garotoryList:{
      type:Array,
      value:[]
    },
    navH:Number,
    manageid:String,
    openid:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _setCurrentId: function(index){
      this.setData({
        currentId:index
      })
    },
    delete:function(evt){
      let datas = evt.currentTarget.dataset
      this.triggerEvent('deleteCate',{datas:datas},{})
    },
    
    _handleTap: function(evt){
      let cid=evt.currentTarget.id
      this.setData({ 
        currentId:cid
      })
      /**自定义触发事件 */
      this.triggerEvent("selectChange",{currentId: cid},{})
    }
    
    
  }
})
