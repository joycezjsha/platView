/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  /*获取城市统计数据*/
  GET_CITY_STA_API:data=> {
    return http.service({
      url:`AccidentAnalysis/getCityAnalysis`,
      method:'get',
      params:data
    })
  },
  /*获取区域统计数据*/
  GET_AREA_STA_API:data=> {
    return http.service({
      url:`AccidentAnalysis/getAreaAnalysis`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-全省/各个市统计数据*/
  GET_ALL_STA_API:data=> {
    return http.service({
      url:`AccidentAnalysis/getAccidentCount`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-事故发生数量变化数据*/
  GET_ACCIDENT_CHANGE_API:data=> {
    return http.service({
      url:`AccidentAnalysis/getAccidentChange`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-重大事故发生趋势数据*/
  GET_ACCIDENT_TREND_API:data=> {
    return http.service({
      url:`AccidentAnalysis/getMajorAccident`,
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
