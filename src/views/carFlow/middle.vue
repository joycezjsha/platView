<template>
  <div class="middle" >
    <div @click="realtime(1)" >
        <m-title label='车辆实时监测' class="car"></m-title>
    </div>
    <div @click="realtime(2)" >
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
import blur from '../../blur.js'
export default {
    name:'middle',
    data(){
        return{
            showcarinfo:true,
            showbelong:false,
            showhotcard:false
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
            blur.$emit('realtime',i)
            console.log(i)
        },
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
        cursor:pointer;
    }
    
}
</style>