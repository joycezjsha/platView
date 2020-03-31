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
  status: false,
  version:'2019/09/09',
  collapsed: false, //默认菜单是否折叠
  page:1,//默认页码，跳转时时记录
  topNavState: 'home',
  leftNavState: 'home',
  dataType: [{value:1,label:"标记"},{value:2,label:"线"},{value:3,label:"面"}],
  dataStatus: [{value:0,label:"隐藏"},{value:1,label:"显示"}],
  layerId: "",
  dataId: "",
  deptId: "",
  userId: "",
  loading:'',
  layer:{status:'新增',data:null},
  service:[], //服务权限
  menuList:[],//菜单权限
  layerPermission:[],//图层权限
  user:{id:''},
  dept:{id:''},
  cursor:'pointer'
}
const getters = {

  getDataId(state) {
    return state.dataId
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
  setLayerInfo(state,layerInfo){
    state.layerInfo = layerInfo
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
