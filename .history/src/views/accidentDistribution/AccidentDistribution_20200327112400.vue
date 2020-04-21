<template>
  <div class="traffic-index">
    <index></index>
    <t-index></t-index>
  </div>
</template>

<script>
import index from "./city_index";
import t_index from "./traffic_index";
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