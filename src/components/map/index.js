/**
 * Created by ThinkPad on 2019/3/29.
 */
import myMap from './Map.vue'
// 这里是重点
const map = {
  install: function(Vue){
    Vue.component('myMap',myMap);
  }
};
export default map;
