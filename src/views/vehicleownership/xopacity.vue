<template>
  <div class="xopacity hove">
    <div class="opticy" style="margin-bottom:10.8vh;">
      <span class="span1" style="margin-right:4vw;">x</span>
      <span  class="span2" style="margin-right:5vw">x</span>
      <span  class="span3" style="margin-right:6.5vw">x</span>
      <span  class="span4">x</span>
    </div>
  </div>
</template>

<script>
export default {
    name:"xopacity",
    data(){
      return{

      }
    },
    created(){
   
    }
}
</script>

<style  scoped lang="scss">

 .xopacity{
    width:21vw;
    height:23px;
    // background:rgba(71,83,108,1);
    // opacity:0.2;
    background:rgba(71,83,108,0.2);
    margin-left: 1.406vw;
    margin-right: 28px;
  }
.xopacity>div{
   .span1{
    width:7px;
    height:8px;
    font-size:14px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(255,255,255,1);
    // line-height:8px;
    margin-left: 16px;
    } ;
    .span2{
        width:7px;
        height:8px;
        font-size:14px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(255,255,255,1);
        // line-height:14px;
    };
    .span3{
        width:7px;
        height:8px;
        font-size:14px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(255,255,255,1);
        // line-height:8px;
    }
    .span4{
        width:7px;
        height:8px;
        font-size:14px;
        font-family:Source Han Sans CN;
        font-weight:400;
        color:rgba(255,255,255,1);
        // line-height:8px;
    }
}
.hove:hover{
    background:rgba(3,103,166,1);
    opacity:0.6;
}
</style>

