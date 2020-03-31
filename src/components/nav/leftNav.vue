<template>
  <!--左侧导航-->
  <aside :class="{showSidebar:collapsed}">
    <!--展开折叠开关-->
    <div class="menu-toggle" @click.prevent="collapse">
      <i class="iconfont icon-outdent" v-show="!collapsed" title="收起"></i>
      <i class="iconfont icon-indent" v-show="collapsed" title="展开"></i>
    </div>
    <!--导航菜单-->
    <el-menu router :collapse="collapsed" ref="leftNavigation" :default-active="defaultActive" :default-openeds="defaultOpened" class="el-menu-vertical noselect" @open="handleOpen" @close="handleClose">
      <el-submenu class="left-submenu" index="1" v-show="mapMenu.children.length>0">
        <template slot="title">
          <i :class="mapMenu.icon"></i>
          <span  class="menu_title">{{mapMenu.name}}</span>
        </template>
        <el-menu-item :index="child.index" v-for="(child, index) in mapMenu.children" :route="child.route" :key="index">
          <i :class="child.icon"></i>
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="left-submenu" index="2" v-show="layerMenu.children.length>0">
        <template slot="title">
          <i :class="layerMenu.icon"></i>
          <span   class="menu_title">{{layerMenu.name}}</span>
        </template>
        <el-menu-item :index="child.index" v-for="(child, index) in layerMenu.children" :route="child.route" :key="index">
          <i :class="child.icon"></i>
          <span>{{child.name}}</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu class="left-submenu" index="3" v-show="operateMenu.children.length>0">
        <template slot="title">
          <i :class="operateMenu.icon"></i>
          <span class="menu_title">{{operateMenu.name}}</span>
        </template>
        <div v-for="(child, index) in operateMenu.children" :key="index">
          <div v-if="child.children">
            <el-submenu class="left-submenu2" :index="child.index">
              <template slot="title">
                <i :class="child.icon"></i>
                <span>{{child.name}}</span>
              </template>
              <el-menu-item :index="child2.index" v-for="(child2, index2) in child.children" :route="child2.route" :key="index2">
                <i :class="child2.icon"></i>
                <span>{{child2.name}}</span>
              </el-menu-item>
            </el-submenu>
          </div>
          <div v-else>
            <el-menu-item :index="child.index" :route="child.route">
              <i :class="child.icon"></i>
              <span>{{child.name}}</span>
            </el-menu-item>
          </div>
        </div>
      </el-submenu>
    </el-menu>
  </aside>
