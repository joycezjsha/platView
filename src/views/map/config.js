/**
 * Created by joyce on 2019/4/11.
 */
import service from '../../common/httpUtil'
export const conf={
  interf:{
    LAYER_LIST: urlConf.BASE_URL + "layermanagement/getlayerlist",//图层列表
    /*t图层管理*/
    // MENU_LIST: urlConf.BASE_URL + "user/listSuperModule",//获取菜单列表
    // LAYER_EDIT: urlConf.BASE_URL + "layermanagement/getlayermesage",//根据id获取图层信息
    // DATA_EDIT: urlConf.BASE_URL + "layerdata/getdatabyid",//根据id获取数据信息
    // DATA_SAVE: urlConf.BASE_URL + "layerdata/savedata",//保存数据
    // LAYER_SAVE: urlConf.BASE_URL + "layermanagement/savelayer",//保存图层
    /*地图服务*/
    TILE_URL: urlConf.BASE_URL + "getLayer/pbf/{z}/{x}/{y}/",//获取PBF图层
    // LAYER_INFO: urlConf.BASE_URL + "layerdata/getdatabyid",//点击获取地图元素详细信息
    // SEARCH_LIST: urlConf.BASE_URL + "layermanagement/querylist",//搜索获取列表
    EXPORT:urlConf.BASE_URL+'layermanagement/excel',//导出图层数据
    QUERY_EXPORT:urlConf.BASE_URL+'layermanagement/queryResultExport',//导出查询结果
    getMileage:urlConf.BASE_URL+'layermanagement/getlayermileage',//获取里程桩数据**未使用
    // getStatics:urlConf.BASE_URL+'layermanagement/getcount',
    // MILEAGE_SEARCH:urlConf.BASE_URL+'layermanagement/querymileagelist',
    //获取图层列表
    LAYER_LIST_API:data => {
      return service({
        url:`layermanagement/getlayerlist`,
        method:'get',
        params:data
      })},
    //获取菜单列表
    MENU_LIST_API:data => {
      return service({
        url:`user/listSuperModule`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    //点击获取地图元素详细信息
    LAYER_INFO_API:data => {
      return service({
        url:`layerdata/getdatabyid`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    //搜索获取列表
    SEARCH_LIST_API:data => {
      return service({
        url:`layermanagement/querylist`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    //图层叠加搜索获取列表
    SEARCH_OVERLY_LIST_API:data => {
      return service({
        url:`layermanagement/jointSearch`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    SEARCH_OVERLY_LIST_ROAD_API:data => {
      return service({
        url:`layermanagement/Search`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    //获取统计列表
    GET_HIGHTSPEED_STATICS:data => {
      return service({
        url:`Analysis/highspeedAnalysis`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    GET_STATICS_API:data => {
      return service({
        url:`layermanagement/getcount`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    //导出图层数据
    // EXPORT:data => {
    //   return service({
    //     url:`layermanagement/excel`,//
    //     method:'get',
    //     params:data
    //   })},
    //里程桩搜索
    MILEAGE_SEARCH:data => {
      return service({
        url:`layermanagement/querymileagelist`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    //里程桩搜索
    GET_HIGH_SPEED_TOP:data => {
      return service({
        url:`layermanagement/getRanking`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    GET_HIGH_SPEED_SORTS:data=>{
      return service({
        url:`layermanagement/highSpeedClassification`,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    TRAFFIC_API:(url,data)=>{
      return service({
        url:url,//${urlConf.BASE_URL}
        method:'get',
        params:data
      })},
    insertLog:function(data){
      return service({
        url:`service/operationalContent`,
        method:'get',
        params:data
      })
    }
  }
  ,
  IMG: {
    mapLightIcon: urlConf.IMG_PATH + 'mapCtr/light.png',
    mapDarkIcon: urlConf.IMG_PATH + 'mapCtr/dark.png',
    exportIcon: urlConf.IMG_PATH + 'mapCtr/export.png',
    exportHoverIcon: urlConf.IMG_PATH + 'mapCtr/export_.png',
    CLOSE_IMG: urlConf.IMG_PATH + '/mapCtr/close.png',
    CLOSE_IMG_HOVER: urlConf.IMG_PATH + '/mapCtr/close_hover.png',
    map_light:urlConf.IMG_PATH + '/mapCtr/map_light.png',
    map_dark:urlConf.IMG_PATH + '/mapCtr/map_dark.png',
    mar_icon:urlConf.IMG_PATH + '/mapCtr/point.png',
    statics_png:urlConf.IMG_PATH + '/mapCtr/statics.png',
    check_png:urlConf.IMG_PATH + '/mapCtr/check.png',
    uncheck_png:urlConf.IMG_PATH + '/mapCtr/uncheck.png',
    icon_lk:urlConf.IMG_PATH + '/mapCtr/lk_check.png',
    uncheck_icon_lk:urlConf.IMG_PATH + '/mapCtr/un_lk_check.png',
  }
}
