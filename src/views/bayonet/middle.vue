<template>
  <div class="bayonet-middle">
      <div @click="change(1)">
         <m-title  label='卡口热力分布'  :img_type='tableIndex==1?"1":"0"' class="car"></m-title> 
      </div>
      <div @click="change(2)">
        <m-title  label='活跃卡口点位'  :img_type='tableIndex==2?"1":"0"' class="car"></m-title> 
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
            tableIndex:1
        }
    },
    components:{
        mTitle,blur,mTab
    },
    methods:{
        // 切换卡口热力分布  与   活跃卡口点位
        change(i){   
            this.tableIndex=i;
        },
    },
    mounted(){

    }
}
</script>

<style scope lang='scss'>

.bayonet-middle{
    position: fixed;
    top:95.6vh;
    left:756px;
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