</template>
<script>
  import Log from '../../common/util.js';
  export default {
    name: 'leftNav',
    data () {
      return {
        loading: false,
        collapsed: this.$store.state.collapsed,
        defaultActive: '1-1',//this.$store.state.defaultActive,
        defaultOpened:[1,2,3],
        mapMenu: {
          index: "1",
          slot: "title",
          name: "",
          icon:'el-icon-map',
          children:[]
        },
        layerMenu: {
            index: "2",
            slot: "title",
            name: "图层管理",
            icon:'el-icon-layer',
            children: []
        },
        operateMenu: {
          index: "3",
          slot: "title",
          name: "运维管理",
          icon:'el-icon-operate',
          children: []
        },
//        mapMenu: {
//          index: "1",
//          slot: "title",
//          name: "地图服务",
//          icon:'el-icon-map-1',
//          children: [
//            {
//              index: "1-1",
//              name: "一张图",
//              route:{path: "/main/map"},
//              icon:'el-icon-map-1'
//            },
//            {
//              index: "1-2",
//              name: "案例集锦",
//              route:{path: "/main/case"},
//              icon:'el-icon-map-2'
//            },
//            {
//              index: "1-3",
//              name: "示例中心",
//              route:{path: "/main/example"},
//              icon:'el-icon-map-3'
//            },
//            {
//              index: "1-4",
//              name: "可视化教程",
//              route:{path: "/main/visual"},
//              icon:'el-icon-map-4'
//            },
//          ]
//        },
//        layerMenu: {
//          index: "2",
//          slot: "title",
//          name: "图层管理",
//          icon:'el-icon-layer-1',
//          children: [
//            {
//              index: "2-1",
//              name: "图层管理",
//              icon:'el-icon-layer-1',
//              route:{path: "/main/layer"}
//            },
//            {
//              index: "2-2",
//              icon:'el-icon-layer-2',
//              name: "数据管理",
//              route:{path: "/main/data"}
//            },
//          ]
//        },
//        operateMenu: {
//          index: "3",
//          slot: "title",
//          name: "运维管理",
//          icon:'el-icon-operate-1',
//          children: [
//            {
//              index: "3-1",
//              name: "权限管理",
//              icon:'el-icon-operate-1',
//              children: [
//                {
//                  index: "3-1-1",
//                  name: "组织管理",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/dept"}
//                },
//                {
//                  index: "3-1-2",
//                  name: "用户管理",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/user"}
//                }
//              ],
//            },
//            {
//              index: "3-2",
//              name: "服务管理",
//              icon:'el-icon-operate-2',
//              children: [
//                {
//                  index: "3-2-1",
//                  name: "服务注册",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/data"}
//                },
//                {
//                  index: "3-2-2",
//                  name: "服务监控",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/data"}
//                },
//                {
//                  ind: "3-2-3",
//                  name: "服务统计",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/data"}
//                }
//              ],
//            },
//            {
//              index: "3-3",
//              name: "日志管理",
//              icon:'el-icon-operate-3',
//              children: [
//                {
//                  index: "3-3-1",
//                  name: "访问日志",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/layer"}
//                },
//                {
//                  index: "3-3-2",
//                  name: "操作日志",
//                  icon:'el-icon-operate-',
//                  route: {path: "/main/layer"}
//                }
//              ],
//            },
//            {
//              index: "3-4",
//              icon:'el-icon-operate-4',
//              name: "个人中心",
//              route: {path: "/main/data"}
//            }
//          ]
//        }
      }
    },
    created(){
        this.initMenu();
      this.defaultLeftNavOpened();
      if (sessionStorage.getItem('row') && sessionStorage.getItem('row')!='' && this.$route.query.row){
        this.$route.query.row= JSON.parse(sessionStorage.getItem('row'));
      }
//      this.$router.push('/')//设置路由默认地址
//      if ('/' != this.$route.path) {//若页面加载时非初始地址 则跳转至初始地址（主要作用是若复制当前路由链接跳转至新窗口或另一个浏览器时候发挥作用）
//        this.$router.push('/');
//      }
    },
    methods: {
      //折叠导航栏
      collapse: function () {
          let that=this;
        this.collapsed = !this.collapsed;
        this.$store.state.collapsed = this.collapsed;
        setTimeout(function(){
            if(that.$store.state.map!='' && that.$store.state.map)
                that.$store.state.map.resize();}
                ,350);
        console.log('aaaa');
        if(this.collapsed){
            if(document.getElementsByClassName('home_container').length>0){
              document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('title')[0].style.left='60px';
              document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('layer-list')[0].style.left='70px';
              document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('layer-search-div')[0].style.left='16vw';
              document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('el-scrollbar')[0].style.left='60px';
              document.getElementsByClassName('minemap-ctrl-bottom-left')[0].style.left='60px';
            }
          document.getElementsByClassName('version')[0].style.display='none';
        }else{
          if(document.getElementsByClassName('home_container').length>0){
            document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('title')[0].style.left='12.5vw';
            document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('layer-list')[0].style.left='13vw';
            document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('layer-search-div')[0].style.left='25%';
            document.getElementsByClassName('home_container')[0].getElementsByClassName('content-container')[0].getElementsByClassName('el-scrollbar')[0].style.left='25%';
            document.getElementsByClassName('minemap-ctrl-bottom-left')[0].style.left='13%';
          }
          document.getElementsByClassName('version')[0].style.display='block';
        }
      },
//       左侧导航栏根据当前路径默认打开子菜单（如果当前是二级菜单，则父级子菜单默认打开）
      defaultLeftNavOpened () {
          let _this=this;
          this.defaultActive=sessionStorage.getItem('defaultIndex');
        let cur_path = this.$route.path;
        //获取当前路由
//        let routers = this.$router.options.routes; // 获取路由对象
//        let subMenuIndex = '', needOpenSubmenu = false;
//        for (let i = 0; i < routers.length; i++) {
//          let children = routers[i].children;
//          if(children){
//            for (let j = 0; j < children.length; j++) {
//              if(children[j].path === cur_path) {
//
//                break;
//              }
//              // 如果该菜单下还有子菜单
//              if(children[j].children && !children[j].leaf) {
//                let grandChildren = children[j].children;
//                for(let z=0; z<grandChildren.length; z++) {
//                  if(grandChildren[z].path === cur_path) {
//                    subMenuIndex = j;
//                    needOpenSubmenu = true;
//                    break;
//                  }
//                }
//              }
//            }
//          }
//        }
//        if(this.$refs['leftNavigation'] && needOpenSubmenu) {
//          this.$refs['leftNavigation'].open(subMenuIndex); // 打开子菜单
//        }
        let getOpenMenuIndex=function(path,menu,layer,service){
          // let menu=JSON.parse(sessionStorage.getItem('menuList')),
          //   permission=JSON.parse(sessionStorage.getItem('layerPermission')),
          //   service=JSON.parse(sessionStorage.getItem('layerPermission'));
          getSelectMenuIndex(menu,path);
          getSelectMenuIndex(layer,path);
          getSelectMenuIndex(service,path);
        };
        let stop=false;
        function getSelectMenuIndex(data,path){
          if(stop) return true;
          if(data.children && data.children.length>0){
            data.children.map(function(e){
              getSelectMenuIndex(e,path);
            })
          };
          if(data.route && path==data.route.path){
            stop=true;
            _this.defaultActive=data.index;
            return stop;
          }
        };
        if(_this.defaultActive==sessionStorage.getItem('defaultIndex') && !stop){
          if(this.$route.meta.index && this.$route.meta.index!='') cur_path=this.$route.meta.index;
        }
        getOpenMenuIndex(cur_path,this.mapMenu,this.layerMenu,this.operateMenu);//this.$store.state.defaultActive=
      },
      handleOpen(key, keyPath) {
//          console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
//          console.log(key, keyPath);
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
        },
      initMenu(){
        let that=this;
        let menu=JSON.parse(sessionStorage.getItem('menuList'));
        menu.forEach(function(e,i){
          if(e.sort=='1'){
            that.mapMenu.name=e.name;
            if( e.childrenMenus.length>0){
              e.childrenMenus.forEach(function(item,f){
                let count=f+1;
                that.mapMenu.children.push(
                  {
                    index: "1-"+count,
                    name: item.name,
                    route:{path: item.route},
                    icon:'el-icon-map-'+count
                  })
              })
            }
          }else if(e.sort=="2"){
            that.layerMenu.name=e.name;
            if( e.childrenMenus.length>0){
              e.childrenMenus.forEach(function(item,f){
                let count=f+1;
                that.layerMenu.children.push(
                  {
                    index: "2-"+count,
                    name: item.name,
                    route:{path: item.route},
                    icon:'el-icon-layer-'+count
                  })
              })
            }
          }else if(e.sort=="3"){
            that.operateMenu.name=e.name;
            if( e.childrenMenus.length>0){
              e.childrenMenus.forEach(function(item,s){
                let count=s+1;
                let itr={
                  index: "3-"+count,
                  name: item.name,
                  route:{path: item.route},
                  icon:'el-icon-operate-'+count
                }

                if(item.childrenMenus.length>0){
                  itr.children=[];
                  item.childrenMenus.forEach(function(cell,f){
                    let thirds=f+1;
                    itr.children.push(
                      {
                        index: "3-"+count+"-"+thirds,
                        name:cell.name ,
                        icon:'el-icon-operate-',
                        route: {path: cell.route}
                      })
                  })
                }
                that.operateMenu.children.push(
                  itr
                );
              });
            }
          }

        })
      },
    },
    watch: {
      '$route': function(to, from){ // 路由改变时执行
        //console.info("to.path:" + to.path);
        sessionStorage.setItem('defaultIndex',this.defaultActive);
        this.defaultLeftNavOpened();
        if(to.name!=from.name){
            this.$store.state.page=1;
          sessionStorage.setItem('row','');
        }else{
          if(to.query.row && to.query.row!=''){
            sessionStorage.setItem('row',JSON.stringify(to.query.row));
          }
        };
//        Log.insertLog({
//          userName:sessionStorage.getItem('fullname'),
//          serviceId:1
//        }).then((response) => {
//          if (response.status == 200) {
//          }
//        })
      }
    }
  }
</script>
<style>
  .menu_t{
    border-bottom: 1px solid rgba(14, 34, 71, 0.86);
    padding-bottom: 12px;
    border-radius: 2px;
  }
  .menu_title{font-size: 0.93vw;}
</style>
