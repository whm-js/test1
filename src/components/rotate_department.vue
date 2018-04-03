<template>
  <div class="g-wrap bg-primary" style="padding:43px 5px 0 5px;">

      <div class="panel border border-box" >
        <div class="panel-content" style="padding-right:27px;">
          <div class="form-control " readonly style="padding-top:10px;" v-on:click="showPopup">
            <div style="float:left;width:95%;height:30px;line-height:30px;overflow: hidden;">
              <span style="float:left;width:70%;overflow: hidden;">{{showDepartmentName(curQueryInfo)}}</span>
              <span class="btn-success btn-sm" style="width:50px;float:left;" v-if="(isCurPlan===true)">当前科室</span>
            </div>
            <div class="triangle-down-icn" ></div>
          </div>

        </div>
        <div class="panel-content" v-show="(curQueryInfo.UserId)">
          <span class="font-grey">{{curQueryInfo.PlanStartDate}}至{{curQueryInfo.PlanEndDate}}</span>
          <span class="btn-warning btn-sm">{{curQueryInfo.PlanDuration}}个月</span>
        </div>
      </div>


    <div class="panel border border-box" style="margin-top:10px;">
      <ul class="ul li-font-size">
        <li class="li" >
          <div class="li-wrap border-btm">
            <span class="li-title text-left">实际时间</span>
            <span class="li-content text-right font-grey" v-show="curQueryInfo.RotateStatus>=100&&curQueryInfo.RotateStatus<=114">{{curQueryInfo.RealityStartDate}}至-</span>
            <span class="li-content text-right font-grey" v-show="curQueryInfo.RotateStatus===200">{{curQueryInfo.RealityStartDate}}至{{curQueryInfo.RealityEndDate}}</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">带教老师</span>
            <span class="li-content text-right font-grey">{{curQueryInfo.CoachingName}}</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap">
            <span class="li-title text-left">轮转状态</span>
            <span class="li-content text-right font-grey">
              {{curQueryInfo.RotateStatusName}}
            </span>
          </div>
          <div class="border-btm" style="float:left;width:100%" v-show="curQueryInfo.RotateStatus>113"></div>
        </li>
        <li class="li" v-show="(curQueryInfo.RotateStatus===200)">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">考核结果</span>
            <span class="li-content text-right text-success">通过</span>
          </div>
        </li>
        <li class="li" v-show="(curQueryInfo.RotateStatus===114)">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">考核结果</span>
            <span class="li-content text-right text-danger">不通过</span>
          </div>
        </li>
        <li class="li" v-show="(curQueryInfo.RotateStatus>113)">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">理论考试成绩</span>
            <span class="li-content text-right font-grey">{{curQueryInfo.TheoryScore}}</span>
          </div>
        </li>
        <li class="li" v-show="(curQueryInfo.RotateStatus>113)">
          <div class="li-wrap">
            <span class="li-title text-left">技能考核成绩</span>
            <span class="li-content text-right font-grey">{{curQueryInfo.SkillScore}}</span>
          </div>
        </li>
      </ul>
      <div class="img-stamp" v-show="curQueryInfo.RotateStatus===200"></div>
    </div>
    <div class="panel " style="margin-top:10px;background:#eee;">
      <div style="width:50%;float:left;" v-show="(curQueryInfo.RotateStatus===100)">
        <div class="btn-blue btn-lg text-center" style="margin:0 5px;" v-on:click="toAttendance('add')">申请出科</div>
      </div>
      <div style="width:50%;float:left;" v-show="(curQueryInfo.RotateStatus===101)">
        <div class="btn-blue btn-lg text-center" style="margin:0 5px;" v-on:click="toAttendance('edit')">修改出科小结</div>
      </div>
      <div style="width:50%;float:left;" v-show="(curQueryInfo.RotateStatus>113)">
        <div class="btn-blue btn-lg text-center" style="margin:0 5px;" v-on:click="toExitInfo">出科情况</div>
      </div>
      <div style="width:50%;float:left;" >
        <div class="btn-blue btn-lg text-center" style="margin:0 5px;" v-on:click="toHandBook">轮转手册</div>
      </div>
    </div>

    <div style="width:100%;float:left;height:60px;"></div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" :closeOnClickModal="clickModalHide"
              style="width:90%;height:90%;overflow:auto;">
      <ul class="ul">
        <li class="li" v-for="(item,index) in queryInfo" v-on:click="changeCurPlan(item,index,true)">
          <div class="li-wrap">
            <span class="li-title" style="width:40%">
              <span style="float:left">{{showDepartmentName(item)}}</span>
              <span class="btn-success btn-sm" v-if="(index===curRotateIndex)" style="float:left;width:50px;" >当前科室</span>
            </span>

            <span class="li-content text-right font-grey" style="width:60%">{{item.PlanStartDate}}至{{item.PlanEndDate}}</span>
          </div>
          <div class="border-btm" style="width:100%;float:left;" v-show="index<queryInfo.length-1"></div>
        </li>
      </ul>
    </mt-popup>
  </div>


