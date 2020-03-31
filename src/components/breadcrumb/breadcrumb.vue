<template>
  <el-row  :gutter="10" id="breadcrumb" style="padding:0px;margin:0px;">
    <el-col :xs="12" :sm="12" :md="18" class="title" style="padding:0px;margin:0px;">
      <div class="grid-content bg-purple-light">
        <el-col :span="24" class="breadcrumb-container" style="padding:0px;margin:0px;">
          <el-breadcrumb separator=">" class="breadcrumb-inner" style="padding:0px;margin:0px;">
            <el-breadcrumb-item v-for="(item,index) in title" :key="item.path" v-if="item.name!==''" class="breadCls">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <el-breadcrumb separator=">" class="breadcrumb-inner">
            <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="item.path" v-if="item.name!==''" class="breadCls">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="6" >
      <div class="button">
        <slot name="button"></slot>
      </div>
    </el-col>
  </el-row>
</template>
<style>

</style>
<script>
  export default{
    name: "breadCrumb",
    data(){
      return {}
    },
    props:['title'],
    mounted(){
    }
  }
</script>
<style>
  #breadcrumb .el-breadcrumb{width: auto;
  float: left;}
  #breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover,.el-breadcrumb__item,.el-breadcrumb__inner{
    line-height: 5vh;
    color: white;
    font-size: 0.83vw;
  }
</style>
