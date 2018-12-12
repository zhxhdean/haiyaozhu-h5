import { observable, action } from 'mobx'
import { post } from '../../service/request'
import { CITY_LIST } from '../../service/urls'
class CityStore {
  @observable domestic = []
  @observable overseas = []

  @action
  async getList() {
    const rsp = await post({ url: CITY_LIST })
    if (rsp.code === 0) {
      this.domestic = rsp.data.filter(item => item.IsIntl === 0)
      this.overseas = rsp.data.filter(item => item.IsIntl === 1)
    }
    return rsp
  }
}
export default new CityStore()
