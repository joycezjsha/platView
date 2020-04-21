<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo">
        <a>
          <img src="../../assets/images/logo.png" style="padding-left:8px;    width: 40px;" />
        </a>
        <a style="color: #fff;margin-left:3%;font-size:1.1vw;">
          <span>陕西交警总队集成指挥平台地图大数据</span>
        </a>
      </div>
      <div class="topbar-bar">
        <el-menu
        :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"   
          width="5vh"
          :router="true"
        >
          <MenuTree :menuData="this.menuData"></MenuTree>
        </el-menu>
      </div>
      <div class="topbar-account topbar-btn">
        <div class="top_div">
          <div class="iconfont">
            <!-- <img :src="userIcon" /> -->
            <i class='el-icon-user-solid' style="color:white;"></i>
          </div>
        </div>
        <el-dropdown class="top_div">
          <span class="el-dropdown-link">
            {{nickname}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>账号管理</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import menuTree from "./menuTree";
import "element-ui/lib/theme-chalk/display.css";
import { road } from "../../road.js";

export default {
  data() {
    return {
      loading: false,
      isCollapse: true,
      companyName: "",
      nickname: "admin",
      activeIndex: "1",
      homeMenu: false,
      messageCount: 5,
      userIcon: "./static/images/login/user.png",
      menuData: [
        {
          id: '1',
          parent_id: '0',
          menu_name: "警情检测",
          sorting: 0,
          path:'/accident/monitor'
        },
        {
          id: '2',
          parent_id: '0',
          menu_name: "交通检测",
          sorting: '0',
          node: [
            {
              id: '2-1',
              parent_id: '2',
              menu_name: "交通拥堵",
              sorting: 0,
              path:'/main/traffic-index'
            },
            {
              id: '2-2',
              parent_id: '2',
              menu_name: "诱导简图",
              sorting: '0',
              path:'/'
            },
            {
              id: '2-3',
              parent_id: '2',
              menu_name: "交通巡航",
              sorting: 0,
              path:'/main/cruise'
            }
          ]
        },
        {
          id: '3',
          parent_id: '0',
          menu_name: "车辆监测",
          sorting: '0',
          node: [
            {
              id: 3-1,
              parent_id: 3,
              menu_name: "车辆流动",
              sorting: 0,
              path:'/main/car-flow'
            },
            {
              id: '3-2',
              parent_id: '3',
              menu_name: "重点车辆",
              sorting: 0,
              path:'/main/vehicle-population'
            }
          ]
        },
        {
          id: '4',
          parent_id: 0,
          menu_name: "设备管理",
          sorting: 0,
          path:'/main/cruise',
          node: [
            {
              id: '4-1',
              parent_id: '4',
              menu_name: "设备总览",
              sorting: 0,
              path:'/main/vehicle-population'
            },
            {
              id: '4-2',
              parent_id: 4,
              menu_name: "电警",
              sorting: 0,
              path:'/main/accident-distribution'
            },
            {
              id: '4-3',
              parent_id: 4,
              menu_name: "卡口",
              sorting: 0,
              path:'/main/accident-distribution'
            }
          ]
        },
        {
          id: '5',
          parent_id: 0,
          menu_name: "专题分析",
          sorting: 0,
          node: [
            {
              id: '5-1',
              parent_id: '5',
              menu_name: "车辆保有量",
              sorting: 0,
              path:'/main/vehicle-population'
            },
            {
              id: '5-2',
              parent_id: 5,
              menu_name: "违法分析",
              sorting: 0,
              path:'/main/accident-distribution'
            },
            {
              id: '5-3',
              parent_id: 5,
              menu_name: "事故分析",
              sorting: 0,
              path:'/main/accident-distribution'
            }
          ]
        },
      ]
    };
  },
  components: {
    MenuTree: menuTree
  },
  created() {
    // 组件创建完后获取数据
    this.fetchNavData();
  },
  methods: {
    jumpTo(url) {
      this.$router.push(url); //用go刷新
    },
    handleSelect(index) {
      // this.defaultActiveIndex = index;
      // this.activeIndex=index;
    },
    fetchNavData() {
      // 初始化菜单激活项
      let cur_path = this.$route.path; //获取当前路由
      let routers = this.$router.options.routes; // 获取路由对象
      let nav_type = "",
        nav_name = "";
      for (var i = 0; i < routers.length; i++) {
        let children = routers[i].children;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              nav_type = routers[i].type;
              nav_name = routers[i].name;
              break;
            }
            // 如果该菜单下还有子菜单
            if (children[j].children) {
              let grandChildren = children[j].children;
              for (let z = 0; z < grandChildren.length; z++) {
                if (grandChildren[z].path === cur_path) {
                  nav_type = routers[i].type;
                  nav_name = routers[i].name;
                  break;
                }
              }
            }
          }
        }
      }
      this.$store.state.topNavState = nav_type;
      this.$store.state.leftNavState = nav_name;
      if (nav_type == "home") {
        this.defaultActiveIndex = "/";
      } else {
        this.defaultActiveIndex = "/" + nav_name + "Manager";
      }
    },
    handleClick(){
 console.log('确认退出')
    },
    logout() {
      //logout
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("access-user");
          this.$router.push('/login');
        })
        .catch(() => {});
      //        this.$confirm('确认退出吗?', '提示', {
      //          confirmButtonClass: 'el-button--warning'
      //        }).then(() => {
      //          //确认
      //          localStorage.removeItem('access-user');
      //          road.$emit('goto', '/login');
      //        }).catch(() => {});
    }
  },
  mounted() {
    let user = window.localStorage.getItem("access-user");
    if (user) {
      user = JSON.parse(user);
      this.nickname = user.nickname || "";
      this.companyName = user.companyName || "";
    }
  },
  watch: {
    $route: function(to, from) {
      // 路由改变时执行
      //console.info("to.path:" + to.path);
      this.fetchNavData();
    }
  }
};
</script>
<style scoped lang="scss">
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.container {
  width: 100%;
  height: 6vh;
  background: #000;
  padding: 0 1vw;
  .topbar-wrap {
    width: 100%;
    height: 100%;
    @include flex(row, center);
  }
  .topbar-logo {
    width: 25%;
    @include flex(row, center);
    justify-content: left;
  }
  .topbar-bar {
    width: 70%;
    @include flex(row, center);
    justify-content: left;
  }
  .topbar-account {
    width: 6vw;
    line-height: 4vh;
    @include flex(row, center);
    background: #3a3c4c;
    img{
          width: 1vw;
    margin-top: 25%;
    }
    .top_div:nth-child(2){
      color: white;
    margin-left: 5%;
    }
  }
}
</style>