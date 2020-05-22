<template>
<div class="middle"> 
  <div class="xagx" style="position: absolute; left:42.0833vw;top:57.5vh; border:1px solid rgba(42, 76, 162, 1);">
    <div class="title">西安市</div>
    <div class="text">汽车保有量：xxxxxx</div>
  </div>
  <div class="xagx" style="position: absolute; left:53vw;top:49.722vh;">
    <div class="title">西安-高新</div>
    <div class="text">汽车保有量：xxxxxx</div>
  </div>
</div>  
</template>

<script>
export default {
  name:'middle'
}
</script>

<style scoped lang="scss">
.xagx{
  width: 179x;
  height: 81px;
  background:rgba(3,12,32,0.74); 
  border:1px solid rgba(42, 76, 162, 1);
  border-radius:2px;
  box-sizing: border-box;
  padding-left: 16px;
  position: absolute;
  left: 808px;
  top:621px;
} 
.title{
    width:159px;
    height:14px;
    padding-top: 15px;
    font-size:14px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(255,255,255,1);

    -webkit-text-stroke:1px undefined;
 
    padding-bottom: 5px;
  }
  .text{
    width:158px;
    height:14px;
    font-size:14px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(0,198,255,1);
 
    padding-bottom: 13px;
    padding-right: 15px;
  }
</style>