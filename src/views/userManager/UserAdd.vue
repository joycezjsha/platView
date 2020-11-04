<template>
  <div id="user-add">
    <div class="add-top">
      <div class="title user-add-title">
        <span>用户管理</span>
        <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
        <span v-text="$route.query.title"></span>
      </div>
      
    </div>
    <div class="add-item">
      <el-form :label-position="labelPosition" label-width="10%" :model="userForm" ref="userForm" :rules="rules">
          <el-form-item label="用户名：" prop="username">
            <el-input v-model="userForm.username" style="width:50%" size="small" @change="checkUserDuplicate"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input v-model="userForm.password" style="width:50%" size="small"></el-input>
          </el-form-item>
          <!--<el-form-item label="所在单位：" v-if="!isOrgzShow">-->
            <!--<el-input v-model="userForm.office" style="width:50%" size="small">></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model="userForm.phone" style="width:50%" size="small">></el-input>
          </el-form-item>
        </el-form>
        <div class="data-save-btn">
          <el-button type="primary" @click="saveUser" :loading="saving">保存</el-button>
          <el-button type="primary" @click="returnManage">返回</el-button>
        </div>
      </div>
  </div>
</template>

<script>
  import {config} from './config.js'
  import {permission} from './config.js'
  import {Validator} from './validator.js'
  import utils from '../js/utils.js'
  import {mapGetters} from "vuex";
  import qs from 'qs';
  import mTitle from "@/components/UI_el/title_com.vue";

  export default {
    name: "user-add",
    data() {
      return {
        labelPosition: 'right',
        userId: sessionStorage.getItem("userId"),
        token: sessionStorage.getItem("token"),
        userForm: {
          username: '',
          password: '',
          role: '',
          office: '',
          dept: '',
          phone: '',
          deptid: '',
          deptname: '',
          flag: 1, //区分运维和普通用户
          permission:[]
        },

        rules: {
          username:[
            {required: true, message: '请输入用户名',trigger: 'blur'},
            { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
          ],
          password:[
            {required: true, message: '请输入密码',trigger: 'blur'},
            { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' },
            {required: true, message: '密码长度为8-20个字符，须包含字母和数字、特殊字符（-@&=.#$%*!~?）',trigger: 'blur',validator: this.validatePsw}
            ],
        },
        roleList:[],
//        [{id: "2",
//          name: "运维管理员"},{id: "1",
//          name: "普通用户"}],
        orgnzationList: [],
        //状态的判断
        checkedRightsAll: {
          operRights: false,
          serRights: false,
          layerRights: false
        },
        rightsData: {
          operRights: {},
          serRights: {},
          layerRights: {}
        },
        isShowOrgTree:false,
        selectService:[],//默认选中服务
        selectMenu:[],//默认选中菜单
        selectLayer:[],//默认选中图层
        saving:false,
        isDuplicate:false,
        isStrictly:true,
        eliminatePermission:['权限管理','用户管理','组织管理','日志管理','服务管理','服务注册','服务统计','服务监控','访问日志','操作日志'],
        isDisable:false
      }
    },
    mounted() {
      this.initRoleList();
      this.initOrgList();
      this.initData();
    },
    computed: {
      isOrgzShow: function () {
        return this.userForm.role =='普通用户' ? true : false;
      },
      ...mapGetters(["getServicePerssion", "getMenuListListPerssion", "getlayerPermission"])
    },
    methods: {
      initDataTT(menu,ser,layer) {
        //初始化deptForm
        let role=this.userForm.role;
        if(role=='运维管理员'){
          this.rightsData.operRights=permission.getMenuListListPerssion(menu);
          this.isDisable=false;
        }else{
          this.rightsData.operRights=permission.getMenuListListPerssion(menu,this.eliminatePermission);
          this.isDisable=true;
        }
        //服务权限
        this.rightsData.serRights = permission.getServicePerssion(ser);
//        this.rightsData.serRights=[{"childrenMenus":[],"createTime":null,"icon":"","id":21,"name":"地图引擎服务","parentid":0,"relationid":"","route":"","sort":"1","type":2,"children":[],"label":"地图引擎服务"},{"childrenMenus":[],"createTime":null,"icon":"","id":22,"name":"地图API接口服务","parentid":0,"relationid":"","route":"","sort":"2","type":2,"children":[],"label":"地图API接口服务"},{"childrenMenus":[],"createTime":null,"icon":"","id":23,"name":"空间查询服务","parentid":0,"relationid":"","route":"","sort":"3","type":2,"children":[],"label":"空间查询服务"},{"childrenMenus":[],"createTime":null,"icon":"","id":25,"name":"坐标转换服务","parentid":0,"relationid":"","route":"","sort":"5","type":2,"children":[],"label":"坐标转换服务"},{"childrenMenus":[],"createTime":null,"icon":"","id":24,"name":"路网分析服务","parentid":0,"relationid":"","route":"","sort":"4","type":2,"children":[],"label":"路网分析服务"},{"childrenMenus":[],"createTime":null,"icon":"","id":26,"name":"地址编码及逆地址编码服务","parentid":0,"relationid":"","route":"","sort":"6","type":2,"children":[],"label":"地址编码及逆地址编码服务"},{"childrenMenus":[],"createTime":null,"icon":"","id":27,"name":"智能提示","parentid":0,"relationid":"","route":"","sort":"7","type":2,"children":[],"label":"智能提示"}]
        //图层数据权限
        this.rightsData.layerRights = permission.getlayerPermission(layer);
      },
      initData() {
        //数据回填
        if (this.$route.query.row) {
          this.userForm.username = this.$route.query.row.username;
          this.userForm.deptid = this.$route.query.row.deptid;
          this.userForm.deptname=this.$route.query.row.deptname;

          this.userForm.phone = this.$route.query.row.phone;
          this.userForm.password = utils.Base64.decode(this.$route.query.row.password);
          this.userForm.dept = this.$route.query.row.dept;
          this.userForm.flag ='2';//this.$route.query.row.type;
          this.userForm.role=this.$route.query.row.role_name;//relationid;
          this.userForm.userid=this.$route.query.row.id==undefined?'':this.$route.query.row.id;
          if(this.userForm.deptid && this.userForm.deptid!=''){
            this.getPermission(this.userForm.deptid);
          }else{
            this.initDataTT();
          };
          if(this.userForm.userid!=''){
              let _this=this;
              setTimeout(function(){
            _this.getPermissionByUserid(_this.userForm.userid);
          },200)}
        }
      },
      getSelectPermission(){
          let parentIds=[],selectIds=[];
        let menu=this.$refs.operRights.getCheckedNodes();
        let layer=this.$refs.layerRights.getCheckedNodes();
        let ser=this.$refs.serRights.getCheckedNodes();
        let selectNodes=menu.concat(layer).concat(ser);
        selectNodes.map(function(e){
          if(e.parentid!=0 && e.parentid!='' && e.parentid!=undefined && !e.disabled){
            parentIds.push(e.parentid);
          }
          if(!e.disabled) selectIds.push(e.id);
        });
//        if(flag) {this.selectMenu=selectIds;this.$refs.operRights.setCheckedKeys(this.selectMenu);}
        return utils.MergeArray(selectIds,parentIds);
      },
      //用户信息或修改保存
      saveUser() {
        let _this = this;
        _this.saving = true;
        //用户数据校验
        if(_this.userForm.userid!=''){
          _this.isDuplicate=true;
        };
        if (_this.checkUserInfo()) {
          _this.$message({type: 'warning', message: _this.checkUserInfo()});
          _this.saving = false;
          return;
        };
        _this.userForm.permission=_this.getSelectPermission();
        let data= {
            fullname: '',
            username:_this.userForm.username,
            password: utils.Base64.encode(_this.userForm.password),
            phone: _this.userForm.phone,
            deptid: _this.userForm.deptid,
            deptname:_this.userForm.deptname,
            type: _this.userForm.role=='普通用户'?'3':'2',
            flag: _this.userForm.flag,
            phone:_this.userForm.phone,
            relationid:_this.userForm.role,

//            createtime:new Date().getTime(),
            id: _this.userForm.userid,
            token:sessionStorage.getItem("token")
        };
//        this.$refs.userForm.validate(
//          (valid) => {
//            if (valid) {
              config.USER_INFO_NEW_PATH(data).then((response) => {
                if (response.status == 200) {
                  if(response.data.errcode==0){
                    _this.savePermission(response.data.data);
                    _this.addLog(_this.userForm.userid);
                  }else{
                    _this.$message({type: 'error', message: '保存失败!'});
                    _this.saving = false;
                  }
                }})
//            }else{
//                alert('ss');
//            }
//          });
 },
      checkUserDuplicate(){
          let _this=this;
//          _this.$axios.get(config.VERIFICATION_USER,{params:{userName:_this.userForm.username}}).then(response => {
              config.VERIFICATION_USER({userName:_this.userForm.username}).then((response) => {
            if(response.status == 200){
              let data = response.data;
              if(data.errcode != 0){
                _this.$message({type: 'warning', message: '用户名重复，请修改'});
                _this.isDuplicate=false;
              }else{
                _this.isDuplicate=true;
              }
            }
          });
      },
      //用户信息校验
      checkUserInfo() {
        //创建校验类
        let validator = new Validator();
//        validator.add(this.userForm.userid, 'isNonEmpty', '用户名不能为空')
        validator.add(this.userForm.username, 'isNonEmpty', '用户名不能为空')
          .add(this.userForm.password, 'isNonEmpty', '密码不能为空')
          .add(this.isDuplicate, 'isTrue', '用户名不能重复')
          .add(this.userForm.username,'checkChinese','用户名不能包含汉字')
          .add(this.userForm.password,'checkChinese','密码不能包含汉字')
          .add(this.userForm.username,'maxLength',20,'用户名字符数超过限制，请修改')
          .add(this.userForm.password,'maxLength',20,'密码字符数超过限制，请修改')
          .add(this.userForm.password,'isStrong','密码长度为8-20个字符，须包含字母和数字、特殊字符（-@&=.#$%*!~?）。')
          .add(this.userForm.role, 'isNonEmpty', '所属角色不能为空')
          .add(this.userForm.deptid, 'isNonEmpty', '所属组织不能为空')
          .add(this.userForm.deptname, 'isNonEmpty', '所在单位不能为空')
          .add(this.userForm.phone, 'isNonEmpty', '手机号码不能为空')
          .add(this.userForm.phone, 'isMobile', '手机号码格式不正确');
        let errorMsg = validator.start();
        return errorMsg;
      },
      validatePsw(rule, value, callback){
        if(!/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[_\-@&=.#$%*!~?><|])[a-zA-Z0-9_\-@&=.#$%*!~?><|]+$/.test(value)){
          callback(new Error('密码长度为8-20个字符，须包含字母和数字、特殊字符（-@&=.#$%*!~?）'));
        }
      },
      returnManage() {
        this.$router.push({path: '/main/user'})
      },
      initRoleList() {
        let _this = this;
//        this.$axios({
//          method: "get",
//          url: config.ROLE_LIST,
//          params: {}
//        }).then(response => {
//         config.ROLE_LIST({}).then((response) => {
//           if (response && response.status == 200) {
//             let datas= response.data.data.map(e=>{
//                 e.id=parseInt(e.id);return e;
//             });
//             _this.roleList=datas;
// //            console.log(response.data.data);
//           }
//         })
      },
      initOrgList() {  //获取组织树结构
        let _this = this;
//        _this.$axios.get( config.ORG_LIST,
//          {params:{}}).then(response => {
//         config.ORG_LIST({}).then((response) => {
//           if(response.status == 200){
//             let data = response.data;
//             if(data.errcode == 0){
//                 console.log(data);
// //              _this.orgnzationList = data.data;
//               data.data.map(function(e){
//                   e.label=e.name;
//                 _this.initTreeData(e);
//                   return e;
//               });
//               _this.orgnzationList=data.data;
// //              console.log(_this.orgnzationList);
//             }
//           }
//         });
      },
      initTreeData(data){
          let _this=this;
        if(data.children.length>0){
          data.children.map(function(e){
            _this.initTreeData(e);
          })
        };
        data.label=data.name;
        return data;
      },
      selectRole: function (value) {
          let _this=this;
//        this.userForm.role = value;
        let role='';
        this.roleList.forEach(function(e){
            if(e.id==value){
              role=e.name;
            }
        });
        this.userForm.role=role;
        if(role=='运维管理员'){
          this.userForm.deptname=this.orgnzationList[0].label;
          this.userForm.deptid=this.orgnzationList[0].id;
          this.isShowOrgTree=false;
          this.initDataTT();
        }else{
//          _this.selectMenu=[];
          this.userForm.deptid='';
          this.isShowOrgTree=true;
          this.userForm.deptname='';
          this.rightsData.operRights=permission.getMenuListListPerssion(this.rightsData.operRights,this.eliminatePermission);
//          this.getSelectPermission();
        }
      },
      selectOrg(value) {
        this.userForm.deptid = value;
      },
      operRightsChange(data, checked, indeterminate) {
          this.isStrictly=false;
        this.handleCheckChange("operRights");
      },
      serRightsChange(data, checked, indeterminate) {
        this.handleCheckChange("serRights");
      },
      layerRightsChange(data, checked, indeterminate) {
        this.handleCheckChange("layerRights");
      },
      handleCheckChange(sign) {
        let _this=this;
        let count = this.$refs[sign].getCheckedNodes();//叶子节点 且不包含半选
        let compareTh = 0;
        if (sign == "operRights") { //包含子菜单选择 特殊处理
          let func=function(data){
            if(data.childrenMenus && data.childrenMenus.length>0){
              data.childrenMenus.map(function(e){
                func(e);
              });
            };
            compareTh++;
          };
          _this.rightsData[sign].map(function(e){
            func(e);
          });
          if (count.length == compareTh) {
            _this.checkedRightsAll[sign] = true;
          } else {
            _this.checkedRightsAll[sign] = false;
          }
          return;
        };
        if (count.length == this.rightsData[sign].length) {
          this.checkedRightsAll[sign] = true;
        } else {
          this.checkedRightsAll[sign] = false;
        }
      },
      checkedAll(sign) {
        let nodes=[];
        let func=function(data){
          if(data.childrenMenus && data.childrenMenus.length>0){
            data.childrenMenus.map(function(e){
              func(e);
            });
          };
          nodes.push(data);
        };
        this.rightsData[sign].map(function(e){
          func(e);
        });
        if (this.checkedRightsAll[sign]) {
          this.$refs[sign].setCheckedNodes(nodes);
        } else {
          this.$refs[sign].setCheckedNodes([]);
        }
      },
      orgnzationChange(data, checked, indeterminate){
        this.$refs.orgnzationTree.setCheckedKeys([]);
        this.isShowOrgTree=false;
        this.userForm.deptname=data.label;
        this.userForm.deptid=data.id;
        this.getPermission(data.id);
      },
      setOrgnzation:function(value){
        if(this.userForm.role!='运维管理员'){
          this.isShowOrgTree=true;
        }
      },
      getPermission(id){
          let _this=this;
//        _this.$axios.get(config.GET_ORG_PERMISSION,
//          {params:{orgId:id}}).then(response => {
        config.GET_ORG_PERMISSION({orgId:id}).then((response) => {
          if(response.status == 200){
            let datas = response.data;
            if(datas.errcode == 0){
                console.log(data);
              let data = datas.data;
              _this.initDataTT(data.menuTree,data.serviceList,data.layerList);
            }
          }
        });
      },
      getPermissionByUserid(id){
        let _this=this;
        _this.selectMenu=[];
        _this.selectLayer=[];
        _this.selectService=[];
//        _this.$axios.get(config.GET_USER_PERMISSION,
//          {params:{userId:id}}).then(response => {
        config.GET_USER_PERMISSION({userId:id}).then((response) => {
          if(response.status == 200){
            let datas = response.data;
            if(datas.errcode == 0){
              console.log(data);
              let data = datas.data;
              if (data.menuTree && data.menuTree.length > 0) {
                data.menuTree.map(function(e){
                  _this.getPermissionIds(e,1);
                });
                _this.$refs.operRights.setCheckedKeys(_this.selectMenu);
              }
//                //to
              if (data.serviceList && data.serviceList.length > 0) {
                data.serviceList.map(function(e){
                  _this.getPermissionIds(e,2);
                });
                _this.$refs.serRights.setCheckedKeys(_this.selectService);
              }
//                //to
              if (data.layerList && data.layerList.length > 0) {
                data.layerList.map(function(e){
                  _this.getPermissionIds(e,3);
                });
                _this.$refs.layerRights.setCheckedKeys(_this.selectLayer);
              }
            }
          }
        });
      },
//      initOrgPermissionById() {
//        let _this = this;
//        let org_id=_this.userForm.deptid;
//        if((''+org_id)!='' && org_id!=undefined){
//          _this.$axios({
//            method: "get",
//            url: config.ORGS_RIGHT_PATH,
//            params: {orgId: org_id}
//          }).then(response => {
//            if (response.status == 200) {
//              let dataT = response.data.data;
//              if (dataT) {
////                let layerList = dataT.layerList;
////                let menuTree = dataT.menuTree;
////                let serviceList = dataT.serviceList;
//                _this.initDataTT(data.menuTree,data.serviceList,data.layerList);
//              }
//            }
//          }).catch(e => {
//          });
//        }
//      },
      getPermissionIds(data,type){
        let _this=this,ids=[];
        if(data.childrenMenus && data.childrenMenus.length>0){
          data.childrenMenus.map(function(e){
            _this.getPermissionIds(e,type);
          })
        };
        switch(type){
          case 1:_this.selectMenu.push(data.id);break;
          case 2:_this.selectService.push(data.id);break;
          case 3: _this.selectLayer.push(data.id);break;
          default:break;
        }

      },
      savePermission(id){
          let _this=this;
          id=id==''?_this.userForm.userid:id;
        config.SAVE_USER_PERMISSION({permissionList:_this.userForm.permission.toString(), userId: id}).then((response) => {
          if (response.status == 200) {
              if (response.data.errcode == 0) {
            _this.$message({type: 'success', message: '保存成功!'});
            _this.saving = false;
            _this.returnManage();
          }
          }}).catch(e => {
          _this.$message({type: 'error', message: '保存失败!'});
          _this.saving = false;
        });
//        $.ajax({
//          method: "post",
//          url: config.SAVE_USER_PERMISSION,
////          dataType : 'json',
////          headers: {
////            Accept: "application/json; charset=utf-8"
////          },
////          params:{token:sessionStorage.getItem("token")},
//          data: {
//            userId: id,
//            token:sessionStorage.getItem("token"),
//            permissionList:_this.userForm.permission.toString()
//          }
//        }).then(response => {
//
//          if (response.errcode == 0) {
//            _this.$message({type: 'success', message: '保存成功!'});
//            _this.saving = false;
//            _this.returnManage();
//          }
//        }).catch(e => {
//          _this.$message({type: 'error', message: '保存失败!'});
//          _this.saving = false;
//        });
      },
      addLog(id){
        if(id!=''){
          this.insertLog('修改用户数据',this.userForm.role+','+this.userForm.username);
        }else{
          this.insertLog('新增用户',this.userForm.role+','+this.userForm.username);
        }
      },
      insertLog(content,name){
        config.insertLog({userName:sessionStorage.getItem('fullname'),content:content+','+name}).then((res) => {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #user-add {
    position:absolute;
    height: 100%;
    width: 100%;
    padding:0 1.56vw;
    background: #0e2247;
  }

  /*.user-add-title {*/
    /*border-bottom: 1px solid #0e2247;*/
  /*}*/

  .add-top {
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #123a80;
    color:white;
  }
  .add-item{
    text-align: center;
  }
  .user-add-form {
    height: auto;
    width: 100%;
  }

  .user-add-form-inner {
    height: 50%;
    width: 100%;
  }
  .el-tree {
    width: 100%;
    height: 90%;
    /*background: #0e2247;*/
    color: #ffffff;
  }
  .data-save-btn{
    text-align: center;
  }
</style>
<style>
  #user-add  .el-input.is-disabled .el-input__inner{
    border:none;color:white;
  }
  #user-add .el-form-item__error {
    left:75px;
  }
  .el-form-item__label{
    color:#ddd;
  }
</style>
