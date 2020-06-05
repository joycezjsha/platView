import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { Loading } from 'element-ui'
import router from '../router'
// const service = axios.create({});
// axios.defaults.headers.post['Content-Type'] = 'application/json';
const service = axios.create({
  baseURL:urlConf.BASE_URL,
  // timeout: 10000,
  responseType:'json'
});
const pending = [];
const CancelToken = axios.CancelToken;
let loading;
let startLoading = () => { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
let endLoading = () => { // 使用Element loading-close 方法
  loading.close();
}
const cancelPending = (config) => {
  pending.forEach((item, index) => {
    if (config) {
      if (item.UrlPath === config.url ) {//&& (config.url.indexOf('jointSearch')!=-1 || config.url.indexOf('querymileagelist')!=-1 || config.url.indexOf('querylist')!=-1)
        item.Cancel() // 取消请求
        pending.splice(index, 1) // 移除当前请求记录
      };
    } else {
      item.Cancel() // 取消请求
      pending.splice(index, 1) // 移除当前请求记录
    }
  })
}
/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
  cancelPending(config);
  config.cancelToken = new CancelToken(res => {
    pending.push({'UrlPath': config.url, 'Cancel': res})
  });
  // startLoading();
  // insertLog(config.method)
  if(config.method === 'post'){
    config.params=new Object();
    config.params._t=new Date().getTime();
    config.params.token='token_for_show';//sessionStorage.getItem("token");
    if(config.url.indexOf('updateOrganizationsRelationPermission')==-1 && config.url.indexOf('saveOrganizationsRelationPermission')==-1){
      config.data = qs.stringify({...config.data});
    }
    // insertLog(config.method);
  }else{
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if(config.url.indexOf('117.157.231.168')==-1){
      config.params._t=new Date().getTime();config.params.token='token_for_show';config.params = {...config.params};
    }
  }

  return config;
}, error => {  //请求错误处理
  // Promise.reject(error);
});
service.interceptors.response.use(function (response) {
  // token 已过期，重定向到登录页面
  // endLoading();
  if (response.data.stateCode == 401){
    localStorage.clear();
    sessionStorage.clear();
    router.replace({
      path: '/login',
      query: {redirect: router.currentRoute.fullPath}
    });
  }else{
    if (response.status != 200){
      Message({
        type: 'error',
        message: '服务请求失败!'
      });
    }
  }
  return response
}, function (error) {
  // Do something with response error
  if(error.response && error.response.status=='401'){
    localStorage.clear();
    sessionStorage.clear();
    router.replace({
      path: '/login',
      query: {redirect: router.currentRoute.fullPath}
    });
  }
  // console.log('err', error);
  // return Promise.reject(error);
});
const httpConnect=function(type, url, params, callback,error) {
  params.token='token_for_show';
  return $.ajax({
    type: type ? type : 'GET',
    url: urlConf.BASE_URL+url,
    data: params,
    // contentType:type=="POST" || type=="post"?"application/x-www-form-urlencoded;charset=UTF-8":"application/json;charset=UTF-8",
    //返回数据格式为json
    dataType: "json",
    scriptCharset: 'utf-8',
    success: function (data) {
      if (typeof callback == 'function') {
        callback(data);
      }

    }, error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest)
      console.log(textStatus)
      console.log(errorThrown)
      error(XMLHttpRequest);
    }
  });
}
export default {
  service,
  httpConnect
} 