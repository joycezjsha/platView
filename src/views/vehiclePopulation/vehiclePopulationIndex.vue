<template>
  <div class="traffic-index">
    <index></index>
    <!-- <t-index></t-index> -->
    <vehiclemiddle></vehiclemiddle>
    <!-- 控制右侧显示对应的组件 -->
    <div>
      <t-index v-if="isShow==1" ref="carinfo">
      </t-index>
      <vehicleBelong v-if="isShow==2" ref="belonginfo"></vehicleBelong>
      <vehicleHotcard  v-if="isShow==3" ref="hotcardinfo"></vehicleHotcard>
    </div>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./vehicle_monitor.vue";
import t_index from "./vehicle_monitor_info.vue";
import vehiclemiddle from "./vehicle_middle.vue";
import vehicleBelong from "./vehicle_belong.vue";
import vehicleHotcard from "./vehicle_hotcard.vue";
// import t_index_city from "./vehicle_monitor_sortInfo.vue";  
export default {
  name: "TafficIndex",
  data() {
    return {
      isShowCity:false,
      isShow:1
    };
  },
  components:{
    index,
    TIndex:t_index,
    vehiclemiddle,
    vehicleBelong,
    vehicleHotcard
    // TIndexCity:t_index_city
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '26vw');
    blur.$on('isShowEvent',function(flag){
      _this.isShowCity=flag;
    })
    
    blur.$on('realtime',data=>{
      _this.isShow=data;
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