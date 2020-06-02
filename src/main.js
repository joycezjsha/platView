// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/index'
import ElementUI from 'element-ui'

import store from './store.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import '@/assets/css/style.css'
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$axios = axios
Vue.prototype.$qs=qs

Vue.config.productionTip = false
Vue.use(ElementUI)
import myMap from '@/Components/Map'
Vue.use(myMap);
import breadCrumb from '@/Components/breadcrumb'
Vue.use(breadCrumb);
import loading from '@/Components/loading'
Vue.use(loading);
import echarts from 'echarts'

Vue.prototype.$echarts = echarts;
Vue.component('footer-copyright', {
  template: '<p class="footer-msg">Copyright © Cennavi, All Rights Reserved.</p>'
});
// 定义保留两位小数的过滤器
Vue.filter('number',function(data){
  if (!data)  return '';
  return data.toFixed(2)
})
// 时间过滤器
Vue.filter('formatDateTime', function (value) {
  if (!value) return '';
  let date = new Date(value);
  let y = date.getFullYear() + '/';
  let mon = (date.getMonth() + 1) + '/';
  let d = date.getDate();
  return y + mon + d;
});

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
// var HTTP = axios.create({
//   baseURL:urlConf.BASE_URL,
//   timeout: 1000,
//   responseType:'json',
//   headers:{
//     'custome-header': 'miaov',
//     'content-type':'application/x-www-form-urlencoded'   //转换为key=value的格式必须增加content-type
//   },
//   transformRequest:[function(data){
//     console.log(data)
//     data._t = new Date().getTime();  //发送之前增加的属性
//     data.token=sessionStorage.getItem("token");
//     return queryString.stringify(data);    //利用对应方法转换格式
//   } ],
//     transformResponse:[function (response) {
//       // token 已过期，重定向到登录页面
//       if (response.data.stateCode == 401){
//         localStorage.clear()
//         router.replace({
//           path: '/login',
//           query: {redirect: router.currentRoute.fullPath}
//         })
//       }
//       return response;
//     }]
// });

// axios.interceptors.request.use(function(config){
//   //在发送请求之前做某事
//   if(config.method=='get'){
//     config.params._t=new Date().getTime();
//     config.params.token=sessionStorage.getItem("token");
//   }else{
//     // config.data._t=new Date().getTime();
//     // config.data.token=sessionStorage.getItem("token");
//   }
//
//   return config;  //只有return config后，才能成功发送请求
// },function(error){
//   //请求错误时做些事
//   return Promise.reject(error);
// });
// axios.interceptors.response.use(function (response) {
//   // token 已过期，重定向到登录页面
//   if (response.data.stateCode == 401){
//     localStorage.clear()
//     router.replace({
//       path: '/login',
//       query: {redirect: router.currentRoute.fullPath}
//     })
//   }
//   return response
// }, function (error) {
//   // Do something with response error
//   return Promise.reject(error)
// })
