<template>
  <div class="secretary_enter">

    <div class="head" @click="openDatePicker()">

      <strong>

        <span style="float:left;margin-left:10px;">计划入科时间：</span>

        <span class="fontColor" style="float:right;margin-right:15px;">

          <span>{{planStartDate}}</span>

          <i slot="icon" class="icon iconfont icon-caret-down" style="font-size:14px;"></i>

        </span>

      </strong>

    </div>

    <!--tab页签头部-->

    <ul class="nav">

      <li id="tabTitle1" :style="{width:tabwidth}" v-bind:class="[{active:tabtag==='tabContent1'},'tabli1']" v-if="hospitalId!==1" v-on:click="tabClick(1,'0')">未批准</li>

      <li id="tabTitle2" :style="{width:tabwidth}" v-bind:class="{active:tabtag==='tabContent2','tabli1':hospitalId===1,'tabli2':hospitalId!==1}" v-on:click="tabClick(2,'2')">未确认入科</li>

      <li id="tabTitle3" :style="{width:tabwidth}" v-bind:class="[{active:tabtag==='tabContent3'},'tabli3']" v-on:click="tabClick(3,'100,101,102,114,200')">已入科</li>

    </ul>

    <!--tab页签内容-->

    <!--未申请出科 start-->

    <div id="tabContent1" v-show="tabtag==='tabContent1'" class="tab-list">

      <studentList :ExitDatas="ExitData" :Status="rotateStatus" :role="role" :ExitType="checkExitType" :fromType="'secretary_enter'"></studentList>

    </div>

    <!--未申请出科 end-->

    <!--待写评语 start-->

    <div id="tabContent2" v-show="tabtag==='tabContent2'" class="tab-list">

      <student-list :ExitDatas="ExitData" :Status="rotateStatus" :role="role" :ExitType="checkExitType" :fromType="'secretary_enter'"></student-list>

    </div>

    <!--待写评语 end-->

    <!--已出科 start-->

    <div id="tabContent3" v-show="tabtag==='tabContent3'" class="tab-list">

      <student-list :ExitDatas="ExitData" :Status="rotateStatus" :role="role" :ExitType="checkExitType" :fromType="'secretary_enter'"></student-list>

    </div>

    <!--已出科 end-->

    <!--日期控件弹窗-->

    <mt-popup v-model="popupVisiblePicker" position="bottom" style="width:100%;">

      <div class="picker-toolbar">

        <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>

        <span class="mint-datetime-action mint-datetime-confirm" @click="confirmdate">确定</span>

      </div>

      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>

    </mt-popup>

  </div>
</template>
<script>
import studentList from "@/components/studentList";

var curYear = new Date().getFullYear();

