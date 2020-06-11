<template>
  <div class='tab' style='background-image: url(./static/images/ui_image/tab_bg.png);'>
    <div class='img'><img :src='icon' /></div>
    <div class='label'>{{label}}</div>
    <div class='value'>{{value}}</div>
  </div>
</template>
<script>

export default {
  data() {
    return {

    };
  },
  props:{
    icon: {
        type: String,
        default: './static/images/default/device.png'
      },
      label: {
        type: String,
        default: '设备总数'
      },
      value: {
        type: String,
        default: ''
      },
  },
  components: {
    
  },
  created() {
    console.log(this.value)
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
  width:98%;
  height:37px;
  margin:0 auto;
  // border:1px solid $color-border-1;
  // background: $color-primary;
  background-size: 100% 100%;
  color: $color-white;
  @include flex(row, center,center);
  .img,.label,.value{
     @include flex(column, center,center);
  }
  .img{
    width:20%;
  }
  .label{
    width:50%;
  }
  .value{
    width:30%;
  }
}
</style>