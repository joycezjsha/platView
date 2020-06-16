/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  //	近30天违法抓拍排名 Electronic/getThirtyAlarm
  GET_THIRTY_ALARM_API:data=> {
    return http.service({
      url:`Electronic/getThirtyAlarm`,
      method:'get',
      params:data
    })
  },
  // 全省统计 Electronic/getDevCount
  GET_PRO_STATIS_API:data=> {
    return http.service({
      url:`Electronic/getDevCount`,
      method:'get',
      params:data
    })
  },
  // 城市统计  Electronic/getCityStatistics
  GET_CITY_STATIS_API:data=> {
    return http.service({
      url:`Electronic/getCityStatistics`,
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
