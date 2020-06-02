<template>
  <div class="right">
     <back></back> 
      <changechart></changechart>
      <rankchart></rankchart>
  </div>
</template>

<script>
import back from "./back.vue";
import changechart from "./changechart.vue";
import rankchart from "./rankchart.vue";
// import righttop from "./righttop.vue";
export default {
    name:'right',
    components:{
       back ,
      // righttop,
       changechart,
       rankchart
    }
}
</script>

<style scoped lang="scss">
.right{
 position: absolute;
 right: 0px;
 top: 19px;
 width: 474px;
 
}
</style>