<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <my-map ref="mapCtr"></my-map>
    <router-view/>
  </div>
</template>

<script>
  import 'babel-polyfill'
  import '@/assets/css/iconfont.css'
  export default {
    name: 'App'
  }
</script>


<style>
  html,body,#app {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0;
    font-family:'SourceHanSansCN-';
    font-size:0.8vw;
  }
</style>
