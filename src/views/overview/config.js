/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import warningInstance from './image/warningInstance.png'
import accident from './image/accident.png'
export const interf={
  //获取轨迹查询数据
  GET_TRAIL_API:data => {
    return http.service({
      url:`Overview/getTArajectory`,
      method:'get',
      params:data
    })},
     //获取历史过车数据
  GET_HIS_CAR_API:data => {
    return http.httpConnect("get", "Overview/getPassingDataDetals",data,
    function(data){
      callback(data);
    },function(e){
      
    })
  }
}
export const IMG={
  /*总览*/
  warningInstanceIMG:warningInstance,
  accidentIMG:accident
}
