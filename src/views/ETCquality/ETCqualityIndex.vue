<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./ETCquality_city.vue";
import t_index from "./ETCquality_statics.vue";
export default {
  name: "TafficIndex",
  data() {
    return {
      isShowCity:false
    };
  },
  components:{
    index,
    TIndex:t_index
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