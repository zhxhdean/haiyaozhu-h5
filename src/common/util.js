function isIphoneX() {
  return (
    /iphone/gi.test(navigator.userAgent) &&
    (window.screen.height === 812 && window.screen.width === 375)
  )
}

function getStorage(key) {
  return localStorage.getItem(key) || ''
}
function setStorage(key, value) {
  localStorage.setItem(key, value)
}
// 获取url 参数
function getQuery(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r =
    window.location.search.substr(1).match(reg) ||
    window.location.hash
      .substring(window.location.hash.search(/\?/) + 1)
      .match(reg)
  if (r != null) return decodeURIComponent(r[2]).trim()
  return null
}

// 移除html标签
function removeHtmlTag(str) {
  let _str = str.replace(/<\/?.+?>/g, '')
  return _str.replace(/ /g, '')
}

export default {
  isIphoneX,
  getStorage,
  setStorage,
  getQuery,
  removeHtmlTag
}
