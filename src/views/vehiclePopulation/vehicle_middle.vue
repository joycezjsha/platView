<template>
  <div class="vehicle-middle" >
    <div @click="realtime(1)" >
        <m-title label='车辆实时监测' class="car" :img_type='tableIndex==1?"1":"0"'></m-title>
    </div>
    <div @click="realtime(2)" >
        <m-title label='车辆归属地OD' class="car" :img_type='tableIndex==2?"1":"0"'></m-title>
    </div>
   <div @click="realtime(3)">
        <m-title  label='热点卡口道路' class="car" :img_type='tableIndex==3?"1":"0"'></m-title>
   </div>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js';
export default {
    name:'vehicle_middle',
    data(){
        return{
            tableIndex:1,
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
            this.tableIndex=i;
            // let els=document.getElementsByClassName('.custom-popup-class');
            blur.$emit('realtime',i)  
        },
    }
}
</script>

<style scope lang='scss'>
.vehicle-middle{
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
