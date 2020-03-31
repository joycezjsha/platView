/**
 * Created by ThinkPad on 2019/3/29.
 */
import breadcrumb from './breadcrumb.vue'
// 这里是重点
const breadCrumb = {
  install: function(Vue){
    Vue.component('breadCrumb',breadcrumb);
  }
};
export default breadCrumb;
