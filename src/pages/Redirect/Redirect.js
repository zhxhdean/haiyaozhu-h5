import React from 'react'
import './Redirect.less'
import logo from '_src/assets/images/logo_tiger.png'
import loading from '_src/assets/images/loading.gif'
import Head from '_src/components/Head/Head'
import util from '_src/common/util'

const RedirectPage = () => {
  const url = util.getQuery('url')
  const name = util.getQuery('name')
  setTimeout(() => {window.location.href = url}, 3000)
  return (
    <div className="redirect-page">
      <Head back={true} title="跳转酒店官网"/>
      <div className="redirect-container">
          <h3>正在链接到酒店官网</h3>
          <div className="main">
              <img src={logo} width="50px" alt="logo"/>
              <img src={loading} alt="动画" width="50px"/>
              <span>{name}</span>
          </div>
          <p>订购酒店产品，请再次确认您的选择，一只虎祝您旅途愉快！</p>
      </div>
    </div>
  )
}

export default RedirectPage
