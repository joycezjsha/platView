/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import playImg from './image/cruise-play.png'
import stopImg from './image/cruise-stop.png'
export const interf={
  //  违法热力图 --返回格式暂时提供不了

  // 	限行日期分布 --返回格式暂时提供不了

  //	尾号限行 IllegalAnalysis/getlastTrafficRestriction
  GET_LAST_TRAFF_API:data=> {
    return http.service({
      url:`IllegalAnalysis/getlastTrafficRestriction`,
      method:'get',
      params:data
    })
  },
  // 	超速违法分类 -返回格式暂时提供不了

  //	超速违法 IllegalAnalysis/getSpeedingViolation
  GET_SPEED_VIOLA_API:data=> {
    return http.service({
      url:`IllegalAnalysis/getSpeedingViolation`,
      method:'get',
      params:data
    })
  },
  //	高发道路排名  IllegalAnalysis/getIllegalAnalysis
  GET_ILL_ANALYSIS_API:data=> {
    return http.service({
      url:`IllegalAnalysis/getIllegalAnalysis`,
      method:'get',
      params:data
    })
  },
  //  违法类别 -- 暂时提供不了

  //	全省统计  IllegalAnalysis/getAllProvinceIllegalStatistics
  GET_ILL_PRO_STATIS_API:data=> {
    return http.service({
      url:`IllegalAnalysis/getAllProvinceIllegalStatistics`,
      method:'get',
      params:data
    })
  },

  // 	违法分析  IllegalAnalysis/getIllegalAnalysis
  GET_ILL_ANALY_API:data=> {
    return http.service({
      url:`IllegalAnalysis/getIllegalAnalysis`,
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
