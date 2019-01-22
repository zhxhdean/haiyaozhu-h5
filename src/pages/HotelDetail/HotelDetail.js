import React, { Component } from 'react'
import { Carousel, Icon, Spin } from 'antd'
import {Link} from 'react-router-dom'
import Head from '../../components/Head/Head'
import './HotelDetail.less'
import { inject, observer } from 'mobx-react'
import DatePicker from '../../components/DatePicker/DatePicker'
import DefaultImage from '../../common/img'
import util from '../../common/util'
@inject('hotelDetailStore', 'rootStore')
@observer
class HotelDetail extends Component {
  componentWillMount() {
    const { id } = this.props.match.params
    this.props.hotelDetailStore.setValue('searchCondition.hotelid', id)
    this.props.rootStore.showLoading()
    this.props.hotelDetailStore
      .getHotelDetail(id)
      .then(rsp => {
        this.props.rootStore.hideLoading()
        if (rsp.code !== 0) {
          util.showToast('数据加载失败')
        } else {
          if (this.props.hotelDetailStore.hotelDetail.HotelType === 0) {
            this.props.rootStore.showLoading(2)
            this.props.hotelDetailStore
              .getRoomPrice()
              .then(rsp => {
                this.props.rootStore.hideLoading(2)
                if (rsp.code !== 0) {
                  util.showToast('房价加载失败')
                }
              })
              .catch(err => {
                this.props.rootStore.hideLoading(2)
                util.showToast('房价加载失败')
              })
          }
        }
      })
      .catch(err => {
        this.props.rootStore.hideLoading()
        util.showToast('数据加载失败')
      })
  }

  handleShowDateModal = (name, date) => {
    document.getElementsByTagName('body')[0].style.position = 'fixed'
    document.getElementsByTagName('body')[0].style.height = '100%'
    if (name === 'showCheckInModal') {
      this.props.hotelDetailStore.setValue('showCheckInModal', true)
      this.props.hotelDetailStore.setValue('showCheckOutModal', false)
      this.props.hotelDetailStore.setValue('checkIn', date)
    } else if (name === 'showCheckOutModal') {
      this.props.hotelDetailStore.setValue('showCheckInModal', false)
      this.props.hotelDetailStore.setValue('showCheckOutModal', true)
      this.props.hotelDetailStore.setValue('checkOut', date)
    }
  }

  handleClose = () => {
    document.getElementsByTagName('body')[0].style.position = 'initial'
    document.getElementsByTagName('body')[0].style.height = 'auto'
    this.props.hotelDetailStore.setValue('showCheckInModal', false)
    this.props.hotelDetailStore.setValue('showCheckOutModal', false)
  }

  handleSelectDate = (name, date) => {
    if (name === 'checkIn') {
      this.props.hotelDetailStore.setValue('checkOut', util.getTomorrow(date))
    }
    this.props.hotelDetailStore.setValue(name, date)
    this.props.rootStore.showLoading(2)
    this.props.hotelDetailStore
      .getRoomPrice()
      .then(rsp => {
        this.props.rootStore.hideLoading(2)
        if (rsp.code !== 0) {
          util.showToast('房价加载失败')
        }
      })
      .catch(err => {
        this.props.rootStore.hideLoading(2)
        util.showToast('房价加载失败')
      })
    // todo搜索房价
  }

