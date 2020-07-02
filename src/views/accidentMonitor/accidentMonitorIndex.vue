<template>
  <div class="traffic-index">
    <index></index>
    <t-index ref='staticsModule'></t-index>
    <accident-map ref='mapModule'></accident-map>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./accident_city.vue";
import t_index from "./accident_statics.vue";
import accidentMap from "./accident_map.vue";
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
    accidentMap
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '26vw');
    blur.$on('initAccidentStatics',function(type,value,flag){
      _this.$refs.staticsModule.initAccidentStatics(type,value,flag);
    });
    blur.$on('initAccidentMapdata',function(data){
      _this.$refs.mapModule.initAccidentMap(data);
    });
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