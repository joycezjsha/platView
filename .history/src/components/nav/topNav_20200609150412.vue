<template>
  <el-row class="top_nav_container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo">
        <a>
          <img src="../../assets/images/logo.png" class='topbar-logo--img' />
        </a>
        <a class='topbar-logo--title'>
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
      <div  class="topbar-time"><m-time></m-time></div>
      <el-divider direction="vertical" style='height:3em;'></el-divider>
      <div class="topbar-account topbar-btn">
        <div class="top_div">
          <div class="iconfont">
            <i class='el-icon-user-solid' style="color:white;"></i>
          </div>
        </div>
        <el-dropdown class="top_div">
          <span class="el-dropdown-link">
            {{nickname}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goUser">账号管理</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class='overview_tab' @click='gotoOverview'>总览</div>
    </el-col>
  </el-row>
</template>
<script>
import menuTree from "./menuTree";
import "element-ui/lib/theme-chalk/display.css";
import { road } from "../../road.js";
import time from '@/components/UI_el/time.vue'

export default {
  data() {
    return {
      loading: false,
      isCollapse: true,
      companyName: "",
      nickname: "admin",
      activeIndex: "",
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
              path:'/main/device-monitor'
            },
            {
              id: '4-2',
              parent_id: 4,
              menu_name: "电警",
              sorting: 0,
              path:'/main/electric-police'
            },
            {
              id: '4-3',
              parent_id: 4,
              menu_name: "卡口",
              sorting: 0,
              path:'/main/bayonet'
            },
            {
              id: '4-4',
              parent_id: 4,
              menu_name: "ETC龙门架",
              sorting: 0,
              path:'/main/etc'
            },
            {
              id: '4-5',
              parent_id: 4,
              menu_name: "区间测速",
              sorting: 0,
              path:'/main/measurement'
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
              path:'/main/vehicleownership'
            },
            {
              id: '5-2',
              parent_id: 5,
              menu_name: "违法分析",
              sorting: 0,
              path:'/main/illegal-distribution'
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
    MenuTree: menuTree,
    mTime:time
  },
  created() {
    // 获取当前路由
    this.fetchNavData();
  },
  methods: {
    jumpTo(url) {
      this.$router.push(url); //用go刷新
    },
    /**
     * 跳转到总览界面
     */
    gotoOverview(){
      this.$router.push('/overview');
    },
    handleSelect(index) {
    },
    fetchNavData() {
      let _this=this;
      // 初始化菜单激活项
      let cur_path = this.$route.path; //获取当前路由
      let routers = this.$router.options.routes; // 获取路由对象
      for (var i = 0; i < _this.menuData.length; i++) {
        if (_this.menuData[i].path === cur_path) {
          _this.activeIndex=''+_this.menuData[i].id;
          break;
        }
        let children =_this.menuData[i].node;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              _this.activeIndex=''+children[j].id;
              break;
            }
            // 如果该菜单下还有子菜单
            if (children[j].node) {
              let grandChildren = children[j].children;
              for (let z = 0; z < grandChildren.length; z++) {
                if (grandChildren[z].path === cur_path) {
                  _this.activeIndex=''+children[z].id;
                  break;
                }
              }
            }
          }
        }
      }
    },
    handleClick(){
    },
    logout() {
      //logout
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.sessionStorage.clear()
          // localStorage.removeItem("access-user");
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
    },
    goUser() {
      this.$router.push('/main/user');
      }
  },
  mounted() {
    let user = window.localStorage.getItem("access-user");
    if (user) {
      user = JSON.parse(user);
      this.nickname = user.nickname || "";
      this.companyName = user.companyName || "";
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/css/color.scss";
@mixin flex($direction: column, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
.top_nav_container {
  width: 100%;
  height: 77px;
  background: url('../../assets/images/top_title_bg.png') no-repeat;
  background-size:100% 100%;
  padding: 0 1vw;
  .topbar-wrap {
    width: 100%;
    height: 100%;
    @include flex(row, center);
  }
  .topbar-logo {
    width: 40%;
    @include flex(row, center);
    justify-content: left;
    &--title{
      color: #fff;margin-left:2%;font-size:28px;letter-spacing:3px;
    }
    &--img{
      padding-left:8px;padding-top:10%;width: 40px;
    }
  }
  .topbar-bar {
    width: 45%;
    @include flex(row, center);
    justify-content: left;
  }
  .topbar-time{
    width: 7%;
    margin-right: 2%;
    // border-right: 1px solid #ccc;
    @include flex(row, end);
    justify-content: right;
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
      font-size:18px;
    }
  }
  .overview_tab{
    width: 3vw;
    line-height: 4vh;
    color:$color-primary;
    cursor:pointer;
    text-align: center;
    font-size: 16px;
  }
 
}
</style>
<style>
 .top_nav_container .el-divider--vertical{
   height:3em;
 }
</style>