var curMonth = new Date().getMonth();
export default {
  name: "",

  components: { studentList },

  data () {
    return {
      guid: this.getLocalStorageValue("userinfo").guid,
      role: "",
      hospitalId: -1,
      tabwidth: '33%',
      ExitData: [],

      rotateStatus: "",

      popupVisiblePicker: false, //是否展示日期弹窗

      selected: "",

      selectedName: "",

      planStartDate: "",

      checkExitType: "", //查看出科情况类型

      tabtag: "",

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

          values: ["01", "16"],

          className: "slot3",

          textAlign: "right",

          defaultIndex: 0,

          value: 0
        }
      ] //时间控件可选择值json配置
    };
  },

  computed: {},

  created () {
    var index = this.checkExitType.split("_")[1];
    switch (index) {
      case "1": //未申请出科
        this.rotateStatus = 0;
        this.checkExitType = "secretary_" + index;
        this.tabtag = "tabContent" + index;
        break;
      case "2": //待写评语
        this.rotateStatus = 2;
        this.checkExitType = "secretary_" + index;
        this.tabtag = "tabContent" + index;
        break;
      case "3": //已出科
        this.rotateStatus = "100,101,102,114,200";
        this.checkExitType = "secretary_" + index;
        this.tabtag = "tabContent" + index;
        break;
      default:
        this.rotateStatus = 2;
        this.checkExitType = "secretary_2";
        this.tabtag = "tabContent2";
        break;
    }
    this.guid = this.getLocalStorageValue("userinfo").guid;

    this.tabtag = "tabContent2";
    this.rotateStatus = 2;
    //设置当前出科时间
    var Year = new Date().getFullYear();
    var Month = new Date().getMonth() + 1;
    Month = Month < 10 ? "0" + Month : Month;
    var date = new Date().getDate();
    date = date > 15 ? Month + "月16日" : Month + "月01日";

    this.planStartDate = Year + "年" + date;
    //请求接口获取数据
    this.getExitDataInfo();
  },

  activated () {
    this.$store.commit("updatasecretary_indexSelected", "secretary_enter");
    // if (this.guid != this.getLocalStorageValue("userinfo").guid) {
    //   this.guid = this.getLocalStorageValue("userinfo").guid;
    // }
    this.role = this.getLocalStorageValue("userinfo").role;
    this.hospitalId = this.getLocalStorageValue("userinfo").hospitalId;
    if(this.hospitalId ===1){
      this.tabwidth = '49.9%'
    }

    var type = this.$route.query.checkExitType;
    if (type != undefined && type != null) {
      var index = this.$route.query.checkExitType.split("_")[1];
      switch (index) {
        case "1": //未申请出科
          this.rotateStatus = 0;
          this.tabClick(index, this.rotateStatus);
          this.checkExitType = "secretary_" + index;
          this.tabtag = "tabContent" + index;
          this.tabClick(index, this.rotateStatus);
          break;
        case "2": //待写评语
          this.rotateStatus = 2;
          this.tabClick(index, this.rotateStatus);
          this.checkExitType = "secretary_" + index;
          this.tabtag = "tabContent" + index;
          this.tabClick(index, this.rotateStatus);
          break;
        case "3": //已出科
          this.rotateStatus = "100,101,102,114,200";
          this.checkExitType = "secretary_" + index;
          this.tabtag = "tabContent" + index;
          this.tabClick(index, this.rotateStatus);
          break;
        default:
          this.rotateStatus = 2;
          this.checkExitType = "secretary_2";
          this.tabtag = "tabContent2";
          this.tabClick(2, this.rotateStatus);
          break;
      }
    }
    if (this.guid != this.getLocalStorageValue("userinfo").guid) {
      this.guid = this.getLocalStorageValue("userinfo").guid;

      this.tabtag = "tabContent2";
      this.rotateStatus = 2;
      //设置当前出科时间
      var Year = new Date().getFullYear();
      var Month = new Date().getMonth() + 1;
      Month = Month < 10 ? "0" + Month : Month;
      var date = new Date().getDate();
      date = date > 15 ? Month + "月16日" : Month + "月01日";

      this.planStartDate = Year + "年" + date;
      //请求接口获取数据
      this.getExitDataInfo();
    }
  },
  methods: {
    //tab页签单击事件

    tabClick: function (index, rotateStatus) {
      //请求接口获取对应tab页签数据

      

      this.ExitData = [];

      this.rotateStatus = rotateStatus;

      this.getExitDataInfo();

      this.checkExitType = "secretary_" + index;

      this.tabtag = "tabContent" + index;
    },
    //弹窗展示出科时间选择插件
    openDatePicker: function () {
      this.popupVisiblePicker = true;
    },
    //选择日期的改变事件
    onValuesChange: function (picker, values) {
      var date = "月01日";
      if (values[2] == 16) {
        date = "月16日";
      }
      this.selectDate = values[0] + "年" + values[1] + date;
      // this.planStartDate = values[0]+'年'+values[1] + date;
    },
    //关闭日期控件弹窗
    cancelHide: function () {
      this.popupVisiblePicker = false;
    },
    confirmdate: function () {
      if (this.selectDate === this.planStartDate) {
        return;
      }
      this.planStartDate = this.selectDate;
      this.getExitDataInfo();
      this.popupVisiblePicker = false;
    },
    //获取学员出科列表信息

    getExitDataInfo: function () {
      // var guid = this.guid;

      if (!this.guid) {
        this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(
          action => {
            this.$router.push("/login");
          }
        );

        return;
      }
      if (this.rotateStatus == 2 && this.hospitalId === 1) {
        this.rotateStatus = '0,2'
      }

      var that = this;

      var date = this.planStartDate;

      // this.$messagebox(date).then(action => {
      //   return;
      // });
      // if (this.planStartDate.indexOf("月底") > -1) {
      //   date = this.planStartDate.replace(/底/, "16日");
      // } else {
      //   date = this.planStartDate;
      // }

      date = date.replace(/年/, "-");

      date = date.replace(/月/, "-");

      date = date.replace(/日/, "");
      // this.$messagebox(date).then(action => {
      //   return;
      // });
      date = this.$formatDate(new Date(date), "yyyy-MM-dd");

      // this.$messagebox(date).then(action => {
      //   return;
      // });

      var params = {
        guid: this.guid,

        planOutDate: date,

        rotateStatus: that.rotateStatus,

        curPage: 1,

        showCount: 10
      };

      this.$httpPost("exit/getRotatePlanList", params, function (err, json) {
        that.ExitData = json.data.data;
      });
    }
  },

  watch: {}
};
</script>
<style>
html,
body {
  background-color: #eee;
}
.secretary_enter {
  width: 100%;
  margin-top: 55px;
  margin-bottom: 55px;
}
.secretary_enter .head {
  width: 96%;
  height: 35px;
  margin: 0px auto;
  text-align: center;
  line-height: 35px;
  background: #fff;
  font-size: 16px;
}
.secretary_enter .mint-field .mint-cell-title {
  width: 120px !important;
}
.secretary_enter .mint-cell {
  min-height: 35px !important;
  background: #eee !important;
}
.secretary_enter .mint-field .mint-cell-value input {
  background: #eee !important;
}

