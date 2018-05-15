<template>
  <div>
    <mt-header fixed title="个人小结" style="background:#37acd3;font-size:16px;">
      <router-link to="/student_evaluate" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="summary-wrap">
      <div style="height:6px;">
      </div>
      <div style="width:100%;overflow:hidden;margin:0px auto;">
        <textarea class="text" id="personalSummary" v-model="summaryInfox"></textarea>
        <p style="text-align:right;">当前字数：
          <span>{{summaryInfoxCount}}</span>  出科小结需大于100字</p>
      </div>
      <div style="margin-top:10px;">
        （结合培训细则对医德医风、组织纪律、服务态度及质量、理论学习、管理病床数、学习的病种、所参加的手术、技术操作、查房时的表现等方面进行小结。）
      </div>

    </div>
    <div style="height:60px;"></div>
    <div class="summary-wrap" style="padding:0px;">
      <div class="btm-btn-group">
        <div style="float:left;width:49%;border-right:1px solid #fff;">
          <div class="btm-btn text-center" v-on:click="toEvaluate">上一项</div>
        </div>
        <div style="float:left;width:49%" v-show="eval_queryInfo.modeTag==='add'">
          <div class="btm-btn text-center" v-on:click="submitData">申请出科</div>
        </div>
        <div style="float:left;width:49%" v-show="eval_queryInfo.modeTag==='edit'">
          <div class="btm-btn text-center" v-on:click="submitData">修改出科小结</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapActions,mapGetters } from 'vuex'
