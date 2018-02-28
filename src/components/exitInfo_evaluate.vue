<template>
  <div style="overflow-x: hidden;">
    <mt-header fixed :title="HtmlTitle" style="background-color:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
      <mt-button slot="right"><span style="font-weight:bold;">2</span>/3</mt-button>
    </mt-header>
    <div style="height:50px;"></div>

    <!--面板2-->
    <div id="panel2" class="exit-panel">

      <div class="panel-title">
          <div class="panel-title-left">评价项目及考核指标</div>
          <div class="panel-title-right">总分：{{SuggestionData.Score ? SuggestionData.Score:'-'}}</div>
      </div>
      <!--如果库中存在评价json-->
      <template v-if="SuggestionData.Content"> 
        <div v-for="item in TeachingJsons">
          <div class="evaluate-panel">
            <h4 class="evaluate-title">{{item.ItemName}}（{{item.ItemScore}}分）</h4>
            <ul style="width:100%;">
              <li class="evaluate-item" v-for="data in item.ItemOptions">
                <div class="evaluate-item-left">{{data.OptionName}}</div>
                <div class="evaluate-item-right" v-if="data.SelectedGrade==-1">-</div>
                <div class="evaluate-item-right" v-else>{{data.SelectedGrade}}分</div>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <!--否则获取本地评价json-->
      <template v-else>
        <div v-for="item in TeachingJsons">
          <div class="evaluate-panel">
            <h4 class="evaluate-title">{{item.ItemName}}（{{item.ItemScore}}分）</h4>
            <ul style="width:100%;">
              <li class="evaluate-item" v-for="data in item.ItemOptions">
                <div class="evaluate-item-left">{{data.OptionName}}</div>
                <div class="evaluate-item-right" v-if="data.SelectedGrade != -1">{{data.SelectedGrade}}分</div>
                <div class="evaluate-item-right" v-else>-</div>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <div class="evaluate-panel">
        <h4 class="evaluate-title">意见或建议</h4>
        <ul style="width:100%;">
          <li class="evaluate-item" style="padding-top:10px;padding-bottom:5px;overflow: hidden;word-break: break-all;">
            {{SuggestionData.Suggestion}}
          </li>
        </ul>
      </div>

      <div class="panel-title" style="margin-top:20px;">
          <div class="panel-title-left2">整体评价：</div>
          <div class="panel-title-right2">{{SuggestionData.OverallEval ? SuggestionData.OverallEval : '-'}}</div>
      </div>

      <div class="exit-footer">
        <div style="float:left;width:50%;border-right:1px solid #fff;" v-on:click="preStep()">上一项</div>
        <div style="float:left;width:49%;" v-on:click="nextStep()">下一项</div>
      </div>
    </div>
    <div style="height:100px;"></div>
  </div>
