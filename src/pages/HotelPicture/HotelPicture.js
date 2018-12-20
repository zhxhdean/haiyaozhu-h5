import React, { Component } from 'react'
import '../HotelDetail/HotelDetail.less'
import Head from  '../../components/Head/Head'
import { inject, observer } from 'mobx-react';
import {Spin} from 'antd'
import util from '../../common/util'
@inject('hotelDetailStore', 'rootStore')
@observer
class HotelPicture extends Component {
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
        }})
      .catch(err => {
        this.props.rootStore.hideLoading()
        util.showToast('数据加载失败')
      })

  }

  handleNavigator = index => {
    this.props.history.push({pathname: `/picture/brower/${index}`})
  }

  render() {
    const { loading } = this.props.rootStore
    const {
      hotelDetail
    } = this.props.hotelDetailStore
    return (
      <div className="hotel-picture-page">
        <Head back={true} title="酒店图片"/>
        <Spin spinning={loading}>
        <div className="hotel-picture">
        
            {hotelDetail.hotelImageList.map((item, index) => {
              return(<div onClick={this.handleNavigator.bind(this, index)} className="pic-item" key={index}><img alt={hotelDetail.HotelName} src={item.ImageUrl}/></div>)
            })}
        
        </div>
        </Spin>
      </div>
    )
  }
}

export default HotelPicture
