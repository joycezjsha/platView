<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index>
     <!-- <t-index-city v-show="isShowCity"></t-index-city> -->
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./vehicle_monitor.vue";
import t_index from "./vehicle_monitor_info.vue";
// import t_index_city from "./vehicle_monitor_sortInfo.vue";
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
    // TIndexCity:t_index_city
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '20vw');
    blur.$on('isShowEvent',function(flag){
      _this.isShowCity=flag;
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