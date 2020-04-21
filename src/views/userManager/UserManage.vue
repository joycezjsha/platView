<template>
  <div id="user-manage">
    <div class="user-manage-top">
      <div class="device-statics_title">
        <div>
          <i class="el-icon-collection-tag">用户管理</i>
        </div>
      </div>
      <!--<div id="user-save-btn">-->
        <!--<el-button type="primary" size="small" @click="newUser">新增</el-button>-->
        <!--<el-button type="primary" size="small" @click="downLoadTemplate">下载模板</el-button>-->
      <!--</div>-->
      <div class="newDataBtn">
        <el-button type="primary" size="small" @click="newUser"></el-button>
      </div>
    </div>
    <div id="user-table">
      <el-table :data="tableData" size="small" align="center" style="width: 100%;margin-top:1%;text-align: center;"
                v-loading="tableLoading" element-loading-text="加载中"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column label="序号" width="120" align="center">
          <template slot-scope="scope"><span>{{scope.$index+(indexItem.thisPage - 1) * searchParams.size + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="deptname" label="所在单位" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="btnFont" @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i>编辑</span>
            &nbsp;&nbsp;
            <span class="btnFont" type="danger" @click="handleDelete(scope.$index, scope.row)"><i
              class="el-icon-delete"></i>删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageDiv">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :background="pageBackground"
          :current-page="searchParams.page"
          :page-sizes="[10,20]"
          :page-size="searchParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {config} from './config.js'

  const ADPT_NEW = "新增";
  const ADPT_AUDIT = "编辑";
  export default {
    name: "user-manage",
    data() {
      return {
        token: sessionStorage.getItem("token"),
        userId: sessionStorage.getItem("userId"),
        tableLoading: false,
        tableData: [],
        count: 0,
        searchParams: {
          token: sessionStorage.getItem("token"),
          page: this.$store.state.page,
          size: 10,
        },
        pageBackground: true,
        indexItem: {
          thisPage: 1,
        },

      }
    },
    mounted() {
      this.handleUserCount();
      this.initOrganization();//初始化组织权限
    },
    methods: {
      handleEdit: function (index, row) {
        this.$store.state.user.id=row.id;
        this.$store.state.page=this.searchParams.page;
        this.$router.push({path: '/main/useradd', query: {row: row, title: ADPT_AUDIT}})
      },
      tableHeader: function ({row, rowIndex}) {
        return 'tableHeader'
      },
      handleSizeChange(pageSize) {
        this.searchParams.size = pageSize;
        this.searchParams.page = 1;
        this.handleUserCount();
        console.log(`每页 ${pageSize} 条`);
      },
      handleCurrentChange(page) {
        this.searchParams.page = page;
        this.handleUserCount();
        console.log(`当前页: ${page}`);
      },
      handleUserCount() {
        this.searchUser()
      },
      initOrganization() {

      },
      searchUser() {
        let _this = this;
//        _this.tableData=[];
//        _this.tableLoading=true;
        config.USER_INFO_PATH({token: this.token, userid: _this.userId,start:_this.searchParams.page,size:_this.searchParams.size}).then((response) => {
//          _this.tableLoading=false;
            if (response.status == 200) {
            if (response.data.errcode == 0) {
              let dataT = response.data.data.list;
              _this.count=response.data.data.total;
              _this.tableData=[];
              if (dataT && dataT.length > 0) {
                dataT.map(arr => {
                  if(arr.type==2){
                    arr.role_name='运维管理员';
                  }else{
                    arr.role_name='普通用户';
                  }
                  _this.tableData.push(arr);
                });
              }
            }
            }})
//        $.ajax({
//          type: 'POST',
//          dataType: "json",
//          async: false,
//          url: config.USER_INFO_PATH, //请求的action路径页面
//          data: {token: this.token, userid: _this.userId,start:_this.searchParams.page,size:_this.searchParams.size},
//          success: function (response) {
//            if (response.errcode == 0) {
//              let dataT = response.data.list;
//              _this.count=response.data.total;
//              if (dataT && dataT.length > 0) {
//                dataT.map(arr => {
//                    if(arr.type==2){
//                        arr.role_name='运维管理员';
//                    }else{
//                      arr.role_name='普通用户';
//                    }
//                  _this.tableData.push(arr);
//                });
//              }
//            }
//          },
//          error: function () {
//          }
//        });
      },
      newUser() {
        this.$store.state.user.id="";
        this.$store.state.page=this.searchParams.page;
        this.$router.push({path: '/main/useradd', query: {title: ADPT_NEW}})
      },
      handleDelete: function (index, row) {
        let _this = this;
        this.$confirm('此操作将永久用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteUser(row);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteUser(row) {
        let _this = this;
        config.USER_INFO_DELETE_PATH({userid: row.id}).then((data) => {
          if (data.status == 200) {
            let response=data.data;
            if (response.errcode == 0){
              _this.$message({
                type: 'success',
                message: '删除用户成功'
              });
              _this.searchUser();
              _this.insertLog(row.username);
            } else {
              _this.$message({
                type: 'error',
                message: '删除用户失败'
              });
            }
          }
        });
      },
      insertLog(name){
        config.insertLog({userName:sessionStorage.getItem('fullname'),content:'删除用户,'+name}).then((res) => {
        })
      }
    }
  }
</script>

<style scoped='true' lang='scss'>
@import "@/assets/css/color.scss";
  #user-manage {
    height: 100%;
    width: 100%;
    padding: 0 1.56vw;
    position:fixed;
    z-index:2;
    top:6vh;
    color:$color-white;
    background-color: $color-bg-3;
  }

  .user-manage-top {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #user-save-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
