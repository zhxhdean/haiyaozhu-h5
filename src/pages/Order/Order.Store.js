import { post } from '_src/service/request'
import { observable, action } from 'mobx'
import { ORDER_LIST, ORDER_DETAIL } from '_src/service/urls'
class OrderStore {
  @observable orderList = []

  // 当前页码
  @observable pageIndex = 1
  // 当前tab的key
  @observable tabKey = '1'

  @observable orderInfo = {
    HotelTrafficInfo: {},
    AllTripDate: {},
    HotelOrders: [{RoomInfo: ''}],
    OrderContactPerson: {},
    Price: {}
  }

  @action
  setPageIndex(pageIndex) {
    this.pageIndex = pageIndex
  }

  @action
  setTabKey(key) {
    this.tabKey = key
  }

  @action
  async getOrderList() {
    if (this.pageIndex === 1) {
      // 如果是当前是第一页，清空数据
      this.orderList = []
    }
    const rsp = await post({
      url: ORDER_LIST,
      data: { pageindex: this.pageIndex, pagesize: 10 }
    })
    if (rsp.code === 0) {
      this.orderList = this.orderList.concat(rsp.data || [])
    }
    return rsp
  }

  @action
  async getOrderDetail(orderid) {
    const rsp = await post({ url: ORDER_DETAIL, data: { orderid: orderid } })
    if (rsp.code === 0) {
      this.orderInfo = rsp.data[0]
    }
    return rsp
  }
}
export default new OrderStore()
