<template>
  <div>
    <mt-header fixed title="考核成绩" style="background-color:#37acd3">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right"><span style="font-weight:bold;">1</span>/3</mt-button>
    </mt-header>
    <div style="height:50px;"></div>
    <!--面板1-->
    <div id="panel1" class="exit-panel">
      <!--考勤、成绩-->
      <table cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td>考核结果</td>
            <td style="width:98px;" v-if="UserExitData.AppraiseResult==-1">
            </td>
            <td style="width:98px;color:#5cb85c;" v-else-if="UserExitData.AppraiseResult==1">
                通过
            </td>
            <td style="width:98px;color:red;" v-else-if="UserExitData.AppraiseResult==0">
                不通过
            </td>
          </tr>
          <tr>
            <td>理论考试成绩</td>
            <td>{{UserExitData.TheoryScore}}</td>
          </tr>
          <tr>
            <td>技能考试成绩</td>
            <td>{{UserExitData.SkillScore}}</td>
          </tr>
        </tbody>
      </table>
      <table style="margin-top:10px;">
        <thead>
          <th colspan="2" style="height:45px;color:#37acd3;">考勤情况</th>
        </thead>
        <tbody>
          <tr>
            <td>是否全勤</td>
            <td style="width:98px;">{{UserExitData.IsFullAttendance}}</td>
          </tr>
          <tr>
            <td>事假（次）</td>
            <td>{{UserExitData.PersonalLeave}}</td>
          </tr>
          <tr>
            <td>病假（次）</td>
            <td>{{UserExitData.SickLeave}}</td>
          </tr>
          <tr>
            <td>公休假（次）</td>
            <td>{{UserExitData.SabbaticalLeave}}</td>
          </tr>
          <tr>
            <td>迟到（次）</td>
            <td>{{UserExitData.Late}}</td>
          </tr>
          <tr>
            <td>旷工（次）</td>
            <td>{{UserExitData.Absenteeism}}</td>
          </tr>
        </tbody>
      </table>

      <!--医德医风-->
      <table id="medicine" style="margin-top:10px;">
        <thead>
          <th colspan="3" style="height:45px;color:#37acd3;">医德医风</th>
        </thead>
        <tbody>
          <!--如果库中存在医德医风json-->
          <template v-if="UserExitData.MedicalEthics">
            <template v-for="item in JSON.parse(UserExitData.MedicalEthics)">
              <template v-if="item.ItemList.length==1">
                <tr>
                  <td colspan="2">{{item.ItemName}}</td>
                  <td style="width:98px;">{{item.OptionValue ? item.OptionValue : '-'}}</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(data,index) in item.ItemList">
                  <td v-if="index==0" :rowspan="item.ItemList.length">{{item.ItemName}}</td>
                  <td class="td" v-if="data.OptionName.indexOf('床号')==0">
                    {{item.ItemList[index-1].OptionName.split('：')[0]}}{{data.OptionName}}
                  </td>
                  <td class="td" v-else-if="data.OptionName.indexOf('排名')>=0">
                    {{item.ItemList[index-1].OptionName}}{{data.OptionName}}）
                  </td>
                  <template v-else>
                    <!--针对OptionName为空的几个item进行特殊控制-->
                    <td class="td" v-if="item.ItemName=='服务态度医患关系'">{{data.OptionName ? data.OptionName : '服务态度：'}}</td>
                    <td class="td" v-else-if="item.ItemName=='工作责任心'">{{data.OptionName ? data.OptionName : '工作责任心：'}}</td>
                    <td class="td" v-else-if="item.ItemName=='医疗文书完成情况'">
                      <span v-if="data.OptionValue=='优秀'">完成质量：</span>
                      <span v-else-if="data.OptionValue.indexOf('按时')>=0">是否按时：</span>
                      <span v-else>{{data.OptionName}}</span>
                    </td>
                    <td class="td" v-else>{{data.OptionName}}</td>
                  </template>
                  <td style="width:98px;">{{data.OptionValue ? data.OptionValue : '-'}}</td>
                </tr>
              </template>
            </template>
          </template>
          <!--否则获取本地医德医风json-->
          <template v-else>
            <template v-for="item in MedicineJson">
              <template v-if="item.ItemList.length==1">
                <tr>
                  <td colspan="2">{{item.ItemName}}</td>
                  <td style="width:100px;">{{item.OptionValue ? item.OptionValue : '-'}}</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(data,index) in item.ItemList">
                  <td v-if="index==0" :rowspan="item.ItemList.length">{{item.ItemName}}</td>
                  <td class="td" v-if="data.OptionName.indexOf('床号')==0">
                    {{item.ItemList[index-1].OptionName}}{{data.OptionName}}
                  </td>
                  <td class="td" v-else-if="data.OptionName.indexOf('排名')>=0">
                    {{item.ItemList[index-1].OptionName}}{{data.OptionName}}）
                  </td>
                  <td class="td" v-else>{{data.OptionName}}</td>
                  <td style="width:100px;">{{data.OptionValue ? data.OptionValue : '-'}}</td>
                </tr>
              </template>
            </template>
          </template>
        </tbody>
      </table>

      <div style="height:100px;"></div>

      <div class="exit-footer" v-on:click="nextStep()">
        下一项
      </div>
      
    </div>
  </div>
</template>
<script>
    import store from '@/store/store';
    import {G_MedicalEthicsData} from '../assets/js/medicineJson.js'
    export default {
        name: '',
        components: {},
        data(){ 
            return{
              UserExitData : {},
              MedicineJson : G_MedicalEthicsData
            }
        },
        created(){
          
        },
        activated(){
          window.scrollTo(0, 0);
          this.getExitDataInfo()
        },
        methods: {
          //获取当前学员出科信息
          getExitDataInfo:function(){
            var guid = this.getGuid();
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
            var Year=new Date(this.$route.query.planStartDate).getFullYear();
            var Month=new Date(this.$route.query.planStartDate).getMonth()+1;
            var year = Year+''+Month;

            var that = this;
            var params = {
              userID:userId,
              guid:guid,
              departmentID:departmentId,
              createYear:year
            };
            this.$httpPost('exit/getExitCourseInfoByID', params, function (err, json) {
              that.UserExitData= json.data.data[0];
              that.$store.commit('updataUserExitData',json.data.data[0]);
            });
          },
          //进入下一个页面
          nextStep:function(){
            this.$router.push({
              path:'/exitInfo_evalute',
              name:'exitInfo_evalute',
              query:{
                planStartDate:this.$route.query.planStartDate,
                userId:this.$route.query.userId,
                departmentId:this.$route.query.departmentId,
                teacherId:this.$route.query.teacherId,
                teacherName:this.$route.query.teacherName,
                planDataIndex:this.$route.query.planDataIndex
              }
            });
          }
        }
    }
</script>

<style>
  html,body{background:#eee;}
  .exit-panel{position:relative;min-height:550px;width:100%;margin-top:50x;text-align:center;}
  .exit-footer{position:fixed;bottom:0px;left:0px;width:100%;height:50px;line-height:50px;color:#fff;background:#37acd3;}

  table{width:100%;}
  table,th,td{
    border-spacing: 0;
    border-collapse: collapse;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 0!important;
    border-bottom: 1px solid #ddd;
    }
  td{height:45px;}
  table td:nth-child(1){  
    font-weight:bold;
  }
  .td{font-weight:bold; border-left: 1px solid #ddd;}
</style>
