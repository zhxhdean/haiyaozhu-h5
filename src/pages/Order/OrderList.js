import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './Order.less'
import Head from '_src/components/Head/Head'
import { Tabs, Button, Spin, Modal } from 'antd'
import util from '_src/common/util'
import moment from 'moment'
const TabPane = Tabs.TabPane
@inject('rootStore', 'orderStore')
@observer
class OrderList extends Component {
  componentDidMount() {
    const { page } = this.props.match.params
    if (!page) {
      this.props.orderStore.setPageIndex(1)
    }

    this.props.orderStore.getOrderList()
    document.addEventListener('scroll', this.listenScroll)
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.listenScroll)
  }

  listenScroll = () => {
    let { tabKey, pageIndex } = this.props.orderStore
    const { loading } = this.props.rootStore
    // 滚动条高度
    const scrollTop = document.documentElement.scrollTop
    // 文档高度
    const el_doc = document.getElementsByClassName('order-list')[+tabKey - 1]
    const documentHeight = (el_doc && el_doc.offsetHeight) || 0
    // 窗体高度
    const windowHeight = window.innerHeight
    if(documentHeight < windowHeight){
      // 没有超过一屏幕，不用加载
      return
    }
    if (windowHeight + scrollTop > documentHeight * 0.9 && !loading) {
      // 加载下一页数据
      console.log('加载下一页数据', pageIndex)
      this.props.orderStore.setPageIndex(pageIndex + 1)
      this.props.rootStore.showLoading()
      this.props.orderStore
        .getOrderList()
        .finally(() => this.props.rootStore.hideLoading())
    }
  }

  handleTabsKey = key => {
    this.props.orderStore.setTabKey(key)
  }

  // 跳详情页
  handleRedirectDetail = (item, e) => {
    if (e.target.nodeName === 'BUTTON') {
      return
    }
    this.props.history.push({ pathname: `/order/${item.OrderNo}` })
  }

  // 取消订单
  handleCancelOrder = (item, e) => {
    Modal.confirm({ title: '提示', content: '请确定要取消此订单吗？' , okText:'确定', cancelText:'取消', onOk: () => {
      this.props.rootStore.showLoading()
      this.props.orderStore
        .cancelOrder(item.OrderNo)
        .then(rsp => {
          if (rsp.code === 0) {
            item.OrderStatus = 101
            util.showToast('订单取消成功', 3000)
          } else {
            util.showToast('订单取消失败', 3000)
          }
        })
        .finally(() => this.props.rootStore.hideLoading())
    }})
  }

  render() {
    const { orderList } = this.props.orderStore || []
    const { loading } = this.props.rootStore
    const processingOrderList =
      orderList.filter(item => [0, 1, 10, 11].includes(item.OrderStatus)) || []
    const finishOrderList = orderList.filter(item =>
      [100, 101].includes(item.OrderStatus)
    )
    return (
      <div className="order-list-page">
        <Head back={true} title="我的订单" />
        <Spin spinning={loading} tip="数据加载中...">
          <Tabs defaultActiveKey="1" onChange={this.handleTabsKey}>
            <TabPane tab="进行中" key="1">
              <div className="order-list">
                {processingOrderList.map((item, index) => (
                  <OrderItem
                    key={index}
                    {...item}
                    onClick={this.handleRedirectDetail.bind(this, item)}
                    onCancel={this.handleCancelOrder.bind(this, item)}
                  />
                ))}
                {processingOrderList.length === 0 ? (
                  <div className="no-data">暂无订单</div>
                ) : (
                  ''
                )}
              </div>
            </TabPane>
            <TabPane tab="已结束" key="2">
              <div className="order-list">
                {finishOrderList.map((item, index) => (
                  <OrderItem
                    key={index}
                    {...item}
                    tabKey="2"
                    onClick={this.handleRedirectDetail.bind(this, item)}
                    onCancel={this.handleCancelOrder.bind(this, item)}
                  />
                ))}
                {finishOrderList.length === 0 ? (
                  <div className="no-data">暂无订单</div>
                ) : (
                  ''
                )}
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    )
  }
}

const OrderItem = ({
  OrderNo,
  HotelName,
  HotelAddress,
  Price,
  OrderStatus,
  TripDate,
  Quantity,
  onClick,
  onCancel,
  tabKey
}) => {
  const night = util.getNights(TripDate.CheckInDate, TripDate.CheckOutDate)
  return (
    <div className="order-item" onClick={onClick}>
      <div className="order-hotel-name">
        <h1>{HotelName}</h1>{' '}
        <span className="price">￥{Price.ActualPayPrice}</span>
      </div>
      <div className="order-hotel-address">
        {HotelAddress}
        <span className="order-status">
          {util.ORDER_STATUS.get(OrderStatus)}
        </span>
      </div>
      <div className="order-hotel-date">
        {new moment(TripDate.CheckInDate).format('MM月DD日')} 至{' '}
        {new moment(TripDate.CheckOutDate).format('MM月DD日')} {night}晚/
        {Quantity}间{' '}
      </div>
      {tabKey === '2' ? null :  <div className="order-hotel-action">
        <Button type="danger" onClick={onCancel}>
          取消
        </Button>
      </div>}
     
    </div>
  )
}

export default OrderList
