import {action, observable} from 'mobx'
import {post} from '_src/service/request'
import {MEMBER_SHIP_CARD,CHECK_BOOKINGABLE,CREATE_ORDER} from '_src/service/urls'
class BookingStore {
  // 会员卡信息
  @observable memberShipCards = []

  @action
  async getMemberShipCard (hotelId) {
    const rsp = await post({url: MEMBER_SHIP_CARD, data: {hotelid: hotelId}})
    if(rsp.code === 0){
      this.memberShipCards = rsp.data
    }
    return rsp
  }

  @action
  async checkBookingable(params){
    return await post({url: CHECK_BOOKINGABLE, data: params})
  }

  @action
  async createOrder(params){
    return await post({url: CREATE_ORDER, data: params})
  }
}

export default new BookingStore()