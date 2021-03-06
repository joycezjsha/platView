/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
import close_img from './image/close.png'
import close_hover_img from './image/close_hover.png'
export const interf={
  /*获取汽车保有量排名数据 VehiclePopulation/getVehiclePopulation*/
  GET_CITY_ORDER_API:data=> {
    return http.service({
      url:`VehiclePopulation/getVehiclePopulation`,
      method:'get',
      params:data
    })
  },
  /*获取汽车保有量排名数据*/
  // GET_CITY_ORDER_API:(data,callback,err)=>{
  //   return http.httpConnect("get", "VehiclePopulation/getVehiclePopulation",data,
  //         function(data){
  //           callback(data);
  //         },function(e){
  //           // _this.$message({type: 'warning', message: '服务异常'});
  //           err(e);
  //         })
  // },
  /*获取汽车保有量统计数据*/
  GET_CITY_STATICS_API:data=> {
    return http.service({
      url:`VehiclePopulation/getProvinceStatistics`,
      method:'get',
      params:data
    })
  },
  /*获取汽车保有量变化趋势数据*/
  GET_CITY_TREND_API:data=> {
    return http.service({
      url:`VehiclePopulation/getVehicleInventoryTrend`,
      method:'get',
      params:data
    })
  },
  /*获取区县数据*/
  GET_CITY_TABLE_API:data=> {
    return http.service({
      url:`VehiclePopulation/getVehicleInventoryTrend`,
      method:'get',
      params:data
    })
  },
  /*获取地图区域数据*/
  GET_MAP_AREA_API:data=> {
    return http.service({
      url:`VehiclePopulation/getVehiclePopulation`,
      method:'get',
      params:data
    })
  }
  
}
export const IMG={
  /*路况巡航*/
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg,
  CLOSE_IMG:close_img,
  CLOSE_HOVER_IMG:close_hover_img
}
