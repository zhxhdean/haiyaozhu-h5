
import {observable, action} from 'mobx'

class HomePageStore {

  @observable showCheckInModal = false
  @observable showCheckOutModal = false
  
  @observable checkIn = ''
  @observable checkOut = ''
  @observable hotelList = [{id:1, hotelName: '酒店名称'},{id:2, hotelName: '酒店名称2'}]

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
}

export default new HomePageStore()