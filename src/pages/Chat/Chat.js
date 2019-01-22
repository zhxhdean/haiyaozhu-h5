import React, { Component } from 'react'
import Head from '_src/components/Head/Head'
import './Chat.less'
import { Input, Button, Spin } from 'antd'
import util from '_src/common/util'
import defaultIcon from '_src/assets/images/chat_hotel.png'
import defaultUserIcon from '_src/assets/images/chat_me.png'
import { inject, observer } from 'mobx-react'

const io = window.io
const client = io.connect('http://c.haiyaozhu.com')
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
      chatType: +util.getQuery('chattype'),
      online: false
    }
  }

  chatSystem() {
    const { chatType, toUid, fromUid, fromName, toName } = this.state
    if(fromUid === 'undefined'){
      util.showToast('未登录，不能使用在线聊天')
      return
    }
    // 登录系统
    client.emit('login', {
      from: fromUid,
      to: toUid,
      fromName: fromName,
      toName: toName,
      token: util.getStorage('_t'),
      openId: util.getStorage('_o'),
      chatType: chatType
    })

    client.on('message', message => {
      // 监听收到的数据
      if (message.from === toUid) {
        const { messageList } = this.props.messageStore
        messageList.push({
          from: fromUid,
          direction: 1,
          chatType: chatType,
          message: message.content,
          to: toUid
        })
        this.setState({online: true})
      }
    })
    client.on('connect_error', obj => {
      client.disconnect()
      util.showToast('连接服务器失败', 3000)
    });
    client.on('connect_timeout', obj => {
      client.disconnect()
      util.showToast('连接服务器超时', 3000)
    });
    client.on('targetoffline', obj => {
      util.showToast('对方已下线,可在线留言', 3000)
      this.setState({online: false})
    });
    client.on('targetonline', obj => {
      this.setState({online: true})
    });
  }

  componentDidMount() {
    const { chatType, toUid, fromUid } = this.state
    this.props.rootStore.showLoading()
    this.chatSystem()
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
    if(fromUid === 'undefined'){
      util.showToast('未登录，不能使用在线聊天')
      return
    }
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
    client.emit('message', { content: msg, from: fromUid, to: toUid })
    this.setState({ msg: '' })
  }
  handleInputChange = e => {
    this.setState({ msg: e.target.value })
  }
  render() {
    const { userInfo, loading } = this.props.rootStore || {}
    const { toName, chatType, msg, online } = this.state
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
        <Head back={true} title={`与酒店在线聊天`} />
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
                    {item.direction === chatType ? '' : (toName + (online ? ' 在线': ' 离线'))}
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
              value={msg}
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
