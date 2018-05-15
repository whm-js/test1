<template>
  <div>
    <mt-header fixed title="个人小结" style="background:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
    </mt-header>

    <div style="margin-top: 50px;">
      <h4 style="margin-top:5px;">个人小结：</h4>
      <div>
        （结合培训细则对医德医风、组织纪律、服务态度及质量、理论学习、管理病床数、学习的病种、所参加的手术、技术操作、查房时的表现等方面进行小结。）
      </div>
      <div class="t-context">{{summaryInfo ? summaryInfo : '-'}}</div>

      <h4>带教老师评语：</h4>
      <textarea class="textarea-text" id="personalSummary" v-model="teacherCommentx"></textarea>
      <p style="text-align:right;">当前字数：
        <span>{{teacherCommentxCount}}</span> 老师总结需大于100字</p>
    </div>

    <div style="height:60px;"></div>

    <div class="t-exit-footer">
      <div style="float:left;width:49%;border-right:1px solid #fff;" v-on:click="toEvaluate()">上一项</div>
      <div style="float:left;width:50%;" v-show="eval_queryInfo.modeTag==='add'" v-on:click="submitData()">提交审核</div>
      <div style="float:left;width:50%;" v-show="eval_queryInfo.modeTag==='edit'" v-on:click="submitData()">修改审核</div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: '',
  components: {},
  data () {
    return {
      popupVisible: false,
      eval_queryInfo: {},
      focusFlag: 'autofocus', //获取焦点
      summaryInfo: ''  //个人小结
      // teacherComment:''  //老师评语
    }
  },
  computed: {
    ...mapGetters([
      'teacherComment'
    ]),
    teacherCommentx: {
      get () {
        console.log(this.teacherComment)
        return this.teacherComment[this.eval_queryInfo.UserId] || ''
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

        var teacherComment = this.teacherComment
        teacherComment[this.eval_queryInfo.UserId] = val
        this.setteacherComment(teacherComment)
        // }
      }
    },
    teacherCommentxCount () {
      return this.teacherCommentx.length
    }
  },
  created () {

  },
  activated () {
    window.scrollTo(0, 0);
    this.initSummary();
  },
  methods: {
    ...mapActions({ setteacherComment: 'setteacherComment' }),
    //返回上一个页面
    toEvaluate: function () {
      // this.saveSummaryInfo();
      this.$router.push({
        path: '/teacher_evaluate',
        name: 'teacher_evaluate',
        query: {
          planDataIndex: this.$route.query.planDataIndex,
          checkExitType: this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    },
    //提交审核
    submitData: function () {
      var guid = this.getLocalStorageValue('userinfo').guid;
      if (!guid) {
        this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
          this.$router.push('/login');
        });
        return;
      }

       if (!this.teacherCommentx || this.teacherCommentx.length < 100) {
        this.$messagebox('温馨提示', '您的评语不足一百字！');
        return;
      }

      //进入填写评语页面前传递的数据
      var idData = window.localStorage.getItem('eval_queryInfo');
      if (!idData) {
        this.$messagebox('温馨提示', '页面请求无效，请退出重新进入页面！').then(action => {
          this.$router.push({
            path: '/teacher_index/teacher_exit/',
            name: '',
            query: {
              planDataIndex: this.$route.query.planDataIndex,
              checkExitType: this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
            }
          });
        });
        return;
      }
      idData = JSON.parse(idData);

      //考勤录入数据、医德医风json
      var attendData = window.localStorage.getItem(this.eval_queryInfo.UserId + '_attendInfo');
      if (!attendData) {
        this.$messagebox('温馨提示', '考勤录入提交异常，请重新录入考勤信息！').then(action => {
          this.$router.push({
            path: '/teacher_evaluate',
            name: '',
            query: {
              planDataIndex: this.$route.query.planDataIndex,
              checkExitType: this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
            }
          });
        });
        return;
      }

      attendData = JSON.parse(attendData);

      var Year = new Date(idData.PlanStartDate).getFullYear();
      var Month = new Date(idData.PlanStartDate).getMonth() + 1;
      var year = Year + '' + Month;

      var params = {
        guid: guid,
        //HospitalId: idData.HospitalID,
        PlanStartDate: idData.PlanStartDate,//计划开始时间，用这个去查轮转计划表确定唯一
        UserId: idData.UserId,
        DepartmentId: idData.DepartmentId,
        TeacherId: idData.CoachingId,
        CreateYear: year,

        IsFullAttendance: attendData.isFullAttend,
        PersonalLeave: attendData.affairLeave,
        SickLeave: attendData.sickLeave,
        SabbaticalLeave: attendData.sabbaticalLeave,
        Late: attendData.late,
        Absenteeism: attendData.absentWork,
        MedicalEthics: JSON.stringify(attendData.medicineJson),
        TeacherComment: this.teacherCommentx
      };

      var that = this;
      var planDataIndex = idData.planDataIndex;
      this.$httpPost('exit/exit_teacherComment', params, function (err, json) {
        //清除缓存中的数据
        window.localStorage.removeItem(that.eval_queryInfo.UserId + '_attendInfo');
        window.localStorage.removeItem('eval_queryInfo');
        window.localStorage.removeItem(that.eval_queryInfo.UserId + '_rateJson');
        window.localStorage.removeItem(that.eval_queryInfo.UserId + '_teacherComment');

        that.$messagebox('温馨提示', '提交审核成功！').then(action => {
          that.$router.push({
            path: '/teacher_index/teacher_exit/',
            name: 'teacher_exit',
            query: {
              exitSuccess: 'success',
              planDataIndex: planDataIndex
            }
          });
        });
      });
    },
    //录入的内容进行特殊字符屏蔽操作
    shieldingWords: function (str) {
      if (!str) {
        return str;
      };
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
      str = str.replace(reg, '*');        //屏蔽网址
      str = str.replace(/<[^>].*?>/g, '*');       //屏蔽html代码
      str = str.replace(/select|update|delete|exec|count|insert|'|"|=|;|>|<|%/i, '*'); //屏蔽sql语句 /i意思为忽略大小写
      str = str.replace(/(^\s+)|(\s+$)/g, '');    //去除前后空格
      str = str.replace(/[\ud83c-\udfff]/g, '*'); //屏蔽表情符
      return str;
    },
    //初始化页面数据
    initSummary: function () {
      //进入填写评语页面前传递的数据
      var eval_queryInfo = window.localStorage.getItem('eval_queryInfo');
      if (!eval_queryInfo) {
        this.$messagebox('温馨提示', '页面请求无效，请退出重新进入页面！').then(action => {
          this.$router.push('/teacher_index/teacher_exit/');
        });
        return;
      };

      eval_queryInfo = JSON.parse(eval_queryInfo);
      this.eval_queryInfo = eval_queryInfo;

      this.getExitCourseInfo();
    },
    //从数据库中获取学员小结和老师评语
    getExitCourseInfo: function () {
      var guid = this.getLocalStorageValue('userinfo').guid;
      if (!guid) {
        this.$messagebox('温馨提示', '登录状态无效了，请重新登录！').then(action => {
          this.$router.push('/login');
        });
        return;
      }
      var vueMdl = this;
      var _date = new Date(vueMdl.eval_queryInfo.PlanStartDate)
      var _year = _date.getFullYear();
      var _month = _date.getMonth() + 1;
      var createYear = _year + '' + _month;
      var params = {
        userID: vueMdl.eval_queryInfo.UserId,
        departmentID: vueMdl.eval_queryInfo.DepartmentId,
        createYear: createYear,
        guid: guid
      };
      this.$httpPost('exit/getExitCourseInfoByID', params, function (err, json) {
        var attendData = json.data.data;
        if (attendData.length > 0) {
          vueMdl.summaryInfo = attendData[0].PersonalSummary;
          // vueMdl.teacherComment = attendData[0].TeacherComment;

          if (attendData[0].TeacherComment !== null) {
            var teacherComment = vueMdl.teacherComment
            teacherComment[vueMdl.eval_queryInfo.UserId] = attendData[0].TeacherComment
            vueMdl.setteacherComment(teacherComment)
          }
        } else {
          //从缓存中获取上次录入的评语
          // var teacherComment = window.localStorage.getItem(vueMdl.eval_queryInfo.UserId + '_teacherComment');
          // vueMdl.teacherComment = teacherComment ? teacherComment : '';

          var teacherComment = vueMdl.teacherComment
          teacherComment[vueMdl.eval_queryInfo.UserId] = ''
          vueMdl.setteacherComment(teacherComment)

        }
      }, 'json');
    },
    //缓存录入的教师评语本地
    saveSummaryInfo: function () {
      var summaryTxt = this.shieldingWords(document.getElementById('personalSummary').innerText);
      this.teacherComment = summaryTxt;
      window.localStorage.setItem(this.eval_queryInfo.UserId + '_teacherComment', JSON.stringify(this.teacherComment));
    },
    //页面头部返回事件控制
    backClick: function () {
      // this.saveSummaryInfo();
      this.$router.push({
        path: '/teacher_index/teacher_exit/',
        name: '',
        query: {
          planDataIndex: this.$route.query.planDataIndex,
          checkExitType: this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
        }
      });
    }
  }
}
</script>

<style>
body {
  background: #eee;
}
ul,
li {
  padding: 0px;
  margin: 0px;
  list-style: none;
}
h4 {
  margin-bottom: 10px !important;
}
.t-context {
  width: 92%;
  min-height: 250px;
  padding: 8px;
  margin: 0px auto;
  margin-top: 10px;
  line-height: 25px;
  overflow-x: hidden;
  background: #fff;
  border: 1px solid #ddd;
}
.textarea-text {
  width: 94%;
  min-height: 250px;
  padding: 8px;
  margin: 0px auto;
  font: inherit;
  color: inherit;
  border: 1px solid #9edaef;
  overflow-x: hidden;
  overflow-y: auto;
  outline: none;
  resize: none;
}
.textarea-text:focus {
  border: 1px solid #37acd3 !important;
}

.t-exit-footer {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  background: #37acd3;
}
</style>
