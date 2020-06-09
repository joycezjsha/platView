/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import service from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  //车辆流动页面地图城市流动数据 Vehicle/getMapVehicleIn
  GET_MAP_CITY_FLOW_API:data=> {
    return http.service({
      url:`Vehicle/getMapVehicleIn`,
      method:'get',
      params:data
    })
  },
  //车辆流动页面地图热点卡口  Vehicle/getHotspotBayonetRanking
  GET_MAP_HOT_BAY_API:data=> {
    return http.service({
      url:`Vehicle/getHotspotBayonetRanking`,
      method:'get',
      params:data
    })
  },
  // 车辆流动页面热点卡口 Vehicle/getHotspotBayonetRanking
  GET_HOT_RANK_API:data=> {
    return http.service({
      url:`Vehicle/getHotspotBayonetRanking`,
      method:'get',
      params:data
    })
  },
  // 车辆流动页面热点道路 Vehicle/getHotspotRoadRanking
  GET_HOT_ROAD_API:data=> {
    return http.service({
      url:`Vehicle/getHotspotRoadRanking`,
      method:'get',
      params:data
    })
  },
  // 车辆流动页面  归属地分析  Vehicle/getVehicleOwnership
  GET_BELONG_API:data=> {
    return http.service({
      url:`Vehicle/getVehicleOwnership`,
      method:'get',
      params:data
    })
  },
  // 车辆流动页面流动趋势 
  GET_FLOW_TREND_API:data=> {
    return http.service({
      url:`Vehicle/getVehicleCurve`,
      method:'get',
      params:data
    })
  },
  // 车辆流动页面车辆类型分析
  GET_VEH_TYPE_API:data=> {
    return http.service({
      url:`Vehicle/getCarType`,
      method:'get',
      params:data
    })
  },
  // 车辆流动页面全省流动情况
  GET_VEH_FLOW_API:data=> {
    return http.service({
      url:`Vehicle/getVehicle`,
      method:'get',
      params:data
    })
  },
  //车辆流动页面全省车辆统计
  GET_VEH_PRO_API:data=> {
    return http.service({
      url:`Vehicle/getProvincialStatistics`,
      method:'get',
      params:data
    })
  },
  // GET_VEH_PRO_API:(stime,etime) => {
  //   return http.service({
  //     url:`Vehicle/getProvincialStatistics?token=token_for_show`,
  //     method:'get',
  //     params:{stime,etime}
  //   })
  // },

  /*获取巡航数据*/
  getCruiseData:(data,callback,err)=>{
    return httpConnect("get", "cruise/getCruise",data,
          function(data){
            callback(data);
          },function(e){
            // _this.$message({type: 'warning', message: '服务异常'});
            err(e);
          })
  },
  /*修改巡航方案名称*/
  editCruiseName:(data,callback,err)=>{
    return httpConnect("get", "cruise/updatePlanName",data,
          function(data){
            callback(data);
          },function(e){
            // _this.$message({type: 'warning', message: '服务异常'});
            err(e);
          })
  },
  /*删除巡航方案*/
  editCruiseName:(data,callback,err)=>{
    return httpConnect("get", "cruise/deletePlan",data,
          function(data){
            callback(data);
          },function(e){
            // _this.$message({type: 'warning', message: '服务异常'});
            err(e);
          })
  },
  /*判断方案名是否存在*/
  isExistCruiseName:(data,callback,err)=>{
    return httpConnect("get", "cruise/isEexist",data,
          function(data){
            callback(data);
          },function(e){
            // _this.$message({type: 'warning', message: '服务异常'});
            err(e);
          })
  }
}
export const IMG={
  /*路况巡航*/
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg
}
