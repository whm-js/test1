<template>
    <mt-popup v-model="popupvalue" position="middle" modal="true">
        <div class="popup">
            <div><img src="../assets/userHeader.png" style="width:100px;margin: 0 auto;padding-top:10px;" /></div>
            <div class="close" @click="closeChild"><img src="../assets/close.png" /></div>
            <ul v-if="StudentInfoData!=''">
                <li>
                    <div>姓名</div>
                    <div class="fontColor">{{StudentInfoData.RealName}}</div>
                </li>
                <li>
                    <div>性别</div>
                    <div class="fontColor">{{StudentInfoData.Sex ? '男':'女'}}</div>
                </li>
                <li>
                    <div>学员身份</div>
                    <div class="fontColor">{{StudentInfoData.Education?StudentInfoData.Education:'-'}}</div>
                </li>
                <li>
                    <div>电话</div>
                    <div class="fontColor">{{StudentInfoData.Telephone?StudentInfoData.Telephone:'-'}}</div>
                </li>
                <li>
                    <div>培训学科</div>
                    <div class="fontColor">{{StudentInfoData.CourseName?StudentInfoData.CourseName:'-'}}</div>
                </li>
                <li>
                    <div>培训年限</div>
                    <div class="fontColor">{{StudentInfoData.TrainingYears===1?'一年制':StudentInfoData.TrainingYears===2?'二年制':StudentInfoData.TrainingYears===3?'三年制':''}}</div>
                </li>
                <li>
                    <div>年级批次</div>
                    <div class="fontColor">{{StudentInfoData.GradeBatch?StudentInfoData.GradeBatch:'-'}}</div>
                </li>
                <li>
                    <div>基地导师</div>
                    <div class="fontColor">{{StudentInfoData.teacherName?StudentInfoData.teacherName:'-'}}</div>
                </li>
                <li>
                    <div>是否具有处方权</div>
                    <div class="fontColor">{{StudentInfoData.IsPrescriptionRight ? '有':'无'}}</div>
                </li>
                <li>
                    <div>是否执业医师</div>
                    <div class="fontColor">{{StudentInfoData.IsPracticingPhysician ? '是':'否'}}</div>
                </li>
                <li>
                    <div>执业证编码</div>
                    <div class="fontColor">{{StudentInfoData.PracticeCode?StudentInfoData.PracticeCode:'-'}}</div>
                </li>
                <li>
                    <div>是否在协同基地培训</div>
                    <div class="fontColor">{{StudentInfoData.isXTBase?'是':'否'}}</div>
                </li>
                <li>
                    <div>协同基地名称</div>
                    <div class="fontColor">{{StudentInfoData.XTBase?StudentInfoData.XTBase:'-'}}</div>
                </li>
                <li>
                    <div>工作单位</div>
                    <div class="fontColor">{{StudentInfoData.WorkPlace?StudentInfoData.WorkPlace:'-'}}</div>
                </li>
            </ul>
            <ul v-else>
                <li style="padding-top:20px;text-align: center;">获取学员信息失败！</li>
            </ul>
        </div>
    </mt-popup>
</template>
<script>
var that;
export default {
  props: {
    userid: [Number, String],
    showStudent: [Boolean]
  },
  data() {
    return {
      StudentInfoData: {},
      StudentID: "",
      popupvalue: false
    };
  },
  watch: {
    userid: function(newData) {
      this.StudentID = newData;
      this.showStudentInfo();
    },
    showStudent: function(newData) {
      this.popupvalue = newData;
    },
    popupvalue: function(newData) {
      if (newData == false) {
        this.$emit("update:showStudent", false);
      }
    }
  },
  created() {
    that = this;
  },
  methods: {
    //获取学员个人信息
    showStudentInfo: function() {
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
        userid: this.StudentID
      };
      this.$httpGet("info/getUserinfo", params, function(err, json) {
        if (err) {
          that.StudentInfoData = "";
          return;
        }
        if (json.data.length >= 1) {
          that.StudentInfoData = json.data[0];
        } else {
          that.StudentInfoData = "";
        }
      });
    },
    closeChild() {
      this.$emit("update:showStudent", false);
    }
  }
};
</script>
<style>

</style>
