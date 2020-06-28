
//引入地图api文件
document.writeln("<link rel='stylesheet' href=\"./static/lib/minemap/v2.0/minemap.css\">");
document.writeln("<script src=\"./static/js/echarts-all-3.js\"></script>");
document.writeln("<script src=\"./static/lib/minemap/v2.0/minemap.js\"></script>");
document.writeln("<script src=\"./static/js/template.js\"></script>");

var ip='192.168.0.180:8091/';//'117.48.214.220:9602';//window.location.host//'117.157.231.168';//'localhost:8080'//'117.48.214.220';//
var mapConfig = {
  BASE_URL: '//113.141.73.223:11180',//"//minedata.cn",
  DOMAIN_URL: '//113.141.73.223:11180',
  MAP_TRAFFIC_URL: '//113.141.73.223:11180/service/solu/',
  spriteUrl:'//113.141.73.223:11180/minemapapi/v1.3/sprite/sprite',
  SOLUTION: 4659,
  ACCESS_TOKEN: 'f1f7ca8c14164c28aead74dd72e86fde',
  DEFAULT_CENTER: [108.943368, 34.255634],
  DEFAULT_ZOOM: 4,
  DEFAULT_PITCH: 0,
  MAX_ZOOM: 16.9,
  MIN_ZOOM: 3
}

var urlConf = {
  /*接口地址*/
  BASE_URL: '//'+ip,
  IMG_PATH :'./static/images/'
}
