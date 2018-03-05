<template>
  <div class="exit-manage">
    <div class="head" @click="openDatePicker()">
      <strong>
        <span style="float:left;margin-left:10px;">计划出科时间：</span>
        <span class="fontColor" style="float:right;margin-right:15px;">
          <span>{{planStartDate}}</span>
          <i slot="icon" class="icon iconfont icon-caret-down" style="font-size:14px;"></i>
        </span>
      </strong>
    </div>
    <!--tab页签头部-->
    <ul class="nav">
      <li id="tabTitle1" v-bind:class="{active:tabtag==='tabContent1'}" v-on:click="tabClick(1,'100')">未申请出科</li>
      <li id="tabTitle2" v-bind:class="{active:tabtag==='tabContent2'}" v-on:click="tabClick(2,'101,102')">待写评语</li>
      <li id="tabTitle3" v-bind:class="{active:tabtag==='tabContent3'}" v-on:click="tabClick(3,'200')">已出科</li>
    </ul>
    <!--tab页签内容-->

    <!--未申请出科 start-->
    <div id="tabContent1" v-show="tabtag==='tabContent1'" class="tab-list">
      <studentList :ExitDatas="ExitData" :Status="rotateStatus" :role="role" :ExitType="checkExitType" :fromType="'teacher_exit'"></studentList>
    </div>
    <!--未申请出科 end-->

    <!--待写评语 start-->
    <div id="tabContent2" v-show="tabtag==='tabContent2'" class="tab-list">
      <studentList :ExitDatas="ExitData" :Status="rotateStatus" :role="role" :ExitType="checkExitType" :fromType="'teacher_exit'"></studentList>
    </div>
    <!--待写评语 end-->

    <!--已出科 start-->
    <div id="tabContent3" v-show="tabtag==='tabContent3'" class="tab-list">
      <studentList :ExitDatas="ExitData" :Status="rotateStatus" :role="role" :ExitType="checkExitType" :fromType="'teacher_exit'"></studentList>
    </div>

    <!--日期控件弹窗-->
    <mt-popup v-model="popupVisiblePicker" position="bottom" style="width:100%;">
      <div class="picker-toolbar">
        <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="confirmdate">确定</span>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
    <!--带箭头小提示窗-->
    <div class="container" v-show="isShowTip">
      <div class="content">{{tipMsg}}</div>
      <s :style="positionLeft ? 'left:50px':'left:20px'">
        <i></i>
      </s>
    </div>

  </div>
</template>

