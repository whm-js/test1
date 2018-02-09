<template>
  <div>
    <mt-header fixed title="考核状况" style="background:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
    </mt-header>
    <div class="attend-wrap" style="width:98%;min-height: 330px;margin: 55px auto 35px;">
      <div class="panel">
        <ul class="ul">
          <li class="li"  style="height:35px;color:#37acd3;text-align:center;font-weight: bold;border-bottom: 1px solid #ddd;">考勤情况</li>
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
    <!--医德医风start-->
    <table id="medicine">
        <thead>
          <th colspan="3" style="height:45px;color:#37acd3;">医德医风</th>
        </thead>
        <tbody>
          <template v-for="(item,pIndex) in medicineJson">
              <template v-if="item.ItemList.length==1">
                <tr>
                  <td colspan="2">{{item.ItemName}}：</td>
                  <td class="td-font" :style="item.ItemList[0].OptionValue ? 'color:#000':'color:#999'" @click="optionClick(item.ItemList[0].OptionGrade,pIndex,0)">
                    <template v-if="item.ItemList[0].OptionValue">{{item.ItemList[0].OptionValue}}</template>
                    <template v-else>
                      <span>请选择</span><span class="more-icn" ></span>
                    </template>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(data,index) in item.ItemList">
                  <td v-if="index==0" :rowspan="item.ItemList.length">{{item.ItemName}}</td>
                  <td class="td" v-if="data.OptionName.indexOf('床号')==0">
                    {{item.ItemList[index-1].OptionName}}{{data.OptionName}}：
                  </td>
                  <td class="td" v-else-if="data.OptionName.indexOf('排名')>=0">
                    {{item.ItemList[index-1].OptionName}}{{data.OptionName}}）：
                  </td>
                  <td class="td" v-else>{{data.OptionName}}：</td>
                  <td class="td-font" :style="data.OptionValue ? 'color:#000':'color:#999'" v-if="data.FromType=='radio'" @click="optionClick(data.OptionGrade,pIndex,index)">
                    <template v-if="data.OptionValue">{{data.OptionValue}}</template>
                    <template v-else>
                      <span>请选择</span><span class="more-icn" ></span>
                    </template>
                  </td>
                  <td class="td-font2" :style="data.OptionValue ? 'color:#000':'color:#999'" v-else>
                    <input :placeholder="data.Unit.indexOf('）')>=0||data.Unit=='' ? '请输入':'请输入'+data.Unit+'数'" type="text" class="mint-field-core" :style="data.OptionValue ? 'color:#000':'color:#999'" :lang="pIndex+'-'+index" v-on:blur="onValuesInput($event)" :value="data.OptionValue ? data.OptionValue : ''"/>
                  </td>
                </tr>
              </template>
            </template>
        </tbody>
    </table>
    <!--医德医风end-->
    <div style="width:100%;float:left;height:100px;"></div>
    <div class="attend-wrap" style="padding:0px;">
        <div class="btm-btn-group">
          <div class="btm-btn text-center" v-on:click="toEvaluate">下一项</div>
        </div>
    </div>
    <!--选择框弹窗-->
    <mt-popup v-model="popupVisiblePicker" position="bottom" style="width:100%;">
        <div class="picker-toolbar">
            <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide('cancel')">取消</span>
            <span class="mint-datetime-action mint-datetime-confirm" @click="cancelHide()">确定</span>
        </div>
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>

</template>

