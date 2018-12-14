import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './Head.less'
import util from '../../common/util'
export default withRouter(
  class Head extends Component {
    handleBack = () => {
      const { url } = this.props
      if (url) {
        this.props.history.push({ pathname: url })
      } else {
        this.props.history.goBack()
      }
    }
    render() {
      const { title, back } = this.props
      if (util.isWechat()) {
        return null
      } else {
        return (
          <div className="head">
            <div
              className={'back ' + (back ? 'show' : 'hide')}
              onClick={this.handleBack.bind(this)}
            />
            {title || '还要住酒店优惠平台'}
          </div>
        )
      }
    }
  }
)
