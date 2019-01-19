function isIphoneX() {
  return (
    /iphone/gi.test(navigator.userAgent) &&
    (window.screen.height === 812 && window.screen.width === 375)
  )
}

function isMobile (str){
  const reg = /^(13[0-9]|14[579]|15[^4,\D]|17[0135678]|18[0-9]|19[0-9])\d{8}$/;
  return reg.test(str)
}

function isEmail (str){
  const reg =/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  return reg.test(str)
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


//date: 2018-12-18
// return: 2018年12月18日
// return: 12月18日
const formatDate2 = (date, type=0) => {
  if(!date){
    return
  }
  const _arr = date.split('-')
  if(type === 1){
    return _arr[0]+'年'+_arr[1]+'月'+_arr[2]+'日'
  }else if(type === 0){
    return _arr[1]+'月'+_arr[2]+'日'
  }else{
    return date
  }
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

const ORDER_STATUS = new Map([
[0, '待确认'],
[1, '酒店确认'],
[100, '订单完成'],
[10, '未支付'],
[11, '已支付'],
[101, '已取消']
])

const BED_TYPE = new Map([
  [0, '大床'],
  [1, '双床'],
  [2, '一大一小'],
  [3, '可大可小'],
  [4, '三小床']
])


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
  getBreakfast,
  formatDate2,
  isMobile,
  isEmail,
  ORDER_STATUS,
  BED_TYPE
}
