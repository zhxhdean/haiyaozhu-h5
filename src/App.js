import React, { Component } from 'react'
import { HashRouter as Router, Route,Switch} from 'react-router-dom'
import {Provider} from 'mobx-react'
import HomePage from './pages/HomePage/HomePage.js'
import City from './pages/City/City.js'
import './index.less'
import homePageStore from './pages/HomePage/HomePage.Store'
import {getOpenId} from './service/request'
import util from './common/util'
const store = {
  homePageStore
}

// 方便调试
window.__APPSTATE__ = store
class App extends Component {
  componentWillMount(){
    getOpenId().then(rsp => {
     alert(JSON.stringify(rsp))
      if(rsp && rsp.code === 0){
        // 接口1 标示成功
        util.setStorage('_o', rsp.data)
      }
    })
  }
  render() {
    return (
    <Provider {...store}>
    <Router>
      <Switch>
      <Route path="/" exact component ={HomePage} />
      <Route path="/city" component={City}/>
      </Switch>
    </Router>
    </Provider>)
  }
}

export default App
