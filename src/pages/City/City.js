import React, { Component } from 'react'
import './City.less'
import { observer, inject } from 'mobx-react'

@inject('homePageStore', 'cityStore')
@observer
class City extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0
    }
  }
  componentWillMount() {
    this.props.cityStore.getList()
  }

  handleChangeTab = val => {
    this.setState({ active: val })
  }

  handleChoiceCity = e => {
    const target = e.target
    if (
      target.className === 'city-item' ||
      target.className === 'hot-city-item'
    ) {
      this.props.homePageStore.setDestination(
        target.dataset.id,
        target.innerText
      )
      this.props.history.replace('/')
    }
  }
  render() {
    const { active } = this.state
    const { domestic, overseas } = this.props.cityStore
    return (
      <div className="city-page">
        <ul className="tab">
          <li
            className={active === 0 ? 'active' : ''}
            onClick={this.handleChangeTab.bind(this, 0)}
          >
            国内城市
          </li>
          <li
            className={active === 1 ? 'active' : ''}
            onClick={this.handleChangeTab.bind(this, 1)}
          >
            海外城市
          </li>
        </ul>

        <div
          className={'city ' + (active === 0 ? '_show' : '_hide') }
          onClick={this.handleChoiceCity.bind(this)}
        >
          <h3 className="hot-city-title">国内热门</h3>
          <div className="hot-city">
          {domestic.filter(item => item.IsHot === true).map(item => {
            return( <div className="hot-city-item" data-id={item.Id}>
              {item.CityName}
          </div>)
          })}
           
   
          </div>
          {domestic.map(item => {
            return (
              <div className="city-item" key={item.Id} data-id={item.Id}>
                {item.CityName}
              </div>
            )
          })}
        </div>

        <div
          className={(active === 1 ? '_show' : '_hide') + ' city'}
          onClick={this.handleChoiceCity.bind(this)}
        >
          <h3 className="hot-city-title">国际热门</h3>
          <div className="hot-city">
          {overseas.filter(item => item.IsHot === true).map(item => {
            return( <div className="hot-city-item" data-id={item.Id}>
              {item.CityName}
          </div>)
          })}
          </div>
          {overseas.map(item => {
            return (
              <div className="city-item" key={item.Id} data-id={item.Id}>
                {item.CityName}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default City
