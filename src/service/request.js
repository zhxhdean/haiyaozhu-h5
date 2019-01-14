import axios from 'axios'
import util from '../common/util'
import { WX_OPENID, WX_TOKEN } from './urls'
const config = {
  baseURL: 'http://m.haiyaozhu.com/openapi/', //'http://localhost:3000' 'https://api.mimishuo.com',
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
  const code = util.getQuery('code')
  const debug = util.getQuery('debug')
  return instance
    .post(debug ? `${WX_OPENID}?debug` : WX_OPENID, { code: code, location: window.location.href })
    .then(rsp => {
      return rsp
    })
    .catch(err => {
      console.log('获取openid失败')
    })
}

const getToken = openid => {
  const code = util.getQuery('code')
  return instance
    .post(WX_TOKEN, { head: { openid: openid }, code: code })
    .then(rsp => {
      return rsp
    })
    .catch(err => {
      console.log('获取openid失败')
    })
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
