import React, { Component } from 'react'
import './City.less'
import { observer,inject } from 'mobx-react';


@inject('homePageStore')
@observer
class City extends Component {
  constructor(props){
    super(props)
    this.state = {
      active: 0
    }
  }
  handleChangeTab = val => {
    this.setState({active: val})
  }

  handleChoiceCity = e => {
    const target = e.target
    if(target.className === 'city-item' || target.className === 'hot-city-item'){
      this.props.homePageStore.setDestination(target.dataset.id, target.innerText)
      this.props.history.replace('/')
    }
  }
  render() {
    const {active} = this.state
    return (
      <div className="city-page">
        <ul className="tab">
          <li className={active === 0 ? 'active' : ''} onClick={this.handleChangeTab.bind(this, 0)}>
            国内城市
          </li>
          <li className={active === 1 ? 'active' : ''} onClick={this.handleChangeTab.bind(this, 1)}>
            海外城市
          </li>
        </ul>

        <div className={(active === 0 ? '_show' : '_hide') + ' city'} onClick={this.handleChoiceCity.bind(this)}>
          <h3 className="hot-city-title">国内热门</h3>
          <div className="hot-city">
            <div className="hot-city-item" data-id="1">北京</div>
            <div className="hot-city-item">上海</div>
            <div className="hot-city-item">深圳</div>
            <div className="hot-city-item">广州</div>
          </div>
          <div className="city-item">
              南京
          </div>
          <div className="city-item">
              西安
          </div>
        </div>

        <div className={(active === 1 ? '_show' : '_hide') + ' city'} onClick={this.handleChoiceCity.bind(this)}>
          <h3 className="hot-city-title">国际热门</h3>
          <div className="hot-city">
            <div className="hot-city-item" data-id="1000">首尔</div>
            <div className="hot-city-item">东京</div>
            <div className="hot-city-item">巴黎</div>
            <div className="hot-city-item">奥兰多</div>
          </div>
          <div className="city-item">
              纽约
          </div>
          <div className="city-item">
              西雅图
          </div>
        </div>

      </div>
    )
  }
}

export default City
