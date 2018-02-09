<template>
  <div>
    <ul class="studentList" style="padding-bottom: 60px;">

      <li class="tab-item" v-for="(item,index) in ExitData">

        <div>

          <div style="float:left;">

            <span class="fontColor" v-on:click="showStudentInfo(item.UserID)">
              <strong class="userName">{{item.RealName}}</strong>（{{item.UserName}}）</span>

          </div>

          <div style="float:right;">
            <el-tooltip placement="bottom" effect="light" :hide-after="showtime">
              <div slot="content">{{item.IsPracticingPhysician ? '是执业医师':'非执业医师'}}</div>
              <span :class="item.IsPracticingPhysician ? 'flag-z':'flag-z-gray'">执</span>
            </el-tooltip>
            <el-tooltip placement="bottom" effect="light" :hide-after="showtime">
              <div slot="content">{{item.IsPracticingPhysician ? '有处方权':'无处方权'}}</div>
              <span :class="item.IsPrescriptionRight ? 'flag-c':'flag-c-gray'">处</span>
            </el-tooltip>
          </div>

        </div>

        <div class="exitTime">
          <div v-if="fromType==='secretary_enter'">计划轮转时间：{{showRotateTime(item)}}</div>
          <div v-if="fromType==='secretary_enter'&&rotateStatus!=0&&rotateStatus!=2">实际入科时间：{{item.RealityStartDate}}</div>
          <div v-if="fromType==='secretary_exit'||fromType==='teacher_exit'">计划出科时间：{{item.PlanEndDate}}</div>
          <div v-if="rotateStatus=='200'&&(fromType==='secretary_exit'||fromType==='teacher_exit')">实际出科时间：{{item.RealityEndDate}}</div>
          <div v-if="(rotateStatus!='0'&&rotateStatus!='2')&&fromType!='teacher_exit'">带教老师：{{item.CoachingName}}</div>

        </div>

        <div>
          <div v-if="item.RotateStatus=='2'&&fromType==='secretary_enter'" class="btn btnBlue" style="float:right;" v-on:click="examineEnterInfo(item)">确认入科</div>
          <div v-if="fromType==='secretary_exit'||fromType==='teacher_exit'" class="btn" style="float:left;" v-on:click="checkHandBook(item)">轮转手册</div>
          <div v-if="fromType==='secretary_exit'" style="float:right;font-size: 16px;margin-right: 10px;font-weight: bold;">{{showRotateStatus(item.RotateStatus)}}</div>
          <div v-if="item.RotateStatus==101&&fromType==='teacher_exit'" class="btn btnBlue" style="float:right;" v-on:click="writeComments(item,'add')">填写评语</div>
          <div v-if="item.RotateStatus==102&&fromType==='teacher_exit'" class="btn" style="float:right;" v-on:click="writeComments(item,'edit')">查看评语</div>
          <div v-if="item.RotateStatus=='102'&&fromType==='secretary_exit'" class="btn btnBlue" style="float:right;" v-on:click="examineExitInfo(item)">审核出科</div>
          <div v-if="item.RotateStatus=='200'&&(fromType==='teacher_exit'||fromType==='secretary_exit')" class="btn btnBlue" style="float:right;" v-on:click="checkExitInfo(item)">出科情况</div>

        </div>

      </li>

      <li v-if="ExitData.length==0" style="padding-top:20px;text-align: center;">暂无数据！</li>

    </ul>

    <student-info :userid="studentID" :showStudent.sync="popupVisible"></student-info>

  </div>
