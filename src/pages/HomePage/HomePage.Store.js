
import {observable, action} from 'mobx'

class HomePageStore {

  @observable showCheckInModal = false
  @observable showCheckOutModal = false

  @observable checkIn = ''
  @observable checkOut = ''
  @observable hotelList = [{id:1, hotelName: '酒店名称'},{id:2, hotelName: '酒店名称2'}]

  @observable cityInfo = {cityId: 0, cityName: ''}
  @action
  getList(){
  }

  @action
  add (){
    const index = this.hotelList.length + 1
    this.hotelList.push({id:index, hotelName: `酒店名称${index}`})
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