/**
 * Created by ThinkPad on 2019/4/10.
 */
import connect from '../../common/httpUtil'
export const interf={
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
    login:(data,callback,err)=>{
      return connect.httpConnect("post", "sys/login",data,
            function(data){
              callback(data);
            },function(e){
              // _this.$message({type: 'warning', message: '服务异常'});
              err(e);
            })
    }
  // insertLog:data => {
  // return service({
  //   url:`${urlConf.monitor_base}/admin/log/operation/insertUserOperation`,
  //   method:'post',
  //   data
  // })}
}
export const IMG={
  /*登录*/
  LOGIN_BG: urlConf.IMG_PATH + "login/pic-homebg.png",
  LOGIN_DIV_BG:urlConf.IMG_PATH + "login/login-divbg.png",
  LOGIN_LEFT_BG:urlConf.IMG_PATH + "login/login-leftbg.png",
}
