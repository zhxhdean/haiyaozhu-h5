import {COUPON_LIST, COUPON_DETAIL} from '_src/service/urls'
import {post} from '_src/service/request'
import {action, observable} from 'mobx'
class CouponStore{
  @observable couponList = []
  @observable couponDetail = {}

  @action
  async getCouponList(){
    const rsp = await post({url: COUPON_LIST})
    if(rsp.code === 0){
      this.couponList = rsp.data
    }
    return rsp
  }

  @action
  async getCouponDetail(id){
    const rsp = await post({url: COUPON_DETAIL, data: { couponid: id}})
    if(rsp.code === 0){
      this.couponDetail = rsp.data
    }
    return rsp
  }



}
export default new CouponStore()