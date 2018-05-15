<template>
  <div class="exitpage">
    <mt-header fixed title="考核情况" style="background-color:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
    </mt-header>
    <div>
      <mt-field label="理论考核成绩" type="number" placeholder="请输入考核成绩" v-model="TheoryScore"></mt-field>
      <mt-field label="技能考核成绩" type="number" placeholder="请输入考核成绩" v-model="SkillScore"></mt-field>
      <mt-field label="考核总成绩" type="number" placeholder="请输入考核总成绩" v-model="totalScore"></mt-field>
      <mt-field label="考核结果" readonly="readonly" placeholder="">
        <label style="margin-left:50px;float:left;">
          <input type="radio" :checked="isFullAttend==1" name="attend-radio" value="1" v-on:change="attendChange($event)" /> 合格，准与出科
        </label>
        <label style="margin-left:50px;float:left;">
          <input type="radio" :checked="isFullAttend==2" name="attend-radio" value="2" v-on:change="attendChange($event)" /> 基本合格，准与出科，需补足培训任务
        </label>
        <label style="margin-left:50px;float:left;">
          <input type="radio" :checked="isFullAttend==0" name="attend-radio" value="0" v-on:change="attendChange($event)" /> 不合格，不予出科
        </label>
      </mt-field>
      <mt-field label="对学员培训任务完成情况的评价" placeholder="请输入评价" v-model="MissionEval"></mt-field>
      <div @click="open('datePicker')">
        <mt-field label="实际出科时间" type="text" readonly="readonly" disableClear placeholder="" v-model="exitTime"></mt-field>
      </div>
    </div>

    <mt-datetime-picker ref="datePicker" type="date" :startDate="startDate" :endDate="endDate" v-model="dateValue" @confirm="handleChange">
    </mt-datetime-picker>

    <div class="mint-tabbar is-fixed">
      <mt-button type="primary" size="normal" style="width:49%;background-color: rgb(55, 172, 211);border-radius: 0;" @click.native="preStep">上一项</mt-button>
      <mt-button type="primary" size="normal" style="width:49%;margin-left: 1%;background-color: rgb(55, 172, 211);border-radius: 0;" @click.native="exitClick">{{isFullAttend==1?'同意出科':'提交审核'}}</mt-button>
      <!-- <div style="float:left;width:49%;border-right:1px solid #fff;" v-on:click="preStep()">上一项</div>
        <div style="float:left;width:50%;" v-on:click="nextStep()">同意出科</div> -->
    </div>
  </div>
</template>
<script>
var that;
export default {
  data () {
    return {
      guid: this.getLocalStorageValue("userinfo").guid,
      TheoryScore: "",
      SkillScore: "",
      totalScore: "",
      MissionEval:"",
      isFullAttend: 1,
      exitTime: this.$formatDate(
        new Date(this.$route.query.planEndDate),
        "yyyy-MM-dd"
      ),
      startDate: new Date("1990-01-01"),
      endDate: new Date(),
      dateValue: new Date()
    };
  },
  methods: {
    preStep () {
      this.$router.push({
        path: "/exitInfo_summary",
        name: "exitInfo_summary",
        query: {
          planStartDate: this.$route.query.planStartDate,
          planEndDate: this.$route.query.planEndDate,
          userId: this.$route.query.userId,
          departmentId: this.$route.query.departmentId,
          teacherId: this.$route.query.teacherId,
          teacherName: this.$route.query.teacherName,
          planDataIndex: this.$route.query.planDataIndex, //页面跳转首页索引参数
          checkExitType: this.$route.query.checkExitType,
          isExit: "true"
        }
      });
    },
    exitClick () {
      if (this.TheoryScore === "") {
        this.$Toast("请输入考核成绩!");
        return;
      }
      if (this.SkillScore === "") {
        this.$Toast("请输入考核成绩!");
        return;
      }
      // if(this.isFullAttend==0){
      //   that.$Toast("出科失败!");
      //     that.$router.push({
      //         path:'/secretary_index/secretary_exit/',
      //         query:{
      //           checkExitType:'secretary_2'  //查看出科情况类型：teacher为教师查看，为空则是学生查看
      //         }
      //     });
      //     return;
      // }
      var startdate = this.$route.query.planStartDate;
      var date = new Date(startdate);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var CreateYear = year.toString() + month.toString();
      var params = {
        guid: this.guid,
        PlanStartDate: this.$route.query.planStartDate,
        UserId: this.$route.query.userId,
        DepartmentId: this.$route.query.departmentId,
        CreateYear: CreateYear,
        TeacherId: this.$route.query.teacherId,
        TheoryScore: this.TheoryScore,
        SkillScore: this.SkillScore,
        AppraiseResult: this.isFullAttend,
        RealityEndDate: this.exitTime,
        TotalScore: this.totalScore,
        MissionEval: this.MissionEval
      };
      this.$httpPost("exit/exit_leaderComment", params, function (err, json) {
        if (json.status == 200) {
          if (that.isFullAttend == 0) {
            that.$Toast("出科审核提交成功!");
            that.$router.push({
              path: "/secretary_index/secretary_exit/",
              query: {
                checkExitType: "secretary_2" //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          } else {
            that.$Toast("出科成功!");
            that.$router.push({
              path: "/secretary_index/secretary_exit/",
              query: {
                checkExitType: "secretary_3" //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          }
          //   that.$router.push("/secretary_index/secretary_exit/");
        } else {
          that.$Toast(json.msg);
          return;
        }
      });
    },
    backClick: function () {
      this.$router.push("/secretary_index/secretary_exit/");
    },
    attendChange (event) {
      //性别点击事件
      var value = event.currentTarget.value;
      value = Number(value);
      this.isFullAttend = value;
      // console.log(this.isFullAttend)
    },
    open: function (picker) {
      this.$refs[picker].open();
    },
    handleChange: function (value) {
      this.dateValue = this.$formatDate(new Date(value), "yyyy-MM-dd");
      this.exitTime = this.dateValue;
    }
  },
  created () {
    that = this;
  },
  activated () {
    if (this.guid !== this.getLocalStorageValue("userinfo").guid) {
      this.guid = this.getLocalStorageValue("userinfo").guid;
    }
    this.TheoryScore = this.$store.state.UserExitData.TheoryScore ? this.$store.state.UserExitData.TheoryScore : "";
    this.SkillScore = this.$store.state.UserExitData.SkillScore ? this.$store.state.UserExitData.SkillScore : "";
    this.isFullAttend = this.$store.state.UserExitData.AppraiseResult;
  }
};
</script>
<style>
.exitpage {
  margin-top: 60px;
  margin-bottom: 55px;
}
.exitpage .mint-cell-value input {
  text-align: right;
  background-color: white;
}
</style>
