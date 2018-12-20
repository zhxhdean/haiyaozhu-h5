import React, { Component } from 'react'
import Head from '_src/components/Head/Head'
import './Booking.less'
export default class Booking extends Component {
  render() {
    return (
      <div className="booking-page">
        <Head back={true} title="提交订单"/>

      </div>
    )
  }
}