var that
export default {
  name: '',
  components: {},
  data () {
    return {
      popupVisible: false,
      eval_queryInfo: {},
      // summaryInfo: ''
    }
  },
  computed: {
    ...mapGetters([
      'summaryInfo'
    ]),
    summaryInfox: {
      get () {
        // console.log(this.summaryInfo[this.eval_queryInfo.DepartmentId])
        return this.summaryInfo[this.eval_queryInfo.DepartmentId] || ''
      },
      set (val) {
        var strRegex = "((https|http|ftp|rtsp|mms)?://)"
          + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
          + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
          + "|" // 允许IP和DOMAIN（域名）
          + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
          + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
          + "[a-z]{2,6})" // first level domain- .com or .museum
          + "(:[0-9]{1,4})?" // 端口- :80
          + "((/?)|" // a slash isn't required if there is no file name
          + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)";
        var reg = new RegExp(strRegex);
        //reg = reg +'ig';
        reg = /(https|http|ftp|rtsp|mms):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ig;
        val = val.replace(reg, '*');        //屏蔽网址
        val = val.replace(/<[^>].*?>/g, '*');       //屏蔽html代码
        val = val.replace(/select|update|delete|exec|count|insert|'|"|=|;|>|<|%/i, '*'); //屏蔽sql语句 /i意思为忽略大小写
        val = val.replace(/(^\s+)|(\s+$)/g, '');    //去除前后空格
        val = val.replace(/[\ud83c-\udfff]/g, '*'); //屏蔽表情符

        var summaryinfo = this.summaryInfo
        summaryinfo[this.eval_queryInfo.DepartmentId] = val
        this.setsummaryInfo(summaryinfo)
        // }
      }
    },
    summaryInfoxCount () {
      // console.log(this.summaryInfox)
      return this.summaryInfox.length
    }
  },
  created () {
    that = this
  },
  activated () {
    this.initSummary();
  },
  methods: {
    ...mapActions({ setsummaryInfo: 'setsummaryInfo' }),
    //返回上一个页面
    toEvaluate: function () {
      // this.saveSummaryInfo();
      this.$router.push({
        path: '/student_evaluate',
        name: 'student_evaluate',
        query: {

        }
      });
    },
    //申请出科
    submitData: function () {
      var guid = this.getLocalStorageValue('userinfo').guid;
      if (!guid) {
        this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
          this.$router.push('/login');
        });
        return;
      }

      var personalSummary = document.getElementById('personalSummary').value;
      if (!personalSummary || personalSummary.length < 100) {
        this.$messagebox('温馨提示', '您的出科总结不足一百字！');
        document.getElementById('personalSummary').focus();
        return;
      }

      //考勤录入数据
      var data = window.localStorage.getItem('attendInfo');
      if (!data) {
        this.$messagebox('温馨提示', '考勤录入提交异常，请重新录入考勤信息！').then(action => {
          this.$router.push('/student_attendance');
        });
        return;
      }

      //各数据信息id的数据集合
      var idData = window.localStorage.getItem('eval_queryInfo');
      if (!idData) {
        this.$messagebox('温馨提示', '考勤录入提交异常，请重新录入考勤信息！').then(action => {
          this.$router.push('/');
        });
        return;
      }

      data = JSON.parse(data);
      idData = JSON.parse(idData);

      var params = {
        guid: guid,
        HospitalId: idData.HospitalID,
        PlanStartDate: idData.PlanStartDate,//计划开始时间，用这个去查轮转计划表确定唯一
        UserId: idData.UserId,
        DepartmentId: idData.DepartmentId,
        TeacherId: idData.CoachingId,

        IsFullAttendance: data.isFullAttend,
        PersonalLeave: data.affairLeave,
        SickLeave: data.sickLeave,
        SabbaticalLeave: data.sabbaticalLeave,
        Late: data.late,
        Absenteeism: data.absentWork,
        PersonalSummary: personalSummary
      };
      var that = this;
      var planDataIndex = idData.planDataIndex;
      this.$httpPost('exit/studExitCourseInfo', params, function (err, json) {
        //清除缓存中的数据
        window.localStorage.removeItem('attendInfo');
        window.localStorage.removeItem('eval_queryInfo');
        window.localStorage.removeItem('rateJson');
        var msg = '申请出科成功！'
        if(that.eval_queryInfo.modeTag == 'edit' ){
          msg = '修改成功！'
        }
        that.$messagebox('温馨提示', msg).then(action => {
          that.$router.push({
            path: '/rotate_department',
            name: 'rotate_department',
            query: {
              exitSuccess: 'success',
              planDataIndex: planDataIndex
            }
          });
        });
      });
    },
    //录入的内容进行特殊字符屏蔽操作
    shieldingWords: function () {
      var strRegex = "((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)";
      var reg = new RegExp(strRegex);
      //reg = reg +'ig';
      reg = /(https|http|ftp|rtsp|mms):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ig;
      this.summaryInfox = this.summaryInfox.replace(reg, '*');        //屏蔽网址
      this.summaryInfox = this.summaryInfox.replace(/<[^>].*?>/g, '*');       //屏蔽html代码
      this.summaryInfox = this.summaryInfox.replace(/select|update|delete|exec|count|insert|'|"|=|;|>|<|%/i, '*'); //屏蔽sql语句 /i意思为忽略大小写
      this.summaryInfox = this.summaryInfox.replace(/(^\s+)|(\s+$)/g, '');    //去除前后空格
      this.summaryInfox = this.summaryInfox.replace(/[\ud83c-\udfff]/g, '*'); //屏蔽表情符
      // return this.summaryInfox;
    },
    initSummary: function () {
      var eval_queryInfo = window.localStorage.getItem('eval_queryInfo');
      // var summaryInfo = window.localStorage.getItem('summaryInfo');
      // if (summaryInfo) {
      //   var _summaryInfo = JSON.parse(summaryInfo)
      // }
      if (eval_queryInfo) {
        var _eval_queryInfo = JSON.parse(eval_queryInfo);
        if (_eval_queryInfo) {
          this.eval_queryInfo = _eval_queryInfo;
          if (_eval_queryInfo.modeTag === 'edit') {
            this.getExitCourseInfo()
          }
        }
      }
    },
    getExitCourseInfo: function () {
      var vueMdl = this;
      var eval_queryInfo = vueMdl.eval_queryInfo;
      var _date = new Date(eval_queryInfo.PlanStartDate)
      var _year = _date.getFullYear();
      var _month = _date.getMonth() + 1;
      var createYear = _year + '' + _month;
      var params = {
        userID: eval_queryInfo.UserId,
        departmentID: eval_queryInfo.DepartmentId,
        createYear: createYear,
        guid: this.getLocalStorageValue('userinfo').guid
      }
      var url = 'exit/getExitCourseInfoByID';
      this.$httpPost(url, params, function (err, data) {
        var status = data.status;
        if (status == 200) {
          var _attendData = data.data.data
          if (_attendData.length > 0) {
            var attendJson = _attendData[0]
            vueMdl.summaryInfo = attendJson.PersonalSummary;
            // vueMdl.setsummaryInfo(attendJson.PersonalSummary)
            var summaryinfo = vueMdl.summaryInfo
            summaryinfo[vueMdl.eval_queryInfo.DepartmentId] = attendJson.PersonalSummary
            vueMdl.setsummaryInfo(summaryinfo)
          } else {
            var summaryinfo = vueMdl.summaryInfo
            summaryinfo[vueMdl.eval_queryInfo.DepartmentId] = ''
            vueMdl.setsummaryInfo(summaryinfo)
          }

        } else if (status === 201) {

        } else {

        }
      }, 'json')
    },
    saveSummaryInfo: function () {
      var summaryTxt = this.shieldingWords(document.getElementById('personalSummary').innerText);
      this.summaryInfo = summaryTxt;
      var summaryInfo = this.summaryInfo;
      window.localStorage.setItem('summaryInfo', JSON.stringify(summaryInfo))
    }
  }
}
</script>

<style>
body {
  background: #eee;
}

ul {
  padding: 0px;
  margin: 0px;
}
li {
  padding: 0;
  list-style: none;
}
.text {
  width: calc(100% - 10px);
  height: 380px;
  border: 1px solid #ddd;
  outline: none;
  resize: none;
  word-break: break-all;
}
.text:focus {
  border: 1px solid #37acd3 !important;
}

.summary-wrap {
  padding: 43px 5px 0 5px;
}
.summary-wrap > button,
input,
optgroup,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}
.summary-wrap .btm-btn-group {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #37acd3;
}
.summary-wrap .btm-btn-group .btm-btn {
  float: left;
  width: 100%;
  color: #fff;
}

.summary-wrap .text-center {
  text-align: center;
}

.summary-wrap .ul input[type="radio"] {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
}
</style>
