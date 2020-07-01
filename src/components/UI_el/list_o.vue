<template>
  <div class='list'>
    <div class='list_item' v-for='(item,i) in list' :key='i' :class="i<(list.length-1)?'borderCls':''">
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
  width:10vw;
  height:auto;
  position:absolute;
  max-height: 150px;
  overflow: auto; 
  .list_item{
    width:100%;
    height:2vh;
    padding: 1vh 0;
    font-size: 0.7vw;
    @include flex(row, start,start);
  }
  .borderCls{
    // border-bottom: 1px solid $color-primary;
  }
  .img,.label,.value{
     @include flex(column, center,center);
  }
  .label{
    max-width:70%;
    padding:0 5px;
    @include flex(column, start,start);
  }
  .value{
    width:30%;
  }
}
</style>