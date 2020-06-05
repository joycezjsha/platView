<template>
  <div class="middle">
    <div @click="realtime" >
        <m-title label='车辆实时监测' class="car"></m-title>
    </div>
    <div @click="belong" >
        <m-title label='车辆归属地OD' class="car"></m-title>
    </div>
   <div @click="hotbayonet">
        <m-title  label='热点卡口道路' class="car"></m-title>
   </div>
  </div>
</template>

<script>
import mTitle from "@/components/UI_el/title_com.vue";
import mTab from '@/components/UI_el/tab.vue';
import blur from '../../blur.js'
export default {
    name:'middle',
    data(){
        return{

        }
    },
    components:{
        mTitle,
        mTab,
        blur
    },
    methods:{
        // 车辆实时监测
        realtime(){
           console.log(111)
        //    blur.$emit('realtime',)

        },
        // 车辆归属地OD
        belong(){
           console.log(222)
        },
        // 热点卡口道路
        hotbayonet(){
           console.log(333)
        }
    }
}
</script>

<style scope lang='scss'>

.middle{
    position: fixed;
    top:88.6vh;
    left:34.53vw;
    width: 38.85vw;
    display: flex;
    .car{
        width:199px;
        height:39px;
        justify-content: space-around;
        line-height: 39px;
    }
    
}
</style>