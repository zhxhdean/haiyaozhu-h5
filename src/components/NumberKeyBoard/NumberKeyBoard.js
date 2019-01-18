import React from 'react'
import './NumberKeyBoard.less'

const NumberKeyBoard = ({ placeholder, value='', index = 0, style, onChange }) => {
  // 打开键盘
  const handleShowKeyBoard = e => {
    let els = document.getElementsByClassName('number-keyboard')
    // 关闭所有的数字键盘
    for (let i = 0; i < els.length; i++) {
      els[i].className = 'number-keyboard fadeout-fast-kb'
    }
    resetFocus()

    const target = e.target
    let el_input = Array.prototype.slice.call(
      document.getElementsByClassName('number-keyboard-txt'),
      0
    )
    index = el_input.findIndex(item => item === target)
    let el = document.getElementsByClassName('number-keyboard')[index]
    el.className = 'number-keyboard fadein-kb'
    document.getElementsByClassName('number-keyboard-txt')[
      index
    ].children[0].className = 'focus'
  }

  // 隐藏键盘
  const handleHideKeyBoard = (e) => {
    let el = document.getElementsByClassName('number-keyboard')[index]
    el.className = 'number-keyboard fadeout-kb'
    resetFocus()
    onChange(value)
  }

  // 重置所有的光标
  const resetFocus = () => {
    let els_focus = document.getElementsByClassName('focus')
    for (let i = 0; i < els_focus.length; i++) {
      // 重置所有的光标
      els_focus[i].className = ''
    }
  }

  // 选择
  const handleChoiceNumber = e => {
    const target = e.target
    if (target.className === '') {
      value += target.innerText
      document.getElementsByClassName('number-keyboard-txt')[
        index
      ].innerHTML = value + '<div class="focus"></div>'
    }
  }

  // 删除
  const handleDeleteNumber = () => {
    value = value.substr(0, value.length - 1)
    document.getElementsByClassName('number-keyboard-txt')[
      index
    ].innerHTML = value + '<div class="focus"></div>'
    if(value === ''){
      document.getElementsByClassName('number-keyboard-txt')[
        index
      ].innerText = placeholder
    }
  }
  
  // 点击其他区域的时候，需要收起键盘
  document.addEventListener('click', (e) => {
    const className = e.target.parentNode.className
    if(className !== 'number-keyboard-page' && className !== 'number' && className !== 'action'){
      handleHideKeyBoard()
    }
  })

  return (
    <div className="number-keyboard-page">
      <div className="number-keyboard-txt" onClick={handleShowKeyBoard} style={style }>
        {value || placeholder || '请输入'}
        <div />
      </div>
      <div className="number-keyboard">
        <div className="number" onClick={handleChoiceNumber}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
          <div>.</div>
          <div>0</div>
          <div className="close-keyboard" onClick={handleHideKeyBoard} />
        </div>
        <div className="action">
          <div className="delete" onClick={handleDeleteNumber} />
          <div className="confirm" onClick={handleHideKeyBoard}>
            确定
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberKeyBoard
