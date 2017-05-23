//index.js

var util = require('../../utils/util.js')

// 获取应用实例
var app = getApp()

var defText = {
  title: '标题',
  author: '分享者',
  source: '出处信息……',
};

// 缓存二次元分类数据、大杂烩分类数据
var images = [{
  title: defText.title,
  author: defText.author,
  source: defText.source,
  url: '',
}, {
  title: defText.title,
  author: defText.author,
  source: defText.source,
  url: '',
}];

// 当前日期（非 yyyyMMdd 或 yyMMdd 则代表今日）
var curDate = '0';

// 当前页
var curSwiperIndex = 0;

// 来自「往期日图」页面
var fromHistory = false;

// 长按标志，解决长按触发短按事件问题
var onImgLongTap = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: defText.title,
    author: defText.author,
    source: defText.source,
    url2d: '',
    url3d: '',
    urlb: '',
    curSwiperIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    curDate = options.d;
    if (curDate && /^(\d{6}|\d{8})$/.test(curDate)) {
      wx.setNavigationBarTitle({
        title: '酷安日图(' + parseDateForTitle(curDate) + ')',
      });
    } else {
      curDate = '0';
    }
    curSwiperIndex = options.dd == '0' ? 1 : 0;
    this.setData({
      curSwiperIndex: curSwiperIndex
    });
    fromHistory = options.fromHistory == '1';
    loadData(this);
  },

  onShareAppMessage: function() {
    return {
      title: '「酷安日图」之「' + this.data.title + '」',
      path: '/pages/index/index?d=' + curDate + '&dd=' + (curSwiperIndex == 0 ? 1 : 0),
    }
  },

  /**
   * 点击事件
   */
  onTitleTap: function (event) {
    console.log('onTitleTap ' + curSwiperIndex);
    // showDetailDlg(curSwiperIndex == 0 ? images[0] : images[1]);
    app.globalData.tmpImgData = curSwiperIndex == 0 ? images[0] : images[1];
    wx.navigateTo({
      url: '../detail/detail',
    });
  },

  /**
   * 点击事件
   */
  onImgTap: function (event) {
    if (onImgLongTap) {
      onImgLongTap = false;
      return;
    }
    console.log('onImgTap ' + curSwiperIndex);
    var item1 = '预览';
    if (wx.getStorageSync('imgLongTapHint') != 'true') {
      item1 += ' (长按图片)';
    }
    wx.showActionSheet({
      itemList: [item1, '回顾往期'],
      // itemList: [item1, '分享', '回顾往期'],
      // itemList: [item1, '保存', '回顾往期'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            previewImg(curSwiperIndex == 0 ? 0 : 1);
            break;
          // case 1:
          //   save2Gallery(curSwiperIndex == 0 ? 0 : 1);
          //   break;
          case 1:
            if (fromHistory) { // 来自「往期日图」页面，直接回退
              wx.navigateBack({
                delta: 1
              });
              break;
            }
            if (checkDonate()) { // 提示捐赠
              break;
            }
            wx.navigateTo({
              url: '../history/history?d=170518'
            });
            break;
        }
      }
    });
  },

  /**
   * 长按事件
   */
  onImgLongTap: function (event) {
    console.log('onImgLongTap ' + curSwiperIndex);
    onImgLongTap = true;
    var ok = previewImg(curSwiperIndex == 0 ? 0 : 1);
    if (ok) {
      wx.setStorage({
        key: 'imgLongTapHint',
        data: 'true',
      });
    }
  },

  /**
   * Swiper页切换事件
   */
  onSwiperChange: function (obj) {
    curSwiperIndex = obj.detail.current;
    console.log('onSwiperChange ' + curSwiperIndex);
    // wx.setStorageSync('dd', curSwiperIndex == 0 ? 1 : 0);
    switchData(this, curSwiperIndex == 0 ? 1 : 0);
  },
})

/**
 * 加载数据
 */
function loadData(that) {
  images = [{
    title: defText.title,
    author: defText.author,
    source: defText.source,
    url: '',
  }, {
    title: defText.title,
    author: defText.author,
    source: defText.source,
    url: ''
  }];

  wx.request({
    url: app.globalData.api,
    data: {
      k: app.globalData.key,
      dd: 1,
      d: curDate
    },
    success: function (res) {
      var data = res.data;
      if (data.status != 0) {
        return;
      }
      if (!data.images || data.images.length == 0) {
        if (curSwiperIndex == 0) {
          setTimeout(function() {
            showImgPreparingDlg();
          }, 800);
        }
        return;
      }
      images[0] = data.images[0];
      if (curSwiperIndex == 0) {
        that.setData({
          title: images[0].title,
          author: images[0].author,
          source: images[0].source,
          url2d: util.getThumbnailUrl(images[0].url),
          urlb: util.getThumbnailUrl(images[0].url)
        });
      } else {
        that.setData({
          url2d: util.getThumbnailUrl(images[0].url)
        });
      }
    }
  });

  wx.request({
    url: app.globalData.api,
    data: {
      k: app.globalData.key,
      dd: 0,
      d: curDate
    },
    success: function (res) {
      var data = res.data;
      console.log(data);
      if (data.status != 0) {
        return;
      }
      if (!data.images || data.images.length == 0) {
        if (curSwiperIndex == 1) {
          setTimeout(function () {
            showImgPreparingDlg();
          }, 800);
        }
        return;
      }
      images[1] = data.images[0];
      if (curSwiperIndex == 1) {
        that.setData({
          title: images[1].title,
          author: images[1].author,
          source: images[1].source,
          url3d: util.getThumbnailUrl(images[1].url),
          urlb: util.getThumbnailUrl(images[1].url)
        });
      } else {
        that.setData({
          url3d: util.getThumbnailUrl(images[1].url)
        });
      }
    }
  });
}

