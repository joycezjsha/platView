<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index>
     <t-index-city v-show="isShowCity"></t-index-city>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./accident_city.vue";
import t_index from "./accident_statics.vue";
import t_index_city from "./accident_statics_city.vue";
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
    TIndexCity:t_index_city
  },
  mounted() {
    
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