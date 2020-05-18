/**
 * Created by ThinkPad on 2019/3/29.
 */
import moduleArea from './area.vue'
// 这里是重点
const Area = {
  install: function(Vue){
    Vue.component('moduleArea',moduleArea);
  }
};
export default Area;