</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return{
                popupVisible:false,//控制点击选择计划弹窗显示/关闭参数
                clickModalHide:true,//控制点击选择计划弹窗关闭参数
                queryInfo:[],//所有计划数据
                dataIndex:0,//选择计划索引
                curRotateIndex:-1,//当前轮转索引
                exitSuccess:false,//是否出科成功标识
                curQueryInfo:[],//当前选择计划数据
                isCurPlan:false,//是否当前轮转计划表示
                guid:0
            }
        },
        methods:{
          //计划弹窗显示
        showPopup:function () {
          if(this.curQueryInfo.length===0){
              this.$messagebox('温馨提示','暂无您的轮转计划，请联系科教科。');
              return;
          }
          this.popupVisible=true;
        },
          //科室名称包含研究方向的处理
          showDepartmentName:function(el){
            if(el.length===0){
              return '';
            }else{
              if(el.ResearchArea!=''){
                return el.DepartmentName + '（' + el.ResearchArea + '）'
              }else{
                return el.DepartmentName
              }
            }
          },
        dealDateStr:function(str) {
          var dateStr=str;
          var _date = new Date(dateStr);
          if(_date){
            var yStr=_date.getFullYear();
            var mStr=(_date.getMonth()+1)>=10?(_date.getMonth()+1):'0'+(_date.getMonth()+1);
            var dStr=_date.getDate()>10?_date.getDate():'0'+_date.getDate();
            dateStr=yStr+'/'+mStr+'/'+dStr;
          }
          return dateStr;
        },
        getPlanStartDate:function (date) {
          var entryDate=date
          var dateStr = entryDate.split('-');
          var dayStr=dateStr[dateStr.length-1];
          if(Number(dayStr)>=1&&Number(dayStr)<16){
            dateStr[dateStr.length-1]='01';
          }else{
            dateStr[dateStr.length-1]='16';
          }
          entryDate=dateStr.join('-');
          return entryDate;
        },
        //轮转计划数据请求
        getQueryInfo:function () {
          var vueMdl = this;
          var url = 'rotate/getQueryinfo';
          var params = {
            page: 1,
            pageNum: 1000,
            guid:this.getLocalStorageValue('userinfo').guid
          }
          this.$httpPost(url, params, function (err, data) {
            if (err) {
              return
            }
            var status = data.status;
            if (status == 200) {
              vueMdl.guid=vueMdl.getGuid();
              window.localStorage.removeItem('rateJson');
              window.localStorage.removeItem('attendInfo');
              window.localStorage.removeItem('summaryInfo');
              window.localStorage.removeItem('eval_queryInfo');
              vueMdl.bindQueryInfo(data.data.data);

            } else if (status === 201) {
              //登录失效

            } else {

            }

          })
        },
        //绑定数据
        bindQueryInfo:function (data) {
          this.queryInfo=data;
          var queryInfo=this.queryInfo;
          if(queryInfo.length>0){
              for(var i=0;i<queryInfo.length;i++){
                if(queryInfo[i].PlanStartDate){
                  queryInfo[i].PlanStartDate=this.$formatDate(new Date(queryInfo[i].PlanStartDate.replace(/-/g,'/')),'yyyy-MM-dd');
                }
                if(queryInfo[i].PlanEndDate){
                  queryInfo[i].PlanEndDate=this.$formatDate(new Date(queryInfo[i].PlanEndDate.replace(/-/g,'/')),'yyyy-MM-dd');
                }
                if(queryInfo[i].RealityStartDate){
                  queryInfo[i].RealityStartDate=this.$formatDate(new Date(queryInfo[i].RealityStartDate.replace(/-/g,'/')),'yyyy-MM-dd');
                }
                if(queryInfo[i].RealityEndDate){
                  queryInfo[i].RealityEndDate=this.$formatDate(new Date(queryInfo[i].RealityEndDate.replace(/-/g,'/')),'yyyy-MM-dd');
                }
                if(i===0){//默认第一条计划，选择为当前显示
                  this.changeCurPlan(queryInfo[i],i);
                }
                if(queryInfo[i].RotateStatus>=100&&queryInfo[i].RotateStatus<200){//当前计划已申请出科的并未出科成功的，选择为当前显示
                  this.changeCurPlan(queryInfo[i],i);
                }
                if(i<queryInfo.length-1){//当前计划已出科成功的并且后一条计划还未申请出科的，选择为当前显示
                  if(queryInfo[i].RotateStatus===200&&(queryInfo[i+1].RotateStatus>=0&&queryInfo[i+1].RotateStatus<100)){
                    this.changeCurPlan(queryInfo[i],i);
                  }
                }
                if(i===queryInfo.length-1){//最后一条并且已出科成功的，选择为当前显示
                  if(queryInfo[i].RotateStatus===200){
                    this.changeCurPlan(queryInfo[i],i);
                  }
                }
              }
              var planDataIndex = this.dataIndex;
              var exitSuccess = this.exitSuccess;
              if(exitSuccess){//申请出科成功后，返回首页，锁定到申请出科的科室
                this.changeCurPlan(queryInfo[planDataIndex],planDataIndex);
              }
            }else{
              this.$messagebox('温馨提示','暂无您的轮转计划，请联系科教科。');
            }
          this.$store.commit('updataPlanData',queryInfo);//存储所有计划数据
        },
        //绑定当前选择的计划数据
        changeCurPlan:function (itm,idx,isClick) {
          this.curQueryInfo=itm;
          this.dataIndex=idx;
          if(itm.RotateStatus>=100&&itm.RotateStatus<200){
            this.isCurPlan=true;
            this.curRotateIndex=idx;
          }else{
            this.isCurPlan=false;
          }
          if(isClick){
            this.popupVisible=false;
          }
        },
          //申请出科
          toAttendance:function (mode) {
            var _curQueryInfo = {
              UserId:this.curQueryInfo.UserId,
              DepartmentId:this.curQueryInfo.DepartmentId,
              PlanStartDate:this.curQueryInfo.PlanStartDate,
              CoachingId:Number(this.curQueryInfo.CoachingId),
              CoachingName:this.curQueryInfo.CoachingName,
              HospitalID:this.curQueryInfo.HospitalID,
              planDataIndex:this.dataIndex,
              modeTag:mode
            }
            window.localStorage.setItem('eval_queryInfo',JSON.stringify(_curQueryInfo));
          this.$router.push({
            path:'/student_attendance',
            name:'student_attendance',
            query:{

            }
          });
        },
          //轮转手册
        toHandBook:function () {
          var curQueryInfo = this.curQueryInfo;
          if(curQueryInfo.length===0){
            this.$messagebox('温馨提示','暂无您的轮转计划，请联系科教科。');
            return;
          }
          this.$router.push({
            path:'/handbook_mainpage',
            name:'handbook_mainpage',
            query:{
                departmentId:curQueryInfo.DepartmentId,
                departmentName:curQueryInfo.DepartmentName,
                courseId:curQueryInfo.CourseId,
                userId:curQueryInfo.UserId,
                rotateStatus:curQueryInfo.RotateStatus
            }
          });
        },
          //出科详情
        toExitInfo:function () {
          var curQueryInfo = this.curQueryInfo;
          this.$router.push({
            path:'/exitInfo',
            name:'exitInfo',
            query:{
              planStartDate:curQueryInfo.PlanStartDate,
              userId:curQueryInfo.UserId,
              departmentId:curQueryInfo.DepartmentId,
              teacherId:curQueryInfo.CoachingId,
              teacherName:curQueryInfo.CoachingName,
              planDataIndex:this.dataIndex
            }
          });
        }
      },
      created(){
//        this.getQueryInfo();

      },
      activated(){
        this.$store.commit('updataindexSelected','rotate_department');
        var planDataIndex = this.$route.query.planDataIndex;//页面跳转首页索引参数
        var exitSuccess = this.$route.query.exitSuccess;//申请出科成功跳转首页标识参数
        if(this.queryInfo.length == 0||this.guid!==this.getLocalStorageValue('userinfo').guid){//页面无数据或换账号重新请求数据
          this. popupVisible=false;
          this.clickModalHide=true;
          this.queryInfo=[];
          this.dataIndex=0;
          this.curRotateIndex=-1//当前轮转索引
          this.exitSuccess=false;
          this.curQueryInfo=[];
          this.curPlanStartDate=0;
          this.isCurPlan=false;
          this.guid=0;
          this.getQueryInfo();
        }else {
          if (planDataIndex||planDataIndex===0) {
            this.dataIndex=planDataIndex;
            if (exitSuccess) {
              this.exitSuccess=exitSuccess;
              this.getQueryInfo();
            } else {
              var curQueryInfo = this.queryInfo[planDataIndex];
              this.changeCurPlan(curQueryInfo, planDataIndex);
            }
          }else{
            this.dataIndex=0;
            this.exitSuccess=false;
          }
        }
      }
    }
