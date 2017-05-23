//detail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lines: [{
      title: '日期',
      desc: '2017-05-18'
    }, {
      title: '题目',
      desc: ''
    },{
      title: '分享者',
      desc: ''
    }, {
      title: '来源',
      desc: ''
    }, {
      title: '标题',
      desc: ''
    }, {
      title: '作者',
      desc: ''
    }, {
      title: '描述',
      desc: ''
    }, {
      title: '链接',
      desc: ''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    console.log(options.data);
    var imageData = getApp().globalData.tmpImgData;
    if (!imageData.url) {
      return;
    }
    var author = parsePicSource(imageData.source, 'a');
    this.setData({
      lines: [{
        title: '题目',
        desc: imageData.title
      }, {
        title: '分享者',
        desc: '@' + imageData.author
      }, {
        title: '日期',
        desc: parseDate(imageData.date)
      }, {
        title: '来源',
        desc: parsePicSource(imageData.source, 'f')
      }, {
        title: '标题',
        desc: parsePicSource(imageData.source, 't')
      }, {
        title: '作者',
        desc: (author.length > 0 ? '@' + author : author)
      }, {
        title: '描述',
        desc: parsePicSource(imageData.source, 'd')
      }, {
        title: '链接',
        desc: parsePicSource(imageData.source, 'u')
      }]
    });
  },

  /**
   * 点击事件
   */
  onLineTap: function (event) {
    var index = event.target.dataset.i;
    var content = this.data.lines[index].desc;
    if (!content) {
      return;
    }
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '内容已复制',
        });
      }
    });
  },

  /**
   * 点击事件
   */
  onBtnTap: function (event) {
    wx.navigateBack();
  }
})

/**
 * 解析出处信息
 */
function parsePicSource(source, key) {
  var res = new RegExp('\\[' + key + ':(.+?)\\]').exec(source);
  if (res) {
    return res[1];
  }
  return '';
}

function parseDate(date) {
  var res = /^(\d{2}|\d{4})(\d{2})(\d{2})$/.exec(date);
  if (res) {
    return (res[1].length == 4 ? res[1] : '20' + res[1])
      + '-' + res[2] + '-' + res[3];
  }
  return date;
}