.secretary_enter ul,
.secretary_enter ul li {
  list-style: none;
  margin: 0px;
  padding: 0px;
}

.secretary_enter .nav {
  width: 96%;
  height: 35px;
  margin: 0px auto;
  margin-top: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.secretary_enter .nav li {
  float: left;
  line-height: 35px;
  text-align: center;
  background: #ccc;
}
/* .secretary_enter .nav > li:nth-child(1) {
  width: 49.9%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.secretary_enter .nav > li:nth-child(2) {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.secretary_enter .nav > li:nth-child(3) {
  width: 33.31%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
} */

.secretary_enter .tabli1 {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.secretary_enter .tabli2 {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
}

.secretary_enter .tabli3 {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.secretary_enter .nav .active {
  background: #37acd3;
  color: #fff;
}

.secretary_enter .tab-list {
  width: 96%;
  margin: 0px auto;
  overflow-y: auto;
  overflow-x: hidden;
}

.secretary_enter .popup {
  width: 300px;
  line-height: 28px;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.secretary_enter .popup .close {
  position: absolute;
  right: 0px;
  top: 1px;
  width: 30px;
  height: 30px;
  float: right;
  color: #333;
  text-align: center;
}
.secretary_enter .popup .close img {
  width: 20px;
  margin-top: 2px;
}
.secretary_enter .popup ul li {
  height: 30px;
  line-height: 30px;
}
.secretary_enter .popup ul li:nth-of-type(odd) {
  background: #eee;
} /*奇数行样式*/
.secretary_enter .popup ul li > div:nth-child(1) {
  float: left;
  width: 43%;
  padding-left: 20px;
  text-align: left;
}
.secretary_enter .popup ul li > div:nth-child(2) {
  float: right;
  width: 40%;
  padding-right: 20px;
  text-align: right;
}
</style>
