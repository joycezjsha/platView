<template>
  <div class="vehicleownership">
      <ranking></ranking>   
      <!-- <middle class="middle"></middle> -->
      <right></right>
  </div>
</template>
<script>
import ranking from "./ranking.vue";
import middle from "./middle.vue";
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
    let _this=this;
    _this.$store.commit("setRight", '26vw');
    // blur.$on('isShowEvent',function(flag){
    //   _this.isShowCity=flag;
    // })
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