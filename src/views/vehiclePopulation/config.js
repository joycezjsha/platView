/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={ 
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
  CRUISE_IMG_PLAY: playImg,
  CRUISE_IMG_STOP:stopImg
}
