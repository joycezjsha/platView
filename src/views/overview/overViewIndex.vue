<template>
  <div class="container">
    <!--头部-->
    <top></top>
    <l-table></l-table>
    <table-info></table-info>
    <statics></statics>
    <map-view></map-view>
      <!--内容区-->
    <!-- <section class="content-container">
      <div class="grid-content bg-purple-light">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </section> -->
  </div>
</template>
<script>
  import top from './header'
  import lTable from './overview_left'
  import table_info from './overview_right'
  import statics from './overview_statics'
  import mapView from './overview_map'
  export default {
    name: 'home',
    data () {
      return {
        loading: false
      }
    },
    mounted(){
      this.$store.commit("setRight", '25.88vw');
    },
    components:{top,lTable,tableInfo:table_info,statics,mapView}
  }
</script>
<style scoped="true" lang='scss'>
  .version{position: fixed;bottom: 2%;left:2%;    z-index: 3;}
  .container{
    position:fixed;
    top:0;
    left:0;
  }
  // .content-container{
  //   position: absolute;
  //   top: 0;
  //   width:100%;
  //   height:100%;
  //   .grid-content{
  //   width:100%;
  //   height:100%;
  //   }
  // }

</style>
