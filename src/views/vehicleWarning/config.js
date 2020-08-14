
import http from '../../common/httpUtil'
import overSpeedImg from './image/over_speed.png'
import close_img from './image/close.png'
import close_hover_img from './image/close_hover.png'
export const interf={ 
  // 获取今日预警数据
  GET_TODAY_ALARM:data=> {
    return http.service({
      url:`VehicleWarning/getTodayAlarm`,
      method:'get',
      params:data
    })
  },
  // 获取今日预警数据
  GET_YESTODAY_ALARM:data=> {
    return http.service({
      url:`VehicleWarning/getYesterDayAlarm`,
      method:'get',
      params:data
    })
  },
   // 获取本周预警数据
   GET_WEEK_ALARM:data=> {
    return http.service({
      url:`VehicleWarning/getWeekDayAlarm`,
      method:'get',
      params:data
    })
  },
  // 获取自定义预警数据
  GET_CUSTOM_ALARM:data=> {
    return http.service({
      url:`VehicleWarning/getCustomDayAlarm`,
      method:'get',
      params:data
    })
  },
  
   //	预警量趋势接口
   GET_MONT_INOUT_API:data=> {
    return http.service({
      url:`VehicleWarning/getAlarmtrend`,
      method:'get',
      params:data
    })
  },
  // 预警车辆类型
  GET_CAR_TYPE_API:data=> {
    return http.service({
      url:`VehicleWarning/getAlarmType`,
      method:'get',
      params:data
    })
  },
  // 归属地分析 --车辆归属地OD地图也是用的这个接口 KeyVehicle/getVehicleOwnership
  GET_OWN_SHIP_API:data=> {
    return http.service({
      url:`VehicleWarning/getAlarmVehicleQCellCore`,
      method:'get',
      params:data
    })
  },
  // 地图卡口预警量
  GET_MAP_BAY_RANK_API:data=> {
    return http.service({
      url:`VehicleWarning/getDevAlarm`,
      method:'get',
      params:data
    })
  },
 
  // 	车辆实时预警接口
  GET_OVER_WARN:data=> {
    return http.service({
      url:`VehicleWarning/getRealTimeAlarm`,
      method:'get',
      params:data
    })
  },
   //	预警量趋势
   GET_WARINING_TREND:data=> {
    return http.service({
      url:`VehicleWarning/getAlarmtrend`,
      method:'get',
      params:data
    })
  }
}
export const IMG={
  /*路况巡航*/
  OVER_SPEED_IMG: overSpeedImg,
  CLOSE_IMG:close_img,
  CLOSE_HOVER_IMG:close_hover_img
}
