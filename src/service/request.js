import axios from 'axios'
import util from '../common/util'
import { WX_OPENID, WX_TOKEN } from './urls'
// import {Modal} from 'antd'
const config = {
  baseURL: 'http://m.haiyaozhu.com/openapi/', //'http://127.0.0.1:8000/openapi/' 'https://api.mimishuo.com',
  // withCredentials: true,
  timeout: 5000
}
const instance = axios.create(config)

instance.interceptors.request.use(
  config => {
    // 增加配置
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  rsp => {
    if (rsp.status === 200 && rsp.data && rsp.data.code === 1) {
      // 接口1 标示成功
      return { code: 0, data: rsp.data.data }
    }
    // if(rsp.data.msg === 'token无效'){
    //   Modal.confirm({
    //     title: '',
    //     content: '请确认是否允许微信授权登录？',
    //     okText: '确定',
    //     cancelText: '取消',
    //     onOk() {
    //       // todo 弹确认框
    //       const location = encodeURIComponent(window.location.href)
    //       // 登录需要在微信中，下单操作需要在微信中
    //       // const location = encodeURIComponent('http://www.haiyaozhu.com/h5/#/booking?checkin=2019-01-15&checkout=2019-01-16&hotelId=37&night=1&hotelName=老磨坊精品酒店（丽江南诏公馆）&roomName=套房(大床)(无早)&roomId=142&price=628&payType=0&hotelTel=0888-6821888&breakfast=0')
    //       const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf64b140d4d73bcc4&redirect_uri=${location}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    //       window.location.replace(url)
    //       //回跳回来带上了code
    //       return { code: 1, msg: ''}
    //     }
    //   })
    // }
    return { code: 1, msg: rsp.data.msg }
  
  },
  err => {
    return Promise.reject(err)
  }
)

const setHead = data => {
  const openId = util.getStorage('_o') // 从storage获取 openid
  if (!openId) {
    //
    return {
      head: {
      openid: 'no',
      token: 'no'
    }, ...data}
  }
  const token = util.getStorage('_t') // 获取 token
  return {
    head: {
      openid: openId,
      token: token
    },
    ...data
  }
}

const getOpenId = () => {
  // 从url 获取临时code
  const code = util.getQuery('code') || util.getStorage('_c')
  const debug = util.getQuery('debug')
  return instance
    .post(debug ? `${WX_OPENID}?debug` : WX_OPENID, { code: code, location: window.location.href })
}



const getToken = openid => {
  const code = util.getQuery('code') || util.getStorage('_c')
  return instance
    .post(WX_TOKEN, { head: { openid: openid }, code: code })
}

const post = options => {
  const { url, data } = options
  const params = setHead(data)
  return instance.post(url, params)
}

const get = options => {
  const { url, data } = options
  const params = {
    params: {
      ...data
    }
  }
  return instance.get(url, params)
}

export { post, get, getOpenId, setHead,getToken }
