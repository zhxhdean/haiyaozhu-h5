import React, { Component } from 'react'
import {Button} from 'antd-mobile'
import './HomePage.css'
import { inject,observer } from 'mobx-react';


@inject('homePageStore') 
@observer 
class HomePage extends Component {
  componentDidMount(){
    this.props.homePageStore.getList()
  }

  handleAdd = () => {
    this.props.homePageStore.add()
  }
  render() {
    const {hotelList} = this.props.homePageStore || []
    return (
      <div>
        <Button className="btn" onClick={this.handleAdd}>新增按钮</Button>
        {
          hotelList.map(item => <span className="hotel" key={item.id}>{item.hotelName}</span>)
        }
      </div>
    )
  }
}

export default HomePage

