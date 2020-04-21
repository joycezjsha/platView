/**
 * Created by ThinkPad on 2019/4/10.
 */
import {service} from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  /*获取巡航数据*/
  getCityIndexData:(data,callback,err)=>{
    return service("get", "AreaList/list",data,
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
