import { observable, action } from 'mobx'
import { post } from '_src/service/request'
import { MESSAGE_LIST } from '_src/service/urls'
class ChatStore {
  @observable messageList = []
  @action
  async getMessageList(data) {
    const rsp = await post({
      url: MESSAGE_LIST,
      data: data
    })
    if (rsp.code === 0) {
      this.messageList = rsp.data
    }
    return rsp
  }
}
export default new ChatStore()
