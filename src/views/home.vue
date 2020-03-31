<template>
  <div class="container">
    <!--头部-->
    <top></top>
      <!--内容区-->
    <section class="content-container">
      <div class="grid-content bg-purple-light">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </section>
  </div>
</template>
<script>
  import {road} from '../road.js'
  import top from '@/components/nav/topNav'
  export default {
    name: 'home',
    data () {
      return {
        loading: false
      }
    },
    mounted(){
      road.$emit('setNickName',sessionStorage.getItem('fullname'));
    },
    components:{top}
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
