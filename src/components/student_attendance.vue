<template>
  <div>
    <mt-header fixed title="考勤录入" style="background:#37acd3;font-size:16px;">
      <router-link to="/"  slot="left">
        <mt-button icon="back" v-on:click="saveAttendInfo"></mt-button>
      </router-link>
    </mt-header>
    <div class="attend-wrap" style="padding:43px 5px 0 5px;">
      <div class="panel">
        <ul class="ul">
          <li class="li" >
            <div class="li-wrap border-btm" style="padding-right:0px;">
              <div class="li-title text-left">是否全勤</div>
              <div class="li-content">
                  <label style="margin-left:10px;">
                    <input type="radio" :checked="isFullAttend==='是'" name="attend-radio"
                           value="是" v-on:change="attendChange($event)"/>
                    是</label>
                  <label  style="margin-left:20px;">
                    <input type="radio" :checked="isFullAttend==='否'" name="attend-radio" value="否"
                           v-on:change="attendChange($event)"/>
                    否</label>
              </div>
            </div>
          </li>
          <li class="li" >
            <div class="li-wrap border-btm">
              <div class="li-title text-left">事假</div>
              <div class="li-content text-right">
                <input type="text" id="affair_leave" placeholder="输入事假次数"
                       :value="affairLeave" v-on:focus="inputFocus($event)" v-on:blur="inputBlur($event)" />
              </div>
            </div>
          </li>
          <li class="li" >
            <div class="li-wrap border-btm">
              <div class="li-title text-left">病假</div>
              <div class="li-content text-right">
                <input type="text" id="sick_leave"  placeholder="输入病假次数"
                       :value="sickLeave" v-on:focus="inputFocus($event)" v-on:blur="inputBlur($event)"/>
              </div>
            </div>
          </li>
          <li class="li" >
            <div class="li-wrap border-btm">
              <div class="li-title text-left">公休假</div>
              <div class="li-content text-right">
                <input type="text" id="sabbatical_leave" placeholder="输入公休假次数"
                       :value="sabbaticalLeave"  v-on:focus="inputFocus($event)" v-on:blur="inputBlur($event)"/>
              </div>
            </div>
          </li>
          <li class="li" >
            <div class="li-wrap border-btm">
              <div class="li-title text-left">迟到</div>
              <div class="li-content text-right">
                <input type="text" id="late" placeholder="输入迟到次数"
                       :value="late"  v-on:focus="inputFocus($event)" v-on:blur="inputBlur($event)"/>
              </div>
            </div>
          </li>
          <li class="li" >
            <div class="li-wrap">
              <div class="li-title text-left">旷工</div>
              <div class="li-content text-right">
                <input type="text" id="absent_work" placeholder="输入旷工次数"
                       :value="absentWork" v-on:focus="inputFocus($event)"  v-on:blur="inputBlur($event)"/>
              </div>
            </div>
          </li>

        </ul>
      </div>
    </div>
    <div style="width:100%;float:left;height:100px;"></div>
    <div class="attend-wrap" style="padding:0px;">
        <div class="btm-btn-group">
          <div class="btm-btn text-center" v-on:click="toEvaluate">下一项</div>
        </div>
    </div>
  </div>

