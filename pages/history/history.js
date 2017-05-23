//history.js

var util = require('../../utils/util.js')

// 获取应用实例
var app = getApp();

var images2d = [];
var images3d = [];

// 已加载的数据数（0，1，2）
var doneDataNum = 0;

// 长按标志，解决长按触发短按事件问题
var onImgLongTap = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    loadData(this);
  },

  /**
   * 点击事件
   */
  onImgTap: function (event) {
    if (onImgLongTap) {
      onImgLongTap = false;
      return;
    }
    console.log('onImgTap');
    var itemData = event.target.dataset;
    var category = itemData.dd;
    var date = this.data.images[itemData.i][category == 1 ? 0 : 1].date;
    wx.navigateTo({
      url: '../index/index?d=' + date + '&dd=' + category + '&fromHistory=1',
    });
  },

  /**
   * 长按事件
   */
  onImgLongTap: function (event) {
    console.log('onImgLongTap');
    onImgLongTap = true;
    var itemData = event.target.dataset;
    previewImg(this, itemData.i, itemData.dd);
  }
})

/**
 * 加载数据
 */
function loadData(that) {
  // wx.showNavigationBarLoading(); // 在当前页面显示导航条加载动画

  doneDataNum = 0;

  wx.request({
    url: app.globalData.api,
    data: {
      k: app.globalData.key,
      dd: 1,
      n: app.globalData.lookBackNum
    },
    success: function (res) {
      var data = res.data;
      if (data.status != 0 || !data.images || data.images.length == 0) {
        return;
      }
      images2d = data.images;
    },
    complete: function () {
      if (++doneDataNum == 2) {
        fillData(that);
      }
    }
  });

  wx.request({
    url: app.globalData.api,
    data: {
      k: app.globalData.key,
      dd: 0,
      n: app.globalData.lookBackNum
    },
    success: function (res) {
      var data = res.data;
      if (data.status != 0 || !data.images || data.images.length == 0) {
        return;
      }
      images3d = data.images;
    },
    complete: function () {
      if (++doneDataNum == 2) {
        fillData(that);
      }
    }
  });
}

function fillData(that) {
  console.log('fillData');

  if (images2d.length == 0 && images3d.length == 0) {
    return;
  }

  var images = [];

  var date = new Date();
  var dateStr = util.formatDate(date);
  var localDateStrArr = ['今日', '昨日', '前天', '大前天', '四天前', '五天前', '六天前'];
  var index2d = 0;
  var index3d = 0;
  for (var i = 0; i < app.globalData.lookBackNum; ++i) {
    var image2d = {
      date: dateStr,
      dateLocal: localDateStrArr[i],
      url: '',
      thumbUrl: ''
    };
    if (dateStr == images2d[index2d].date) {
      image2d.url = images2d[index2d].url;
      image2d.thumbUrl = util.getThumbnailUrl(image2d.url);
      index2d++;
    }
    var image3d = {
      date: dateStr,
      dateLocal: localDateStrArr[i],
      url: '',
      thumbUrl: ''
    };
    if (dateStr == images3d[index3d].date) {
      image3d.url = images3d[index3d].url;
      image3d.thumbUrl = util.getThumbnailUrl(image3d.url);
      index3d++;
    }
    images.push([
      image2d, image3d
    ]);
    date.setDate(date.getDate() - 1);
    dateStr = util.formatDate(date);
  }
  // 刷新界面
  that.setData({
    images: images
  });
}

/**
 * 预览图片
 */
function previewImg(that, index, category) {
  var curUrl = that.data.images[index][category == 1 ? 0 : 1].url;
  if (!curUrl) {
    return;
  }
  var allUrls = [];
  if (that.data.images[index][0].url) {
    allUrls.push(that.data.images[index][0].url);
  }
  if (that.data.images[index][1].url) {
    allUrls.push(that.data.images[index][1].url);
  }
  wx.previewImage({
    current: curUrl,
    urls: allUrls
  });
}
