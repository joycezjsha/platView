/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import warningInstance from './image/warningInstance.png'
import accident from './image/accident.png'
import jqImg from './image/jq.png'
import sgImg from './image/sg.png'
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
  // 省内超速情况   获取省内车辆运行态势数据
  GET_PRO_CAR_API:data => {
    return http.service({
      url:`Overview/getVehicleOperation`,
      method:'get',
      params:data
    })
  },
  // 省内超速情况   获取省内车辆运行态势数据总数
  GET_PRO_COUNT_API:data => {
    return http.service({
      url:`Overview/getVehicleOperationNum`,
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
    return http.service({
      url:`Overview/getMapVehicleIn`,
      method:'get',
      params:data
    })
  },
  //获取车辆流动地图热点卡口
  GET_MAP_CAR_FLOW_API:data => { 
    return http.service({
      url:`Vehicle/getHotspotBayonetRanking`, //接口可能不对
      method:'get',
      params:data
    })
  },
  //获取车辆保有量数据
  GET_CAR_FLOW_API:data => {
    return http.service({
      url:`Overview/getVehiclePopulation`,
      method:'get',
      params:data
    })
  },
  //获取活跃电警统计数据
  GET_DEV_STATICS_API:data => {
    return http.service({
      url:`Overview/getDevStatistics`,
      method:'get',
      params:data
    })
  },
  //获取本月事故统计数据
  GET_SG_STATICS_API:data => {
    return http.service({
      url:`Overview/getSameMonthAccident`,
      method:'get',
      params:data
    })
  },
  //获取今日警情统计数据
  GET_ACCI_STATICS_API:data => {
    return http.service({
      url:`Overview/getTodayPoliceSituation`,
      method:'get',
      params:data
    })
  },
  //获取境内路况监测数据
  GET_TAFFIC_ORDER_API:data => {
    return http.service({
      url:`TrafficJam/getRoadRanking`,
      method:'get',
      params:data
    })
  },
  //获取境内路况监测数据
  GET_DEVICE_MAP_API:data => {
    return http.service({
      url:`Overview/getMapActiveBayone`,
      method:'get',
      params:data
    })
  },
  //获取大、小车流量数据
  GET_BIG_CAR_API:data => {
    return http.service({
      url:`Overview/getBigCarOrSmallCarFlow`,
      method:'get',
      params:data
    })
  },
  //获取今日预警
  
  GET_TODAY_ALARM_API:data => {
    return http.service({
      url:`Overview/getTodayAlarm`,
      method:'get',
      params:data
    })
  },
  //获取今日执法
  
  GET_TODAY_ENFORCEMENT_API:data => {
    return http.service({
      url:`Overview/getTodayIntercept`,
      method:'get',
      params:data
    })
  }
}
export const IMG={
  /*总览*/
  warningInstanceIMG:warningInstance,
  accidentIMG:accident,
  jqImg:jqImg,
  sgImg:sgImg
}