</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return{
                popupVisible:false,
                isFullAttend:'是',
                affairLeave:0,
                sickLeave:0,
                sabbaticalLeave:0,
                late:0,
                absentWork:0,
                eval_queryInfo:{},
                attendInfo:{},
                sourVal:0
            }
        },
        created(){
          this.initAttendInfo();
        },
        activated(){
          this.initAttendInfo();
        },
        methods:{
          toEvaluate:function () {
            this.saveAttendInfo();
            this.$router.push({
              path:'/student_evaluate',
              name:'student_evaluate',
              query:{

              }
            });
          },
          attendChange:function (evt) {
            var _value = evt.currentTarget.value;
            this.isFullAttend=_value;
            if(_value==='是'){
              this.affairLeave=0
              this.sickLeave=0
              this.sabbaticalLeave=0
              this.late=0
              this.absentWork=0
            }
          },
          inputBlur:function (evt) {
            clearInterval(this.focusTime);
            var textInputIdArr=['affair_leave','sick_leave','sabbatical_leave','late','absent_work']
            var isAllZero = true;
            for(var i =0;i<textInputIdArr.length;i++){
              var iptObj= document.getElementById(textInputIdArr[i]);
              var val = iptObj.value;
              var _id = iptObj.id
              if(val!=''){
                 val=parseInt(val) ;
                if(val>0){
                  isAllZero=false;
                  if(_id==='affair_leave'){this.affairLeave=val}
                  if(_id==='sick_leave'){this.sickLeave=val}
                  if(_id==='sabbatical_leave'){this.sabbaticalLeave=val}
                  if(_id==='late'){this.late=val}
                  if(_id==='absent_work'){this.absentWork=val}
                }
              }else{
                document.getElementById(_id).value=0;
/*                if(_id==='affair_leave'){this.affairLeave=0}
                if(_id==='sick_leave'){this.sickLeave=0}
                if(_id==='sabbatical_leave'){this.sabbaticalLeave=0}
                if(_id==='late'){this.late=0}
                if(_id==='absent_work'){this.absentWork=0}*/
              }
            }
            if(!isAllZero){
              this.isFullAttend='否';
            }else{
              this.isFullAttend='是';
              this.affairLeave=0;
              this.sickLeave=0;
              this.sabbaticalLeave=0;
              this.late=0;
              this.absentWork=0;
            }

          },
          inputFocus:function (evt) {
              this.sourVal=evt.target.value;
            var getNumStaff =function () {
              var _value = evt.target.value;
              _value=_value.replace(/[^0-9]/g,'');
              evt.target.value=_value;
            }
            this.focusTime = setInterval(getNumStaff, 100);
          },
          initAttendInfo:function () {
            var attendInfo = window.localStorage.getItem('attendInfo');
            var eval_queryInfo = window.localStorage.getItem('eval_queryInfo');
            if(attendInfo){
                this.attendInfo=JSON.parse(attendInfo);
            }
            if(eval_queryInfo){
              this.eval_queryInfo=JSON.parse(eval_queryInfo);
            }
            if(attendInfo){
              var _attendInfo = this.attendInfo;
              this.isFullAttend=_attendInfo.isFullAttend;
              this.affairLeave=_attendInfo.affairLeave;
              this.sickLeave=_attendInfo.sickLeave;
              this.sabbaticalLeave=_attendInfo.sabbaticalLeave;
              this.late=_attendInfo.late;
              this.absentWork=_attendInfo.absentWork;
            }else{
              this.isFullAttend='是';
              this.affairLeave=0;
              this.sickLeave=0;
              this.sabbaticalLeave=0;
              this.late=0;
              this.absentWork=0;
            }
            if(this.eval_queryInfo.modeTag==='edit'&&!attendInfo){
              this.getExitCourseInfo()
            }
          },
          saveAttendInfo:function () {
            var attendInfo={
              isFullAttend:this.isFullAttend,
              affairLeave:this.affairLeave,
              sickLeave:this.sickLeave,
              sabbaticalLeave:this.sabbaticalLeave,
              late:this.late,
              absentWork:this.absentWork
            }
            window.localStorage.setItem('attendInfo',JSON.stringify(attendInfo));
          },
          getExitCourseInfo:function () {
            var vueMdl = this;
            var eval_queryInfo = vueMdl.eval_queryInfo;
              var _date=new Date(eval_queryInfo.PlanStartDate)
            var _year = _date.getFullYear();
            var _month = _date.getMonth()+1;
            var createYear = _year+''+_month;
            var params = {
              userID:eval_queryInfo.UserId,
              departmentID: eval_queryInfo.DepartmentId,
              createYear: createYear,
              guid:this.getLocalStorageValue('userinfo').guid
            }
            var url = 'exit/getExitCourseInfoByID';
            this.$httpPost(url, params, function (err,data) {
              var status = data.status;
              if (status == 200) {
                  var _attendData=data.data.data
                if(_attendData.length>0){
                      var attendJson=_attendData[0]
                  if(attendJson.IsFullAttendance==='0'){
                    vueMdl.isFullAttend='是';
                  }else{
                    vueMdl.isFullAttend=attendJson.IsFullAttendance;
                  }
                  vueMdl.affairLeave=attendJson.PersonalLeave;
                  vueMdl.sickLeave=attendJson.SickLeave;
                  vueMdl.sabbaticalLeave=attendJson.SabbaticalLeave;
                  vueMdl.late=attendJson.Late;
                  vueMdl.absentWork=attendJson.Absenteeism;
                }else{
                  vueMdl.isFullAttend=1;
                  vueMdl.affairLeave=0;
                  vueMdl.sickLeave=0;
                  vueMdl.sabbaticalLeave=0;
                  vueMdl.late=0;
                  vueMdl.absentWork=0;
                }

              } else if (status === 201) {

              } else {

              }
            }, 'json')
          }
        }
    }
</script>

<style>
  body{
    background:#eee;
  }
  .attend-wrap >
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
  .attend-wrap{

  }
  .attend-wrap .btm-btn-group{
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
    height:50px;
    line-height:50px;
    background:#37acd3;
  }
  .attend-wrap .btm-btn-group .btm-btn{
     float:left;
     width:100%;
     color:#fff;
  }
  .attend-wrap .text-center{text-align:center;}
  .attend-wrap .text-right{text-align:right;}
  .attend-wrap .border-btm{border-bottom:1px solid #eeeeee;}

  .attend-wrap .ul{padding:10px;}
  .attend-wrap .li{ float:left;width:100%;}
  .attend-wrap .li-wrap{ padding:10px;height:30px;}
  .attend-wrap .li-title{float:left;padding:5px 0 0 0;width:50%;}
  .attend-wrap .li-content{float:left;padding:5px 0 0 0;width:50%;}
  .attend-wrap .ul input[type="number"]{
       border:0;width:97%;outline:none;
     }
  .attend-wrap .ul input[type="text"]{
    border:0;width:97%;outline:none;
  }
  .attend-wrap .ul input[type="radio"]{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
  }
  .attend-wrap .panel{float:left;background:#fff;width:100%;border-radius:6px;}

</style>
