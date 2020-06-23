
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  // 道路统计 Bayonet/getRoadStatistics
  GET_ROAD_STATIS_API:data=> {
    return http.service({
      url:`Bayonet/getRoadStatistics`,
      method:'get',
      params:data
    })
  },
  // 卡口热力分布  Bayonet/getBayonetHeat
  GET_BAY_HEAT_API:data=> {
    return http.service({
      url:`Bayonet/getBayonetHeat`,
      method:'get',
      params:data
    })
  },
  // 活跃卡口点位  Bayonet/getBayonetActive
  GET_BAY_ACTIVE_API:data=> {
    return http.service({
      url:`Bayonet/getBayonetActive`,
      method:'get',
      params:data
    })
  },
  // 道路上的设备 Bayonet/getRoadMapDev
  GET_BAY_ROAD_MAP_DEV_API:data=> {
    return http.service({
      url:`Bayonet/getRoadMapDev`,
      method:'get',
      params:data
    })
  },
  // 卡口监测-今日卡口数据回传排名 Bayonet/getBayonetEchoRanking
  GET_BAY_RANK_API:data=> {
    return http.service({
      url:`Bayonet/getBayonetEchoRanking`,
      method:'get',
      params:data
    })
  },
  // 卡口监测-全省统计  Bayonet/getDevCount
  GET_DEV_COUNT_API:data=> {
    return http.service({
      url:`Bayonet/getDevCount`,
      method:'get',
      params:data
    })
  },
  //卡口监测-城市统计   Bayonet/getCityStatistics
  GET_CITY_STA_API:data=> {
    return http.service({
      url:`Bayonet/getCityStatistics`,
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
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg
}
