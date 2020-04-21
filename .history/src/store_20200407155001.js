/**
 * Created by yqr on 2018/3/26.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

/*测试数据*/
const date = 'Mon Mar 24 2018 00:00:00 GMT+0800 (中国标准时间)'

const state = {
  map:'',
  right:'1vw'
}
const getters = {

  getRight(state) {
    return state.right
  },
  getLayerId(state) {
    return state.layerId
  },
  getDeptId(state) {
    return state.deptId
  },
  getUserId(state) {
    return state.userId
  }
}
const mutations = {
  setRight(state,right){
    state.right = right
  },
  setDataInfo(state,dataInfo){
    state.dataInfo = dataInfo
  },
  setDataId(state, dataId) {
    state.dataId = dataId
  },
  setLayerId(state, layerId) {
    state.layerId = layerId
  }
}
/*从本地存储读取数据*/
for(var item in state) {
  localStorage.getItem(item)? state[item] = JSON.parse(localStorage.getItem(item)): false;
}
export default new Vuex.Store({
  state,
  getters,
  mutations
})
