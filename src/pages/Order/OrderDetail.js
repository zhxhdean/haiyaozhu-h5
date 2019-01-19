import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Head from '_src/components/Head/Head'
import { inject, observer } from 'mobx-react'
import { Spin,Icon } from 'antd'
import './Order.less'
import moment from 'moment'
import util from '_src/common/util'
@inject('rootStore', 'orderStore')
@observer
class OrderDetail extends Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0
    const {id} = this.props.match.params
    this.props.rootStore.showLoading()
    this.props.orderStore.getOrderDetail(id).finally(() => this.props.rootStore.hideLoading())
  }
  render() {
    const {loading} = this.props.rootStore
    const {orderInfo} = this.props.orderStore
    return (
      <div className="order-detail-page">
        <Head back={true} title="订单详情" />
        <div className="order-page">
        <Spin spinning={loading}>
          <div className="order-info" style={{marginTop: '0px'}}>
            <h2>
              <Link to={`/detail/${orderInfo.HotelId}`}>
                {orderInfo.HotelName}
              </Link>{' '}
              <Link to={`/detail/${orderInfo.HotelId}`}>
                <Icon type="right" />
              </Link>
            </h2>
            <span className="address">{orderInfo.HotelTrafficInfo.HotelAddress}</span>
            <h2 className="order-info-detail">订单信息</h2>
            <p>
              <span>订单金额：</span>
              <font className="font12">￥</font>
              <b>{orderInfo.Price.ActualPayPrice}</b>
            </p>
            <p>
              <span>订单号：</span>
              {orderInfo.OrderNo}
            </p>
            <p>
              <span>订单状态：</span>
              {//payType = 0 现付、 =1 预付
              util.ORDER_STATUS.get(orderInfo.OrderStatus)
              // orderInfo.payType === 0 ? (orderInfo.orderStatus === 1 ? '已确认' :'已提交') : (orderInfo.orderStatus === 11 ? '已支付' : '未支付')
              }
            </p>
            <p>
              <span>入住日期：</span>
              {new moment(orderInfo.AllTripDate.CheckInDate).format('MM月DD日')}-
              {new moment(orderInfo.AllTripDate.CheckOutDate).format('MM月DD日')}
            </p>
            <p>
              <span>入住房间：</span>
    {orderInfo.HotelOrders[0].RoomInfo.RoomName || ''} ({util.getBreakfast(orderInfo.HotelOrders[0].RoomInfo.BreakfastCount)}) ({util.BED_TYPE.get(orderInfo.HotelOrders[0].RoomInfo.BreakfastCount)})
            </p>
            <p>
              <span>房间数：</span>
              {orderInfo.HotelOrders[0].RoomInfo.Quantity || 1}
            </p>
            <h2 className="order-info-detail">预订信息</h2>
            <p>
              <span>联系人：</span>
              {orderInfo.OrderContactPerson.Contact}
            </p>
            <p>
              <span>联系手机：</span>
              {orderInfo.OrderContactPerson.Phone}
            </p>
            <p>
              <span>联系邮箱：</span>
              {orderInfo.OrderContactPerson.Email}
            </p>
            <p>
              <span>预订时间：</span>
              {orderInfo.OrderCreateDate && new moment(orderInfo.OrderCreateDate).utc().format('YYYY-MM-DD HH:mm:ss')}
            </p>
          </div>
          </Spin></div>
      </div>
    )
  }
}

export default OrderDetail
