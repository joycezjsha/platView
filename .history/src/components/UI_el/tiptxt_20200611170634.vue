<template>
  <div class='tiptxt'>
    <div class='img'>
      <i :class='"iconfont "+icon' :style='icon_style' v-show='isShowIcon' />
    </div>
    <div class='txt'>{{text}}</div>
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
      default: false
    },
    icon: {
      type: String,
      default: 'icon-jingqing'
    },
    icon_style:{
      type: String,
      default: 'color:#A6AFCD;font-size:30px;height:30px;'
    },
    text: {
      type: String,
      default: '设备包括：电子警察、视频设备、ETC龙门架...'
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
.tiptxt{
    color: #A6AFCD;
    // background: rgba(255,255,255,0.298039);
    height: auto;
    line-height: 4vh;
    margin: 2% 0;
    padding: 5px;
    width: 98%;
 .img{
    display: inline-block;
    width: 10%;
    text-align: center;
    vertical-align: top;
 }
 .txt{
   display: inline-block;
   width: 85%;
   vertical-align: middle;
 }
}
</style>