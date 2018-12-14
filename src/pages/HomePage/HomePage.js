import React, { Component } from 'react'
import { Icon, Spin } from 'antd'
import './HomePage.less'
import { inject, observer } from 'mobx-react'
import DatePicker from '../../components/DatePicker/DatePicker'
import DefaultImage from '../../common/img'
import util from '../../common/util'
import Head from '../../components/Head/Head'
@inject('homePageStore', 'rootStore', 'hotelListStore')
@observer
class HomePage extends Component {
  componentDidMount() {
    this.props.rootStore.showLoading()
    this.props.homePageStore
      .getList()
      .then(rsp => {
        this.props.rootStore.hideLoading()
      })
      .catch(err => {
        this.props.rootStore.hideLoading()
        console.log('请求失败')
      })
  }

  handleSearch = () => {
    const { cityInfo, checkIn, checkOut } = this.props.homePageStore
    this.props.hotelListStore.setSearchCondition({
      city: cityInfo.cityId,
      cityName: cityInfo.cityName,
      checkin: checkIn,
      checkout: checkOut
    })
    this.props.history.push({pathname: `/list/${cityInfo.cityName}/${cityInfo.cityId}`})
  }

  handleShowDateModal = (name, date) => {
    // 禁止页面滚动
    document.getElementById('root').style.position = 'fixed'
    document.getElementById('root').style.height = '100%'
    if (name === 'showCheckInModal') {
      this.props.homePageStore.setValue('showCheckInModal', true)
      this.props.homePageStore.setValue('showCheckOutModal', false)
      this.props.homePageStore.setValue('checkIn', date)
    } else if (name === 'showCheckOutModal') {
      this.props.homePageStore.setValue('showCheckInModal', false)
      this.props.homePageStore.setValue('showCheckOutModal', true)
      this.props.homePageStore.setValue('checkOut', date)
    }
  }

  handleClose = () => {
    // 恢复页面
    document.getElementById('root').style.position = 'initial'
    document.getElementById('root').style.height = 'auto'
    this.props.homePageStore.setValue('showCheckInModal', false)
    this.props.homePageStore.setValue('showCheckOutModal', false)
  }

  handleSelectDate = (name, date) => {
    this.props.homePageStore.setValue(name, date)
  }

  // 选择目的地
  handleChangeCity = () => {
    this.props.history.push({ pathname: '/city' })
  }

  handleNavigator = hotelId => {
    this.props.history.push({pathname: `/detail/${hotelId}`})
  }

  render() {
    const { loading } = this.props.rootStore
    const {
      checkIn,
      checkOut,
      showCheckInModal,
      showCheckOutModal,
      cityInfo,
      hotelList
    } = this.props.homePageStore || []
    return (
      <div className="home-page">
      <Head title="还要住酒店优惠平台"/>
        <div className="search-container">
          <h1>全球酒店官网优惠任您淘</h1>
          <h4>官网预定更靠谱，更优惠......</h4>

          <div className="destination" onClick={this.handleChangeCity}>
            <Icon type="search" />
            {cityInfo.cityName || '请选择目的地'}
          </div>

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

          <div className="search-btn">
            <button onClick={this.handleSearch}>搜 索</button>
          </div>

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
        <h4 className="tips">订酒店先淘优惠，每日更新！</h4>
        <Spin spinning={loading}>
          <div className="top-hotels">
            {hotelList.map(item => {
              return (
                <div className="hotel-item" key={item.HotelId} onClick={this.handleNavigator.bind(this, item.HotelId)}>
                  <div
                    className="hotel-img"
                    style={{
                      backgroundImage: `url(${item.ImageUrl ||
                        DefaultImage.DEFAULT_HOTEL_320_160})`
                    }}
                  />

                  <div className="item-right">
                    <div className="ellips_2 hotel-name">{item.HotelName}</div>
                    {item.PromotionInfoList.map((item, index) => {
                      return (
                        <div className="ellips_2 promotion" key={index}>
                          {util.removeHtmlTag(item.RecommedShortText)}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Spin>

        <div className="foot">
          <a href="http://www.haiyaozhu.com/hotel.html">成为合作酒店</a>
          <a href="http://www.haiyaozhu.com/terms.html">条款与细则</a>
        </div>
      </div>
    )
  }
}

export default HomePage
