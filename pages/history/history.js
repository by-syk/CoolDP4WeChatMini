// history.js

var util = require('../../utils/util.js')

// 获取应用实例
var app = getApp();

var images2d = [];
var images3d = [];

// 已加载的数据数（0，1，2）
var doneDataNum = 0;

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
    console.log('onImgTap');
    var itemData = event.target.dataset;
    var category = itemData.dd;
    var date = this.data.images[itemData.i][category == 1 ? 0 : 1].date;
    wx.navigateTo({
      url: '../index/index?d=' + date + '&dd=' + category,
    });
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
  var index2d = 0;
  var index3d = 0;
  for (var i = 0; i < app.globalData.lookBackNum; ++i) {
    var image2d;
    if (dateStr == images2d[index2d].date) {
      image2d = images2d[index2d];
      image2d.url = util.getThumbnailUrl(image2d.url);
      index2d++;
    } else {
      image2d = {
        date: dateStr,
        url: ''
      };
    }
    var image3d;
    if (dateStr == images3d[index3d].date) {
      image3d = images3d[index3d];
      image3d.url = util.getThumbnailUrl(image3d.url);
      index3d++;
    } else {
      image3d = {
        date: dateStr,
        url: ''
      };
    }
    images.push([
      image2d, image3d
    ]);
    date.setDate(date.getDate() - 1);
    dateStr = util.formatDate(date);
  }

  that.setData({
    images: images
  });
}