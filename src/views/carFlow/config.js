/**
 * Created by ThinkPad on 2019/4/10.
 */
import service from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
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
