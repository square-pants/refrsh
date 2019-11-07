//index.js

var refresh;
Page({

  onPageScroll(e) {
    refresh.onPageScroll(e.scrollTop);
  },


  /**
   * 页面的初始数据
   */
  data: {
    listHeight: 0,
    list: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  },

  onSucceed: function (e) {
    if (e.target.dataset.index == 0) {
      refresh.refreshSucceed();
    } else if (e.target.dataset.index == 9) {
      refresh.loadMoreSucceed();
    }
  },

  /**
   * 加载更多
   */
  loadMore: function () {
    setTimeout(function () {
      refresh.loadMoreSucceed();
    }, 1000);
  },

  /**
   * 刷新
   */
  refresh: function () {
    setTimeout(function () {
      refresh.refreshSucceed();
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    refresh = this.selectComponent("#refresh");
  }

})
