import {observable,action} from 'mobx'
import {post} from '../../service/request'
import {HOTEL_DETAIL, HOTEL_ROOM_PRICE} from '../../service/urls'
import util from '../../common/util'
class HotelDetailStore{
  @observable showCheckInModal = false
  @observable showCheckOutModal = false

  @observable checkIn = util.getToday()
  @observable checkOut = util.getTomorrow()
  @observable hotelDetail = {
    hotelTrafficInfo: {},
    hotelImageList: [],
    hotelContactInfo: {},
    PromotionInfoList: []
  }

  @observable hotelRoomPriceList = []
  // 搜索房价条件
  @observable searchCondition = {
    hotelid: 0,
    tripdate: {
      checkindate: '',
      checkoutdate: ''
    }
  }

    @action
    async getHotelDetail(hotelId){
      const rsp = await post({url: HOTEL_DETAIL, data: {hotelid: hotelId}})
      if(rsp.code === 0){
        this.hotelDetail = rsp.data
      }
      return rsp
    }

    @action
    setValue(name, value){
      if(name.includes('.')){
        // todo 需要优化
        this[name.split('.')[0]][name.split('.')[1]] = value
      }else{
        this[name] = value
      }
      
    }

    @action
    async getRoomPrice(){
        this.searchCondition.tripdate.checkindate = this.checkIn
        this.searchCondition.tripdate.checkoutdate = this.checkOut
      
      const rsp = await post({url: HOTEL_ROOM_PRICE, data: this.searchCondition})
      if(rsp.code === 0){
        this.hotelRoomPriceList = rsp.data
      }
      return rsp
    }
}

export default new HotelDetailStore()