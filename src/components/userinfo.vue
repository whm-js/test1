<template>
  <div class="userinfo">
    <div style="height:45px;background-color:#eee">&nbsp;</div>
    <div class="userinfo_detail">
      <div style="text-align: center;">
        <img src="../assets/userHeader.png" style="margin: 0 auto;padding-top:10px;width:100px;" />
        <p style="font-size:16px;">{{userinfoData.RealName}}({{userinfoData.UserName}})</p>
      </div>
      <div style="margin:auto 8px;" v-if="role=='学员'">
        <mt-cell title="学员类型">{{userinfoData.Education}}</mt-cell>
        <mt-cell title="培训学科">{{userinfoData.CourseName}}</mt-cell>
        <mt-cell title="培训年限">{{userinfoData.TrainingYears===1?'一年制':userinfoData.TrainingYears===2?'二年制':userinfoData.TrainingYears===3?'三年制':''}}</mt-cell>
        <mt-cell title="年级批次">{{userinfoData.GradeBatch}}</mt-cell>
        <mt-cell title="是否具有处方权">{{userinfoData.IsPrescriptionRight?'有':'无'}}</mt-cell>
        <mt-cell title="是否执业医师" style="background-image: none;">{{userinfoData.IsPracticingPhysician?'是':'否'}}</mt-cell>
      </div>
      <div style="margin:auto 8px;" v-else-if="role=='科室负责人'">
        <mt-cell title="角色">{{userinfoData.UserRole}}</mt-cell>
        <mt-cell title="所在科室">{{userinfoData.DepartmentName}}</mt-cell>
        <mt-cell title="职务">{{userinfoData.PositionName?userinfoData.PositionName:'-'}}</mt-cell>
        <mt-cell title="专业技术职称" style="background-image: none;">{{userinfoData.TitleName?userinfoData.TitleName:'-'}}</mt-cell>
      </div>
      <div style="margin:auto 8px;" v-else>
        <mt-cell title="角色">{{userinfoData.UserRole}}</mt-cell>
        <mt-cell title="所在科室">{{userinfoData.DepartmentName}}</mt-cell>
        <mt-cell title="是否取得师资证书">{{userinfoData.isTeacherLCE?'是':'否'}}</mt-cell>
        <mt-cell title="师资证级别">{{userinfoData.TeacherLCElevel?userinfoData.TeacherLCElevel:'-'}}</mt-cell>
        <mt-cell title="是否为我院全科专业带教老师">{{userinfoData.isGeneralTeacher?'是':'否'}}</mt-cell>
        <mt-cell title="是否取得全科师资证书">{{userinfoData.ishasGeneralLCE?'是':'否'}}</mt-cell>
        <mt-cell title="专业技术职称" style="background-image: none;">{{userinfoData.TitleName?userinfoData.TitleName:'-'}}</mt-cell>
        <div v-if="role==='基地导师'">
          <mt-cell title="是否为住培导师">{{userinfoData.isResident?'是':'否'}}</mt-cell>
          <mt-cell title="是否为住培考官">{{userinfoData.isOfficer?'是':'否'}}</mt-cell>
          <mt-cell title="是否取得住培考官证书">{{userinfoData.isHasOfficerLCE?'是':'否'}}</mt-cell>
        </div>
      </div>

    </div>
    <div class="listtype">
      <mt-cell title="个人资料" to="/userinfoEdit" is-link value="">
        <i slot="icon" class="icon iconfont icon-my_icon"></i>
      </mt-cell>
    </div>
    <div class="listtype">
      <mt-cell title="客服中心" to="/customer_service" is-link value="">
        <i slot="icon" class="icon iconfont icon-icon_phone"></i>
      </mt-cell>
    </div>
    <div class="listtype">
      <mt-cell title="关于我们" to="/about" is-link value="">
        <i slot="icon" class="icon iconfont icon-jihe"></i>
      </mt-cell>
    </div>

    <div id="btndiv" style="margin-top:20px;margin-bottom: 60px;">
      <mt-button type="default" class="btntype" @click.native="updatePWD">修改密码</mt-button>
      <mt-button type="default" class="btntype" @click.native="outlogin" style="float:right;">退出账号</mt-button>
    </div>


  </div>
</template>

