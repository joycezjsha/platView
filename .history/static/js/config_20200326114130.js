document.writeln("<link rel='stylesheet' href=\"./static/css/comm.css\">");
//引入地图api文件
document.writeln("<link rel='stylesheet' href=\"./static/lib/minemap/v2.0/minemap.css\">");
document.writeln("<script src=\"./static/lib/minemap/v1.3/minemap.js\"></script>");
document.writeln("<script src=\"//minedata.cn/minemapapi/v1.3.0/plugins/turf/turf.min.js\"></script>");

var ip='117.48.214.220:9602';//window.location.host//'117.157.231.168';//'localhost:8080'//'117.48.214.220';//
var mapConfig = {
  BASE_URL: '//map.xianjiaojing.com',//"//minedata.cn",
  DOMAIN_URL: '//map.xianjiaojing.com',
  MAP_TRAFFIC_URL: '//map.xianjiaojing.com/service/solu/',
  spriteUrl:'//map.xianjiaojing.com/minemapapi/v1.3/sprite/sprite',
  SOLUTION: 3478,
  ACCESS_TOKEN: '18f589098bf14f5bac790331c60a37ae',
  DEFAULT_CENTER: [108.943368, 34.255634],
  DEFAULT_ZOOM: 5.5,
  DEFAULT_PITCH: 0,
  MAX_ZOOM: 16.9,
  MIN_ZOOM: 3
}
var urlConf = {
  /*接口地址*/
  BASE_URL: '//'+ip+'/',
  _BASE_URL:'//113.141.66.75/traffic_xian/',
  IMG_PATH :'./static/images/'
}
