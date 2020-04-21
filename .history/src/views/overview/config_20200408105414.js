/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
export const interf={
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
}
