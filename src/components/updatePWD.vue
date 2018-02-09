<template>
<div style="width:98%;margin:0 auto;border-radius:6px">
  <mt-header fixed title="修改密码" style="background-color:#37acd3;font-size:16px;">
      <mt-button slot="left" icon="back" @click="back"></mt-button>
  </mt-header>
  <div style="height:45px;background-color:#eee">&nbsp;</div>
  <div class="inputdiv">
      <mt-field label="" placeholder="请输入原始密码" type="password" v-model="olbpwd1" :attr="{ maxlength: 12 }"></mt-field>
      <mt-field label="" placeholder="请输入新密码" type="password" v-model="newpwd1" :attr="{ maxlength: 12 }"></mt-field>
      <mt-field label="" placeholder="请再次输入新密码" type="password" v-model="newpwd2" :attr="{ maxlength: 12 }"></mt-field>
      <div style="margin-top:30px;text-align:center;">
        <mt-button type="default" class="btntype" @click.native="updatePWD" >确定修改</mt-button>
    </div>
    <div style="margin:0 auto;width:95%;text-align:left;padding-top:10px;">
        <span>
            &nbsp;备注：密码长度为6-12位，密码包含数字、字母
        </span>
    </div>
  </div>
</div>
</template>

<script>
  import store from '@/store/store'
  import Router from 'vue-router'
    export default {
        name: '',
        store,
        components: {},
        created(){
        },activated(){
            //避免因为滑动，页面不显示在最顶部
            document.body.scrollTop=0;
            document.documentElement.scrollTop=0;
            this.cleanInput();
            this.guid=this.getLocalStorageValue('userinfo').guid;
        },
        data(){ 
            return{
                olbpwd1:'',
                newpwd1:'',
                newpwd2:'',
                guid:this.getLocalStorageValue('userinfo').guid,
            }
        },
        methods: {
            updatePWD() {
                var that=this;
                if(!this.guid){
                    this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
                        this.$router.push('/login');
                    });
                    return;
                }
                if(that.olbpwd1.length<1){
                    this.$Toast('请输入原始密码');
                }
                else if(that.newpwd1.length<1){
                    this.$Toast('请输入新密码，密码格式为6-12位，由数字，字母组成');
                }
                else if(that.newpwd2.length<1){
                    this.$Toast('请再次输入新密码');
                }
                else if(that.newpwd1!=that.newpwd2){
                    this.$Toast('两次填写的密码不一致');
                }
                else if(that.newpwd1.length<6||that.newpwd1.lengt>12){
                    this.$Toast('请输入正确的密码格式，密码为6-12位，由数字，字母组成');
                }else{
                    var parems={
                        userid:0,
                        newpwd:that.newpwd1,
                        oldpwd:that.olbpwd1,
                        guid:this.guid
                    };
                    this.$httpPost('info/updateUserpwd', parems, function (err, json) {
                        if(json.status==200){
                            if(json.data.state==-1){
                                that.$Toast('原始密码错误');
                            }else if(json.data.state==0){
                                that.$messagebox.confirm('修改成功，请重新登录').then(action => {
                                    that.$router.push({ 
                                        path: '/login',
                                        name: 'login',
                                        });
                                });
                            }
                            
                        }
                    });
                }
                
            },
            olbpwd(){
                alert(0);
            },
            cleanInput(){
                this.olbpwd1='';
                this.newpwd1='';
                this.newpwd2='';
            },
            back(){
                var path='/index/userinfo/';
                var role=this.getLocalStorageValue('userinfo').role;
                switch (role){
                    case '学员':
                        path='/index/userinfo/';
                        break;
                    case '带教老师':
                        path='/teacher_index/userinfo/';
                        break;
                    case '教学秘书':
                        path='/secretary_index/userinfo/';
                        break;
                    case '科室负责人':
                        path='/secretary_index/userinfo/';
                        break;
                }
                this.$router.push({
                    path:path,
                    name:'',
                });
            }
        }
    }
</script>

<style>
html,body{background-color: #eee;}
.btntype{
    background-color:#37acd3;
    color:white;
    width:95%;
}
.inputdiv{
    border-radius:6px;
    height:680px;
    background-color:white;
    text-align: center;
}
</style>
