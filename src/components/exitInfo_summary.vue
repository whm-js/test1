<template>
  <div>
    <mt-header fixed title="个人小结" style="background-color:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
      <mt-button slot="right" v-show="isExit!='true'">
        <span style="font-weight:bold;">{{curcount}}</span>{{pagecount}}</mt-button>
    </mt-header>
    <div style="height:50px;"></div>
    <!--面板3-->
    <div id="panel3" class="exit-panel">
      <div>
        <div class="summary-panel">
          <h4 class="summary-title">个人小结：</h4>
          <div class="summary-text" v-if="!this.$store.state.UserExitData">-</div>
          <div class="summary-text" v-else-if="this.$store.state.UserExitData.PersonalSummary">
            {{this.$store.state.UserExitData.PersonalSummary}}
          </div>
          <div class="summary-text" v-else>-</div>
        </div>

        <br/>
        <div class="summary-panel">
          <h4 class="summary-title">带教老师评语：</h4>
          <div class="summary-text" v-if="!this.$store.state.UserExitData">-</div>
          <div class="summary-text" v-else-if="this.$store.state.UserExitData.TeacherComment">
            {{this.$store.state.UserExitData.TeacherComment}}
          </div>
          <div class="summary-text" v-else>-</div>
        </div>
      </div>
      <div style="height:100px;"></div>
      <div class="exit-footer">
        <div v-if="isExit!=='true'" style="float:left;width:49%;border-right:1px solid #fff;" v-on:click="preStep()">上一项</div>
        <div v-if="isExit!=='true'" style="float:left;width:50%;" v-on:click="nextStep()">返回轮转科室</div>
        <div v-if="isExit==='true'" style="float:left;width:99%;" v-on:click="nextExitPage()">下一项</div>
      </div>
    </div>

  </div>
</template>

