import React, { Component } from 'react'
import { Picker, List, Icon, DatePicker, Flex } from 'antd-mobile'
import './HomePage.less'
import { inject, observer } from 'mobx-react'

const seasons = [
  [
    {
      label: '2013',
      value: '2013'
    },
    {
      label: '2014',
      value: '2014'
    }
  ],
  [
    {
      label: '春',
      value: '春'
    },
    {
      label: '夏',
      value: '夏'
    }
  ]
]

@inject('homePageStore')
@observer
class HomePage extends Component {
  componentDidMount() {
    this.props.homePageStore.getList()
  }

  handleAdd = () => {
    this.props.homePageStore.add()
  }
  render() {
    const minDate = new Date()
    const { hotelList } = this.props.homePageStore || []
    return (
      <div>
        <div className="search-container">
          <h1>全球酒店官网优惠任您淘</h1>
          <h4>官网预定更靠谱，更优惠......</h4>
          <Picker
            title="选择城市"
            data={seasons}
            cascade={false}
            extra="请选择"
          >
            <List.Item arrow="horizontal">
              <Icon type="search" />
              目的地
            </List.Item>
          </Picker>

          <Flex>
            <Flex.Item>
              <DatePicker mode="date" title="选择入住时间" extra="不限" minDate={minDate}>
                <List.Item arrow="horizontal">入住时间</List.Item>
              </DatePicker>
            </Flex.Item>
            <Flex.Item>
              <DatePicker mode="date" title="选择退房时间" extra="不限" minDate={minDate}>
                <List.Item arrow="horizontal">退房时间</List.Item>
              </DatePicker>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}

export default HomePage
