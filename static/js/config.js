
//引入地图api文件
document.writeln("<link rel='stylesheet' href=\"./static/lib/minemap/v2.0/minemap.css\">");
document.writeln("<script src=\"./static/js/echarts-all-3.js\"></script>");
document.writeln("<script src=\"./static/lib/minemap/v2.0/minemap.js\"></script>");
document.writeln("<script src=\"./static/js/template.js\"></script>");
//测试地址
var ip='127.0.0.1:8091';//'192.168.70.216:8091';//
//正式地址
// var ip=window.location.host;
//地图配置
var mapConfig = {
  BASE_URL: '//113.141.73.223:11180',//"//minedata.cn",
  DOMAIN_URL: '//113.141.73.223:11180',
  MAP_TRAFFIC_URL: '//113.141.73.223:11180/service/solu/',
  spriteUrl:'//113.141.73.223:11180/minemapapi/v1.3/sprite/sprite',
  SOLUTION: 4659,
  ACCESS_TOKEN: 'f1f7ca8c14164c28aead74dd72e86fde',
  DEFAULT_CENTER: [109.278987,35.747334],
  DEFAULT_ZOOM: 6,
  DEFAULT_PITCH: 0,
  MAX_ZOOM: 16.9,
  MIN_ZOOM: 3,
}

var urlConf = {
  /*接口地址*/
  BASE_URL: '//'+ip+'/',
  IMG_PATH :'./static/images/',
  JT_PATH:'//'+'92.1.48.106/xasimg/',
  YQ_PATH:'//117.157.231.168/minemapapi/demo/index.html#base_map', //疫情地址
  overview_weekCount:1611,//总览超速统计-配置数据：上周
  overview_monthCount:88810//总览超速统计-配置数据：本月
}
