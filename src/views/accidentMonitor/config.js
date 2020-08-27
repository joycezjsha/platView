/**
 * Created by ThinkPad on 2019/4/10.
 */
import http from '../../common/httpUtil'
import sgImg from './image/sg.png'
import sgUncheckImg from './image/sg_.png'
import jqImg from './image/jq.png'
import spImg from './image/zq.png'
import spUncheckImg from './image/zq-uncheck.png'
import xcImg from './image/xc.png'
import xcUncheckImg from './image/xc-uncheck.png'
import close_img from './image/close.png'
import close_hover_img from './image/close_hover.png'
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
  },
  /*获取应急处置json数据*/
  GET_EMERGENCY_API:(callback,err)=>{
    return http.httpConnect("get", "./static/json/jwz.json",{},
          function(data){
            callback(data);
          },function(e){
            // _this.$message({type: 'warning', message: '服务异常'});
            err(e);
          })
  },
  /*获取城市统计数据*/
  GET_ACCI_CITY_STA_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getCityPoliceStatistics`,
      method:'get',
      params:data
    })
  },
  /*获取区域统计数据*/
  GET_ACCI_AREA_STA_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getBrigadePoliceStatistics`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-统计数据*/
  GET_ALL_ACCI_STA_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getPoliceCount`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-警情分类数据*/
  GET_ACCI_SORT_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getPoliceCategory`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-警情发生趋势数据*/
  GET_ACCI_ACCUR_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getThirtyPoliceTrend`,
      method:'get',
      params:data
    })
  },
  /*获取右侧-重大警情发生趋势数据*/
  GET_MAIN_ACCI_ACCUR_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getMajorPoliceTrend`,
      method:'get',
      params:data
    })
  },
  /*获取地图-城市警情数量统计数据*/
  GET_MAP_CITY_ACCI_API:data=> {
    return http.service({
      url:`PoliceMonitoring/getMapCityPolice`,
      method:'get',
      params:data
    })
  },
  /*获取地图-施工统计数据*/
  GET_MAP_CONSTRUCTION_API:data=> {
    return http.service({
      url:`Construction/getConstruction`,
      method:'get',
      params:data
    })
  },
  //获取视频巡查数据
  GET_SP_API:data=> {
    return http.service({
      url:`Bayonet/getAllDev`,
      method:'get',
      params:data
    })
  }
}
export const IMG={
  /*路况巡航*/
  SG_IMG: sgImg,
  SG_UNCHECK_IMG:sgUncheckImg,
  SP_IMG: spImg,
  SP_UNCHECK_IMG:spUncheckImg,
  jqImg:jqImg,
  CLOSE_IMG:close_img,
  CLOSE_HOVER_IMG:close_hover_img,
  XC_IMG: xcImg,
  XC_UNCHECK_IMG:xcUncheckImg
}
