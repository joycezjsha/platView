<template>
  <div class='ui_title'>
    <div>{{label}}</div>
  </div>
</template>
<script>

export default {
  data() {
    return {

    };
  },
  props:{
      label: {
        type: String,
        default: '设备总数'
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
.ui_title{
  width:100%;
  height:5vh;
  // border:1px solid $color-border-1;
  background:url(../../assets/images/div_title_bg.png) no-repeat;
  background-size:100% 100%;
  color:white;
  line-height: 5vh;
  text-align: center;
  font-size: 1vw;
  margin: 0 auto;
}
</style>