  handleNavigator = hotelId => {
    this.props.history.push({ pathname: `/picture/${hotelId}` })
  }
  handleBooking = (hotel, room, subRoom, fee) => {
    const payType = subRoom.RoomInfoDataList[0].PayType === 'FG' ? 0 : 1
    const { checkIn, checkOut } = this.props.hotelDetailStore
    const night = util.getNights(checkIn, checkOut)
    const params = {
      hotelId: hotel.HotelId,
      roomName: `${room.BaseRoomName}(${
        subRoom.BedInfo.BedType
      })(${util.getBreakfast(subRoom.RoomInfoDataList[0].FGBreakfast)})`,
      hotelName: hotel.HotelName,
      checkin: checkIn,
      checkout: checkOut,
      night: night,
      price: subRoom.AveragePrice,
      payType: payType,
      roomId: +subRoom.RoomId,
      hotelTel: hotel.hotelContactInfo.Tel,
      breakfast: +subRoom.RoomInfoDataList[0].FGBreakfast,
      hotelAddress: hotel.hotelTrafficInfo.HotelAddress
    }
    // 预订信息
    sessionStorage.setItem('bookingInfo', JSON.stringify(params))
    this.props.history.push({
      pathname: `/booking?checkin=${checkIn}&checkout=${checkOut}&hotelId=${
        hotel.HotelId
      }&night=${night}&hotelName=${hotel.HotelName}&roomName=${
        room.BaseRoomName
      }(${subRoom.BedInfo.BedType})(${util.getBreakfast(
        subRoom.RoomInfoDataList[0].FGBreakfast
      )})&roomId=${subRoom.RoomId}&price=${
        subRoom.AveragePrice
      }&payType=${payType}&hotelTel=${hotel.hotelContactInfo.Tel}&breakfast=${
        subRoom.RoomInfoDataList[0].FGBreakfast
      }`
    })
  }

  // 订阅
  handleSubscribe = num => {
    if (!num) {
      const { id } = this.props.match.params
      this.props.hotelDetailStore.subscribe(id).then(rsp => {
        if (rsp.code === 0) {
          let el = document.getElementsByClassName('follow')[0]
          util.showToast('订阅成功')
          el && (el.className = 'followed')
          el && (el.innerText = '已订阅')
        }
      })
    }
  }

  handleChat = () => {
    const { userInfo } = this.props.rootStore
    const userDetail = userInfo.UserDetail || {}
    const { hotelDetail } = this.props.hotelDetailStore
    const url = `/chat?fromname=${userDetail.Name}&from=${userInfo.UID}&to=${
      hotelDetail.Uid
    }&toname=酒店&chattype=0`
    this.props.history.push({pathname: url})
  }

