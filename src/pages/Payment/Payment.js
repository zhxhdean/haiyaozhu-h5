import React, { Component } from 'react'
import Head from '_src/components/Head/Head'
import './Payment.less'
import wechatIcon from '_src/assets/images/i-wechat.svg'
import { observer, inject } from 'mobx-react'
import util from '_src/common/util'

@inject('rootStore')
@observer
class Payment extends Component {
  constructor(props){
    super(props)
    this.state = {
      prepayid: ''
    }
  }
  componentDidMount() {
    const {prepayid} = this.props.match.params
    this.setState({prepayid: prepayid})
    const params = {
      url: window.location.href,
      prepayid: prepayid || ''
    }
    this.props.rootStore.getWXConfig(params)
  }

  handleSubmit = () => {
    let orderInfo = {}
    let bookingInfo = sessionStorage.getItem('bookingInfo')
    // 订单金额
    bookingInfo &&
      (orderInfo = JSON.parse(bookingInfo))
    console.log('支付')
    const self = this
    const { wxconfig } = this.props.rootStore
      // config信息验证后会执行ready方法，
      // 所有接口调用都必须在config接口获得结果之后，
      // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
      // 则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
      // 则可以直接调用，不需要放在ready函数中。
      window.wx.chooseWXPay({
        timestamp: wxconfig.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: wxconfig.nonceStr, // 支付签名随机串，不长于 32 位
        package: 'prepay_id=' + this.state.prepayid, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: wxconfig.paySign, // 支付签名
        success: function(res) {
          orderInfo.orderstatus = 10
          if (res.errMsg === 'chooseWXPay:ok') {
            //支付成功，跳订单详情页
            util.showToast('支付成功', 3000)
            orderInfo.orderstatus = 11
            //location.href = 'ordersuccess?prepayid=' + util.getQuery('prepayid') + '&status=' + orderstatus;
          } else {
            util.showToast(res.errMsg, 3000)
          }
          sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo))
          self.props.history.push({pathname: '/ordersuccess'})
        },
        cancel: function(res) {
          util.showToast('支付已取消', 3000)
          self.props.history.push({pathname: '/ordersuccess'})
          // location.href = 'ordersuccess?prepayid=' + util.getQuery('prepayid') + '&status=' + orderstatus;
        }
      })
    
  }
  render() {
    let orderInfo = {}
    const bookingInfo = sessionStorage.getItem('bookingInfo') || {}
    bookingInfo && JSON.stringify(bookingInfo) !== '{}' && (orderInfo = JSON.parse(bookingInfo))
    const { wxconfig } = this.props.rootStore
    window.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: wxconfig.appid, // 必填，公众号的唯一标识
      timestamp: wxconfig.timestamp, // 必填，生成签名的时间戳
      nonceStr: wxconfig.nonceStr, // 必填，生成签名的随机串
      signature: wxconfig.paySign, // 必填，签名，见附录1
      jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })

    return (
      <div className="payment-page">
        <Head title="支付订单" back={true} />
        <div className="payment-info">
          <b>
            <i>
              应付总额：<font className="font12">￥</font>
            </i>
            {orderInfo.totalPrice}
          </b>
          <span>{orderInfo.hotelName}</span>
          <span>
            {orderInfo.roomName} 共{orderInfo.night}晚
          </span>
          <button className="wechat" onClick={this.handleSubmit}>
            <img src={wechatIcon} alt="微信支付" /> 微信支付
          </button>
        </div>
      </div>
    )
  }
}

export default Payment
