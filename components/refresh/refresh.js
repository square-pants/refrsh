// components/refresh/refresh.js
var refreshHeight = 0; //刷新区域高度
var pageScrollTop = 0; //页面滚动高度
var pressType = true; //按压状态
var animationTime = 400; //回弹动画时间
var downStagnationY = 0; //下拉停滞坐标
var upwardStagnationY = 0; //上拉停滞坐标
var isUpdate=false;//是否处于刷新时间
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isScroll: true,
    refreshState: 0, //刷新状态 0普通状态  1下拉  2上拉
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 下拉刷新成功
     */
    refreshSucceed: function () {
      var that=this;
      wx.pageScrollTo({
        scrollTop: refreshHeight,
        duration: animationTime
      })
     
      setTimeout(function(){
        isUpdate = false;
        that.setData({
          isScroll: true,
          refreshState: 0
        })
      },animationTime)
    },

    /**
     * 上拉加载成功
     */
    loadMoreSucceed: function () {
      var that = this;
      wx.pageScrollTo({
        scrollTop: 0,
        duration: animationTime
      })

      setTimeout(function () {
        isUpdate = false;
        that.setData({
          isScroll: true,
          refreshState: 0
        })
        wx.pageScrollTo({
          scrollTop: refreshHeight,
          duration: 0
        })
      }, animationTime+50)
    },

    onPageScroll: function(e) {
      pageScrollTop = e;
      if (isUpdate||!pressType) return
      if (pageScrollTop < (refreshHeight - 10)) {
        pressType = false
        this.setData({
          refreshState: 1
        })
      } else if (pageScrollTop > (refreshHeight + 10)) {
        pressType = false
        this.setData({
          refreshState: 2
        })
      }
    },

    /**
     * 按下
     */
    touchStart(e) {
      pressType = true;
    },

    /**
     * 松开
     */
    touchEnd(e) {
      var laststate = this.data.refreshState;
      
      if (pageScrollTop != refreshHeight) {
          // console.log('坐标', pageScrollTop);
          // console.log('高度', refreshHeight);
          // console.log('状态', laststate);
          if (laststate == 2 && pageScrollTop > 10) { //加载操作
            wx.pageScrollTo({
              scrollTop: upwardStagnationY,
              duration: animationTime
            })
            isUpdate=true;
            this.setData({
              isScroll:false
            });
            this.triggerEvent('loadMore');
          } else if (laststate == 1 &&pageScrollTop < (refreshHeight-10)) { //刷新操作
            wx.pageScrollTo({
              scrollTop: downStagnationY,
              duration: animationTime
            })
            isUpdate = true;
            this.setData({
              isScroll: false
            });
            this.triggerEvent('refresh');
          } else if (!isUpdate) {//取消操作
            this.setData({
              refreshState: 0
            })
            wx.pageScrollTo({
              scrollTop: refreshHeight,
              duration: 0
            })
          }
      } 
    },

    /**
     * 滚到顶部
     */
    upper(e) {},
    /**
     * 滚到底部
     */
    lower(e) {},
    /**
     * 滚动
     */
    scroll(e) {
      // console.log('组件滚动', e.detail.scrollTop)
    },
    refreshComplete: function() {
      wx.pageScrollTo({
        scrollTop: refreshHeight,
        duration: 400
      })
    },
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      refreshHeight = wx.getSystemInfoSync().windowHeight * 0.3;
      // refreshHeight = parseInt(wx.getSystemInfoSync().windowHeight * 0.3);
      downStagnationY = refreshHeight * 0.7;
      upwardStagnationY = refreshHeight * 0.3;
    },
    ready: function() {
      wx.pageScrollTo({
        scrollTop: refreshHeight,
        duration: 0
      });
      pageScrollTop = refreshHeight
    },
  }
})