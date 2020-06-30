<template>
  <div class="traffic-index">
    <index></index>
    <t-index ref='staticsModule'></t-index>
     <ditribution-map ref='mapModule'></ditribution-map>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./distribution_city.vue";
import t_index from "./distribution_statics.vue";
import ditributionMap from "./ditribution_map.vue";
export default {
  name: "TafficIndex",
  data() {
    return {
      isShowCity:false
    };
  },
  components:{
    index,
    TIndex:t_index,
    ditributionMap
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '26vw');
    blur.$on('initDistributionMapdata',function(data){
      _this.$refs.mapModule.initDistributionMap(data);
    });
    blur.$on('initDistributionStatics',function(type,value,flag){
      _this.$refs.staticsModule.initDistributionStatics(type,value,flag);
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