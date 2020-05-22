<template>
<div class="backright"  >
    <div class="back" >
        <a href="" >&lt;&lt;</a>
        <span class="text">返回全省</span>
        <span class="title">西安市</span>
    </div>
    <div class="number reg" style="margin-bottom:10px">
        <i style="" class='iconfont icon-wodecheliang'></i>
        <span class="num">注册车辆总数</span>
        <span class="x x1" style="">xxxxxxxx</span>
    </div>
     <div class="number van" style=" ">
        <i style="" class='iconfont icon-cheliang'></i>
        <span class="num">客货车</span>
        <span class="x x2" style="">xxxx/xx%</span>
    </div>
    <changechart></changechart>
     <!-- <rankchart></rankchart> -->
</div>
  
</template>

<script>
import changechart from "./changechart.vue";
import rankchart from "./rankchart.vue";
export default {
    name:'back',
    components:{
        changechart,
        rankchart
    }
}
</script>

<style scoped lang="scss">
.backright{
    position:absolute;
    right:0 ;
    top:0;
}
.back{
    width:474px;
    height:34px;
    background:linear-gradient(0deg,#000930,rgba(8,35,84,1),rgba(8,35,84,1));
    border:1px solid;
    border-image:linear-gradient(0deg, rgba(2,8,47,1), rgba(32,103,187,1)) 1 1;
    box-shadow:0px 0px 0px 0px rgba(7,12,43,1);
}
a{
    width:19px;
    height:11px;
    font-size:24px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(0,198,255,1);
    text-decoration:none;
    margin-left: 17px;
};
.text{
    width:64px;
    height:16px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(0,198,255,1);
}
 .icon-cheliang{
    width:20px;height:18px; 
    color:rgba(254,254,254,1);
    margin-left: 17px;
    margin-right:8px;
}
.num{
    width:100px;
    height:16px;
    font-size:16px;
    font-family:Source Han Sans CN;
    font-weight:400;
    font-style:italic;
    color:rgba(255,255,255,1);
}
.x{
    width:94px;
    height:12px;
    font-size:22px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(255,255,255,1);
}
.x1{
    margin-left: 196px;
}
.x2{
    margin-left: 235px;
}
.icon-wodecheliang{
    width:20px;height:18px; 
    color:rgba(254,254,254,1);
    margin-left: 17px;
    margin-right:8px
}
.number{
    width:458px;
    height:37px;
    background:rgba(3,7,30,0.6);
    border:1px solid rgba(139,142,164,1);
}
 .title{
    width:53px;
    height:18px;
    font-size:18px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(254,254,254,1);
    margin-left: 108px;
}




</style>