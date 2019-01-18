import { observable, action } from 'mobx'
import { MODIFY_USERINFO } from '_src/service/urls'
import { post } from '_src/service/request'
class MemberStore {

  @observable
  name = ''
  @observable
  mobilePhone = ''
  @observable
  email = ''
  @observable
  address = ''

  @action
  async setUserInfo(data) {
    const rsp = await post({ url: MODIFY_USERINFO, data: data })
    return rsp
  }

  @action
  setValue(name, value){
    this[name] = value
  }
}

export default new MemberStore()