</template>
<script>
import studentInfo from "@/components/studentInfo";
export default {
  name: "",

  props: {
    ExitDatas: {
      type: Array,
      required: true
    },
    Status: [String, Number],
    ExitType: [String],
    fromType: [String]
  },

  components: { studentInfo },

  data() {
    return {
      role: "",
      showtime: 1000,
      ExitData: [], //出科数据列表
      StudentInfoData: {},
      rotateStatus: "",
      parentrole: "",
      checkExitType: "",
      // fromType: "",
      routerUrl: this.$route.path,
      popupVisible: false,
      studentID: ""
    };
  },
  watch: {
    ExitDatas: function(newdata) {
      this.ExitData = newdata;
    },
    Status: function(newdata) {
      this.rotateStatus = newdata;
    }
    // fromType: function(newdata) {
    //   this.fromType = newdata;
    // },
    // ExitType: function(newdata) {
    //   this.checkExitType = newdata;
    // }
  },
  activated() {},
  methods: {
    showRotateTime(el) {
      var date1 = el.PlanStartDate.replace(/-/g, "/");
      var date2 = el.PlanEndDate.replace(/-/g, "/");
      var name = el.RotateStatusName;
      // var state ="计划轮转时间：";
      var start = this.$formatDate(new Date(date1), "yyyy-MM-dd");
      var end = this.$formatDate(new Date(date2), "yyyy-MM-dd");
      return start + "至" + end;
    },
    //获取学员个人信息
    showStudentInfo: function(studentID) {
      this.studentID = studentID;
      this.popupVisible = true;
      // var guid = this.getLocalStorageValue('userinfo').guid;
      // if (!guid) {
      //   this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(
      //     action => {
      //       this.$router.push("/login");
      //     }
      //   );
      //   return;
      // }
      // var that = this;
      // var params = {
      //   guid: guid,
      //   userid: studentID
      // };
      // this.$httpGet("info/getUserinfo", params, function(err, json) {
      //   if (json.data.length >= 1) {
      //     that.StudentInfoData = json.data[0];
      //     that.popupVisible = true;
      //   }
      // });
    },
    //关闭个人信息弹窗
    closeStudentInfo: function() {
      this.popupVisible = false;
    },
    showRotateStatus: function(RotateStatus) {
      switch (RotateStatus) {
        case 0:
          return "未审批";
          break;
        case 1:
          return "未入科";
          break;
        case 2:
          return "未入科";
          break;
        case 100:
          return "未申请出科";
          break;
        case 101:
          return "老师未写评语";
          break;
      }
    },
    //查看出科情况
    checkExitInfo: function(item) {
      var curStudentData = item; //当前选择的学生数据
      this.$router.push({
        path: "/exitInfo",
        name: "exitInfo",
        query: {
          planStartDate: curStudentData.PlanStartDate,
          userId: curStudentData.UserID,
          departmentId: curStudentData.DepartmentId,
          teacherId: curStudentData.CoachingId,
          teacherName: curStudentData.CoachingName,
          planDataIndex: 0, //页面跳转首页索引参数
          checkExitType: this.ExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    },
    examineEnterInfo(item) {
      var curStudentData = item; //当前选择的学生数据
      this.$router.push({
        path: "/secretary_enterpage",
        name: "secretary_enterpage",
        query: {
          planStartDate: curStudentData.PlanStartDate,
          planEndDate: curStudentData.PlanEndDate,
          userId: curStudentData.UserID,
          departmentId: curStudentData.DepartmentId,
          teacherId: curStudentData.CoachingId,
          teacherName: curStudentData.CoachingName,
          planDataIndex: 0, //页面跳转首页索引参数
          checkExitType: this.ExitType, //查看出科情况类型：teacher为教师查看，为空则是学生查看
          RealName: curStudentData.RealName,
          UserName: curStudentData.UserName
        }
      });
    },
    //填写评语
    writeComments: function(studentIndex, mode) {
      var curStudentData = studentIndex; //当前选择的学生数据
      var hospitalID = this.getLocalStorageValue("userinfo").hospitalId;
      //缓存填写评语需要的基础数据
      var _curQueryInfo = {
        UserId: curStudentData.UserID,
        DepartmentId: curStudentData.DepartmentId,
        PlanStartDate: curStudentData.PlanStartDate,
        CoachingId: curStudentData.CoachingId,
        CoachingName: curStudentData.CoachingName,
        HospitalID: hospitalID,
        planDataIndex: 0,
        modeTag: mode, //操作评语的状态：add 添加，edit 修改
        checkExitType: this.ExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
      };
      window.localStorage.setItem(
        "eval_queryInfo",
        JSON.stringify(_curQueryInfo)
      );

      this.$router.push({
        path: "/teacher_attendance",
        name: "teacher_attendance",
        query: {
          planDataIndex: 0,
          modeTag: mode, //操作评语的状态：add 添加，edit 修改
          checkExitType: this.ExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    },
    examineExitInfo(item) {
      var curStudentData = item; //当前选择的学生数据
      this.$router.push({
        path: "/exitInfo_summary",
        name: "exitInfo_summary",
        query: {
          planStartDate: curStudentData.PlanStartDate,
          planEndDate:curStudentData.PlanEndDate,
          userId: curStudentData.UserID,
          departmentId: curStudentData.DepartmentId,
          teacherId: curStudentData.CoachingId,
          teacherName: curStudentData.CoachingName,
          planDataIndex: 0, //页面跳转首页索引参数
          checkExitType: this.ExitType, //查看出科情况类型：teacher为教师查看，为空则是学生查看
          isExit: "true"
        }
      });
    },
    //查看轮转手册
    checkHandBook: function(item) {
      var curStudentData = item; //当前选择的学生数据
      this.$router.push({
        path: "/handbook_mainpage",
        name: "handbook_mainpage",
        query: {
          departmentId: curStudentData.DepartmentId,
          departmentName: curStudentData.DepartmentName,
          courseId: curStudentData.CourseId,
          userId: curStudentData.UserID,
          rotateStatus: curStudentData.RotateStatus,
          checkExitType: this.ExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    }
  }
};
</script>
<style>
.studentList .tab-item {
  width: 92%;
  /* min-height: 110px; */
  margin: 10px auto;
  padding: 10px;
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}
.studentList .fontColor {
  color: #37acd3;
}
.studentList .userName {
  display: inline-block;
  text-decoration: underline;
  padding-bottom: 5px;
  font-size: 16px;
}
.studentList .exitTime {
  clear: both;
  padding: 8px 0px;
  line-height: 23px;
  font-size: 14px;
  overflow: hidden;
}
.studentList .flag-z {
  padding: 3px 6px;
  font-size: 16px;
  border-radius: 6px;
  margin-right: 10px;
  color: #fff;
  font-weight: bold;
  background: #f0ad4e;
}
.studentList .flag-z-gray {
  padding: 3px 6px;
  font-size: 16px;
  border-radius: 6px;
  margin-right: 10px;
  color: #fff;
  font-weight: bold;
  background: #ccc;
}
.studentList .flag-c {
  padding: 3px 6px;
  font-size: 16px;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
  background: #5cb85c;
}
.studentList .flag-c-gray {
  padding: 3px 6px;
  font-size: 16px;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
  background: #ccc;
}
.studentList .btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  color: #37acd3;
  text-align: center;
  border: 1px solid #37acd3;
  border-radius: 5px;
  font-size: 16px;
}
.studentList .btnBlue {
  background: #37acd3;
  color: #fff;
}
</style>
