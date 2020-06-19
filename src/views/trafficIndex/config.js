/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  //获取西安市交通拥堵排名
  // GET_Xian_TAFFIC_ORDER:data => {
  //   return http.service({
  //     url:`TrafficJam/getCityJamRanking`,
  //     method:'get',
  //     params:data
  //   })
  // },
  //获取左侧交通拥堵排名数据
  GET_CITY_TAFFIC_ORDER_API:data => {
    return http.service({
      url:`TrafficJam/getCityJamRanking`,
      method:'get',
      params:data
    })
  },
  //获取境内高速路及主干道路况
  GET_ROAD_TAFFIC_ORDER_API:data => {
    return http.service({
      url:`TrafficJam/getRoadRanking`,
      method:'get',
      params:data
    })
  },
  //某城市30天拥堵指数分析
  GET_ROAD_TAFFIC_ANALYSIS_API:data => {
    return http.service({
      url:`TrafficJam/getCityThirtyJamRankingByXzqh`,
      method:'get',
      params:data
    })
  },
  //某城市今日、昨日、上周同期拥堵指数分析
  GET_ROAD_TAFFIC_RANGE_ANALYSIS_API:data => {
    return http.service({
      url:`TrafficJam/getCityJamRankingByXzqh`,
      method:'get',
      params:data
    })
  },
  
}
export const IMG={
  /*路况巡航*/
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg
}
