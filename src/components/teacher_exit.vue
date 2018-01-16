<template>
  <div class="exit-manage">
    <div class="head" @click="openDatePicker()">
        <strong>
        <span>计划出科时间：</span>
        <span>{{planStartDate}}</span>
        <span class="triangle-down-icn" ></span>
      </strong>
    </div>
    <!--tab页签头部-->
    <ul class="nav">
      <li id="tabTitle1" v-bind:class="{active:tabtag==='tabContent1'}" v-on:click="tabClick(1,100)">未申请出科</li>
      <li id="tabTitle2" v-bind:class="{active:tabtag==='tabContent2'}" v-on:click="tabClick(2,101)">待写评语</li>
      <li id="tabTitle3" v-bind:class="{active:tabtag==='tabContent3'}" v-on:click="tabClick(3,200)">已出科</li>
    </ul>
    <!--tab页签内容-->

    <!--未申请出科 start-->
    <div id="tabContent1" v-show="tabtag==='tabContent1'" class="tab-list">
      <ul>
        <li class="tab-item" v-for="(item,index) in ExitData">
          <div>
            <div style="float:left;">
              <span class="fontColor" v-on:click="showStudentInfo(item.UserID)"><strong class="userName">{{item.RealName}}</strong>（{{item.UserName}}）</span>
            </div>
            <div style="float:right;">
              <span :class="item.IsPracticingPhysician ? 'flag-z':'flag-z-gray'">执</span>
              <span :class="item.IsPrescriptionRight ? 'flag-c':'flag-c-gray'">处</span>
            </div>
          </div>
          <div class="exitTime">
            <div>计划出科时间：{{item.PlanEndDate}}</div>
          </div>
          <div>
            <div class="btn" style="float:left;" v-on:click="checkHandBook(index)">轮转手册</div>
          </div>
        </li>
        <li v-if="ExitData.length==0" style="padding-top:20px;text-align: center;">暂无数据！</li>
      </ul>
    </div>
    <!--未申请出科 end-->

    <!--待写评语 start-->
    <div id="tabContent2" v-show="tabtag==='tabContent2'" class="tab-list">
      <ul>
        <li class="tab-item" v-for="(item,index) in ExitData">
          <div>
            <div style="float:left;">
              <span class="fontColor" v-on:click="showStudentInfo(item.UserID)"><strong class="userName">{{item.RealName}}</strong>（{{item.UserName}}）</span>
            </div>
            <div style="float:right;">
              <span :class="item.IsPracticingPhysician ? 'flag-z':'flag-z-gray'">执</span>
              <span :class="item.IsPrescriptionRight ? 'flag-c':'flag-c-gray'">处</span>
            </div>
          </div>
          <div class="exitTime">
            <div>计划出科时间：{{item.PlanEndDate}}</div>
          </div>
          <div>
            <div class="btn" style="float:left;" v-on:click="checkHandBook(index)">轮转手册</div>
            <div class="btn btnBlue" style="float:right;" v-on:click="writeComments(index,'add')">填写评语</div>
          </div>
        </li>
        <li v-if="ExitData.length==0" style="padding-top:20px;text-align: center;">暂无数据！</li>
      </ul>
    </div>
    <!--待写评语 end-->

    <!--已出科 start-->
    <div id="tabContent3" v-show="tabtag==='tabContent3'" class="tab-list">
      <ul>
        <li class="tab-item" v-for="(item,index) in ExitData">
          <div>
            <div style="float:left;">
              <span class="fontColor" v-on:click="showStudentInfo(item.UserID)"><strong class="userName">{{item.RealName}}</strong>（{{item.UserName}}）</span>
            </div>
            <div style="float:right;">
              <span :class="item.IsPracticingPhysician ? 'flag-z':'flag-z-gray'">执</span>
              <span :class="item.IsPrescriptionRight ? 'flag-c':'flag-c-gray'">处</span>
            </div>
          </div>
          <div class="exitTime">
            <div>计划出科时间：{{item.PlanEndDate}}</div>
            <div>实际出科时间：{{item.RealityEndDate}}</div>
          </div>
          <div>
            <div class="btn" style="float:left;" v-on:click="checkHandBook(index)">轮转手册</div>
            <div class="btn btnBlue" style="float:right;" v-on:click="checkExitInfo(index)">出科情况</div>
          </div>
        </li>
        <li v-if="ExitData.length==0" style="padding-top:20px;text-align: center;">暂无数据！</li>
      </ul>
    </div>
    <!--已出科 end-->
    <!--学员个人信息弹窗-->
    <mt-popup v-model="popupVisible" position="middle" modal="false">
      <div class="popup">
        <ul>
          <li><img src="../assets/userHeader.png" width="100px" style="margin: 0 auto;padding-top:10px;" /></li>
          <li>
            <div>姓名：</div>
            <div>{{StudentInfoData.RealName}}</div>
          </li>
          <li>
            <div>性别：</div>
            <div>{{StudentInfoData.Sex ? '男':'女'}}</div>
          </li>
          <li>
            <div>学员身份：</div>
            <div>{{StudentInfoData.Education?StudentInfoData.Education:'-'}}</div>
          </li>
          <li>
            <div>培训学科：</div>
            <div>{{StudentInfoData.CourseName}}</div>
          </li>
          <li>
            <div>培训年限：</div>
            <div>{{StudentInfoData.TrainingYears===1?'一年制':StudentInfoData.TrainingYears===2?'二年制':StudentInfoData.TrainingYears===3?'三年制':''}}</div>
          </li>
          <li>
            <div>年级批次：</div>
            <div>{{StudentInfoData.GradeBatch}}</div>
          </li>
          <li>
            <div>是否具有处方权：</div>
            <div>{{StudentInfoData.IsPrescriptionRight ? '有':'无'}}</div>
          </li>
          <li>
            <div>是否执业医师：</div>
            <div>{{StudentInfoData.IsPracticingPhysician ? '是':'否'}}</div>
          </li>
          <li>
            <div>执业证编码：</div>
            <div>{{StudentInfoData.PracticeCode?StudentInfoData.PracticeCode:'-'}}</div>
          </li>
          <li>
            <div>是否在协同基地培训：</div>
            <div>{{StudentInfoData.isXTBase?'是':'否'}}</div>
          </li>
          <li>
            <div>协同基地名称：</div>
            <div>{{StudentInfoData.XTBase?StudentInfoData.XTBase:'-'}}</div>
          </li>
          <li>
            <div>工作单位：</div>
            <div>{{StudentInfoData.WorkPlace?StudentInfoData.WorkPlace:'-'}}</div>
          </li>
        </ul>
      </div>
    </mt-popup>
    <!--日期控件弹窗-->
    
    <mt-popup v-model="popupVisiblePicker" position="bottom" style="width:100%;"> 
        <div class="picker-toolbar">  
            <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>  
            <span class="mint-datetime-action mint-datetime-confirm" @click="cancelHide">确定</span>  
        </div>
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
    export default {
      name: '',
      components: {},
      data(){
          return{
            ExitData : [],  //出科数据列表
            tabtag:'tabContent2',
            popupVisible:false, //是否展示个人信息弹窗
            popupVisiblePicker:false, //是否展示日期弹窗
            checkExitType:'', //查看出科情况类型
            StudentInfoData:{},  //学员个人信息
            slots:[],//时间控件可选择值json配置
            planStartDate:'',
            rotateStatus:0  //轮转状态
          }
      },
      methods:{
        //tab页签单击事件
        tabClick:function(index,rotateStatus){
          //请求接口获取对应tab页签数据
          this.ExitData = [];
          this.rotateStatus = rotateStatus;
          this.getExitDataInfo();
          this.checkExitType = 'teacher_'+index;
          this.tabtag = 'tabContent' + index;
        },
        //获取学员出科列表信息
        getExitDataInfo:function(){
          var guid = this.getGuid();
          if(!guid){
            this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
              this.$router.push('/login');
            });
            return;
          }
          var that = this;
          var params = {
            guid:guid,
            planOutDate:'2017-03-16',
            rotateStatus:that.rotateStatus,
            curPage:1,
            showCount:10
          };
          this.$httpPost('exit/getRotatePlanList', params, function (err, json) {
              that.ExitData= json.data.data;
          });
        },
        //获取学员个人信息
        showStudentInfo:function(studentID){
          var guid = this.getGuid();
          if(!guid){
            this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
              this.$router.push('/login');
            });
            return;
          }
          var that = this;
          var params = {
            guid:guid,
            userid:studentID
          };
          this.$httpGet('info/getUserinfo',params, function (err, json) {
              if (json.data.length>=1) {
                that.StudentInfoData= json.data[0];
              }
          });
          this.popupVisible = true;
        },
        //查看出科情况
        checkExitInfo:function(studentIndex){
          var curStudentData = this.ExitData[studentIndex]; //当前选择的学生数据
          this.$router.push({
            path:'/exitInfo',
            name:'exitInfo',
            query:{
              planStartDate:curStudentData.PlanStartDate,
              userId:curStudentData.UserID,
              departmentId:curStudentData.DepartmentId,
              teacherId:curStudentData.CoachingId,
              teacherName:curStudentData.CoachingName,
              planDataIndex:0,  //页面跳转首页索引参数
              checkExitType:this.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
            }
          });
        },
        //查看轮转手册
        checkHandBook:function (studentIndex) {
          var curStudentData = this.ExitData[studentIndex]; //当前选择的学生数据
          this.$router.push({
            path:'/handbook_mainpage',
            name:'handbook_mainpage',
            query:{
                departmentId:curStudentData.DepartmentId,
                departmentName:curStudentData.DepartmentName,
                courseId:curStudentData.CourseId,
                userId:curStudentData.UserID,
                rotateStatus:curStudentData.RotateStatus,
                checkExitType:this.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
            }
          });
        },
        //弹窗展示出科时间选择插件
        openDatePicker:function (){
          //年份
          var select_year_option =[];
          var curYear = new Date().getFullYear();
          for(var i = 2014; i <= curYear+2; i++){
              select_year_option.push(i);
          }

          //月份
          var select_month_option =[];
          for(var i = 1; i <= 12; i++){
              select_month_option.push(i);
          }
          this.slots=[  
            {  
              flex: 1,
              values: select_year_option,  
              className: 'slot',  
              textAlign: 'left'
            },{  
              values: select_month_option,  
              className: 'slot',
              textAlign: 'center' 
            },{  
              flex: 1,  
              values: ['15','月底'],  
              className: 'slot',  
              textAlign: 'right' 
            }  
          ];
          this.popupVisiblePicker=true;
        },
        //选择日期的改变事件
        onValuesChange: function (picker, values) {
          this.planStartDate = values[0];
        },
        //关闭日期控件弹窗
        cancelHide:function(){
          this.popupVisiblePicker=false;
        },
        //填写评语
        writeComments:function(studentIndex,mode){
          var curStudentData = this.ExitData[studentIndex]; //当前选择的学生数据
          var hospitalID = this.getLocalStorageValue('userinfo').hospitalId;
          //缓存填写评语需要的基础数据
          var _curQueryInfo = {
            UserId:curStudentData.UserID,
            DepartmentId:curStudentData.DepartmentId,
            PlanStartDate:curStudentData.PlanStartDate,
            CoachingId:curStudentData.CoachingId,
            CoachingName:curStudentData.CoachingName,
            HospitalID:hospitalID,
            planDataIndex:0,
            modeTag:mode, //操作评语的状态：add 添加，edit 修改
            checkExitType:this.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
          }
          window.localStorage.setItem('eval_queryInfo',JSON.stringify(_curQueryInfo));

          this.$router.push({
              path:'/teacher_attendance',
              name:'teacher_attendance',
              query:{
                planDataIndex:0,
                modeTag:mode, //操作评语的状态：add 添加，edit 修改
                checkExitType:this.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
          });
        }

      },
      created(){
      },
      activated(){
        this.$store.commit('updatateacher_indexSelected','teacher_exit');
        var index = this.checkExitType.split('_')[1];
        switch(index){
          case '1': //未申请出科
            this.rotateStatus = 100;
          break;
          case '2': //待写评语
            this.rotateStatus = 101;
          break;
          case '3': //已出科
            this.rotateStatus = 200;
          break;
          default:
            this.rotateStatus = 101;
            this.checkExitType = 'teacher_2';
            this.tabtag = 'tabContent2';
          break;
        };
        //请求接口获取数据
        this.getExitDataInfo();

        //设置当前出科时间
        var Year=new Date().getFullYear();
        var Month=new Date().getMonth()+1;
        var date = new Date().getDate();
        date = date>15 ? Month+'月底':Month+'月15日';

        this.planStartDate = Year+'年'+date;
      }
    }
