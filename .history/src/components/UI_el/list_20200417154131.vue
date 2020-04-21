<template>
  <div class='list'>
    <div class='list_item' v-for='(item,i) in list' :key='i'>
      <div class='color' :style="'background:'+item.color"></div>
      <div class='label'>{{item.label}}:</div>
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
  width:9vw;
  height:auto;
  position:absolute;
  .list_item{
    width:100%;
    height:3vh;
    margin:1vh 0;
    @include flex(row, start,start);
  }
  .img,.label,.value{
     @include flex(column, center,center);
  }
  .color{
    width: 20%;
    height: 2vh;
    border-radius: 4px;
  }
  .label{
    max-width:50%;
    padding:0 5px;
    @include flex(column, start,start);
  }
  .value{
    width:30%;
  }
}
</style>