</script>

<style>
  body{
    background:#eee;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    margin: 0;
    font: inherit;
    color: inherit;
  }
  ul{
    padding:0px;margin:0px;
  }
  li{
      padding:0;
      list-style : none;
  }
  .bg-primary{
    background:#eee;
  }
  .g-wrap{

  }
  .g-wrap .font-grey{color:#888;}
  .g-wrap .text-center{text-align:center;}
  .g-wrap .text-right{text-align:right;}
  .g-wrap .text-success {
    color: #5cb85c;
  }
  .g-wrap .text-warning {
    color: #f0ad4e;
  }
  .g-wrap .text-danger {
    color: #d9534f;
  }
  .g-wrap .bold{font-weight:700 !important;}
  .g-wrap .border{  border:1px solid #eeeeee;}
  .g-wrap .border-btm{border-bottom:1px solid #eeeeee;}
  .g-wrap .border-box{margin-left:-1px;}
  .g-wrap .btn-success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .g-wrap .btn-warning {
    color: #fff;
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .g-wrap .btn-lg{
    padding: 7px 13px;
    font-size: 18px;
    line-height: 1.3333333;
    border-radius: 4px;
  }
  .g-wrap .btn-sm{
    padding: 5px 10px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .g-wrap .btn-xs{
    padding: 1px 5px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .g-wrap .btn-blue{
    color: #fff;
    background-color: #37acd3;
    border-color: #37acd3;
  }
  .g-wrap .btn-blue:hover {
    color: #37acd3;
    background-color: #fff;
    border-color: #37acd3;
  }
  .g-wrap .img-stamp{
    position:relative;
    top:30px;
    left:130px;
    width:150px;
    height:150px;
    background:url('../assets/stamp.png')no-repeat;
    background-size:100%;
  }
  .g-wrap .ul{padding:10px;}
  .g-wrap .li{ float:left;width:100%;}
  .g-wrap .li-wrap{ padding:10px 0;float:left;width:100%}
  .g-wrap .li-title{float:left;padding:5px 0 0 0;}
  .g-wrap .li-content{float:right;padding:5px 0 0 0;}
  .g-wrap .li-font-size{font-size:16px;}

  .g-wrap .panel{float:left;background:#fff;width:100%;border-radius:6px;}
  .g-wrap .panel-title{padding:10px;}
  .g-wrap .panel-sub-title{
    padding:10px;
  }

  .g-wrap .panel-content{padding:10px;}

  .g-wrap .form-control {
    display: block;
    width:100%;
    height: 30px;
    padding: 5px 10px;
    font-size: 16px;
    line-height: 1.5;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }
  .g-wrap .form-control[readonly]{
    background-color: #eee;
    opacity: 1;
  }
  .g-wrap .triangle-down-icn{
    position:relative;
    left:95%;
    top:0px;
    width:17px;
    height:30px;
    background:#eee url('../assets/triangle-down-icn.png') 0 10px no-repeat;
  }

</style>
