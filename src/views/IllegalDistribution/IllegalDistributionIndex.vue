<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index>
     <t-index-city v-show="isShowCity"></t-index-city>
    <middle></middle>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./Illegal_city.vue";
import t_index from "./Illegal_statics.vue";
import t_index_city from "./accident_statics_city.vue";
import middle from "./Illegal_middle.vue";
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
    TIndexCity:t_index_city,
    middle
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