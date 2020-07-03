// import "../../config/index";

//引入地图api文件
document.writeln("<link rel='stylesheet' href=\"./static/lib/minemap/v2.0/minemap.css\">");
document.writeln("<script src=\"./static/js/echarts-all-3.js\"></script>");
document.writeln("<script src=\"./static/lib/minemap/v2.0/minemap.js\"></script>");
document.writeln("<script src=\"./static/js/template.js\"></script>");

// var host = require('../../config/index');

var ip='127.0.0.1:8091/';
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
  MIN_ZOOM: 3,

  // host: '0.0.0.0', // can be overwritten by process.env.HOST
  // port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
  // autoOpenBrowser: false,
  // errorOverlay: true,
  // notifyOnErrors: true,
  // poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
}

var urlConf = {
  /*接口地址*/
  BASE_URL: '//'+ip,
  IMG_PATH :'./static/images/',
  JT_PATH:'92.1.48.106/xasimg'
}
