<template>
  <div class="tab" style='background-image: url(./static/images/ui_image/tab_bg.png);'>
    <div class='img' v-if='isShowIcon' >
      <i :class='"iconfont "+icon' :style='icon_style'/>
    </div>
    <div class='label'>{{label}}</div>
    <div class='value'>{{value}}</div>
    <div class="rightValue" v-if='right_value.length>0'>
      <div v-for='(item,index) in right_value' :key="index">
        <div class='label'>{{item.label}}:</div>
        <div class='value'>{{item.value}}</div>
        <div class='img'> <i class="iconfont icon-shangsheng" :style='item.value=="-"?"color:transparent":(item.value.split("%")[0]>0?"color:#FFAF05":"transform:rotate(180deg);color:#00DFC7")' /></div>
        <!-- <div class='img'> <i class="iconfont icon-shangsheng" :style='item.value.split("%")[0]>0?"color:#FFAF05":"transform:rotate(180deg);color:#00DFC7"' /></div> -->
      </div>
    </div>
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
      type: Array,
      default: []
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
  height:60px;
  margin:0 auto;
  // border:1px solid $color-border-1;
  // background: $color-primary;
  background-size: 100% 100%;
  color: $color-white;
  margin-bottom: 14px;
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
    width:20%;
    align-items: start;
    font-size: 16px;
    font-style:italic;
  }
  .value{
    width:20%;
    font-size: 24px;

  }
  .rightValue{
    width:45%;
    font-size: 12px;
    @include flex(column, start,flex-start);
    >div{
       @include flex(row, start,flex-start);
       height:50%;
       width:100%;
      .img,.label,.value{
        @include flex(row, start,flex-start);
      }
      .img{
        width:10%;
        i{
          color:#8B8EA4;
          &:before{
            font-size: 14px;
          }
        }
      }
      .label{
        width:auto;
        align-items: start;
        font-style:italic;
      }
      .value{
        width: auto;
        font-size: 0.72917vw;
        margin-left: 5%;
      }
    } 
  }
}
</style>