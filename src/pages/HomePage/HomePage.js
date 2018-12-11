import React, { Component } from 'react'

import './HomePage.less'
import { inject, observer } from 'mobx-react'
import DatePicker from '../../components/DatePicker/DatePicker'

@inject('homePageStore')
@observer
class HomePage extends Component {
  componentDidMount() {
    this.props.homePageStore.getList()
  }

  handleAdd = () => {
    this.props.homePageStore.add()
  }

  handleShowDateModal = (name,date) => {
    // 禁止页面滚动
    document.getElementById('root').style.position = 'fixed';
    document.getElementById('root').style.height='100%';
    if(name === 'showCheckInModal') {
      this.props.homePageStore.setValue('showCheckInModal' , true)
      this.props.homePageStore.setValue('showCheckOutModal' , false)
      this.props.homePageStore.setValue('checkIn' , date)
    }else if(name === 'showCheckOutModal'){
      this.props.homePageStore.setValue('showCheckInModal' , false)
      this.props.homePageStore.setValue('showCheckOutModal' , true)
      this.props.homePageStore.setValue('checkOut' , date)
    }
    
  }

  handleClose = () => {
    // 恢复页面
    document.getElementById('root').style.position = 'initial';
    document.getElementById('root').style.height='auto';
    this.props.homePageStore.setValue('showCheckInModal' , false)
    this.props.homePageStore.setValue('showCheckOutModal' , false)
  }

  handleSelectDate = (name, date) => {
    console.log(name, date)
    this.props.homePageStore.setValue(name, date)
  }

  render() {
    const { checkIn,checkOut,showCheckInModal,showCheckOutModal } = this.props.homePageStore || []
    return (
      <div>
        <div className="search-container">
          <h1>全球酒店官网优惠任您淘</h1>
          <h4>官网预定更靠谱，更优惠......</h4>
          <div className="checkdate">
            <div className="checkdate-item" onClick={this.handleShowDateModal.bind(this, 'showCheckInModal',checkIn)}>
              入住日期
              <span >{checkIn || '不限'}</span>
            </div>
            <div className="checkdate-item" onClick={this.handleShowDateModal.bind(this, 'showCheckOutModal',checkOut)}>
            离店日期
            <span >{checkOut|| '不限'}</span>
            </div>
          </div>

          <div className="search-btn">
          <button >搜 索</button>
          </div>
          
          
          <DatePicker title="请选入住日期" date={checkIn} show={showCheckInModal} onSelect={this.handleSelectDate.bind(this, 'checkIn')} onClose={this.handleClose}/>
        <DatePicker minDate={checkIn} title="请选离店日期" date={checkOut} show={showCheckOutModal} onSelect={this.handleSelectDate.bind(this, 'checkOut')} onClose={this.handleClose}/>
     
         
        </div>

        </div>
    )
  }
}

export default HomePage
