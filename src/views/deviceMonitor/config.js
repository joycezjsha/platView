/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  // 设备查询 设备类型分析
  GET_QUERY_API:data=> {
    return http.service({
      url:`Device/getDevStatistics`,
      method:'get',
      params:data
    })
  },
  // 	设备总览-设备总数 Device/getDevCount
  GET_TOTAL_NUM_API:data=> {
    return http.service({
      url:`Device/getDevCount`,
      method:'get',
      params:data
    })
  },
  // 设备总览-城市统计 Device/getCityStatistics
  GET_CITY_STA_API:data=> {
    return http.service({
      url:`Device/getCityStatistics`,
      method:'get',
      params:data
    })
  },
  /*获取设备总览-电警,卡口,联通视频,龙门架,区间测速统计*/
  GET_DEVICE_STATICS_API:data=> {
    return http.service({
      url:`Device/getPkklqCount`,
      method:'get',
      params:data
    })
  },
  /*获取重点设备检测数据*/
  GET_MAIN_DEVICE_API:data=> {
    return http.service({
      url:`Device/getKeyDev`,
      method:'get',
      params:data
    })
  }
  
}
export const IMG={
  /*路况巡航*/
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg
}
