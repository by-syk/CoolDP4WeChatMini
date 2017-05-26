//util.js

var pixelRatio = undefined;

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('');
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 请求压缩原图以节省流量（七牛云提供支持），并获取新链接
 */
function getThumbnailUrl(url) {
  if (!url) {
    return url;
  }
  if (!pixelRatio) {
    pixelRatio = wx.getSystemInfoSync().pixelRatio;
  }
  if (pixelRatio < 3) {
    return url + '-wc720';
  }
  return url + '-wc';
}

module.exports = {
  formatDate: formatDate,
  getThumbnailUrl: getThumbnailUrl
}
