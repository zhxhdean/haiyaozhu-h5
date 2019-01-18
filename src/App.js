import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'
import HomePage from './pages/HomePage/HomePage.js'
import HotelList from './pages/HotelList/HotelList.js'
import HotelDetail from './pages/HotelDetail/HotelDetail.js'
import HotelPicture from './pages/HotelPicture/HotelPicture.js'
import HotelPictureDetail from './pages/HotelPicture/HotelPictureDetail.js'
import Booking from './pages/Booking/Booking'
import City from './pages/City/City.js'
import Payment from './pages/Payment/Payment.js'
import OrderSuccess from './pages/Order/Order.Success'
import Member from './pages/Member/Member.js'
import Profile from './pages/Member/Profile/Profile.js'
import './index.less'
import homePageStore from './pages/HomePage/HomePage.Store'
import hotelListStore from './pages/HotelList/HotelList.Store'
import cityStore from './pages/City/City.Store'
import hotelDetailStore from './pages/HotelDetail/HotelDetail.Store'
import bookingStore from './pages/Booking/Booking.Store'
import memberStore from './pages/Member/Member.Store'
import rootStore from './store'
import { getOpenId, getToken } from './service/request'
import util from './common/util'
import ToolBar from './components/Toolbar/Toolbar.js'
const store = {
  rootStore,
  homePageStore,
  hotelListStore,
  cityStore,
  hotelDetailStore,
  bookingStore,
  memberStore
}

// 方便调试
window.__APPSTATE__ = store
class App extends Component {
  componentWillMount() {
    if (window.location.href.includes('debug')) {
      util.setStorage('_o', '')
      util.setStorage('_t', '')
      util.setStorage('_c', '')
      // util.setStorage('_o', 'oAVoSweV7_70u_vKdFAR52zGEnsc')
      // util.setStorage('_t', '011XWwDD1PELs60kMoED1I1vDD1XWwDw:1gh2ll:ignSvlEJIMsfIbTs7PMIToImuYo')
    }
    if (window.location.href.includes('code=')) {
      util.setStorage('_c', util.getQuery('code'))
    }
    rootStore.setLogining(true)
    rootStore.showLoading()
    getOpenId()
      .then(rsp => {
        if (rsp && rsp.code === 0) {
          // 接口1 标示成功
          util.setStorage('_o', rsp.data.openid)
          return rsp.data.openid
        }
        return false
      })
      .then(openid => {
        return (
          openid &&
          getToken(openid).then(rsp => {
            if (rsp && rsp.code === 0) {
              util.setStorage('_t', rsp.data.token)
              util.showToast('登录成功', 3000)
              return rsp.data.token
            }
            return false
          })
        )
      })
      .then(token => {
        // 用户信息
        token && rootStore.getUserInfo()
      })
      .finally(() => {
        rootStore.setLogining(false)
        rootStore.hideLoading()
      })
  }
  render() {
    return (
      <Provider {...store}>
        <Router>
          <div>
            <Switch>
              <Route path="/city" component={City} />
              <Route path="/list/:name/:id" component={HotelList} />
              <Route path="/detail/:id?" component={HotelDetail} />
              <Route
                path="/picture/brower/:id?"
                component={HotelPictureDetail}
              />
              <Route path="/picture/:id?" component={HotelPicture} />
              <Route path="/booking" component={Booking} />
              <Route path="/payment/:prepayid/:paysign" component={Payment} />
              <Route path="/ordersuccess" component={OrderSuccess} />
              <Route path="/member/profile" component={Profile} />
              <Route path="/member" component={Member} />
              <Route path="/" exact component={HomePage} />
            </Switch>

            <ToolBar />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
