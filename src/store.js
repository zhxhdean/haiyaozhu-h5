import {action, observable} from 'mobx'
import {WX_CONFIG,USERINFO} from './service/urls'
import {post} from './service/request'
class RootStore{

  //微信配置
  @observable wxconfig = {}

  @observable userInfo = {}

  @action 
  async getWXConfig (params){
    const rsp = await post({url: WX_CONFIG, data: params})
    if(rsp.code === 0){
      this.wxconfig = rsp.data
    }
    return rsp
  }

  @action 
  async getUserInfo(){
    const rsp = await post({url: USERINFO})
    if(rsp.code === 0){
      this.userInfo = rsp.data
    }
    return rsp
  }

  @observable loading = false
  @observable loading2 = false
  @action
  showLoading(v){
    if(v === 2){
      this.loading2 = true
    }else{
      this.loading = true
    }
    
  }

  @action
  hideLoading(v){
    if(v === 2){
      this.loading2 = false
    }else{
      this.loading = false
    }
    
  }
}

export default new RootStore()