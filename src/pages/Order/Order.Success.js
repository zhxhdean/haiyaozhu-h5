import React from 'react'
import './Order.less'
import Head from '_src/components/Head/Head'
import {Icon} from 'antd'
import {Link} from 'react-router-dom'
import util from '_src/common/util'


const OrderSuccess = () => {
  let orderInfo = window.sessionStorage.getItem('orderInfo')||''
  orderInfo && (orderInfo = JSON.parse(orderInfo))

  let passengerInfo = window.localStorage.getItem('passengerInfo')||''
  passengerInfo && (passengerInfo = JSON.parse(passengerInfo))
  return(<div className="order-page">
  <Head title="订单信息" back={true}/>
  <div className="order-info">
  <h2><Link to={`/detail/${orderInfo.hotelId}`}>{orderInfo.hotelName}</Link> <Link to={`/detail/${orderInfo.hotelId}`}><Icon type="right" /></Link></h2>
  <span className="address">{orderInfo.hotelAddress}</span>
  <h2 className="order-info-detail">订单信息</h2>
  <p><span>订单金额：</span><font className="font12">￥</font><b>{orderInfo.totalPrice}</b></p>
  <p><span>订单号：</span>{orderInfo.orderNo}</p>
  <p><span>订单状态：</span>{
    //payType = 0 现付、 =1 预付
    util.ORDER_STATUS.get(orderInfo.orderStatus)
    // orderInfo.payType === 0 ? (orderInfo.orderStatus === 1 ? '已确认' :'已提交') : (orderInfo.orderStatus === 11 ? '已支付' : '未支付')
  }</p>
  <p><span>入住日期：</span>{util.formatDate2(orderInfo.checkin)}-{util.formatDate2(orderInfo.checkout)}</p>
  <p><span>入住房间：</span>{orderInfo.roomName || ''}</p>
  <p><span>房间数：</span>{orderInfo.number || 1}</p>
  <h2 className="order-info-detail">预订信息</h2>
  <p><span>联系人：</span>{passengerInfo.name}</p>
  <p><span>联系手机：</span>{passengerInfo.mobile}</p>
  <p><span>联系邮箱：</span>{passengerInfo.email}</p>
  </div>
</div>)
}

export default OrderSuccess

