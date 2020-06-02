<template>
  <div class="bottomright" style="border:1px silid">
      <div  class="rank"  style="border:#0A94FF">
        <m-title label='区县排名' style='width:6vw;height:1vh;'></m-title>
      </div>
      <div class="titles">
        <span class="No">No.</span>
        <span class="city">区县</span>
        <span class="car" >汽车保有量</span>
          <i style=" color:rgba(29,153,171,1);margin-right:1.8vw;" class='iconfont icon-shaixuan'></i>
        <span class="cargo">占比
         <i style="width:15px;height:17px; color:rgba(29,153,171,1);" class='iconfont icon-shaixuan'></i>
        </span>        
      </div>
      <xopacity></xopacity>
        <x></x>
      <xopacity></xopacity>
      <!-- <xcenter></xcenter> -->
      <x></x>
      <xopacity></xopacity>
      <x></x>
      <!-- <xopacity></xopacity>
      <x></x> -->
    </div>
</template>
<script>
import xopacity from "./xopacity.vue";
import x from "./x.vue";
import xcenter from "./xcenter.vue";
import mTitle from '@/components/UI_el/title_com.vue'
export default {
    name:"ranking",
    data(){
        return{

        }
    },
    components:{
        xopacity,
        x,
        xcenter,
        mTitle
    }
}
</script>

<style  scoped lang="scss">
.bottomright{
  position: fixed;
  top: 21vw;
  width:23.6875vw;
  height:39.074vh;
  background: #02061F;
  border: 1px solid #0A94FF;
  margin-top: 140px;
  right: 13px;
  // margin-bottom: 13px;
}
.rank{
  width:114px;
  height:16px;
  font-size:16px;
  font-family:Source Han Sans CN;
  font-weight:400;
  padding: 6px 0;
  color:rgba(255,255,255,1);
  margin-bottom: 20px;
}
.titles{
  width: 100%;
  padding-left: 38px;
  // padding-right: 36px;
  .No{
    width:23px;
    height:12px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(29,153,171,1);
    line-height:25px;
    margin-right: 45px;
  };
  .city{
    width:31px;
    height:16px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(29,153,171,1);
    line-height:60px;
    margin-right: 30px;
  };
  .car{
    width:79px;
    height:16px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(29,153,171,1);
    line-height:60px;
    //
  };
  .cargo{
    width:79px;
    height:16px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(29,153,171,1);
    line-height:60px;
  }
}
.ranking i{
  width:15px;
  height:17px; 
  color:rgba(29,153,171,1); 
  margin-right:35px;
}
</style>