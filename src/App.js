import React, { Component } from 'react'
import { HashRouter as Router, Route,Switch} from 'react-router-dom'
import {Provider} from 'mobx-react'
import HomePage from './pages/HomePage/HomePage.js'
import City from './pages/City/City.js'
import './index.less'
import homePageStore from './pages/HomePage/HomePage.Store'

const store = {
  homePageStore
}

// 方便调试
window.__APPSTATE__ = store
class App extends Component {
  
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
