import React, { Component } from 'react'
import Head from '_src/components/Head/Head'
import './Booking.less'
import util from '_src/common/util'
import { Row, Col, Input, Icon, Spin } from 'antd'
import Selection from '_src/components/Selection/Selection'
import { observer, inject } from 'mobx-react'

@inject('bookingStore', 'rootStore')
@observer
class Booking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      number: 1,
      hotelId: +util.getQuery('hotelId'),
      roomName: util.getQuery('roomName'),
      hotelName: util.getQuery('hotelName'),
      checkin: util.getQuery('checkin'),
      checkout: util.getQuery('checkout'),
      night: +util.getQuery('night'),
      price: +util.getQuery('price'),
      payType: +util.getQuery('payType'), // 0 :现付， 1：预付
      roomId: +util.getQuery('roomId'),
      hotelTel: util.getQuery('hotelTel'),
      breakfast: util.getQuery('breakfast'),
      passengerInfo: {
        mobile: '',
        name: '',
        email: ''
      }
    }
  }
  componentDidMount() {
    const defaultPassengerInfo = localStorage.getItem('passengerInfo')
    defaultPassengerInfo &&
      this.setState({ passengerInfo: JSON.parse(defaultPassengerInfo) })
    this.props.rootStore.showLoading()
    this.props.bookingStore
      .getMemberShipCard(this.state.hotelId)
      .then(rsp => {
        this.props.rootStore.hideLoading()
      })
      .catch(err => {
        this.props.rootStore.hideLoading()
      })
  }
  handleSelect = v => {
    this.setState({ number: +v })
  }

  handleSubmit = () => {
    const { passengerInfo, payType } = this.state
    if (!passengerInfo.name) {
      util.showToast('请输入姓名')
      return
    }
    if (!passengerInfo.mobile) {
      util.showToast('请输入手机号码')
      return
    } else {
      if (!util.isMobile(passengerInfo.mobile)) {
        util.showToast('手机号码格式错误')
        return
      }
    }
    if (!passengerInfo.email) {
      util.showToast('请输入电子邮箱')
      return
    } else {
      if (!util.isEmail(passengerInfo.email)) {
        util.showToast('电子邮箱格式错误')
        return
      }
    }

    this.checkBookingable().then(rsp => {
      if (rsp) {
        // todo 创建订单
        const createOrderParams = this.getCreateOrderParams(rsp.data)
        this.props.rootStore.showLoading()
        this.props.bookingStore
          .createOrder(createOrderParams)
          .then(rsp => {
            this.props.rootStore.hideLoading()
            if (rsp.code === 0) {
              // 保存，下次直接使用
              localStorage.setItem(
                'passengerInfo',
                JSON.stringify(passengerInfo)
              )
              let orderInfo = {}
              let bookingInfo = sessionStorage.getItem('bookingInfo')
              // 订单金额
              bookingInfo &&
                (orderInfo = JSON.parse(bookingInfo))
              orderInfo.totalPrice = createOrderParams.items.Price.ActualPayPrice
              orderInfo.orderNo = createOrderParams.items.OrderNo
              orderInfo.number = createOrderParams.OrderItemList[0].Quantity
              if (payType === 0) {
                // 现付， 接口返回订单状态 1?'已确认':'已提交' , todo 跳订单成功页面
                orderInfo.orderStatus = rsp.data
                sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo))
                this.props.history.push({pathname: '/ordersuccess'})
              } else {
                //todo跳转支付页面
                sessionStorage.setItem('bookingInfo', JSON.stringify(orderInfo))
                this.props.history.push({
                  pathname: `/payment/${rsp.data.prepayid}/${rsp.data.wxsign}`})
              }
            }else{
              util.showToast(rsp.msg, 3000)
            }
          })
          .catch(err => {
            this.props.rootStore.hideLoading()
            util.showToast('提交订单遇到错误', 3000)
          })
      }
    })
  }

  // 检查房间是否可订
  checkBookingable = () => {
    const checkBookingParams = this.getCheckBookingableParams()
    this.props.rootStore.showLoading()
    return this.props.bookingStore
      .checkBookingable(checkBookingParams)
      .then(rsp => {
        this.props.rootStore.hideLoading()
        if (rsp.code !== 0) {
          util.showToast(rsp.msg, 3000)
          return false
        }
        const bookingInfo = sessionStorage.getItem('bookingInfo')
        // 订单号
        bookingInfo && (JSON.parse(bookingInfo).orderNo = rsp.data)
        return rsp
      })
      .catch(err => {
        console.log(err)
        this.props.rootStore.hideLoading()
        util.showToast('提交订单遇到错误', 3000)
        return false
      })
  }

  // 可订检查参数
  getCheckBookingableParams = () => {
    const {
      payType,
      number,
      checkin,
      checkout,
      hotelId,
      night,
      price,
      roomId
    } = this.state
    var items = []
    var item = {
      RoomId: roomId,
      HotelId: hotelId,
      Price: {
        Price: price * night
      },
      PayType: payType,
      TripDate: {
        CheckInDate: checkin,
        CheckOutDate: checkout
      },
      TravelPerson: [1],
      Quantity: number,
      // Remark: 最好无烟房,
      OrderItemOptionList: []
    }
    // if (this.usePoint && !_.isEmpty(this.giftPointsForFreeExchangeResource)) {
    //   item.OrderItemOptionList.push({
    //     OptionId: this.giftPointsForFreeExchangeResource.ResourceId,
    //     TripDate: null
    //   });
    // }
    items.push(item)
    return {
      items: items
    }
  }

  // 下单参数
  getCreateOrderParams = orderNo => {
    console.log(orderNo)
    const {
      passengerInfo,
      hotelTel,
      payType,
      number,
      breakfast,
      roomName,
      hotelName,
      checkin,
      checkout,
      hotelId,
      night,
      price,
      roomId
    } = this.state
    const items = {
      OrderItemList: [],
      OrderNo: orderNo,
      HotelId: hotelId,
      HotelTel: hotelTel,
      HotelName: hotelName,
      RoomName: roomName,
      Breakfast: breakfast,
      OrderContactPerson: {
        Tel: '',
        Phone: passengerInfo.mobile,
        Email: passengerInfo.email,
        Fax: '',
        Contact: passengerInfo.name
      },
      Price: {
        ActualPayPrice: price * number * night,
        Price: price * number * night
      },
      Payment: {
        PaymentType: payType === 1 ? 2 : 0,
        PayType: payType
      },
      PayCreditCount: 0
      // PayCreditCount: this.usePoint ? this.giftPointsForFree : 0
    }
    var item = {
      RoomId: roomId,
      HotelId: hotelId,
      Price: {
        Price: price * night
      },
      TripDate: {
        CheckInDate: checkin,
        CheckOutDate: checkout
      },
      Quantity: number,
      TravelPerson: [
        {
          Name: passengerInfo.name
        }
      ],
      OrderItemOptionList: []
    }
    // if (this.usePoint && !_.isEmpty(this.giftPointsForFreeExchangeResource)) {
    //   item.OrderItemOptionList.push({
    //     OptionId: this.giftPointsForFreeExchangeResource.ResourceId,
    //     TripDate: null
    //   });
    // }
    // if (this.giftPointsGeted > 0 && !_.isEmpty(this.giftPointsGetedExchangeResource)) {
    //   item.OrderItemOptionList.push({
    //     OptionId: this.giftPointsGetedExchangeResource.ResourceId,
    //     TripDate: null
    //   });
    // }
    items.OrderItemList.push(item)

    const { memberShipCards } = this.props.bookingStore
    const memberShipCard =
      memberShipCards.find(item => item.HotelId === hotelId) || {}
    items.CardNo = memberShipCard.CardNo || ''

    return {
      items: items
    }
  }

  handleInputChange = (name, e) => {
    const val = e.currentTarget.value
    let passengerInfo = this.state.passengerInfo
    if (name === 'name') {
      passengerInfo.name = val
    } else if (name === 'mobile') {
      passengerInfo.mobile = val
    } else if (name === 'email') {
      passengerInfo.email = val
    }
    this.setState({ passengerInfo: passengerInfo })
  }

  render() {
    const {
      show,
      number,
      roomName,
      hotelName,
      checkin,
      checkout,
      hotelId,
      night,
      price,
      passengerInfo
    } = this.state
    const { loading } = this.props.rootStore
    const { memberShipCards } = this.props.bookingStore
    const memberShipCard =
      memberShipCards.find(item => item.HotelId === hotelId) || {}
    return (
      <div className="booking-page">
        <Spin spinning={loading}>
          <Head back={true} title={hotelName} />
          <div className="checkin-info">
            <Row>
              <Col span={6}>入住房型：</Col>
              <Col span={14}>{roomName}</Col>
            </Row>
            <Row>
              <Col span={8}>入住：{util.formatDate2(checkin)} </Col>
              <Col offset={2} span={8}>
                离店：{util.formatDate2(checkout)}{' '}
              </Col>
              <Col offset={2}>共{night}晚</Col>
            </Row>
          </div>
          <div className="booking-info">
            <Row
              onClick={() => {
                this.setState({ show: true })
              }}
            >
              <Col span={6}>房间数：</Col>
              <Col span={16}>{number}</Col>
              <Col span={2} className="right">
                <Icon type="right" />
              </Col>
            </Row>
            <Row>
              <Col span={6}>入住人：</Col>
              <Col span={18} className="right">
                <Input
                  value={passengerInfo.name}
                  placeholder="请填写姓名"
                  onChange={this.handleInputChange.bind(this, 'name')}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>联系手机：</Col>
              <Col span={18} className="right">
                <Input
                  value={passengerInfo.mobile}
                  placeholder="请填写手机号码"
                  onChange={this.handleInputChange.bind(this, 'mobile')}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>电子邮箱：</Col>
              <Col span={18} className="right">
                <Input
                  value={passengerInfo.email}
                  placeholder="请填写电子邮箱"
                  onChange={this.handleInputChange.bind(this, 'email')}
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>会员号：</Col>
              <Col span={18}>{memberShipCard.CardNo}</Col>
            </Row>

            <Selection
              title="请选择房间数量"
              onSelect={this.handleSelect}
              onClose={() => this.setState({ show: false })}
              show={show}
              number={number}
            />
          </div>
        </Spin>

        <div className="submit-info">
          <div className="total">
            总价：<i>￥{number * price}</i>
          </div>

          <button onClick={this.handleSubmit}>提交订单</button>
        </div>
      </div>
    )
  }
}

export default Booking
