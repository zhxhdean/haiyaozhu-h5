import React, { Component } from 'react'
import Head from '_src/components/Head/Head'
import './Chat.less'
import { Input, Button, Spin } from 'antd'
import util from '_src/common/util'
import defaultIcon from '_src/assets/images/chat_hotel.png'
import defaultUserIcon from '_src/assets/images/chat_me.png'
import { inject, observer } from 'mobx-react'
import io from 'socket.io-client'
@inject('rootStore', 'messageStore')
@observer
class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: '',
      toName: util.getQuery('toname'),
      toUid: util.getQuery('to'),
      fromUid: util.getQuery('from'),
      fromName: util.getQuery('fromname'),
      chatType: +util.getQuery('chattype')
    }
    this.socket = io('ws://c.haiyaozhu.com', {
      path: '/',
      transports: ['websocket', 'polling']
    })
  }
  componentDidMount() {
    const { chatType, toUid, fromUid,fromName, toName } = this.state
    this.props.rootStore.showLoading()
    this.socket.emit('login', {
      'from': fromUid,
      'to': toUid,
      'fromName': fromName,
      'toName': toName,
      'token': util.getStorage('_t'),
      'openId': util.getStorage('_o'),
      'chatType': chatType
    });
    
    
    this.props.messageStore
      .getMessageList({
        from: fromUid,
        to: toUid,
        chatType: chatType
      })
      .finally(() => this.props.rootStore.hideLoading())
  }
  handleSend = () => {
    const { chatType, toUid, fromUid, msg } = this.state
    if (!msg) {
      util.showToast('请输入内容')
      return
    }
    const { messageList } = this.props.messageStore
    messageList.push({
      from: fromUid,
      direction: 0,
      chatType: chatType,
      message: msg,
      to: toUid
    })
  }
  handleInputChange = e => {
    if (e.target.value) {
      this.setState({ msg: e.target.value })
    }
  }
  render() {
    const { userInfo, loading } = this.props.rootStore || {}
    const { toName, chatType } = this.state
    const { messageList } = this.props.messageStore
    const el = document.getElementsByClassName('message-list')[0]
    el &&
      setTimeout(() => {
        window.scrollTo(
          0,
          document.body.scrollHeight || document.documentElement.scrollHeight
        )
      }, 100)
    return (
      <div className="chat-page">
        <Head back={true} title={`与${toName}的聊天`} />
        <div className="chat-list">
          <div className="message-list">
            <Spin spinning={loading} />
            {messageList.map((item, index) => {
              return (
                <div
                  className={
                    'message-item ' +
                    (item.direction === chatType ? ' right' : '')
                  }
                  key={index}
                >
                  <div className="avatar">
                    {/* item.direction === chatType, 发送者的信息 */}
                    <img
                      alt="头像"
                      src={
                        item.direction === chatType
                          ? userInfo.HeadImgUrl || defaultUserIcon
                          : defaultIcon
                      }
                    />
                  </div>
                  <div className="content">
                    <p>{item.message}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="send-bar">
            <Input
              onPressEnter={this.handleSend}
              placeholder="在这里输入消息"
              onChange={this.handleInputChange.bind(this)}
            />{' '}
            <Button onClick={this.handleSend}>发送</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat
