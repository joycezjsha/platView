<template>
    <div>
        <template v-for="value in this.menuData">
            <el-submenu :index="value.path" v-if="value.node" :key="value.id" :route="value.path">
              <template slot="title">{{value.menu_name}}</template>
              <MenuTree :menuData="value.node"></MenuTree>
            </el-submenu>
            <el-menu-item :index="value.path" :key="value.id" :route="value.path" v-else>{{value.menu_name}}</el-menu-item>
        </template>
    </div>
</template>

<script>
  export default {
    props: ['menuData'],
    name: 'MenuTree'
  }
</script>