</script>

<style>
html,body{background-color: #eee;}
.exit-manage{width:100%;margin-top:55px;}
.exit-manage .head{width:72%;height:35px;margin:0px auto;text-align:center;line-height:40px;border-bottom: 1px solid #000;}
.exit-manage .mint-field .mint-cell-title{width: 120px !important;}
.exit-manage .mint-cell{min-height: 35px !important;background: #eee !important;}
.exit-manage .mint-field .mint-cell-value input{background: #eee !important;}

.exit-manage .triangle-down-icn{position:absolute;left:78%;top:60px;width:17px;height:30px;background:url('../assets/triangle-down-icn.png') 0 10px no-repeat;background-size: 14px;}
.exit-manage ul,.exit-manage ul li{list-style: none;margin:0px;padding:0px;}


.exit-manage .nav{width:90%;height:35px;margin:0px auto;margin-top:15px;border:1px solid #ddd;border-radius: 25px;}
.exit-manage .nav li{float: left;line-height:35px;text-align: center;background: #fff;}
.exit-manage .nav > li:nth-child(1){width:35%;border-top-left-radius: 25px;border-bottom-left-radius: 25px;}
.exit-manage .nav > li:nth-child(2){width:31%;border-left:1px solid #ddd;border-right:1px solid #ddd;}
.exit-manage .nav > li:nth-child(3){width:33.3%;border-top-right-radius: 25px;border-bottom-right-radius: 25px;}
.exit-manage .nav .active{background: #37acd3;color:#fff;}


.exit-manage .tab-list{width:92%;margin:0px auto;overflow-y: auto;overflow-x: hidden;}
.exit-manage .tab-item{width:90%;min-height:120px;margin:15px auto;padding:10px;overflow: hidden;border-radius: 10px;border: 1px solid #ddd;background: #fff;}
.exit-manage .fontColor{color: #37acd3;}
.exit-manage .userName{display: inline-block;text-decoration: underline;padding-bottom: 5px;}
.exit-manage .exitTime{clear:both;padding:8px 0px;line-height:23px;font-size:14px;overflow: hidden;}
.exit-manage .flag-z{padding:2px 3px;margin-right:10px;color:#fff;font-weight: bold;background: #f0ad4e;}
.exit-manage .flag-z-gray{padding:2px 3px;margin-right:10px;color:#fff;font-weight: bold;background: #ccc;}
.exit-manage .flag-c{padding:2px 3px;color:#fff;font-weight: bold;background: #5cb85c;}
.exit-manage .flag-c-gray{padding:2px 3px;color:#fff;font-weight: bold;background: #ccc;}
.exit-manage .btn{width:100px;height:30px;line-height:30px;color:#37acd3;text-align:center;font-weight:bold;border: 1px solid #37acd3;border-radius: 10px;}
.exit-manage .btnBlue{background: #37acd3;color: #fff;}

.exit-manage .popup{width:300px;line-height: 28px;text-align: center;overflow-x: hidden;overflow-y: auto;}
.exit-manage .popup ul li > div:nth-child(1){float:left;width:50%;text-align: right;}
.exit-manage .popup ul li > div:nth-child(2){float:left;width:46%;padding-left:8px;text-align: left;}
</style>