<script>
    import {G_MedicalEthicsData} from '../assets/js/medicineJson.js';
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
                sourVal:0,
                popupVisiblePicker:false, //是否展示弹窗
                slots:[],//选项值配置

                slotsValue:'',  //选择的弹窗值
                itemId:0, //医德医风item的索引
                optionId:0, //医德医风option的索引
                medicineJson : G_MedicalEthicsData  //医德医风json
            }
        },
        created(){
        },
        activated(){
          window.scrollTo(0, 0);
          this.initAttendInfo();
        },
        methods:{
          //下一项，进入评价学员页面
          toEvaluate:function () {
            this.saveAttendInfo();
            this.$router.push({
              path:'/teacher_evaluate',
              name:'teacher_evaluate',
              query:{
                planDataIndex:this.$route.query.planDataIndex,
                checkExitType:this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          },
          //监控选择了全勤，则相关数据设置为0
          attendChange:function (evt) {
            var _value = evt.currentTarget.value;
            this.isFullAttend=_value;
            if(_value==='是'){
              this.affairLeave=0;
              this.sickLeave=0;
              this.sabbaticalLeave=0;
              this.late=0;
              this.absentWork=0;
            }
          },
          //考勤录入的失去焦点事件监控
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
                  switch(_id){
                    case 'affair_leave':
                      this.affairLeave=val;
                    break;
                    case 'sick_leave':
                      this.sickLeave=val;
                    break;
                    case 'sabbatical_leave':
                      this.sabbaticalLeave=val;
                    break;
                    case 'late':
                      this.late=val;
                    break;
                    case 'absent_work':
                      this.absentWork=val;
                    break;
                  };
                }
              }else{
                document.getElementById(_id).value=0;
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
          //获取焦点，监控文本框的输入情况
          inputFocus:function (evt) {
              this.sourVal=evt.target.value;
            var getNumStaff =function () {
              var _value = evt.target.value;
              _value=_value.replace(/[^0-9]/g,'');
              evt.target.value=_value;
            }
            this.focusTime = setInterval(getNumStaff, 100);
          },
          //初始化考勤录入状态信息
          initAttendInfo:function () {
            //进入填写评语页面前传递的数据
            var eval_queryInfo = window.localStorage.getItem('eval_queryInfo');
            if(!eval_queryInfo){
              this.$messagebox('温馨提示', '页面请求无效，请退出重新进入页面！').then(action => {
                this.$router.push({
                  path:'/teacher_index/teacher_exit/',
                  name:'',
                  query:{
                    planDataIndex:this.$route.query.planDataIndex,
                    checkExitType:this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
                  }
                });
              });
              return;
            }
            this.eval_queryInfo=JSON.parse(eval_queryInfo);

            //修改评语，从数据库中获取考勤相关信息
            //if(this.eval_queryInfo.modeTag==='edit'){
              this.getExitCourseInfo();
            //}
          },
          //将操作的数据缓存本地
          saveAttendInfo:function () {
            var attendInfo={
              isFullAttend:this.isFullAttend,
              affairLeave:this.affairLeave,
              sickLeave:this.sickLeave,
              sabbaticalLeave:this.sabbaticalLeave,
              late:this.late,
              absentWork:this.absentWork,
              medicineJson:this.medicineJson //医德医风
            }
            window.localStorage.setItem(this.eval_queryInfo.UserId+'_attendInfo',JSON.stringify(attendInfo));
          },
          //获取上一次录入的学员出科相关信息
          getExitCourseInfo:function () {
            var guid = this.getLocalStorageValue('userinfo').guid;
            if(!guid){
              this.$messagebox('温馨提示', '登录状态无效了，请重新登录！').then(action => {
                this.$router.push('/login');
              });
              return;
            }
            var vueMdl = this;
            var eval_queryInfo = vueMdl.eval_queryInfo;
            var _date=new Date(eval_queryInfo.PlanStartDate);
            var _year = _date.getFullYear();
            var _month = _date.getMonth()+1;
            var createYear = _year+''+_month;
            var params = {
              userID:eval_queryInfo.UserId,
              departmentID: eval_queryInfo.DepartmentId,
              createYear: createYear,
              guid:guid
            }
            var url = 'exit/getExitCourseInfoByID';
            this.$httpPost(url, params, function (err,json) {
              if(json.data.data.length>=1){
                var attendJson=json.data.data[0];
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
                vueMdl.medicineJson =(attendJson.MedicalEthics==='')?G_MedicalEthicsData:JSON.parse(attendJson.MedicalEthics);
              }else{//没有从数据库中获取数据
                //上次操作的缓存数据
                var attendInfo = window.localStorage.getItem(vueMdl.eval_queryInfo.UserId+'_attendInfo');
                if(attendInfo){
                  vueMdl.attendInfo=JSON.parse(attendInfo);
                  vueMdl.isFullAttend=vueMdl.attendInfo.isFullAttend;
                  vueMdl.affairLeave=vueMdl.attendInfo.affairLeave;
                  vueMdl.sickLeave=vueMdl.attendInfo.sickLeave;
                  vueMdl.sabbaticalLeave=vueMdl.attendInfo.sabbaticalLeave;
                  vueMdl.late=vueMdl.attendInfo.late;
                  vueMdl.absentWork=vueMdl.attendInfo.absentWork;
                  vueMdl.medicineJson = vueMdl.attendInfo.medicineJson;
                }else{
                  vueMdl.isFullAttend='是';
                  vueMdl.affairLeave=0;
                  vueMdl.sickLeave=0;
                  vueMdl.sabbaticalLeave=0;
                  vueMdl.late=0;
                  vueMdl.absentWork=0;
                  vueMdl.medicineJson = G_MedicalEthicsData;
                }
              }
            }, 'json');
          },
          //医德医风选项的选择弹窗
          optionClick:function(opitons,pIndex,index){
            this.slots = [{
              flex: 1,
              values: opitons,
              className: 'slot',
              textAlign: 'center',
              defaultIndex: 0,
              value: -1
            }];
            
            this.popupVisiblePicker=true;
            this.itemId = pIndex;
            this.optionId = index;
          },
          //页面头部返回事件控制
          backClick:function(){
            this.saveAttendInfo();
            this.$router.push({
              path:'/teacher_index/teacher_exit/',
              name:'',
              query:{
                planDataIndex:this.$route.query.planDataIndex
                // checkExitType:this.$route.query.checkExitType  //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          },
          //关闭选择控件弹窗
          cancelHide:function(type){
            if (type=='cancel') {
              //this.medicineJson[this.itemId].ItemList[this.optionId].OptionValue = '';
            }else{
              //当点击弹窗，有默认选中，直接点击确定时，取用默认值
              if (!this.slotsValue) {
                this.slotsValue = this.slots[0].values[0];
              };
              this.medicineJson[this.itemId].ItemList[this.optionId].OptionValue = this.slotsValue;
            }
            this.popupVisiblePicker=false;
          },
          //选择医德医风操作项的改变事件
          onValuesChange: function (picker, values) {
            this.slotsValue = values[0];
            /*if (values[0]) {
              this.medicineJson[this.itemId].ItemList[this.optionId].OptionValue = values[0];
            }else{
              this.medicineJson[this.itemId].ItemList[this.optionId].OptionValue = '';
            }*/
          },
          //录入医德医风数值的监控事件
          onValuesInput:function(evt){
            var value = evt.target.value.trim();
            var pIndex = evt.target.lang.split('-')[0];
            var index = evt.target.lang.split('-')[1];
            if (value.length >= 1) {
              this.medicineJson[pIndex].ItemList[index].OptionValue = value;
            }else{
              this.medicineJson[pIndex].ItemList[index].OptionValue = '';
            }
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

/*医德医风*/
table{width:98%;margin:0px auto;}
  table,th,td{
    position: relative;
    border-spacing: 0;
    border-collapse: collapse;
    box-sizing: border-box;
    background-color: #fff;
    border-radius:6px;
    border-bottom: 1px solid #ddd;
    }
  td{height:45px;}
  table td:nth-child(1){
    font-weight:bold;
    text-align: center;
  }
  .td{font-weight:bold;text-align: center; border-left: 1px solid #ddd;}
  .more-icn{position:absolute;right:15px;bottom:10px;width:17px;height:28px;background:url('../assets/right.png') 0 10px no-repeat;background-size: 9px;}
  .td-font{width: 100px;}
  .td-font2{width:100px;padding-right: 3px;}
</style>
