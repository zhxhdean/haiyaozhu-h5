import React, { Component } from 'react'
import './Coupon.less'
import { Spin, Divider } from 'antd'
import { inject, observer } from 'mobx-react'
import Head from '_src/components/Head/Head'
import moment from 'moment'
@inject('rootStore', 'couponStore')
@observer
class CouponDetail extends Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0
    const { id } = this.props.match.params
    this.props.rootStore.showLoading()
    this.props.couponStore
      .getCouponDetail(id)
      .finally(() => this.props.rootStore.hideLoading())
  }

  render() {
    const { loading } = this.props.rootStore
    const { couponDetail } = this.props.couponStore
    return (
      <div className="coupon-detail-page">
        <Head back={true} title="酒店优惠券详情" />
        <Spin spinning={loading}>
          <div className="coupon-detail">
            <p>优惠券：{couponDetail.CouponTitle}</p>
            <p>优惠券码：{couponDetail.CouponNo}</p>
            <p>优惠金额：￥{couponDetail.CouponAmount}</p>
            <p>
              有效期：{new moment(couponDetail.EffectDate).format('YYYY-MM-DD')}{' '}
              至 {new moment(couponDetail.ExpDate).format('YYYY-MM-DD')}
            </p>
            <p>说明：{couponDetail.CouponDesc}</p>

            <Divider />
            <p>
              <img src={`data:image/jpg;base64,${couponDetail.Url}`} />
            </p>
            <p>使用时请出示该二维码</p>
          </div>
        </Spin>
      </div>
    )
  }
}

export default CouponDetail
