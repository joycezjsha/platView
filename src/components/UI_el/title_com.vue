<template>
  <div class='ui_title_com'>
    <div :style="'background-image:url('+img+');background-repeat: no-repeat;background-size: 100% 100%;padding: 0 15px 0 10px;height: 100%;'">{{label}}</div>
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
        default: '交通动态监测'
      },
      img_type:{
        type: String,
        default: '1'
      }
  },
  computed:{
    img:function () {
      // `this` 指向 vm 实例
      return this.img_type>0?'./static/images/ui_image/title_bg_checked.png':'./static/images/ui_image/title_bg_unchecked.png'
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
.ui_title_com{
  // width:9vw;
  color:white;
  text-align: center;
  font-size: 0.85vw;
  line-height: 4vh;
  height: 4vh;
}
</style>