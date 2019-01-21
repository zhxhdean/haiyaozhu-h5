import React, { Component } from 'react'
import './Coupon.less'
import { Link } from 'react-router-dom'
import { Spin, Modal, Icon } from 'antd'
import { inject, observer } from 'mobx-react'
import Head from '_src/components/Head/Head'
import moment from 'moment'
@inject('rootStore', 'couponStore')
@observer
class CouponList extends Component {
  componentDidMount() {
    this.props.rootStore.showLoading()
    this.props.couponStore
      .getCouponList()
      .finally(() => this.props.rootStore.hideLoading())
  }

  handleShowCouponDescription = () => {
    Modal.info({
      okText: '关闭',
      content: (
        <div className="coupon-description-content">
          <h2 className="f_orange">1.礼券是什么？</h2>
          <p>
            礼券是酒店特意为老顾客发的优惠券。基于酒店的促销策略，大部分酒店会经常做些优惠活动，让老顾客再次入住的时候享受到各类优惠。[一只虎度假直通车]为您实时直接送达这些礼券到您的微信公众号账户，供您选择使用。
          </p>
          <h2 className="f_orange">2.如何找到礼券？</h2>
          <p>
            打开[一只虎度假直通车]的微信公众号，点击右下角 [个人中心]
            菜单，然后点击"我的礼券"。您会看到所有您所属会员的酒店发给您的有效礼券。
          </p>
          <p>
            礼券充满惊喜，优惠多多，但是有过期时间，建议您有空就打开[一只虎度假直通车]的微信公众号看看，总有一券适合您。
          </p>
          <h2 className="f_orange">3.礼券如何使用？</h2>
          <p>
            到达酒店后，点击此酒店所发的有效礼券，将此礼券的二维码让酒店前台扫描成功后，您即可享受此礼券的优惠。扫描后，此礼券即为已使用礼券，将不能再次使用。
          </p>
          <h2 className="f_orange">4.免责申明</h2>
          <p>
            [一只虎度假直通车]
            微信公众号只限于提供互联网工具帮助用户直接跟酒店沟通和预订酒店产品。
          </p>
          <p>
            [一只虎度假直通车]
            微信公众号上的礼券为酒店直接提供，所有礼券内容，优惠政策和金额，优惠限制，优惠活动时间等都由酒店自行录入展示。
            酒店负责所有礼券有关信息的准确性。
          </p>
          <p>
            为了更好的使用礼券，请您在入住前注意礼券上的详细信息。如您遇到礼券信息不准确,优惠不实，请直接与酒店沟通协商解决。
            [一只虎度假直通车] 微信公众号对此不负相关法律责任.{' '}
          </p>
          <p>
            如有疑问或者投诉请邮件：
            <a href="mailto:service@haiyaozhu.com">service@haiyaozhu.com</a>
          </p>
        </div>
      )
    })


  }

  handleRedirectDetail = (CouponNo,e) => {
    if(e.target.nodeName !== "A"){
      //to 详情页
      this.props.history.push({pathname: `/coupon/${CouponNo}`})
    }
  }

  render() {
    const { loading } = this.props.rootStore
    const { couponList } = this.props.couponStore
    return (
      <div className="coupon-list-page">
        <Head back={true} title="酒店优惠券" />

        <Spin spinning={loading}>
          <div className="coupon-list">
            <div
              className="coupon-description"
              onClick={this.handleShowCouponDescription}
            >
              使用
              <br />
              说明
            </div>
            {couponList.map((item, index) => (
              <HotelCouponItem key={index} {...item} onClick={this.handleRedirectDetail}/>
            ))}
          </div>
        </Spin>
      </div>
    )
  }
}

const HotelCouponItem = props => {
  return (
    <ul className="hotel-coupon">
      {props.HotelCoupons.map((item, index) => (
        <CouponItem key={index} {...item} HotelName={props.HotelName} onClick={props.onClick}/>
      ))}
    </ul>
  )
}




const CouponItem = (props) => {
  const { CouponAmount, ExpDate, HotelId, HotelName,CouponNo, onClick } = props
  return (
    <li onClick={onClick.bind(this,CouponNo)}>
      <div className="price">
        <em className="currency">￥</em>
        {CouponAmount}
      </div>
      <div className="hotel">
        <p>适用酒店：{HotelName}</p>
        <p className="expire-date">
          过期时间：{new moment(ExpDate).format('YYYY-MM-DD')} <Icon type="right" />
        </p>
        <p>
          <Link to={`/detail/${HotelId}`}>立即使用</Link>
        </p>
      </div>
    </li>
  )
}

export default CouponList
