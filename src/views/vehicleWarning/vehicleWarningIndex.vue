<template>
  <div class="traffic-index">
    <index></index>
    <!-- 控制右侧显示对应的组件 -->
    <t-index></t-index>
  </div>
</template>

<script>
import blur from "@/blur";
import index from "./vehicle_warning_index.vue";
import t_index from "./vehicle_warning_info.vue"; 
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
    TIndex:t_index
  },
  mounted() {
    let _this=this;
    _this.$store.commit("setRight", '25.4vw');
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