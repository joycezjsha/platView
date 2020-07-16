<template>
  <div id="iframe">
    <iframe id="example" :src="http" frameborder="no" border="0" name='name'></iframe>
  </div>
</template>

<script>
    export default {
        name: "example-connect",
        data(){
          return {
            http:urlConf.YQ_PATH
          }
        }
    }
</script>

<style scoped>
  .iframe {
    width:100%;
    height:100%;
  }
  #example {
    width:100%;
    height:100%;
  }
  .active-menu, .active-menu i {
    background-color: #1B1B1B !important;
    color: #F09B22 !important;
}
.active-menu i{color: #F09B22 !important;}
.arrow {
    float: right;
    margin-top: 8px;
}
</style>
