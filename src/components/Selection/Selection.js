import React, { Component } from 'react'
import './Selection.less'
import { Icon } from 'antd'

const DEFAULT_LEN = [1, 2, 3, 4, 5]

export default class Selection extends Component {
  handleSelect = e => {
    const target = e.target
    if (target.nodeName === 'LI') {
      this.props.onSelect(target.dataset.v)
      this.props.onClose()
    }
  }

  render() {
    const { title, show, number } = this.props

      return (
        <div className="selection-page">
          <div className={'mask' + (show ? ' fadein' : ' fadeout')}>
            <div className="main">
              <h3>{title}</h3>
              <ul onClick={this.handleSelect}>
                {DEFAULT_LEN.map(item => {
                  return (
                    <li
                      key={item}
                      data-v={item}
                      className={+number === item ? 'selected' : ''}
                    >
                      {item}间 {+number === item ? <Icon type="check" /> : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )
    
  }
}
