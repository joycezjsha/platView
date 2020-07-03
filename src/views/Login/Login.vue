<template>
  <div class="page-login" style="'background:url(./image/login_bg.png) no-repeat'">
    <!-- <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div> -->
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-main" flex="dir:top main:center cross:center">
          <!-- logo -->

          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default"
              >
                <div class="page-login-header">
                  <img class="page-login-header--logo" src="./image/guohui.png" />
                  <div class="page-login-header--title">陕西交警总队集成指挥平台地图大数据</div>
                </div>

                <el-form-item prop="username">
                  <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                    <i slot="prepend" class="el-icon-user-solid"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="formLogin.password" placeholder="密码">
                    <i slot="prepend" class="el-icon-key"></i>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item prop="code">
                  <el-input type="text" v-model="formLogin.code" placeholder="验证码">
                    <template slot="append">
                      <img class="login-code" :src="captchaPath"  @click="getCaptcha" />
                    </template>
                  </el-input>
                </el-form-item>   -->
                <el-button size="default" :loading="loginLoading"  @click="submit" type="primary" class="button-login">登录</el-button>
              </el-form>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="快速选择用户" :visible.sync="dialogVisible" width="400px">
      <el-row :gutter="10" style="margin: -20px 0px -10px 0px;">
        <el-col v-for="(user, index) in users" :key="index" :span="8">
          <div class="page-login--quick-user" @click="handleUserBtnClick(user)">
            <d2-icon name="user-circle-o" />
            <span>{{user.name}}</span>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
</template>

<script>
import { getUUID } from './utils/index'
import {IMG,interf} from "./config.js";
import axios from 'axios'
export default {
  name: "login",
  data() {
    return {
      // 快速选择用户
      dialogVisible: false,
      // loadingInstance: "",
      users: [
        {
          name: "Admin",
          username: "admin",
          password: "admin"
        },
        {
          name: "Editor",
          username: "editor",
          password: "editor"
        },
        {
          name: "User1",
          username: "user1",
          password: "user1"
        }
      ],
      // 表单
      formLogin: {
        username: "admin",
        password: "",
        code: "",
        uuid:''

      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      },
      //验证码图片
      captchaPath:'',
      loginLoading:false
    };
  },
  components: {
  },
  mounted() {
    // 验证码初始化
  },
  created(){
    // this.getCaptcha();
  },
  methods: {
    // ...mapActions('d2admin/account', [
    //   'login'
    // ]),
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {

      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit() {
      let _this=this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
        //   interf.LOGIN_API({
        //        'username': this.formLogin.username,
        //        'password': this.formLogin.password,
        //       //  'uuid': this.formLogin.uuid,
        //       //  'captcha': this.formLogin.code
        //   },(res) => {
        //     let data=res.data;
        //     if(data.code==200){
        //       let user={
        //         nickname:_this.formLogin.username,
        //         companyName:''
        //       }
        //       window.localStorage.setItem("access-user",JSON.stringify(user));
        //       this.$router.replace(this.$route.query.redirect || "/");
        //     }else{
        //       this.$$alert.error("登录失败，账号或密码不正确");
        //     }
            
        //   },()=>{});
        // } else {
        //   // 登录表单校验失败
        //   this.$message.error("请求失败，请检查服务");
      _this.loginLoading=true;
      let data={
          'username': _this.formLogin.username,
          'password': _this.formLogin.password,
      }
      axios.post(interf.LOGIN_URL,data).then(res => {
        let data=res.data;
        _this.loginLoading=false;
        if(data.code==200){
          _this.$message({
            message: '登陆成功',
            type: 'success'
          });
          window.sessionStorage.setItem('token',data.data.token)
            _this.$router.push('/')
        }else{
          _this.$message({
            message: '登录失败，账号或密码不正确！',
            type: 'warn'
          });
        }
      })
      .catch(err => {
        this.$message({
            message: '请求服务失败！',
            type: 'error'
          });
        _this.loginLoading=false;
      })
        }
      });
    
    },
    /**
     * @description 获取验证码图片
     */
    // 获取验证码图片
    // getCaptcha () {
    //   let _this=this;
    //     this.formLogin.uuid = getUUID();
    //     this.captchaPath = config.interf.adornUrl(`/captcha.jpg?uuid=${this.formLogin.uuid}`);//this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
    // },
  }
};
</script>
<style scoped lang="scss">
$color-text-normal: #ccc;
$color-primary: "#eee";
$color-bg: #000;
$color-text-sub: "#000";
$color-text-main: "#ccc";
.page-login {
  $backgroundColor: #000;
  // ---
  background-color: $backgroundColor;
  background:url(../../../static/images/login_bg.png) no-repeat;
  background-size: 100% 100%;
  height: 100%;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
  // 层
  .page-login--layer {
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .page-login-header {
    text-align: center;
    margin-bottom: 3em;
    &--logo {
      width: 2vw;
      float: left;
    }
    &--title {
      font-size: 1.2vw;
      font-weight: 700;
      line-height: 4vh;
    }
  }
  // 登录表单
  .page-login--form {
    width: 28vw;
    margin: 0 auto;
    margin-top: 8%;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 75%;
      margin: 1.5vh 10% 1.5vh 15%;
      height: 3.5vh;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 0.5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #fff;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
<style >
.el-button{
  height:4vh;
  padding: 0.3vh 0;
} 
</style>