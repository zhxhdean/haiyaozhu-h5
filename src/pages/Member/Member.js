import React, { Component } from 'react'
import {Link} from 'react-router-dom'
export default class Profile extends Component {
  render() {
    return (
      <div>
        个人中心页面
        <Link to="/member/profile">个人资料</Link>
      </div>
    )
  }
}
