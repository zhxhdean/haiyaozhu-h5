import React, { Component } from 'react'
import { Icon } from 'antd'
import './DatePicker.less'
import util from '../../common/util'
const Week = ['日', '一', '二', '三', '四', '五', '六']

// 可配置显示几个月， 默认3个月， 传入month
export default class DatePicker extends Component {
  handleChoiceDate = (val, e) => {
   if(e.target.className.includes('unable')){
     //unable的日期不可以选
     return
   }
    e.target.className = 'date selected'
    this.props.onSelect(val)
    setTimeout(() => {
      this.props.onClose()
    }, 100)
  }

  

  // 当前月有多少天(month 从 0 开始的)
  getDaysOfMonth(year, month) {
    const rst = []
    const count = new Date(year, month, 0).getDate()

    for (let i = 1; i <= count; i++) {
      rst.push(i)
    }
    return rst
  }

  //当前月份第一天是周几
  getWeekDay(year, month) {
    const rst = []
    const count = new Date(year, month, 1).getDay()
    const lastMonth = new Date(year, month, 0).getDate()
    // 如果从周一开始，需要count-1,week 调整为 一，二，。。。。日
    for (let i = 0; i < count; i++) {
      rst.push(lastMonth - i)
    }
    return rst.reverse()
  }

  isWeekend(year, month, date) {
    const day = new Date(year, month - 1, date).getDay()
    if (day === 6 || day === 0) {
      return true
    }
    return false
  }

  render() {

    //传入选中的日期
    const selected = this.props.date
    // 起始时间
    const _minDate = this.props.minDate || new Date()
    const minDate = new Date(_minDate)
    const month = this.props.month || 3
    const months = []
    for (let i = 1; i <= month; i++) {
      months.push(i)
    }
    return (
      <div
        className={
          this.props.show
            ? util.isIphoneX()
              ? 'page show-iphonex'
              : 'page show'
            : 'page'
        }
      >
        <div className="fixed">
          <div className="month bold">
            {this.props.title || '选择日期'}
            <Icon
              style={{ fontSize: '16px' }}
              type="close-circle"
              onClick={this.props.onClose}
            />
          </div>
        </div>

        <div className="data-page">
          {months.map(i => {
            const today = new Date()
            let year = today.getFullYear()
            let month = today.getMonth() + i
            if (month > 12) {
              year = year + 1
              month = month - 12
            }
            // 当天
            const date = today.getDate()
            const daysOfMonth = this.getDaysOfMonth(year, month)
            const weekDayofFirstDay = this.getWeekDay(year, month - 1)

            return (
              <div key={i}>
                <div className="month">
                  {year}年{month}月
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: '0 10px'
                  }}
                >
                  {Week.map((item, index) => (
                    <div className="date" key={index}>
                      {item}
                    </div>
                  ))}
                </div>

                <div
                  style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}
                >
                  {weekDayofFirstDay.map((item, index) => {
                    return (
                      <div className="date unable" key={index}>
                        {item}
                      </div>
                    )
                  })}

                  {daysOfMonth.map((item, index) => {
                    let isSelected =
                      `${year}-${(month + '').padStart(2, '0')}-${(
                        item + ''
                      ).padStart(2, '0')}` === selected

                    let weekend = this.isWeekend(year, month, item)
                    if (index + 1 === date && i === 1) {
                      return (
                        <div
                          onClick={this.handleChoiceDate.bind(
                            this,
                            `${year}-${(month + '').padStart(2, '0')}-${(
                              item + ''
                            ).padStart(2, '0')}`
                          )}
                          className={
                            (weekend ? 'weekend' : '') +
                            ' date' +
                            (selected ? ' ' : ' today')
                          }
                          key={index}
                        >
                          今天
                        </div>
                      )
                    } else if (i === 1 && index + 1 < date) {
                      return (
                        <div key={index} className="date unable">
                          {item}
                        </div>
                      )
                    } else {
                      const unable = new Date(`${year}-${(month + '').padStart(2, '0')}-${(
                        item + ''
                      ).padStart(2, '0')}`) - minDate <= 0 ? true : false
                      return (
                        <div
                          onClick={this.handleChoiceDate.bind(
                            this,
                            `${year}-${(month + '').padStart(2, '0')}-${(
                              item + ''
                            ).padStart(2, '0')}`
                          )}
                          key={index}
                          className={
                            (weekend ? 'weekend' : '') +
                            ' date' +
                            (isSelected ? ' selected' : '') +
                            (unable ? ' unable': '')
                          }
                        >
                          {item}
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
