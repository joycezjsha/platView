<template>
  <div class='tab'>
    <div class='item' v-for='e in tabList' :key='e'></div>
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
.tab{
  width:100%;
  height:5vh;
  border:1px solid $color-border-1;
  background: $color-primary;
  @include flex(row, center,center);
  .item{
     @include flex(column, center,center);
  }
}
</style>