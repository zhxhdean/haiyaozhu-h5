import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import './Toolbar.less'
export default withRouter(class Toolbar extends Component {
  render() {
    const path = this.props.location.pathname
    console.log(path)
    if(path === '/' || path === '/member'){
      // 首页
      return (
        <div className="toolbar">
          <Link to="/"><span className={'home' + (path === '/' ? ' on' : '')}>首页</span></Link>
          <Link to="/"><span className="chat">信息</span></Link>
          <Link to="/member"><span className={'member' + (path === '/member' ? ' on' : '')}>会员</span></Link>
        </div>
      )
    }else{
      return null
    }

  }
})
