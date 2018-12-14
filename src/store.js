import {action, observable} from 'mobx'
class RootStore{

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