
import http from '../../common/httpUtil'
import overSpeedImg from './image/over_speed.png'
export const interf={ 
  // 车辆实时监测地图数据  KeyVehicle/getMapBayonetRanking
  GET_MAP_BAY_RANK_API:data=> {
    return http.service({
      url:`KeyVehicle/getMapBayonetRanking`,
      method:'get',
      params:data
    })
  },
  // 热点卡口 --和地图使用一个接口 KeyVehicle/getHotspotBayonetRanking
  GET_HOT_BAY_RANK_API:data=> {
    return http.service({
      url:`KeyVehicle/getHotspotBayonetRanking`,
      method:'get',
      params:data
    })
  },
  //	热点道路  KeyVehicle/getHotspotRoadRanking
  GET_HOT_ROAD_RANK_API:data=> {
    return http.service({
      url:`KeyVehicle/getHotspotRoadRanking`,
      method:'get',
      params:data
    })
  },
  // 归属地分析 --车辆归属地OD地图也是用的这个接口 KeyVehicle/getVehicleOwnership
  GET_OWN_SHIP_API:data=> {
    return http.service({
      url:`KeyVehicle/getVehicleOwnership`,
      method:'get',
      params:data
    })
  },
  // 今日重点监测车辆运行态势 Overview/getVehicleOperation
  GET_OPERA_API:data=> {
    return http.service({
      url:`Overview/getVehicleOperation`,
      method:'get',
      params:data
    })
  },
  //	近30日重点车辆出入陕趋势  KeyVehicle/getMonthKeyVehicleInAndOut
  GET_MONT_INOUT_API:data=> {
    return http.service({
      url:`KeyVehicle/getMonthKeyVehicleInAndOut`,
      method:'get',
      params:data
    })
  },
  //	境内城市监测车辆实时排名 KeyVehicle/getDomesticVehicleRanking
  GET_DOM_VEH_RANKING_API:data=> {
    return http.service({
      url:`KeyVehicle/getDomesticVehicleRanking`,
      method:'get',
      params:data
    })
  },
  //  今日入陕 出陕 KeyVehicle/getToadyKeyVehicleInAndOut
  GET_TOADY_VEHICLE_API:data=> {
    return http.service({
      url:`KeyVehicle/getToadyKeyVehicleInAndOut`,
      method:'get',
      params:data
    })
  },
  // 	重点车辆监测  KeyVehicle/getKeyVehicle
  GET_KEY_VEHICLE_API:data=> {
    return http.service({
      url:`KeyVehicle/getKeyVehicle`,
      method:'get',
      params:data
    })
  },
  // 	重点车辆监测超速预警 KeyVehicle/getSpeeding
  GET_OVER_WARN_FLOW_API:data=> {
    return http.service({
      url:`KeyVehicle/getSpeeding`,
      method:'get',
      params:data
    })
  },
  /*获取巡航数据*/
  getCityIndexData:(data,callback,err)=>{
    return http._httpConnect("get", "AreaList/list",data,
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
  OVER_SPEED_IMG: overSpeedImg
}
