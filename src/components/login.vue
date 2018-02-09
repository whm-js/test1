<template>
  <div class="login">

    <div class="logo"></div>

    <div class="row">
      <div style="width:80%;margin:0px auto;border-bottom: 1px solid #ccc;">
        <div style="float:left;width:40px;height:35px;padding-top:5px;">
          <img class='tipImage' src="../assets/username.png" style="" />
        </div>
        <mt-field placeholder="请输入账号" type="username" v-model="username"></mt-field>
      </div>
    </div>

    <div class="row">
      <div style="width:80%;margin:0px auto;border-bottom: 1px solid #ccc;">
        <div style="float:left;width:40px;height:35px;padding-top:3px;">
          <img class='tipImage' src="../assets/password.png" style="" />
        </div>
        <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
      </div>
    </div>

    <div class="row" style="width: 100%;padding-top: 5%">
      <mt-button style="width:80%;height:50px;line-height:50px;background:#38ACD3;" type="primary" v-on:click="login">登录</mt-button>
    </div>

  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import store from "@/store/store";
import { mapState, mapMutations, mapGetters } from "vuex";
// import { userLogin,getUserInfo } from "@/service/getData";
export default {
  name: "Vue",
  data() {
    return {
      islogin: 0, //是否能请求登录接口（认证通过）
      username: "",
      password: ""
    };
  },
  store,
  components: {},
  created() {},
  methods: {
    login: function() {
      var self = this;
      var params = {
        username: this.username,
        password: this.Base64.encode(this.password)
      };
      this.validateLogin(params);
      if (!this.islogin) {
        return;
      }

      // fetch("http://101.37.24.216:3003/login", {
      //   method: "POST",
      //   mode: "cors",
      //   cache: "default",
      //   headers: {
      //     Accept: "application/json",
      //     // 'Access-Control-Allow-Origin': '*',
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   body: `username=${this.username}&password=${this.Base64.encode(this.password)}`
      // }).then(res => {
      //   console.log(res.json());
      // });

      // userLogin(this.username,this.Base64.encode(this.password)).then(res=>{
      //   console.log(res)
      // })

      this.$httpPost('login', params, function(err, data) {
        if (err) {
          return
        }
        //只有学员才能登陆
        switch (data.data.code) {
          case 0:
            self.setGuid(data.data.guid)
            self.setLocalStorageValue('userinfo', data.data);
            self.$store.commit('updataguid', data.data.guid);
            //登录成功只有学员账号才能登陆
            if (data.data.role === "学员") {

              self.$router.push('/index/rotate_department/');
            }else if(data.data.role === "基地导师"||data.data.role === "带教老师"){
              self.$router.push('/teacher_index');
            }
             else {
              //提示未开发
              if (location.hostname == 'newtest.ksbao.com' || location.hostname == 'localhost') {
                if (data.data.role === "基地导师"||data.data.role === "带教老师") {

                  self.$router.push('/teacher_index');
                } else if (data.data.role === "教学秘书"||data.data.role === "科室负责人") {

                  self.$router.push('/secretary_index');
                }else{
                  self.$messagebox({
                  title: '提示',
                  message: `正在开发中，敬请期待...`,
                });
                }
              } else {
                self.$messagebox({
                  title: '提示',
                  message: `正在开发中，敬请期待...`,
                });
              }
            }
            break
          case 1:
            //账号密码错误
            self.$messagebox({
              title: '提示',
              message: data.msg,
            });
            break
        }
      })
    },
    validateLogin: function(params) {
      if (params.username && params.password) {
        this.islogin = 1;
      }
      if (!params.username) {
        this.$Toast({
          message: "请输入账号",
          position: "bottom",
          duration: 3000
        });
        this.islogin = 0;
        return;
      }
      if (!params.password) {
        this.$Toast({
          message: "请输入密码",
          position: "bottom",
          duration: 3000
        });
        this.islogin = 0;
        return;
      }
    }
  }
};
</script>

<style>
html,
body {
  background: #eee;
}

body {
  margin: 0px !important;
}

.login .logo {
  width: 100%;
  height: 280px;
  background: url(../assets/loginImg.png);
  background-size: 100%;
  background-repeat: no-repeat;
}

.login .mint-cell-wrapper {
  background-image: none !important;
  border-bottom: none;
  background: #eee;
}

.login .mint-cell-wrapper input {
  background: #eee;
}

.login .tipImage {
  width: 50%;
  top: 7px;
  position: relative;
}

.login .row {
  width: 100%;
  margin-top: 10px;
  text-align: center;
}
</style>
