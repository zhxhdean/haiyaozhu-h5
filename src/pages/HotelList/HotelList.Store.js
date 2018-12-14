import { observable, action } from 'mobx'
import { post } from '../../service/request'
import { SEARCH_HOTEL, AUTOCOMPLETE } from '../../service/urls'
class HotelListStore {
  @observable searchCondition = {
    keyword: '',
    city: 0,
    checkin: '',
    checkout: '',
    cityName: ''
  }

  @observable hotelList = []

  @observable autocompleteList = []

  @action
  setValue (name, value){
    this[name] = value
  }
  @action
  setSearchCondition(option) {
    this.searchCondition = {
      keyword: '',
      city: option.city,
      checkin: option.checkin,
      checkout: option.checkout,
      cityName: option.cityName
    }
  }

  @action
  async searchHotelList() {
    const rsp = await post({
      url: SEARCH_HOTEL,
      data: { item: this.searchCondition }
    })
    if (rsp.code === 0) {
      this.hotelList = rsp.data
    }else{
      this.hotelList = []
    }
    return rsp
  }

  @action
  async autocomplete(keyword) {
    const rsp = await post({
      url: AUTOCOMPLETE,
      data: { keyword: keyword, cityid: this.searchCondition.city }
    })
    if (rsp.code === 0) {
      this.autocompleteList = rsp.data
    }
    return rsp
  }
}

export default new HotelListStore()
