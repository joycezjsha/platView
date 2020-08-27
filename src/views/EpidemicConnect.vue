<template>
  <div class="iframe">
    <div class='qjzx' @click='drawer=true'><el-button></el-button></div>
    <iframe id="example" :src="http" frameborder="no" border="0" name='name'></iframe>
    <el-dialog title="疫情-车辆监控" style='' :visible.sync="drawer" append-to-body class='epidemic'>
      <img :src='img' />
    </el-dialog>
  </div>

</template>

<script>
    export default {
        name: "example-connect",
        data(){
          return {
            http:urlConf.YQ_PATH,
            drawer:false,
            img:'./static/images/yq.jpg'
          }
        }
    }
</script>

<style scoped lang='scss'>
  .iframe {
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    left:0;
    .qjzx{
      position:absolute;
      right:1vw;
      top:2vh;
    }
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
<style lang='scss'>
.epidemic .el-dialog{
    width: 80%;
    height: 80%;
}
.epidemic .el-dialog__title{
  color:white;
}
.epidemic .el-dialog__body{
    width: 97%;
    height: 85%;
    padding-top: 10px;
    img{
      width:100%;
      height:100%;
    }
}
</style>
