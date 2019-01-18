import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Head from '_src/components/Head/Head'
import { inject, observer } from 'mobx-react'
import './Member.less'
import {Icon,Modal,Spin} from 'antd'
// import util from '_src/common/util'
@inject('rootStore')
@observer
class Profile extends Component {

  componentDidMount(){
    //当前是否在进行登录操作中
    const {logining} = this.props.rootStore
    this.props.rootStore.getUserInfo().then(rsp => {
      if (rsp.msg === 'token无效' && !logining) {
        Modal.confirm({
          title: '',
          content: '请确认是否允许微信授权登录？',
          okText: '登录',
          cancelText: '取消',
          onOk() {
            // todo 弹确认框
            const location = encodeURIComponent(window.location.href)
            // 登录需要在微信中，下单操作需要在微信中
            // const location = encodeURIComponent('http://www.haiyaozhu.com/h5/#/booking?checkin=2019-01-15&checkout=2019-01-16&hotelId=37&night=1&hotelName=老磨坊精品酒店（丽江南诏公馆）&roomName=套房(大床)(无早)&roomId=142&price=628&payType=0&hotelTel=0888-6821888&breakfast=0')
            const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf64b140d4d73bcc4&redirect_uri=${location}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
            window.location.replace(url)
            //回跳回来带上了code
            return false
          }
        })
        // util.showToast('请登录后再下单', 3000)
      }
    })
  }

  render() {
    const {userInfo,loading} = this.props.rootStore
    const logined = userInfo.NickName !== ''
    const userDetail = userInfo.UserDetail || {}
    return (
      <div className="member-page">
        <Head back={true} title="会员中心" />
        <Spin spinning={loading}>
        <div className="banner">
          <img alt="头像" src={userInfo.HeadImgUrl} />
          {userDetail.Name}
        </div>
        </Spin>
        <dl className="menu">
          <dd>
            <Link to={logined ? '/member/profile' : '#'}><i className="icon profile" /><span>个人资料</span><Icon type="right" /></Link>
          </dd>
          <dd>
          <Link to="/member/order"><i className="icon order" /><span>我的订单</span><Icon type="right" /></Link>
          </dd>
          <dd>
          <Link to="/member/coupon"><i className="icon coupon" /><span>酒店礼券</span><Icon type="right" /></Link>
          </dd>
        </dl>

        <dl className="menu">
          <dd>
            <Link to="/member/profile"><i className="icon about" /><span>关于我们</span><Icon type="right" /></Link>
          </dd>
          <dd>
          <Link to="/member/order"><i className="icon online-service" /><span>一只虎在线客服</span><Icon type="right" /></Link>
          </dd>
          
        </dl>
      </div>
    )
  }
}

export default Profile
