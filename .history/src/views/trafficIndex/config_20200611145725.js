/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  // getCityIndexData:(data,callback,err)=>{
  //   return http._httpConnect("get", "AreaList/list",data,
  //         function(data){
  //           callback(data);
  //         },function(e){
  //           // _this.$message({type: 'warning', message: '服务异常'});
  //           err(e);
  //         })
  // },
  //获取左侧交通拥堵排名数据
  GET_CITY_TAFFIC_ORDER_API:data => {
    return http.service({
      url:`TrafficJam/getCityJamRanking`,
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
