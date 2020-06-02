<template>
  <div class="ranking" style="border:1px silid">
      <!-- <div class="rank" style="border:#0A94FF">汽车保有量排名</div> -->
      <div  class="rank"  style="border:#0A94FF">
        <m-title label='汽车保有量排名' style='width:10vw;'></m-title>
      </div>
      <div>
        <div class="titles">
          <span class="No">No.</span>
          <span class="city">城市</span>
          <span class="car" >汽车保有量</span>
          <i style="" class='iconfont icon-shaixuan'></i>
          <span class="cargo">客货车数量
          <i style="width:15px;height:17px; color:rgba(29,153,171,1);" class='iconfont icon-shaixuan'></i>
          </span>        
        </div>
         <xopacity></xopacity>
         <!-- <xopacity></xopacity> -->
          <x></x>
          <xopacity></xopacity>
          <x></x>
          <xopacity></xopacity>
          <x></x>
          <!-- <xcenter></xcenter> -->
          <xopacity></xopacity>
          <x></x>
          <xopacity></xopacity>
          <x></x>
          <xopacity></xopacity>
          <x></x>
          <xopacity></xopacity>
          <x></x>
      </div>
      
     
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

.ranking{
  top: 0.67708vw;
  left: 0.625vw;
  margin-left: 0.6vw;
  width: 24.6875vw;
  height: 50.9375vw;
  background: #02061F;
  border: 1px solid #0A94FF;
  margin-top: 13px;
}
.rank{
  width:120px;
  height:39px;
  font-size:16px;
  font-family:Source Han Sans CN;
  font-weight:400;
  padding-top: 9px;
  padding-bottom: 6px;
  color:rgba(255,255,255,1);
  margin-bottom: 36px;
  border-bottom: 1px solid #fff;
}
.titles{
  width: 100%;
  padding-left: 30px;
  padding-right: 33px;
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
    line-height:40px;

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
  width:15px;height:17px; color:rgba(29,153,171,1); margin-right:35px;
}

</style>