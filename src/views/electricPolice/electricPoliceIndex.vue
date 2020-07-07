<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index>
    <!-- <t-index-city v-show="isShowCity"></t-index-city> -->
    <middle></middle>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./electricPolice_city.vue";
import t_index from "./electricPolice_statics.vue";
import middle from "./middle.vue";
// import t_index_city from "./accident_statics_city.vue";
export default {
  name: "TafficIndex",
  data() {
    return {
    };
  },
  components:{
    index,
    TIndex:t_index,
    middle
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '26vw');
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