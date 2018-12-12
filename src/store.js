import {action, observable} from 'mobx'
class RootStore{

  @observable loading = false

  @action
  showLoading(){
    this.loading = true
  }

  @action
  hideLoading(){
    this.loading = false
  }
}

export default new RootStore()