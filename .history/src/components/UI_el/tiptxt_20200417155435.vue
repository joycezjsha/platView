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
.tab{
  width:100%;
  height:5vh;
  border:1px solid $color-border-1;
  background: $color-primary;
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