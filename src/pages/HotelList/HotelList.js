import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Spin, AutoComplete ,Icon } from 'antd'
import DefaultImage from '../../common/img'
import './HotelList.less'
import util from '../../common/util'
const Option = AutoComplete.Option
let canSearch = true
@inject('hotelListStore', 'rootStore')
@observer
class HotelList extends Component {
  componentDidMount() {
    console.log(this.props.hotelListStore.searchCondition)
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
  handleSearchHotel = value => {
    // todo 去酒店详情页

  }
  render() {
    const { loading } = this.props.rootStore
    const { hotelList, autocompleteList } = this.props.hotelListStore
    const option = autocompleteList.map(item => <Option key={item.HotelId}>{item.HotelName}</Option>)
    return (
      <div className="hotel-list-page">
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
