/**
 * Created by ThinkPad on 2019/4/10.
 */
import connect from '../../common/httpUtil';

 const interf={
  /*登录*/
  URL_LOGIN: urlConf.BASE_URL + "user/login",
  VERTIFY_CODE: urlConf.BASE_URL + "user/getnumber",
  LOGIN_API: data => {
    return connect.service({
      url:`user/login`,
      method:'get',
      params:data
    })},
  VERTIFY_CODE_API: data => {
    return connect.service({
      url:`user/getnumber`,
      method:'get',
      params:data
    })},

    adornUrl:data=>{
      return urlConf.BASE_URL+data
    },

      // 车辆流动页面流动趋势 
    // login:data=> {
    //   return connect.service({
    //   url:
    //   method:'post',
    //   params:data
    // })
  }
  
  // insertLog:data => {
  // return service({
  //   url:`${urlConf.monitor_base}/admin/log/operation/insertUserOperation`,
  //   method:'post',
  //   data
  // })}
// }
const IMG={
  /*登录*/
  LOGIN_BG: urlConf.IMG_PATH + "login/pic-homebg.png",
  LOGIN_DIV_BG:urlConf.IMG_PATH + "login/login-divbg.png",
  LOGIN_LEFT_BG:urlConf.IMG_PATH + "login/login-leftbg.png",
}
export {
  IMG,
  interf
}
