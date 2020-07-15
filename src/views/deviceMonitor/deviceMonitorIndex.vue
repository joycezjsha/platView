<template>
  <div class="traffic-index">
    <index></index>
    <t-index ref='statics'></t-index>
    <d-map ref='deviceMap'></d-map>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./device_city.vue";
import t_index from "./device_statics.vue";
import d_map from "./device_map.vue";
export default {
  name: "TafficIndex",
  data() {
    return {
      
    };
  },
  components:{
    index,
    TIndex:t_index,
    DMap:d_map
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '26vw');
    //type:0->城市，1->道路  value：参数名称  flag：0->不显示‘返回全省’按钮，1->显示‘返回全省’按钮
    setTimeout(()=>{
      blur.$on('initCityOrRoadStatics',function(type,value,flag){
        _this.$refs.statics.initStatics(type,value,flag);
        });
      blur.$on('clearRoadAndMaker',function(){
        _this.$refs.statics.clearMaker();
        });
      
    },300);
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