</template>
<script>
    import {Teachingdata} from '../assets/js/teachingJson.js'
    import {Evaluationdata} from '../assets/js/evaluationJson.js'

    export default {
        name: '',
        components: {},
        activated(){
          window.scrollTo(0, 0);
          this.getSuggestionInfo();
        },
        data(){ 
            return{
              SuggestionData : {},
              HtmlTitle : this.$route.query.checkExitType ? '评价学员':'评价带教老师',
              TeachingJsons : this.$route.query.checkExitType ? Evaluationdata.EvaluationItems:Teachingdata.TeachingItems
            }
        },
        methods: {
          //获取老师评语
          getSuggestionInfo:function(){
            var guid = this.getLocalStorageValue('userinfo').guid;
            if(!guid){
              this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
                this.$router.push('/login');
              });
              return;
            }
            var userId = this.$route.query.userId;
            if(!userId){
              this.$messagebox('温馨提示', '页面请求无效，请重新进入！').then(action => {
                this.$router.push('/');
              });
              return;
            }
            var departmentId = this.$route.query.departmentId;
            if(!departmentId){
              this.$messagebox('温馨提示', '页面请求无效，请重新进入！').then(action => {
                this.$router.push('/');
              });
              return;
            }
            var planStartDate=this.$route.query.planStartDate;
            if(!planStartDate){
              this.$messagebox('温馨提示', '页面请求无效，请重新进入！').then(action => {
                this.$router.push('/');
              });
              return;
            }
            var teacherId=this.$route.query.teacherId;
            if(!teacherId){
              this.$messagebox('温馨提示', '页面请求无效，请重新进入！').then(action => {
                this.$router.push('/');
              });
              return;
            }
            var teacherName=this.$route.query.teacherName;
            if(!teacherName){
              this.$messagebox('温馨提示', '页面请求无效，请重新进入！').then(action => {
                this.$router.push('/');
              });
              return;
            }
            //查看出科情况类型：teacher为教师查看，为空则是学生查看
            var appraisalType = this.$route.query.checkExitType ? 1:0;

            var params = {
              guid:guid,
              PlanStartDate:planStartDate,
              AppraisalType:appraisalType,
              UserId:userId,
              DepartmentId:departmentId,
              TeacherId:teacherId,
              TeacherName:teacherName
            };
            var that = this;
            that.$httpPost('rotate/getSuggestion', params, function (err, json) {
              that.SuggestionData= json.data.data[0];
              if (that.SuggestionData.Content) {
                that.TeachingJsons = that.$route.query.checkExitType ? JSON.parse(that.SuggestionData.Content).EvaluationItems:JSON.parse(that.SuggestionData.Content).TeachingItems;
              } else{
                that.TeachingJsons = that.$route.query.checkExitType ? Evaluationdata.EvaluationItems:Teachingdata.TeachingItems;
              };
            });
          },
          //返回上一个页面
          preStep:function(){
            this.$router.push({
              path:'/exitInfo',
              name:'exitInfo',
              query:{
                planStartDate:this.$route.query.planStartDate,
                userId:this.$route.query.userId,
                departmentId:this.$route.query.departmentId,
                teacherId:this.$route.query.teacherId,
                teacherName:this.$route.query.teacherName,
                planDataIndex:this.$route.query.planDataIndex, //页面跳转首页索引参数
                checkExitType:this.$route.query.checkExitType
              }
            });
          },
          //进入下一个页面
          nextStep:function(){
            this.$router.push({
              path:'/exitInfo_summary',
              name:'exitInfo_summary',
              query:{
                planStartDate:this.$route.query.planStartDate,
                userId:this.$route.query.userId,
                departmentId:this.$route.query.departmentId,
                teacherId:this.$route.query.teacherId,
                teacherName:this.$route.query.teacherName,
                planDataIndex:this.$route.query.planDataIndex, //页面跳转首页索引参数
                checkExitType:this.$route.query.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          },
          //页面头部返回事件控制
          backClick:function(){
            var path = this.$route.query.checkExitType ? '/teacher_index/teacher_exit/':'/index/rotate_department/';
            this.$router.push({
              path:path,
              name:'',
              query:{
                planDataIndex:this.$route.query.planDataIndex,
                checkExitType:this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          }
        }
    }
</script>

<style>
  html,body{background:#eee;}
  .exit-panel{position:relative;min-height:580px;width:100%;text-align:center;}
  .exit-footer{position:fixed;bottom:0px;left:0px;width:100%;height:50px;line-height:50px;color:#fff;background:#37acd3;}

  .panel-title{width:100%;height:45px;margin: 0px auto;margin-bottom:20px;line-height:45px;font-weight:bold;border:1px solid #ddd;background:#fff;}
  .panel-title-left{float:left;width:60%;padding-right:20px;}
  .panel-title-right{float:right;width:25%;padding-right:10px;}


  .panel-title-left2{float:left;width:50%;text-align:right;}
  .panel-title-right2{float:right;width:48%;text-align:left;}


  ul,li{margin:0px;padding:0px;list-style: none;}
  .evaluate-panel{width:100%;margin: 0px auto;margin-bottom:10px;background:#fff;}
  .evaluate-title{height:40px;margin:0px;line-height:40px;color:#37acd3;}
  .evaluate-item{min-height:50px;padding:0px 15px;text-align:left;border-bottom:1px solid #ccc;overflow:hidden;}
  .evaluate-item-left{float:left;width:90%;margin-top:15px;}
  .evaluate-item-right{float:right;width:10%;margin-top:15px;}
</style>
