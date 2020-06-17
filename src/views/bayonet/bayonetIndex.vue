<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index> 
    <t-index-city  v-show="isShowCity"></t-index-city>
    <middle></middle>
  </div>
</template>

<script>
import blur from '../../blur.js';
import index from "./bayonet_city.vue";
import t_index from "./bayonet_statics.vue";
import t_index_city from "./accident_statics_city.vue";
import middle from "./middle.vue";
// activebaypoint  "
export default {
  name: "TafficIndex",
  data() {
    return {
      isShowCity:false,
      isActive:1  //切换下边的两个组件
    };
  },
  components:{
    index,
    TIndex:t_index,
    TIndexCity:t_index_city,
    middle
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '26vw');
    blur.$on('isShowEvent',function(flag){
      _this.isShowCity=flag;
    })
    blur.$on('realtime',i=>{
      _this.isActive=i;
      console.log( _this.isActive)
    })
  },
  destroyed() {
  },
  methods: {
  }
};
</script>
<style>
.traffic-index{
  position:fixed;
}

</style>