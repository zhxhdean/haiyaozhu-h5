import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'
import HomePage from './pages/HomePage/HomePage.js'
import HotelList from './pages/HotelList/HotelList.js'
import HotelDetail from './pages/HotelDetail/HotelDetail.js'
import City from './pages/City/City.js'
import './index.less'
import homePageStore from './pages/HomePage/HomePage.Store'
import hotelListStore from './pages/HotelList/HotelList.Store'
import cityStore from './pages/City/City.Store'
import hotelDetailStore from './pages/HotelDetail/HotelDetail.Store'
import rootStore from './store'
import { getOpenId, getToken } from './service/request'
import util from './common/util'
import ToolBar from './components/Toolbar/Toolbar.js'
const store = {
  rootStore,
  homePageStore,
  hotelListStore,
  cityStore,
  hotelDetailStore
}

// 方便调试
window.__APPSTATE__ = store
class App extends Component {
  componentWillMount() {
    if(window.location.href.includes('debug')){
      util.setStorage('_o', 'oAVoSweV7_70u_vKdFAR52zGEnsc')
      util.setStorage('_t', '001GML8r1VRa5l0hr9ar16lM8r1GML8u:1gXcQk:WAolyCxU9bT7P4AwtvAKFdhHMis')
    }
    getOpenId().then(rsp => {
      if (rsp && rsp.code === 0) {
        // 接口1 标示成功
        util.setStorage('_o', rsp.data.openid)
        getToken(rsp.data.openid).then(rsp => {
          if (rsp && rsp.code === 0) {
            util.setStorage('_t', rsp.data.token)
          }
        })
      }
    })
  }
  render() {
    return (
      <Provider {...store}>
        <Router>
          <div>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/city" component={City} />
              <Route path="/list/:name/:id" component={HotelList}/>
              <Route path="/detail/:id?" component={HotelDetail}/>
            </Switch>

            <ToolBar />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
