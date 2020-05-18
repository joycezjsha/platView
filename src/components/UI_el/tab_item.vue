<template>
  <div class='tabItem'>
    <div class='item' v-for='e in tabList' :key='e'>{{e}}</div>
  </div>
</template>
<script>

export default {
  data() {
    return {

    };
  },
  props:{
    tabList: {
      type: Array,
       default:()=>{
        return ['超速检测次数','平均行驶速度/限速']
       }
    }
  },
  components: {
    
  },
  created() {
  },
  methods: {

  }
}
</script>
<style scoped lang="scss">
@import "@/assets/css/color.scss";
@mixin flex($direction, $justify, $align) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.tabItem{
  width:100%;
  height:5vh;
  @include flex(row, center,center);
  .item{
     @include flex(column, center,center);    
     border: 1px solid #DCDFE6;
    width: 7vw;
    height: 3vh;
    margin: 2%;
    color:$color-info;
  }
}
</style>