
import http from '../../common/httpUtil'
import overSpeedImg from './image/over_speed.png'
import close_img from './image/close.png'
import close_hover_img from './image/close_hover.png'
export const interf={ 
  // 获取今日、昨日、本周、自定义超速统计数据
  GET_OVER_SPEED_BY_TIME:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedNum`,
      method:'get',
      params:data
    })
  },
  //超速分析列表 数据获取
  GET_OVER_TABLE:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedList`,
      method:'get',
      params:data
    })
  },
   //	活跃卡口点位流量
   GET_ACTIVE_BAYONET_API:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedVehicleBayonetMap`,
      method:'get',
      params:data
    })
  },
  //	高发路段
  GET_ACTIVE_ROAD_API:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedRoadRanking`,
      method:'get',
      params:data
    })
  },
  //超速时间趋势
  GET_OVER_SPEED_TIME_TREND:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedTrend`,
      method:'get',
      params:data
    })
  },
  
  // 超速车辆类型分析
  GET_OVER_CAR_TYPE_API:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedVehicleType`,
      method:'get',
      params:data
    })
  },
  // 超速分类统计
  GET_OVER_SPEED_SORT_API:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedVehicleSort`,
      method:'get',
      params:data
    })
  },
  
  // 实时超速列表
  GET_OVER_SPEED_REAL_API:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedVehicleRealTime`,
      method:'get',
      params:data
    })
  },
  // 道路类型列表
  GET_ROAD_CATE_GORY_API:data=> {
    return http.service({
      url:`IllegalAnalysis/getRoadCategory`,
      method:'get',
      params:data
    })
  },
 
  // 	高发道路排名
  GET_ROAD_ORDER:data=> {
    return http.service({
      url:`OverspeedAnalysis/getOverspeedRoadRanking`,
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