<script>
import studentList from "@/components/studentList";
var curYear = new Date().getFullYear();
var curMonth = new Date().getMonth();
export default {
  name: "",
  components: { studentList },
  data() {
    return {
      role: "",
      guid: "",
      ExitData: [], //出科数据列表
      tabtag: "tabContent2",
      popupVisible: false, //是否展示个人信息弹窗
      popupVisiblePicker: false, //是否展示日期弹窗
      checkExitType: "", //查看出科情况类型
      StudentInfoData: {}, //学员个人信息
      slots: [
        {
          flex: 1,
          values: [
            curYear - 4,
            curYear - 3,
            curYear - 2,
            curYear - 1,
            curYear,
            curYear + 1,
            curYear + 2
          ],
          className: "slot1",
          textAlign: "left",
          defaultIndex: 4,
          value: 4
        },
        {
          flex: 1,
          values: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12"
          ],
          className: "slot2",
          textAlign: "center",
          defaultIndex: curMonth,
          value: curMonth
        },
        {
          flex: 1,
          values: ["15", "月底"],
          className: "slot3",
          textAlign: "right",
          defaultIndex: 0,
          value: 0
        }
      ], //时间控件可选择值json配置
      planStartDate: "",
      rotateStatus: 0, //轮转状态
      selectDate: "",
      positionLeft: "", //tip箭头位置
      tipMsg: "", //tip提示信息
      isShowTip: false //是否显示tip提示窗
    };
  },
  methods: {
    //tab页签单击事件
    tabClick: function(index, rotateStatus) {
      //请求接口获取对应tab页签数据
      this.ExitData = [];
      this.rotateStatus = rotateStatus;
      this.getExitDataInfo();
      this.checkExitType = "teacher_" + index;
      this.tabtag = "tabContent" + index;
    },
    //获取学员出科列表信息
    getExitDataInfo: function() {
      // var guid = this.getLocalStorageValue('userinfo').guid;
      var that = this;
      var date = "";
      if (this.planStartDate.indexOf("月底") > -1) {
        var date1 = this.planStartDate.replace(/底/, "20日");
        date1 = date1.replace(/年/, "-");
        date1 = date1.replace(/月/, "-");
        date1 = date1.replace(/日/, "");
        var dates = date1.split("-");
        var lastDate = this.$getLastDay(dates[0], dates[1]);

        date = this.planStartDate.replace(/底/, lastDate + "日");
      } else {
        date = this.planStartDate;
      }
      date = date.replace(/年/, "-");
      date = date.replace(/月/, "-");
      date = date.replace(/日/, "");
      date = this.$formatDate(new Date(date), "yyyy-MM-dd");
      var params = {
        guid: this.guid,
        planOutDate: date,
        rotateStatus: that.rotateStatus,
        curPage: 1,
        showCount: 10
      };
      this.$httpPost("exit/getRotatePlanList", params, function(err, json) {
        that.ExitData = json.data.data;
      });
    },
    //获取学员个人信息
    showStudentInfo: function(studentID) {
      var guid = this.getLocalStorageValue("userinfo").guid;
      if (!guid) {
        this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(
          action => {
            this.$router.push("/login");
          }
        );
        return;
      }
      var that = this;
      var params = {
        guid: guid,
        userid: studentID
      };
      this.$httpGet("info/getUserinfo", params, function(err, json) {
        if (json.data.length >= 1) {
          that.StudentInfoData = json.data[0];
        }
      });
      this.popupVisible = true;
    },
    //关闭个人信息弹窗
    closeStudentInfo: function() {
      this.popupVisible = false;
    },
    //查看出科情况
    checkExitInfo: function(studentIndex) {
      var curStudentData = this.ExitData[studentIndex]; //当前选择的学生数据
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
          checkExitType: this.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    },
    //查看轮转手册
    checkHandBook: function(studentIndex) {
      var curStudentData = this.ExitData[studentIndex]; //当前选择的学生数据
      this.$router.push({
        path: "/handbook_mainpage",
        name: "handbook_mainpage",
        query: {
          departmentId: curStudentData.DepartmentId,
          departmentName: curStudentData.DepartmentName,
          courseId: curStudentData.CourseId,
          userId: curStudentData.UserID,
          rotateStatus: curStudentData.RotateStatus,
          checkExitType: this.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    },
    //弹窗展示出科时间选择插件
    openDatePicker: function() {
      this.popupVisiblePicker = true;
    },
    //选择日期的改变事件
    onValuesChange: function(picker, values) {
      var date = "月底";
      if (values[2] == 15) {
        date = "月15日";
      }
      this.selectDate = values[0] + "年" + values[1] + date;
      // this.planStartDate = values[0]+'年'+values[1] + date;
    },
    //关闭日期控件弹窗
    cancelHide: function() {
      this.popupVisiblePicker = false;
    },
    confirmdate: function() {
      if (this.selectDate === this.planStartDate) {
        return;
      }
      this.planStartDate = this.selectDate;
      this.getExitDataInfo();
      this.popupVisiblePicker = false;
    },
    //填写评语
    writeComments: function(studentIndex, mode) {
      var curStudentData = this.ExitData[studentIndex]; //当前选择的学生数据
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
        checkExitType: this.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
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
          checkExitType: this.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    },
    //展示tip提示窗
    showTip: function(type, status) {
      this.isShowTip = true;
      if (type == "chu") {
        this.positionLeft = "50px";
        this.tipMsg = status ? "有处方权" : "无处方权";
      } else {
        this.positionLeft = "";
        this.tipMsg = status ? "是执业医师" : "非执业医师";
      }
      /*var second = 0;  //秒
          //开始计时
          var intNum = setInterval(timer(),1000);

          //设计计时
          function timer(){
            second=second+1;
          }
          //停止展示并暂停计时
          if (second==2) {
            this.isShowTip = false;
            clearInterval(intNum);
          };*/
    }
  },
  created() {
    var index = this.checkExitType.split("_")[1];
    switch (index) {
      case "1": //未申请出科
        this.rotateStatus = 100;

        break;
      case "2": //待写评语
        this.rotateStatus = "101,102";
        break;
      case "3": //已出科
        this.rotateStatus = 200;
        break;
      default:
        this.rotateStatus = "101,102";
        this.checkExitType = "teacher_2";
        this.tabtag = "tabContent2";
        break;
    }
  },
  activated() {
    this.$store.commit("updatateacher_indexSelected", "teacher_exit");
    this.role = this.getLocalStorageValue("userinfo").role;
    var type = this.$route.query.checkExitType;
    if (type != undefined && type != null) {
      var index = type.split("_")[1];
      switch (index) {
        case "1": //未申请出科
          this.rotateStatus = 100;
          this.checkExitType = "teacher_" + index;
          this.tabtag = "tabContent" + index;
          break;
        case "2": //待写评语
          this.rotateStatus = "101,102";
          this.checkExitType = "teacher_" + index;
          this.tabtag = "tabContent" + index;
          break;
        case "3": //已出科
          this.rotateStatus = 200;
          this.checkExitType = "teacher_" + index;
          this.tabtag = "tabContent" + index;
          break;
        default:
          this.rotateStatus = "101,102";
          this.checkExitType = "teacher_2";
          this.tabtag = "tabContent2";
          break;
      }
    }
    if (this.guid != this.getLocalStorageValue("userinfo").guid) {
      this.guid = this.getLocalStorageValue("userinfo").guid;

      this.tabtag = "tabContent2";
      this.rotateStatus = "101,102";
      //设置当前出科时间
      var Year = new Date().getFullYear();
      var Month = new Date().getMonth() + 1;
      Month = Month < 10 ? "0" + Month : Month;
      var date = new Date().getDate();
      date = date > 15 ? Month + "月底" : Month + "月15日";

      this.planStartDate = Year + "年" + date;
      //请求接口获取数据
      this.getExitDataInfo();
    }
  }
};
</script>

<style>
html,
body {
  background-color: #eee;
}
.exit-manage {
  width: 100%;
  margin-top: 55px;
}
.exit-manage .head {
  width: 96%;
  height: 35px;
  margin: 0px auto;
  text-align: center;
  line-height: 35px;
  background: #fff;
  font-size: 16px;
}
.exit-manage .mint-field .mint-cell-title {
  width: 120px !important;
}
.exit-manage .mint-cell {
  min-height: 35px !important;
  background: #eee !important;
}
.exit-manage .mint-field .mint-cell-value input {
  background: #eee !important;
}

.exit-manage ul,
.exit-manage ul li {
  list-style: none;
  margin: 0px;
  padding: 0px;
}

.exit-manage .nav {
  width: 96%;
  height: 35px;
  margin: 0px auto;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}
.exit-manage .nav li {
  float: left;
  line-height: 35px;
  text-align: center;
  background: #ccc;
}
.exit-manage .nav > li:nth-child(1) {
  width: 35%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.exit-manage .nav > li:nth-child(2) {
  width: 31%;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.exit-manage .nav > li:nth-child(3) {
  width: 33.31%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.exit-manage .nav .active {
  background: #37acd3;
  color: #fff;
}

.exit-manage .tab-list {
  position: relative;
  width: 99%;
  margin: 0px auto;
  overflow-y: auto;
  overflow-x: hidden;
}

.exit-manage .popup {
  width: 300px;
  line-height: 28px;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.exit-manage .popup .close {
  position: absolute;
  right: 0px;
  top: 1px;
  width: 30px;
  height: 30px;
  float: right;
  color: #333;
  text-align: center;
}
.exit-manage .popup .close img {
  width: 20px;
  margin-top: 2px;
}
.exit-manage .popup ul li {
  height: 30px;
  line-height: 30px;
}
.exit-manage .popup ul li:nth-of-type(odd) {
  background: #eee;
} /*奇数行样式*/
.exit-manage .popup ul li > div:nth-child(1) {
  float: left;
  width: 43%;
  padding-left: 20px;
  text-align: left;
}
.exit-manage .popup ul li > div:nth-child(2) {
  float: right;
  width: 40%;
  padding-right: 20px;
  text-align: right;
}

/*带箭头小提示窗*/
div.container {
  position: absolute;
  top: 30%;
  right: 40px;
  font-size: 9pt;
  display: block;
  height: 15px;
  width: 65px;
  background-color: transparent;
  *border: 1px solid #666;
}
div.container s {
  position: absolute;
  top: -20px;
  *top: -22px;
  left: 20px; /*是否具有处方权需改动值为50px，箭头向右移动*/
  display: block;
  height: 0;
  width: 0;
  font-size: 0;
  line-height: 0;
  border-color: transparent transparent #666 transparent;
  border-style: dashed dashed solid dashed;
  border-width: 10px;
}
div.container i {
  position: absolute;
  top: -9px;
  *top: -9px;
  left: -10px;
  display: block;
  height: 0;
  width: 0;
  font-size: 0;
  line-height: 0;
  border-color: transparent transparent #fff transparent;
  border-style: dashed dashed solid dashed;
  border-width: 10px;
}
.content {
  border: 1px solid #666;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  position: absolute;
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 5px;
  *top: -2px;
  *border-top: 1px solid #666;
  *border-top: 1px solid #666;
  *border-left: none;
  *border-right: none;
  *height: 102px;
  box-shadow: 3px 3px 4px #999;
  -moz-box-shadow: 3px 3px 4px #999;
  -webkit-box-shadow: 3px 3px 4px #999;
  /* For IE 5.5 - 7 */
  filter: progid:DXImageTransform.Microsoft.Shadow(
      Strength=4,
      Direction=135,
      Color="#999999"
    );
  /* For IE 8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#999999')";
}
</style>
