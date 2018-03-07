<template>
    <div class="enterpage">
        <mt-header fixed title="确认入科" style="background-color:#37acd3;font-size:16px;">
            <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
        </mt-header>
        <div style="text-align: center;">
            <img src="../assets/userHeader.png" width="100px" style="margin: 0 auto;padding-top:10px;" />
            <p style="font-size:16px;">{{RealName}}({{UserName}})</p>
            <p style="font-size:16px;">{{PlanStartDate}}至{{PlanEndDate}}</p>
        </div>
        <div>
            <div @click="open('datePicker')">
                <mt-field label="实际入科时间" type="text" readonly="readonly" disableClear placeholder="" v-model="enterTime"></mt-field>
            </div>
            <div @click="openpopup">
                <mt-field label="带教老师" type="text" readonly="readonly" disableClear placeholder="请选择带教老师" v-model="CoachingName"></mt-field>
            </div>
            <mt-field label="入科验证码" type="number" placeholder="请输入入科验证码" v-model="DynamicCode"></mt-field>
        </div>

        <mt-datetime-picker ref="datePicker" type="date" :startDate="startDate" :endDate="endDate" v-model="dateValue" @confirm="handleChange">
        </mt-datetime-picker>

        <div class="mint-tabbar is-fixed">
            <mt-button type="primary" size="large" @click.native="enterClick" style="background-color: rgb(55, 172, 211);border-radius: 0;">确认入科</mt-button>
            <!-- <div style="float:left;width:49%;border-right:1px solid #fff;" v-on:click="preStep()">上一项</div>
        <div style="float:left;width:50%;" v-on:click="nextStep()">同意出科</div> -->
        </div>

        <mt-popup v-model="popupVisiblePicker" position="bottom" style="width:100%;">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="confirmdate">确定</span>
            </div>
            <mt-picker :slots="slots" value-key="NameStr" @change="onValuesChange"></mt-picker>
        </mt-popup>



    </div>
</template>
<script>
var that;
var pickerArray = [];
export default {
  data() {
    return {
      guid: this.getLocalStorageValue('userinfo').guid,
      popupVisiblePicker: false,
      RealName: "",
      UserName: "",
      DynamicCode: "",
      CoachingID: "",
      CoachingName: "",
      PlanStartDate: this.$route.query.planStartDate,
      PlanEndDate: this.$route.query.planEndDate,
      CoachingNameArr: [],
      enterTime: this.$formatDate(new Date(this.$route.query.planStartDate), "yyyy-MM-dd"),
      startDate: new Date("1990-01-01"),
      endDate: new Date(),
      dateValue: new Date(),
      slots: [
        {
          flex: 1,
          values: pickerArray,
          className: "slot1",
          textAlign: "center",
          defaultIndex: -1,
          value: -1
        }
      ] //时间控件可选择值json配置
    };
  },
  methods: {
    openpopup() {
      if(this.slots[0].values!=[]){
      this.getDepartTeacher();
      }
      this.popupVisiblePicker = true;
    },
    cancelHide() {
      this.popupVisiblePicker = false;
    },
    confirmdate() {
      this.popupVisiblePicker = false;
    },
    onValuesChange(picker, values) {
        if(values[0]==undefined){
            return;
        }
        this.CoachingName = values[0].RealName
        this.CoachingID = values[0].UserID
    },
    getDepartTeacher() {
      var params = {
        guid: this.getLocalStorageValue('userinfo').guid,
        departmentID: this.$route.query.departmentId,
        planStartDate: this.$route.query.planStartDate
      };
      this.$httpPost("entry/getDepartTeacher", params, function(err, json) {
        if (json.status == 200) {
          pickerArray = json.data.datas;
          for(var i=0;i<pickerArray.length;i++){
            pickerArray[i].NameStr = pickerArray[i].RealName+'(已带教'+pickerArray[i].StudentCount+'人)'
          }
          // that.slots[0].values=pickerArray;
          that.$set(that.slots[0], 'values', pickerArray)
        } else {
          return [];
        }
      });
    },
    enterClick() {
      if (this.TheoryScore === "") {
        this.$Toast("请输入考核成绩!");
        return;
      }
      if (this.SkillScore === "") {
        this.$Toast("请输入考核成绩!");
        return;
      }
      var startdate = this.$route.query.planStartDate;
      var date = new Date(startdate);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var CreateYear = year + month;
      var params = {
        guid: this.guid,
        IdStr:this.CoachingID,
        NameStr:this.CoachingName,
        mdlDateTimes:this.enterTime,
        departmentID:this.$route.query.departmentId,
        planStartDate: this.$route.query.planStartDate,
        planEndDate: this.$route.query.planEndDate,
        userID: this.$route.query.userId,
        dynamicCode:this.DynamicCode

      };
      this.$httpPost("entry/setEntryInfo", params, function(err, json) {
        if(err){
          that.$Toast('入科验证码错误！');
          return
        }
        if (json.status == 200) {
          that.$Toast("入科成功!");
          that.$router.push({
              path:'/secretary_index/secretary_enter/',
              query:{
                checkExitType:'secretary_3'  //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
          });
        //   that.$router.push("/secretary_index/secretary_enter/");
        } else {
          that.$Toast(json.msg);
          return;
        }
      });
    },
    backClick: function() {
      this.$router.push("/secretary_index/secretary_enter/");
    },
    attendChange(event) {
      //性别点击事件
      var value = event.currentTarget.value;
      value = Number(value);
      this.isFullAttend = value;
    },
    open: function(picker) {
      this.$refs[picker].open();
    },
    handleChange: function(value) {
      this.dateValue = this.$formatDate(new Date(value), "yyyy-MM-dd");
      this.enterTime = this.dateValue;
    }
  },
  created() {
    that = this;
    this.guid = this.getLocalStorageValue('userinfo').guid;
    this.getDepartTeacher();
  },
  activated() {
    if (this.guid !== this.getLocalStorageValue('userinfo').guid) {
      this.guid = this.getLocalStorageValue('userinfo').guid;
    }
    // this.getDepartTeacher();
    this.RealName = this.$route.query.RealName;
    this.UserName = this.$route.query.UserName;
    
  }
};
</script>
<style>
.enterpage {
  margin-top: 60px;
  margin-bottom: 55px;
}
.enterpage .mint-cell-value input {
  text-align: right;
  background-color: white;
}
</style>
