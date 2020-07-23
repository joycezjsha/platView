<template>
  <div class="vehicleownership">
      <ranking></ranking>   
      <!-- <middle class="middle"></middle> -->
      <right ref='statics'></right>
      <v-map ref='vehicleMap'></v-map>
  </div>
</template>
<script>
import blur from "@/blur";
import ranking from "./ranking.vue";
import right from "./right.vue";
import v_map from "./vehicle_map.vue";
export default {
  name: "vehicleownership",
  data() {
    return {
      isShowCity:false
    };
  },
  components:{
    ranking,
    right,
    vMap:v_map
  },
   mounted() {
    let _this=this;
    _this.$store.commit("setRight", '25vw');
    blur.$on('initVehicleStatics',function(data){
      _this.$refs.statics.initStatics(data);
    })
  },
  destroyed() {
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
.vehicleownership{
  position:fixed;
}

</style>