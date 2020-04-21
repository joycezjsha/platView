<template>
  <div class='list'>
    <div class='list_item' v-for='(item,i) in list' :key='i'>
      <div class='color' :style="'background:'+item.color"></div>
      <div class='label'>{{item.label}}</div>
      <div class='value'>{{item.value}}</div>
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
    list:{
       type: Array,
       default:()=>{
         return [{color:'#ccc',label:'视频巡查',value:'1224'}]
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
.list{
  width:100%;
  height:auto;
  border:1px solid $color-border-1;
  background: $color-primary;
  .list_item{
    width:100%;
    height:3vh;
    margin:1vh 0;
    @include flex(row, center,center);
  }
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