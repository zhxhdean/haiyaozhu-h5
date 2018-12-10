import React, { Component } from 'react'
import DatePicker from '../../components/DatePicker/DatePicker'
export default class ChoiceDate extends Component {
  render() {
    return (
      <div>
        <DatePicker month={6} title="选择入住日期"/>
      </div>
    )
  }
}
