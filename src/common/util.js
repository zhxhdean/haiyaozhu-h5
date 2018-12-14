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

// toast
const showToast = (content, duration= 1500) => {
  const html = document.createElement('div')
  html.className = 'mask'
  html.innerHTML = `<div class="toast">${content}</div>`
  document.getElementById('root').appendChild(html)
  setTimeout(() => {
    document.getElementById('root').removeChild(html)
  }, duration)
}

// 微信内
const isWechat = () => {
  return navigator.userAgent.toLowerCase().includes('micromessenger')
}

function formatNumber(n) {
  return n.toString().padStart(2, '0')
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
const formatDate = (number, format) =>{
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []

  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in format.split(/\/|-|:|\s/)) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

const getTomorrow = (date = '') => {
  const today = date === '' ? new Date() : new Date(date)
  return formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()+1).getTime(), 'Y-M-D')
}

const getToday = () => {
  return formatDate(Date.now(), 'Y-M-D')
}


// 住几晚 checkin: 2018-01-01 checkout:2018-01-03
const getNights = (checkin, checkout) => {
  if(!checkin || !checkout){
    return ''
  }
  const cki = new Date(checkin)
  const cko = new Date(checkout)
  return (cko-cki)/3600/24/1000
}

const BREAK_FAST = new Map([
  [0, '无早'],
  [1, '单早'],
  [2, '双早']
])
const getBreakfast = val => {
  return BREAK_FAST.get(val)
} 

export default {
  isIphoneX,
  getStorage,
  setStorage,
  getQuery,
  removeHtmlTag,
  showToast,
  isWechat,
  formatDate,
  getTomorrow,
  getNights,
  getToday,
  getBreakfast
}
