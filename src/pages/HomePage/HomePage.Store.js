
import {observable, action} from 'mobx'
import {TOP_HOTELS} from '../../service/urls'
import {post} from '../../service/request'
class HomePageStore {

  @observable showCheckInModal = false
  @observable showCheckOutModal = false

  @observable checkIn = ''
  @observable checkOut = ''
  @observable hotelList = []

  @observable cityInfo = {cityId: 2, cityName: ''}

  @action
  async getList(){
    const rsp = await post({url: TOP_HOTELS})
    if(rsp.code === 0){
      this.hotelList = rsp.data
    }
    return rsp
  }

  @action
  setValue(name, value){
    this[name] = value
  }

  // 设置目的地
  @action
  setDestination(id, name){
    this.cityInfo = {cityId: id, cityName: name}
  }
}

export default new HomePageStore()