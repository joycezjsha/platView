<template>
  <div class="traffic-index">
    <index></index>
    <t-index ref='trafficBox'></t-index>
  </div>
</template>

<script>
import index from "./city_index";
import t_index from "./traffic_index";
import blur from "@/blur";
export default {
  name: "TafficIndex",
  data() {
    return {
    };
  },
  components:{
    index,
    TIndex:t_index
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '25.5vw');
    blur.$on('setSelectItems',function(name,id){
      _this.$refs['trafficBox'].setSelectItems(name,id);
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