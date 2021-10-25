let app = getApp();
//云数据库相关
const db = wx.cloud.database({});

Page({
  data: {
    searchKey: '', //搜索词
    foodList: [], //菜品 
    cartList: [], // 购物车
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    totalNum: 0, //总数，初始为0
    // 购物车动画
    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
  },

  onLoad(e) {
    let searchKey = e.searchKey
    if (searchKey) {
      //搜索菜品
      this.getFoodList('search', searchKey)
      this.setData({
        searchKey: searchKey //搜索词
      })
    } else {
      //获取菜品数据
      this.getFoodList('getAll')
    }

  },
  //获取用户输入的搜索词
  getSearchKey(e) {
    this.setData({
      searchKey: e.detail.value //搜索词
    })
  },
  //搜索事件
  goSearch() {
    this.getFoodList('search', this.data.searchKey)
  },
  //获取菜品数据
  getFoodList(action, searchKey) {
    //获取购物车菜品
    let cartList = wx.getStorageSync('cart') || [];
    wx.cloud.callFunction({
      name: "getFoodList",
      data: {
        action: action,
        searchKey: searchKey
      }
    }).then(res => {
      let dataList = res.result.data;
      console.log("菜品数据", res)
      //遍历
      dataList.forEach(food => {
        food.quantity = 0;
        cartList.forEach(cart => {
          if (cart._id == food._id) {
            food.quantity = cart.quantity ? cart.quantity : 0;
          }
        })
      });
      this.setData({
        cartList: cartList,
        foodList: dataList,
      })
      this.getTotalPrice()
    }).catch(res => {
      console.log("菜品数据请求失败", res)
    })
  },
  //购物车减少数量
  minusCount(e) {
    let item = e.currentTarget.dataset.item;
    let cartList = wx.getStorageSync('cart') || [];
    let foodList = this.data.foodList
    for (let i in foodList) {
      if (foodList[i]._id == item._id) {
        if (foodList[i].quantity && foodList[i].quantity > 0) {
          foodList[i].quantity -= 1;
        } else {
          foodList[i].quantity = 0;
        }
        if (cartList.length > 0) {
          for (let j in cartList) {
            if (cartList[j]._id == item._id) {
              cartList[j].quantity ? cartList[j].quantity -= 1 : 0
              if (cartList[j].quantity <= 0) {
                //购买数里为0就从购物车里删除
                this.removeByValue(cartList, item._id)
              }
              if (cartList.length <= 0) {
                this.setData({
                  foodList: foodList,
                  cartList: [],
                  totalNum: 0,
                  totalPrice: 0,
                })
                // this.cascadeDismiss()
              }
              try {
                wx.setStorageSync('cart', cartList)
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      }
    }
    this.setData({
      cartList: cartList,
      foodList: foodList
    })
    this.getTotalPrice();
  },
  // 定义根据id删除数组的方法
  removeByValue(array, id) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]._id == id) {
        array.splice(i, 1);
        break;
      }
    }
  },

  // 购物车增加数量
  addCount(e) {
    let item = e.currentTarget.dataset.item;
    let arr = wx.getStorageSync('cart') || [];
    let f = false;
    for (let i in this.data.foodList) { // 遍历菜单找到被点击的菜品，数量加1
      console.log("当前点击的id", item._id, "foodid", this.data.foodList[i]._id)
      if (this.data.foodList[i]._id == item._id) {
        this.data.foodList[i].quantity += 1;
        if (arr.length > 0) {
          for (let j in arr) { // 遍历购物车找到被点击的菜品，数量加1
            if (arr[j]._id == item._id) {
              arr[j].quantity += 1;
              f = true;
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
              break;
            }
          }
          if (!f) {
            arr.push(this.data.foodList[i]);
          }
        } else {
          arr.push(this.data.foodList[i]);
        }
        try {
          wx.setStorageSync('cart', arr)
        } catch (e) {
          console.log(e)
        }
        break;
      }
    }

    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },


  // 获取购物车总价、总数
  getTotalPrice() {
    var cartList = this.data.cartList; // 获取购物车列表
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) { // 循环列表得到每个数据
      totalP += cartList[i].quantity * cartList[i].price; // 所有价格加起来     
      totalN += cartList[i].quantity
    }
    this.setData({ // 最后赋值到data中渲染到页面
      cartList: cartList,
      totalNum: totalN,
      totalPrice: totalP.toFixed(2)
    });
  },
  // 清空购物车
  cleanList(e) {
    for (var i in this.data.foodList) {
      this.data.foodList[i].quantity = 0;
    }
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      foodList: this.data.foodList,
      cartList: [],
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  //删除购物车单项
  deleteOne(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var arr = wx.getStorageSync('cart')
    for (var i in this.data.foodList) {
      if (this.data.foodList[i]._id == id) {
        this.data.foodList[i].quantity = 0;
      }
    }
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        foodList: this.data.foodList,
        cartList: [],
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }
    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle: function () {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }
  },
  // 打开购物车方法
  cascadePopup: function () {
    var that = this;
    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },
  // 关闭购物车方法
  cascadeDismiss: function () {
    var that = this
    // 购物车关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },
  // 跳转确认订单页面
  gotoOrder: function () {
    var arr = wx.getStorageSync('cart') || [];
    if (!arr || arr.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择菜品'
      })
      return;
    }

    let userInfo = app.globalData.userInfo;
    if (!userInfo || !userInfo.nickName) {
      wx.showModal({
        title: '请登录',
        content: '请到个人中心登录',
        showCancel: false, //去掉取消按钮
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../me/me',
            })
          }
        }
      })
      return;
    }
    if (app.globalData.isNeedSaoMa && !app.globalData.address) {
      wx.showToast({
        icon: 'none',
        title: '回首页扫码点餐'
      })
      return
    }
    if (!app.globalData.isNeedSaoMa) {
      app.globalData.address = '店内下单'
    }

    wx.navigateTo({
      url: '/pages/pay/pay'
    })

  },
})



// Component({
//   pageLifetimes: {
//     show() {
//       if (typeof this.getTabBar === 'function' &&
//         this.getTabBar()) {
//         this.getTabBar().setData({
//           selected: 2
//         })
//       }
//     }
//   }
// })