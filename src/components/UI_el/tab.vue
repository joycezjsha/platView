<template>
  <div class='tab' style='background-image: url(./static/images/ui_image/tab_bg.png);'>
    <div class='img'>
      <i :class='"iconfont "+icon' :style='icon_style' v-show='isShowIcon' />
    </div>
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
    isShowIcon: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: 'icon-jingqing'
    },
    icon_style:{
      type: String,
      default: 'color:#A6AFCD;font-size:30px;height:30px;'
    },
    label: {
      type: String,
      default: '设备总数'
    },
    value: {
      // type: String,
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
    i{
      font-size: 20px;
      color:#8B8EA4;
    }
  }
  .label{
    width:50%;
  }
  .value{
    width:30%;
  }
}
</style>