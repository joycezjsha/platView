/**
 * Created by xupuxin on 2017/7/1.
 */
var MAX_BOUNDS = [[107.63045,33.72769], [110.23616,34.77676]];
export const setAutoSize = function (mapc, array) {

  let initArray = array[0]
  let minX = initArray[0];
  let maxX = initArray[0];
  let minY = initArray[1];
  let maxY = initArray[1];
  for (let i = 1; i < array.length; i++) {
    let item = array[i]
    minX = Math.min(minX, item[0])
    // console.log('minX=' + minX)
    maxX = Math.max(maxX, item[0])
    // console.log('maxX=' + maxX)
    minY = Math.min(minY, item[1])
    maxY = Math.max(maxY, item[1])
//          console.log('minX='+minX)
//          console.log('maxX='+maxX)
//          console.log('minY='+minY)
//          console.log('manY='+maxY)
//          console.log('\n')
  }

  let mms = [0, 0, 370, 370];//最大最小经纬度,[maxx,maxy,minx,miny]

  // let minx = mms[2] - (mms[0] - mms[2]) / 2;
  // let miny = mms[3] - (mms[1] - mms[3]) / 2;
  // let maxx = mms[0] + (mms[0] - mms[2]) / 2;
  // let maxy = mms[1] + (mms[1] - mms[3]) / 2;
  minX = minX - (maxX - minX) / 2.5
  minY = minY - (maxY - minY) / 2.5
  maxX = maxX + (maxX - minX) / 2.5
  maxY = maxY + (maxY - minY) / 2.5
  let arr = [[minX, minY], [maxX, maxY]];
  mapc.fitBounds(minemap.LngLatBounds.convert(arr));
}
let EARTH_RADIUS = 6378137.0;    //单位M
let PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}

/**
 * caculate the great circle distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
export const getGreatCircleDistance = function (lat1, lng1, lat2, lng2) {
  let radLat1 = getRad(lat1);
  let radLat2 = getRad(lat2);
  let a = radLat1 - radLat2;
  let b = getRad(lng1) - getRad(lng2);

  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000.0;
  return s;
}
/**
 * 判断当前点是否在矩形内
 * @param x
 * @param y
 * @returns {boolean}
 */
export const isPointInMatrix = function (x, y) {
  let x1=MAX_BOUNDS[0][0]
  let y1=MAX_BOUNDS[0][1]
  let x2=MAX_BOUNDS[1][0]
  let y2=MAX_BOUNDS[1][1]
  console.log('x='+x)
  console.log('y='+y)
  console.log('x1='+x1)
  console.log('y1='+y1)
  console.log('x2='+x2)
  console.log('y2='+y2)
  if (x > x1 && x < x2 && y> y1 && y < y2) {
    return true
  }
  return false
}