<script>
import store from "@/store/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      role: "",
      pagecount: "",
      curcount: "",
      isExit: ""
    };
  },
  activated() {
    window.scrollTo(0, 0);
    this.isExit = this.$route.query.isExit;
    this.role = this.getLocalStorageValue("userinfo").role;
    switch (this.role) {
      case "学员":
        this.pagecount = "/3";
        this.curcount = "3";
        break;
      case "基地导师":
        this.pagecount = "/3";
        this.curcount = "3";
        break;
      case "带教老师":
        this.pagecount = "/3";
        this.curcount = "3";
        break;
      case "教学秘书":
        this.pagecount = "/2";
        this.curcount = "2";
        break;
      case "科室负责人":
        this.pagecount = "/2";
        this.curcount = "2";
        break;
    }

    // if(!this.$store.state.UserExitData.PersonalSummary){
      this.getExitDataInfo();
    // }
  },
  methods: {
    //获取当前学员出科信息
    getExitDataInfo: function() {
      var guid = this.getLocalStorageValue('userinfo').guid;
      if (!guid) {
        this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(
          action => {
            this.$router.push("/login");
          }
        );
        return;
      }
      var userId = this.$route.query.userId;
      if (!userId) {
        this.$messagebox("温馨提示", "页面请求无效，请重新进入！").then(
          action => {
            this.$router.push("/");
          }
        );
        return;
      }
      var departmentId = this.$route.query.departmentId;
      if (!departmentId) {
        this.$messagebox("温馨提示", "页面请求无效，请重新进入！").then(
          action => {
            this.$router.push("/");
          }
        );
        return;
      }
      var Year = new Date(this.$route.query.planStartDate).getFullYear();
      var Month = new Date(this.$route.query.planStartDate).getMonth() + 1;
      var year = Year + "" + Month;

      var that = this;
      var params = {
        userID: userId,
        guid: guid,
        departmentID: departmentId,
        createYear: year
      };
      this.$httpPost("exit/getExitCourseInfoByID", params, function(err, json) {
        if (json.data.data.length >= 1) {
          that.UserExitData = json.data.data[0];
        }
        that.$store.commit("updataUserExitData", that.UserExitData); //缓存学员出科数据，在出科详情的第三个页面用到：展示个人小结和带教老师评语
      });
    },
    nextStep: function() {
      // var path = this.$route.query.checkExitType ? '/teacher_index':'/index/rotate_department/';
      var path = "/index/rotate_department/";
      switch (this.role) {
        case "学员":
          path = "/index/rotate_department/";
          break;
        case "基地导师":
          path = "/teacher_index/teacher_exit/";
          break;
        case "带教老师":
          path = "/teacher_index/teacher_exit/";
          break;
        case "教学秘书":
          path = "/secretary_index/secretary_exit/";
          break;
        case "科室负责人":
          path = "/secretary_index/secretary_exit/";
          break;
      }
      this.$router.push({
        path: path,
        name: "",
        query: {
          planDataIndex: this.$route.query.planDataIndex
        }
      });
    },
    nextExitPage() {
      this.$router.push({
        path: "/secretary_exitpage",
        name: "secretary_exitpage",
        query: {
          planStartDate: this.$route.query.planStartDate,
          planEndDate:this.$route.query.planEndDate,
          userId: this.$route.query.userId,
          departmentId: this.$route.query.departmentId,
          teacherId: this.$route.query.teacherId,
          teacherName: this.$route.query.teacherName,
          planDataIndex: this.$route.query.planDataIndex, //页面跳转首页索引参数
          checkExitType: this.$route.query.checkExitType,
          isExit:'true'
        }
      });
    },
    //返回上一个页面
    preStep: function() {
      if (this.role === "教学秘书" || this.role === "科室负责人") {
        this.$router.push({
          path: "/exitInfo",
          name: "exitInfo",
          query: {
            planStartDate: this.$route.query.planStartDate,
            planEndDate:this.$route.query.planEndDate,
            userId: this.$route.query.userId,
            departmentId: this.$route.query.departmentId,
            teacherId: this.$route.query.teacherId,
            teacherName: this.$route.query.teacherName,
            planDataIndex: this.$route.query.planDataIndex, //页面跳转首页索引参数
            checkExitType: this.$route.query.checkExitType
          }
        });
      } else {
        this.$router.push({
          path: "/exitInfo_evalute",
          name: "exitInfo_evalute",
          query: {
            planStartDate: this.$route.query.planStartDate,
            planEndDate:this.$route.query.planEndDate,
            userId: this.$route.query.userId,
            departmentId: this.$route.query.departmentId,
            teacherId: this.$route.query.teacherId,
            teacherName: this.$route.query.teacherName,
            planDataIndex: this.$route.query.planDataIndex, //页面跳转首页索引参数
            checkExitType: this.$route.query.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
          }
        });
      }
    },
    //页面头部返回事件控制
    backClick: function() {
      var path = "/index/rotate_department/";
      switch (this.role) {
        case "学员":
          path = "/index/rotate_department/";
          break;
        case "基地导师":
          path = "/teacher_index/teacher_exit/";
          break;
        case "带教老师":
          path = "/teacher_index/teacher_exit/";
          break;
        case "教学秘书":
          path = "/secretary_index/secretary_exit/";
          break;
        case "科室负责人":
          path = "/secretary_index/secretary_exit/";
          break;
      }
      this.$router.push({
        path: path,
        name: "",
        query: {
          planDataIndex: this.$route.query.planDataIndex,
          checkExitType: this.$route.query.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    }
  }
};
</script>

<style>
html,
body {
  background: #eee;
}
.exit-panel {
  position: relative;
  min-height: 550px;
  width: 100%;
  text-align: center;
}
.exit-footer {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #fff;
  background: #37acd3;
}

.summary-panel {
  width: 100%;
  margin: 0px auto;
  margin-bottom: 10px;
  background: #fff;
}
.summary-title {
  height: 45px;
  margin-top: 5px;
  line-height: 45px;
  text-align: center;
  color: #37acd3;
  border-bottom: 1px solid #ddd;
}
.summary-text {
  min-height: 160px;
  padding: 5px;
  text-indent: 1.5em;
  text-align: left;
  line-height: 28px;
  overflow: hidden;
  word-break: break-all;
}
</style>
