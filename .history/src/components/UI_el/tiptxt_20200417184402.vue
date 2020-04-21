<template>
  <div class='tiptxt'>
    <span class='img'><img :src='icon' /></span>{{text}}
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
        default: './static/images/default/police.png'
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
    color: white;
    background: rgba(255,255,255,0.298039);
    height: 3vh;
    line-height: 3vh;
    margin: 2% 0;
    padding: 5px;
 .img{
    display: inline-block;
    width: 10%;
    text-align: center;
    vertical-align: middle;

 }
}
</style>