
<template>
  <div class="middle" >
    <div @click="realtime(1)" >
        <!-- <div  class="car car1">
            <span> 车辆实时监测</span>
        </div> -->
        <m-title label='城市车辆分析' class="car"></m-title>
    </div>
    <div @click="realtime(2)" >
        <!-- <div  class="car car1">
            <span>车辆归属地OD</span>
        </div> -->
        <m-title label='车辆归属地OD' class="car"></m-title>
    </div>
   <div @click="realtime(3)">
        <m-title  label='热点卡口道路' class="car"></m-title>
   </div>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js';
export default {
    name:'middle',
    data(){
        return{
            // showcarinfo:true,
            // showbelong:false,
            // showhotcard:false
        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    methods:{
        // 车辆实时监测
        realtime(i){    
            let els=document.getElementsByClassName('.custom-popup-class');
            // if(els){
            // //    console.log("s",els) 
            // }   
            blur.$emit('realtime',i)
            // console.log(i)
        },
    }
}
</script>

<style scope lang='scss'>

.middle{
    position: fixed;
    top:95.6vh;
    left:34.53vw;
    width: 38.85vw;
    display: flex;
    .car{
        width:199px;
        height:39px;
        justify-content: space-around;
        line-height: 39px;
        cursor:pointer;
    }
    .car1{
        width:199px;
        height:39px;
        background:linear-gradient(90deg,rgba(59,79,101,1));
        border:1px solid;
        border-image:linear-gradient(-55deg, rgba(175,182,184,1)) 1 1;
        // background:url(../../../static/images/ui_image/title_bg_unchecked.png) no-repeat;
        // background-image: url(./static/images/ui_image/tab_bg.png);
        span{
            width:121px;
            height:20px;
            font-size:20px;
            font-family:Source Han Sans CN;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:25px;
        }
    }
}
</style>
