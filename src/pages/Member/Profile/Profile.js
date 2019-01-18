import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import NumberKeyBoard from '_src/components/NumberKeyBoard/NumberKeyBoard'
import Head from '_src/components/Head/Head'
import { Input, Row, Col, Button } from 'antd'
import '../Member.less'
import util from '../../../common/util';
@inject('rootStore', 'memberStore')
@observer
class Profile extends Component {
  handleInput = (name, e) => {
    this.props.memberStore.setValue(name, e.target.value)
  }

  handleNumberKeyBoard = (name, value) => {
    this.props.memberStore.setValue(name, value)
  }

  handleSubmit = () => {
    const { userInfo } = this.props.rootStore
    const { name, mobilePhone, email, address } = this.props.memberStore
    const data = {
      items: {
        Name: name || userInfo.UserDetail.Name,
        MobilePhone: mobilePhone|| userInfo.UserDetail.MobilePhone,
        Email: email || userInfo.UserDetail.Email,
        Address: address || userInfo.UserDetail.Address
      },
      nickname: userInfo.NickName || '',
      headimgurl: userInfo.HeadImgUrl
    }
    this.props.rootStore.showLoading()
    this.props.memberStore.setUserInfo(data).then(rsp => {
      if(rsp.code === 0){
        util.showToast('保存成功', 3000)
      }
    }).finally(() => this.props.rootStore.hideLoading())
  }

  render() {
    const { userInfo, loading } = this.props.rootStore
    const userDetail = userInfo.UserDetail || {}
    return (
      <div className="profile-page">
        <Head back={true} title="个人资料" />
        <div className="profile-main">
          <Row>
            <Col span={8}>
              <label>姓名：</label>
            </Col>
            <Col span={16}>
              <Input
                defaultValue={userDetail.Name}
                onChange={this.handleInput.bind(this, 'name')}
              />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>联系手机：</label>
            </Col>
            <Col span={16}>
              <NumberKeyBoard
                onChange={this.handleNumberKeyBoard.bind(this, 'mobilePhone')}
                placeholder="请输入手机号"
                value={userDetail.MobilePhone}
              />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>电子邮箱：</label>
            </Col>
            <Col span={16}>
              <Input
                defaultValue={userDetail.Email}
                onChange={this.handleInput.bind(this, 'email')}
              />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <label>联系地址：</label>
            </Col>
            <Col span={16}>
              <Input
                defaultValue={userDetail.Address}
                onChange={this.handleInput.bind(this, 'address')}
              />
            </Col>
          </Row>
          <Row style={{ border: '0', marginTop: '10px' }}>
            <Col span={24}>
              <Button type="primary" onClick={this.handleSubmit} loading={loading}>
                保存
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Profile
