<template>
  <div id="left-menu">
    <el-menu router :default-active="defaultActive" class="el-menu-vertical" @open="handleOpen" @close="handleClose">
      <el-submenu class="left-submenu" index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{mapMenu.name}}</span>
        </template>
        <el-menu-item :index="child.index" v-for="(child, index) in mapMenu.children" :route="child.route" :key="index">
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="left-submenu" index="2">
        <template slot="title">
          <i class="el-icon-picture"></i>
          <span>{{layerMenu.name}}</span>
        </template>
        <el-menu-item :index="child.index" v-for="(child, index) in layerMenu.children" :route="child.route" :key="index">
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="left-submenu" index="3">
        <template slot="title">
          <i class="el-icon-service"></i>
          <span>{{operateMenu.name}}</span>
        </template>
        <div v-for="(child, index) in operateMenu.children" :key="index">
          <div v-if="child.children">
            <el-submenu class="left-submenu2" :index="child.index">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{child.name}}</span>
              </template>
              <el-menu-item :index="child2.index" v-for="(child2, index2) in child.children" :route="child2.route" :key="index2">
                <span>{{child2.name}}</span>
              </el-menu-item>
            </el-submenu>
          </div>
          <div v-else>
            <el-menu-item :index="child.index" :route="child.route">
              <span>{{child.name}}</span>
            </el-menu-item>
          </div>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
    export default {
      name: "left-menu",
      data() {
        return {
          defaultActive: "1-1"
        }
      },
      props: ['mapMenu', 'layerMenu', 'operateMenu'],
      mounted(){
        this.getMenus()//获取菜单列表（自权限管理），返回数据仅包含权限部分，暂不使用
      },
      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        getMenus() {
          this.$axios.get(intConf.MENU_LIST,{params:{
            token: sessionStorage.getItem("token"),
            userId: sessionStorage.getItem("userId"),
            type: '1'
          }}).then(response => {
            console.log(response)
          }).catch(e => {
            console.error(e)
          })
        }
      }
    }
</script>

<style scoped>
  #left-menu {
    height:auto;
    width:100%;
    overflow-y:auto;
  }
  .el-menu-vertical {
    height:100%;
    width:99%;
    background-color: #4488ff;
  }
</style>
