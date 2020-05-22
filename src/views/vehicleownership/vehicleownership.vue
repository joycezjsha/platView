<template>
  <div class="vehicleownership">
      <ranking></ranking>   
      <middle class="middle"></middle>
      <right></right>
  </div>
</template>

<script>

import ranking from "./ranking.vue";
import middle from "./middle.vue";
// import xas from "./xas.vue";
import right from "./right.vue";
export default {
  name: "vehicleownership",
  data() {
    return {
      isShowCity:false
    };
  },
  components:{
    ranking,
    middle,
    right

  },
  mounted() {
    
  },
  destroyed() {
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
.vehicleownership{
  // display: flex;
  box-sizing: border-box;
  position:fixed;
  position: relative;
}

</style>