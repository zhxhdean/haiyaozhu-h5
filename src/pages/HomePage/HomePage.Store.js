
import {observable, action} from 'mobx'

class HomePageStore {

  @observable hotelList = [{id:1, hotelName: '酒店名称'},{id:2, hotelName: '酒店名称2'}]

  @action
  getList(){
  }

  @action
  add (){
    const index = this.hotelList.length + 1
    this.hotelList.push({id:index, hotelName: `酒店名称${index}`})
  }
}

export default new HomePageStore()