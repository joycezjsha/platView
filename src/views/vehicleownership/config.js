/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  /*获取汽车保有量排名数据*/
  GET_CITY_ORDER_API:data=> {
    return http.service({
      url:`VehiclePopulation/getVehiclePopulation`,
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
