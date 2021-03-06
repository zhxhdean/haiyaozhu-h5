import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Spin, AutoComplete ,Icon } from 'antd'
import DefaultImage from '../../common/img'
import './HotelList.less'
import util from '../../common/util'
import Head from '../../components/Head/Head'
const Option = AutoComplete.Option
let canSearch = true
@inject('hotelListStore', 'rootStore')
@observer
class HotelList extends Component {
  componentDidMount() {
    console.log(this.props.hotelListStore.searchCondition)
    const {name, id} = this.props.match.params
    if(!this.props.hotelListStore.searchCondition.cityName){
      this.props.hotelListStore.setSearchCondition({
        city: id,
        cityName: name,
        checkin: '',
        checkout: ''
      })
    }
    this.props.hotelListStore.searchHotelList()
  }
  // 联想
  handleSearch = value => {
    console.log(canSearch)
    canSearch &&
      setTimeout(() => {
        this.props.hotelListStore.autocomplete(value).then(rsp => {
          canSearch = true
        })
      }, 300)
    canSearch = false
  }

  // 搜索选中的
  handleSearchHotel = hotelId => {
    // todo 去酒店详情页
    this.props.history.push({pathname: `/detail/${hotelId}`})
  }

  handleNavigator = hotelId => {
    this.props.history.push({pathname: `/detail/${hotelId}`})
  }
  render() {
    const { loading } = this.props.rootStore
    const { hotelList, autocompleteList,searchCondition } = this.props.hotelListStore
    const option = autocompleteList.map(item => <Option key={item.HotelId} value={item.HotelId+''}>{item.HotelName}</Option>)
    return (
      <div className="hotel-list-page">
      <Head back={true} url="/" title={searchCondition.cityName ? `"${searchCondition.cityName}"的酒店优惠` : '搜索'}/>
        <div className="search">
          <AutoComplete
            onSelect={this.handleSearchHotel}
            onSearch={this.handleSearch}
            allowClear={true}
            placeholder="输入关键字"
          >{option}
          
          </AutoComplete>
          <Icon type="search" className="searchIcon"/>
        </div>
        <Spin spinning={loading}>
          <div className="hotel-list">
            {hotelList.map(item => {
              return (
                <div
                onClick={this.handleNavigator.bind(this, item.HotelId)}
                  key={item.HotelId}
                  className="hotel-item"
                  style={{
                    backgroundImage: `url(${item.ImageUrl ||
                      DefaultImage.DEFAULT_HOTEL_320_160})`
                  }}
                >
                  <div className="hotel-star">
                    <div className="unstar" style={{width: '80px', height: '16px', backgroundPosition: '0px -16px'}}>
                      <i
                        className="star"
                        style={{ width: item.Star * 16 + 'px', height: '16px'}}
                      />
                    </div>
                  </div>
                  <div className="hotel-name">{item.HotelName}</div>

                  {item.PromotionInfoList && item.PromotionInfoList[0] && (
                    <div className="hotel-promotion ellips">
                      {util.removeHtmlTag(
                        item.PromotionInfoList[0].RecommedShortText
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {hotelList.length === 0 ? <div className="no-result">没有找到结果</div> : ''}
          </div>
        </Spin>
      </div>
    )
  }
}

export default HotelList
