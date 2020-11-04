/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import warningInstance from './image/warningInstance.png'
import accident from './image/accident.png'
export const interf={
  // 	总览页面地图城市流动数据 Overview/getMapVehicleIn
  GET_MAP_CITY_FLOW_API:data => {
    return http.service({
      url:`Overview/getMapVehicleIn`,
      method:'get',
      params:data
    })
  },
  //获取历史过车数据
  GET_HIS_CAR_API:data => {
      return http.service({
        url:`Overview/getPassingData`,
        method:'get',
        params:data
      })
    },
    //获取历史过车数据列表
  GET_HIS_CAR_LIST_API:data => {
    return http.service({
      url:`Overview/getPassingDataDetals`,
      method:'get',
      params:data
    })
  },
  //获取轨迹查询数据
  GET_TRAIL_API:data => {
    return http.service({
      url:`Overview/getTArajectory`,
      method:'get',
      params:data
    })
  },
  //获取轨迹查询列表数据
  GET_TRAIL_LIST_API:data => {
    return http.service({
      url:`Overview/getTArajectoryDetals`,
      method:'get',
      params:data
    })
  },
  // 获取交通动态检测数据
  GET_TRA_API:data => {
    return http.service({
      url:`Overview/getTrafficDynamics`,
      method:'get',
      params:data
    })
  },
  // 获取设备查询数据
  GET_EQU_API:data => {
    return http.service({
      url:`Overview/getDevStatistics`,
      method:'get',
      params:data
    })
  },
  // 获取省内车辆运行态势数据
  GET_PRO_CAR_API:data => {
    return http.service({
      url:`Overview/getVehicleOperation`,
      method:'get',
      params:data
    })
  },
  // 获取进出陕车辆趋势数据
  GET_VEH_CAR_API:data => {
    return http.service({
      url:`Overview/getVehicleTrends`,
      method:'get',
      params:data
    })
  },
   // 获取车辆保有量数据
  //  GET_VEH_CAR_API:data => {
  //   return http.service({
  //     url:`Overview/getVehicleTrends`,
  //     method:'get',
  //     params:data
  //   })
  // },
  //获取地图城市流动数据
  GET_MAP_CITY_FLOW_API:data => {
    return http.httpConnect("get", "Overview/getMapVehicleIn",data,
    function(data){
      callback(data);
    },function(e){
      
    })
  }

}
export const IMG={
  /*总览*/
  warningInstanceIMG:warningInstance,
  accidentIMG:accident
}