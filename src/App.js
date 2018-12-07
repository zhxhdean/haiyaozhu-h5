import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage.js'
import {Provider} from 'mobx-react'
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
      <Route path="/" component ={HomePage}/>
    </Router>
    </Provider>)
  }
}

export default App