/**
 * 切换数据
 */
function switchData(that, category) {
  var index = category == 1 ? 0 : 1;
  that.setData({
    title: images[index].title,
    author: images[index].author,
    source: images[index].source,
    url2d: util.getThumbnailUrl(images[0].url),
    url3d: util.getThumbnailUrl(images[1].url),
  });
  setTimeout(function () {
    that.setData({
      urlb: util.getThumbnailUrl(images[index].url),
    });
  }, 500);
}

/**
 * 预览图片
 */
function previewImg(curIndex) {
  var curUrl = images[curIndex].url;
  if (!curUrl) {
    return false;
  }
  var allUrls = [];
  if (images[0].url) {
    allUrls.push(images[0].url);
  }
  if (images[1].url) {
    allUrls.push(images[1].url);
  }
  wx.previewImage({
    current: curUrl,
    urls: allUrls
  });
  return true;
}

// /**
//  * 下载原图并保存到图库
//  * TODO https://cdn.by-syk.com
//  */
// function save2Gallery(curIndex) {
//   var curUrl = images[curIndex].url;
//   if (!curUrl) {
//     return;
//   }
//   if (!wx.saveImageToPhotosAlbum) {
//     wx.showModal({
//       title: '提示',
//       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
//       showCancel: false
//     });
//     return;
//   }
//   wx.downloadFile({
//     url: curUrl,
//     success: function(res) {
//       wx.saveImageToPhotosAlbum({
//         filePath: res.tempFilePath,
//         success: function (res) {
//           wx.showToast({
//             icon: 'success',
//             title: '已保存到图库',
//             duration: 2000
//           });
//         },
//         fail: function (res) {
//           console.log(res);
//         },
//       });
//     },
//     fail: function(res) {
//       console.log(res);
//     }
//   });
// }

// /**
//  * 显示详情对话框
//  */
// function showDetailDlg(data) {
//   var title = data.title;
//   var url = parsePicSource(data.source, 'u');
//   var author = parsePicSource(data.source, 'a');
//   var content = '「题目」\n' + data.title
//     + '\n\n「分享」\n@' + data.author
//     + '\n\n「来源」\n' + parsePicSource(data.source, 'f')
//     + '\n\n「标题」\n' + parsePicSource(data.source, 't')
//     + '\n\n「作者」\n' + (author.length > 0 ? '@' + author : author)
//     + '\n\n「描述」\n' + parsePicSource(data.source, 'd')
//     + '\n\n「链接」\n' + url;
//   wx.showModal({
//     title: '详情',
//     content: content,
//     confirmText: '了解',
//     confirmColor: '#ff5252',
//     cancelText: '复制链接',
//     showCancel: url.length > 0,
//     success: function (res) {
//       if (res.cancel) {
//         wx.setClipboardData({
//           data: url,
//           success: function (res) {
//             wx.showToast({
//               title: '链接已复制',
//             });
//           }
//         });
//       }
//     }
//   });
// }

// /**
//  * 解析出处信息
//  */
// function parsePicSource(source, key) {
//   var res = new RegExp('\\[' + key + ':(.+?)\\]').exec(source);
//   if (res) {
//     return res[1];
//   }
//   return '';
// }

function showImgPreparingDlg() {
  wx.showModal({
    title: '图缺',
    content: '似乎管理员偷懒忘记上图了😴',
    confirmText: '催一催',
    confirmColor: '#ff5252',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        // TODO
      }
    }
  });
}

function checkDonate() {
  console.log('checkDonate');
  var donated = wx.getStorageSync('donated');
  if (donated != 'true') {
    var logs = wx.getStorageSync('logs') || [];
    if (logs.length >= 5) {
      showDonate();
      return true;
    }
  }
  return false;
}

/**
 * 显示捐赠提示对话框
 */
function showDonate() {
  console.log('showDonate');
  wx.showModal({
    title: '捐赠支持',
    content: '「酷安日图」由个人开发与维护，且图片存储服务需要一笔不小的费用。如果你喜欢，可以捐赠支持我，多少随意。所得将用于维护服务器运作。',
    confirmText: '好的',
    confirmColor: '#ff5252',
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        wx.setStorage({
          key: 'donated',
          data: 'true',
        });
      }
    }
  });
}

function parseDateForTitle(date) {
  var res = /^(?:\d{2}|\d{4})(\d{2})(\d{2})$/.exec(date);
  if (res) {
    return res[1] + '/' + res[2];
  }
  return date;
}