<template>
  <div :class="right_value==''?'tab':'tab_'" style='background-image: url(./static/images/ui_image/tab_bg.png);'>
    <div class='img' v-if='isShowIcon' >
      <i :class='"iconfont "+icon' :style='icon_style'/>
    </div>
    <div class='label'>{{label}}</div>
    <div class='value'>{{value}}</div>
    <div class="rightValue" v-if='right_value!=""'>{{right_value}}</div>
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
      default: 'color:#A6AFCD;'
    },
    label: {
      type: String,
      default: '设备总数'
    },
    value: {
      // type: String,
      default: ''
    },
    right_value: {
      // type: String,
      default: ''
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
      font-size: 18px;
      color:#8B8EA4;
    }
  }
  .label{
    width:50%;
    align-items: start;
    font-size: 16px;
    font-style:italic;
  }
  .value{
    width:30%;
    font-size: 24px;
    .rightValue{
      font-size: 16px;
    }
  }
}
.tab_{
  width:98%;
  height:37px;
  margin:0 auto;
  // border:1px solid $color-border-1;
  // background: $color-primary;
  background-size: 100% 100%;
  color: $color-white;
  @include flex(row, center,center);
  .img,.label,.value,.rightValue{
     @include flex(column, center,center);
  }
  .img{
    width:20%;
    i{
      font-size: 18px;
      color:#8B8EA4;
    }
  }
  .label{
    width:30%;
    align-items: start;
    font-size: 16px;
    font-style:italic;
  }
  .value{
    width:20%;
    font-size: 24px;

  }
  .rightValue{
    width:30%;
    font-size: 16px;
  }
}
</style>