  render() {
    const { loading, loading2 } = this.props.rootStore
    const {
      hotelDetail,
      checkIn,
      checkOut,
      showCheckInModal,
      showCheckOutModal,
      hotelRoomPriceList
    } = this.props.hotelDetailStore

    const night = util.getNights(checkIn, checkOut)

    return (
      <div className="hotel-detail-page">
        <Spin spinning={loading}>
          <Head back={true} title={hotelDetail.HotelName} />
          <div className="hotel-pic">
            <Carousel autoplay>
              {hotelDetail.hotelImageList.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={this.handleNavigator.bind(
                      this,
                      hotelDetail.HotelId
                    )}
                  >
                    <div
                      className="pic"
                      style={{
                        backgroundImage: `url(${item.ImageUrl || DefaultImage})`
                      }}
                    />
                  </div>
                )
              })}
            </Carousel>
            <div
              className="unstar"
              style={{
                width: '80px',
                height: '16px',
                backgroundPosition: '0px -16px'
              }}
            >
              <i
                className="star"
                style={{ width: hotelDetail.Star * 16 + 'px', height: '16px' }}
              />
            </div>

            <div className="hotel-name">{hotelDetail.HotelName}</div>
            <div className="more-info">详情>></div>
          </div>

          <div className="hotel-info">
            <div className="hotel-infor">
              <h3>地址：{hotelDetail.hotelTrafficInfo.HotelAddress}</h3>
              <h3>
                电话：
                <a href={`tel:${hotelDetail.hotelContactInfo.Tel}`}>
                  {hotelDetail.hotelContactInfo.Tel}
                  <Icon type="phone" />
                </a>
              </h3>
            </div>
            <div>
              <div
                className={hotelDetail.LikeNum > 0 ? 'followed' : 'follow'}
                onClick={this.handleSubscribe.bind(this, hotelDetail.LikeNum)}
              >
                {hotelDetail.LikeNum > 0 ? '已订阅' : '订阅优惠推送'}
              </div>
              {hotelDetail.HotelType === 0 ? (
                <div className="wechat" onClick={this.handleChat}>
                  微信联系
                  <Icon type="wechat" />
                </div>
              ) : null}
            </div>
          </div>
          {/* hotelType: 1 是官网酒店， 
          hotelType: 0 是签约酒店，需要展示房型房价 */}
          {hotelDetail.HotelType === 1 &&
            hotelDetail.PromotionInfoList.map((item, index) => {
              return (
                <div className="hotel-promotion" key={index}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.MembershipDiscount
                    }}
                  />
                  <span>优惠规则：</span>
                  <Icon type="tags" />
                  {item.CouponPolicy}
                  <span>优惠码：</span>
                  <Icon type="gift" />
                  {item.CouponCode}
                </div>
              )
            })}

          {hotelDetail.HotelType === 1 && (
            <div className="hotel-website">
              <h2>{hotelDetail.HotelName}</h2>
              {/* <h2>{hotelDetail.HotelUrl}</h2> */}
              <Link className="button" to={`/redirect?url=${hotelDetail.HotelUrl}&name=${hotelDetail.HotelName}`}>
                转官网预定
              </Link>
            </div>
          )}

          {hotelDetail.HotelType === 2 && (
            <div className="hotel-desc">
              {util.removeHtmlTag(hotelDetail.HotelDesc)}
            </div>
          )}

          {hotelDetail.HotelType === 0 && (
            <Spin spinning={loading2}>
              <div className="contract-hotel">
                <div className="checkdate">
                  <div
                    className="checkdate-item"
                    onClick={this.handleShowDateModal.bind(
                      this,
                      'showCheckInModal',
                      checkIn
                    )}
                  >
                    入住日期
                    <span>{checkIn || '不限'}</span>
                  </div>
                  <div className="night">{night}晚</div>
                  <div
                    className="checkdate-item"
                    onClick={this.handleShowDateModal.bind(
                      this,
                      'showCheckOutModal',
                      checkOut
                    )}
                  >
                    离店日期
                    <span>{checkOut || '不限'}</span>
                  </div>
                </div>

                {hotelRoomPriceList.map((item, index) => {
                  const roompic = item.BaseRoomImageList[0].ImageUrl
                  const subRoom = item.SubRoomList[0]
                  const _fee =
                    subRoom &&
                    subRoom.RefOption.ExchangeResource.find(
                      item => item.ResourceType === 2
                    )
                  const fee = (_fee && _fee.UsePoint) || 0
                  const payType =
                    subRoom.RoomInfoDataList[0].PayType === 'FG' ? 0 : 1
                  return (
                    <div className="hotel-room-price" key={index}>
                      <div className="hotel-room-price-item">
                        <div
                          className="price-item-pic"
                          style={{
                            backgroundImage: `url(${roompic})`
                          }}
                        />
                        <div className="price-item-info">
                          <div className="price-item-room-name">
                            <h4>{item.BaseRoomName}</h4>
                            <span>
                              {item.RoomInfo.AreaRange}平米 住
                              {item.RoomInfo.Person}人{' '}
                              {item.RoomInfo.FloorRange}层
                            </span>
                          </div>
                          <div className="price-item-booking">
                            <div>
                              <span>
                                {util.getBreakfast(
                                  subRoom.RoomInfoDataList[0].FGBreakfast
                                )}{' '}
                                {subRoom.BedInfo.BedType}
                              </span>
                              <em className="price">
                                ￥{subRoom.AveragePrice}{' '}
                                {fee ? `或 ${fee}积分` : ''}
                              </em>
                            </div>
                          </div>
                          <div
                            className="booking"
                            onClick={this.handleBooking.bind(
                              this,
                              hotelDetail,
                              item,
                              subRoom,
                              fee
                            )}
                          >
                            预订
                            <i>{payType === 0 ? '到店付' : '在线付'}</i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {hotelRoomPriceList.length === 0 ? (
                  <div className="no-data">暂无数据</div>
                ) : (
                  ''
                )}

                <DatePicker
                  title="请选入住日期"
                  date={checkIn}
                  show={showCheckInModal}
                  onSelect={this.handleSelectDate.bind(this, 'checkIn')}
                  onClose={this.handleClose}
                />
                <DatePicker
                  minDate={checkIn}
                  title="请选离店日期"
                  date={checkOut}
                  show={showCheckOutModal}
                  onSelect={this.handleSelectDate.bind(this, 'checkOut')}
                  onClose={this.handleClose}
                />
              </div>
            </Spin>
          )}
        </Spin>
      </div>
    )
  }
}

export default HotelDetail