<script>
  import store from '@/store/store'
  // import { getUserInfo } from "@/service/getData";
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex';
  var searchUrl = window.location.href;
  var searchData = searchUrl.split("="); //截取 url中的“=”,获得“=”后面的参数
  var searchText = decodeURI(searchData[1]); //decodeURI解码
  var searchName = decodeURI(searchData[2]);
  export default {
    name: '',
    created() {
    },
    activated() {
      this.$store.commit('updataindexSelected', 'userinfo');
      this.$store.commit('updatateacher_indexSelected', 'teacher_userinfo');
      this.$store.commit('updatasecretary_indexSelected','secretary_userinfo');
      //避免因为滑动，页面不显示在最顶部
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      this.role = this.getLocalStorageValue('userinfo').role; //获取用户角色
      if (this.guid !== this.getLocalStorageValue('userinfo').guid || this.userinfoData === '') {
        this.guid = this.getLocalStorageValue('userinfo').guid;
        //刷新／激活数据写在此处,每次打开页面请求最新的数据
        //this.getUserInfo();
      }
      this.getUserInfo();
    },
    data() {
      return {
        guid: '',
        loginUserinfo: '',
        role: '',
        userinfoData: '',
      }
    },
    computed: {
      count() {
        return this.$store.getters.count;
      }
    },
    store,
    components: {},
    methods: {
      getUserInfo() {
        var that = this;
        if (!that.guid) {
          this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
            this.$router.push('/login');
          });
          return;
        }
        var parems = {
          userid: 0,
          guid: that.guid,
          userrole: ''
        }
        // getUserInfo(0,that.guid,'').then(res=>{
        //   console.log(res)
        // })

        this.$httpGet('info/getUserinfobyrole', parems, function(err, json) {
          if (json.status == 200) {

            if (json.data.length > 0) {
              for (var i in json.data[0]) {
                json.data[0][i] = that.dataProcess(json.data[0][i]);
              }
              that.userinfoData = json.data[0];
            }

          } else {
            this.$messagebox({
              title: '提示',
              message: json.msg,
              showCancelButton: true
            });
          }
        });
      },
      updatePWD() {
        this.$router.push('/updatePWD');
      },
      outlogin() {
        window.localStorage.removeItem('rateJson');
        window.localStorage.removeItem('attendInfo');
        window.localStorage.removeItem('summaryInfo');
        window.localStorage.removeItem('eval_queryInfo');
        if(searchText.indexOf('pugongying')>-1){
          window.webkit.messageHandlers.cleanuserinfoC.postMessage('退出登录');
        }
        this.$router.push('/login');
      },
      dataProcess(value) {
        return value == null ? '' : value == undefined ? '' : value;
      }

    }
  }
</script>

<style>
  html,
  body {
    background-color: #eee;
  }

  body #app {
    background-color: #eee;
  }

  .userinfo {
    height: auto;
    width: 98%;
    margin: 0 auto;
    margin-bottom: 50px;
  }

  .userinfo .userinfo_detail {
    border-radius: 6px;
    background-color: white;
    width: 100%;
  }

  .userinfo #btndiv .btntype {
    background-color: #37acd3;
    color: white;
    width: 48%;
  }

  .userinfo .listtype {
    margin-top: 10px;
    border-radius: 6px;
    width: 100%;
    background-color: white;
  }

  .userinfo .listtype a {
    margin: 2px;
    background-image: none;
  }

  .userinfo .listtype mint-cell-title span {
    margin-top: -10px;
    display: inline-block;
  }

  .userinfo
  /* Cell Component */


  /* Header Component */


  /* Button Component */


  /* Tab Item Component */


  /* Tabbar Component */


  /* Navbar Component */


  /* Checklist Component */


  /* Radio Component */


  /* z-index */

  .userinfo .mint-cell {
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    min-height: 48px;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
  }

  .userinfo .mint-cell img {
    vertical-align: middle;
  }

  .userinfo .mint-cell:first-child .mint-cell-wrapper {
    background-origin: border-box;
  }

  .userinfo .mint-cell:last-child {
    background-image: -webkit-gradient(linear, left bottom, left top, from(#c0c4cc), color-stop(50%, #c0c4cc), color-stop(50%, transparent));
    background-image: linear-gradient(0deg, #c0c4cc, #c0c4cc 50%, transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }

  .userinfo .mint-cell-wrapper {
    background-image: -webkit-gradient(linear, left top, left bottom, from(#c0c4cc), color-stop(50%, #c0c4cc), color-stop(50%, transparent));
    background-image: linear-gradient(180deg, #c0c4cc, #c0c4cc 50%, transparent 50%);
    background-size: 120% 1px;
    background-repeat: no-repeat;
    background-position: top left;
    background-origin: content-box;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 16px;
    line-height: 1;
    min-height: inherit;
    overflow: hidden;
    padding: 0 10px;
    width: 100%;
  }

  .userinfo .mint-cell-mask::after {
    background-color: #000;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
  }

  .userinfo .mint-cell-mask:active::after {
    opacity: .1;
  }

  .userinfo .mint-cell-text {
    vertical-align: middle;
  }

  .userinfo .listtype .mint-cell-text {
    vertical-align: middle;
    display: inline-block;
    margin-top: -10px;
  }

  .userinfo .mint-cell-label {
    color: #888;
    display: block;
    font-size: 12px;
    margin-top: 6px;
  }

  .userinfo .mint-cell-title {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }

  .userinfo .mint-cell-value {
    color: #888;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .userinfo .mint-cell-value.is-link {
    margin-right: 24px;
  }

  .userinfo .mint-cell-left {
    position: absolute;
    height: 100%;
    left: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  .userinfo .mint-cell-right {
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  .userinfo .mint-cell-allow-right::after {
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 20px;
    position: absolute;
    width: 5px;
    height: 5px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }
</style>
