<template>
  <div>
    <mt-header fixed title="评价带教老师" style="background:#37acd3;font-size:16px;">
      <router-link to="/student_attendance"  slot="left">
        <mt-button icon="back"  v-on:click="saveRateInfo"></mt-button>
      </router-link>
    </mt-header>
    <div class="eval-wrap top-wrap" >
      <div style="padding:5px;">
        <div class="top-title">
          <div style="float:left;margin-left:10px;">评价项目及考核指标</div>
          <div style="float:right;margin-right:10px;">总分{{rateJson.totalScore}}</div>
        </div>
      </div>
    </div>

    <div class="eval-wrap" style="padding:78px 5px 0 5px;float:left;">
      <div class="eval-panel" v-for="(item,index) in TeachingJson.TeachingItems" style="margin-top:10px;">
        <div class="eval-panel-title text-center" style="">{{item.ItemName}}({{item.ItemScore}}分)</div>
        <div class="ul-wrap" style="padding:0px 10px 10px 10px;">
          <ul class="ul">
            <li class="li"v-for="(itemA,indexA) in item.ItemOptions">
              <div class="li-wrap " style="">
                <span class="li-title text-left" style="width:100%;">{{itemA.OptionName}}</span>
                <div class="li-content" style="width:100%;padding:5px 0;">
                  <div class="block">
                    <el-rate v-model="rateJson.scoreValue[index].value[indexA]"
                             v-bind:groupIdx="index"
                             v-bind:itmIdx="indexA"
                             v-bind:lastrate="(rateJson.scoreValue[index].value[indexA]===0)?false:rateJson.scoreValue[index].value[indexA]"
                             v-on:change="rateChange"></el-rate>
                  </div>
                </div>
              </div>
              <div class="border-btm" style="float:left;width:100%;" v-show="indexA<item.ItemOptions.length-1"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="eval-panel" style="background:none;margin-top:10px;">
        <div class="eval-panel-title text-center">建议和意见</div>
        <div style="padding:0 5px;">
          <textarea class="text-area" id="adviceTextArea">{{rateJson.suggestion}}</textarea>
        </div>
      </div>
    </div>
    <div style="width:100%;height:140px;float:left;"></div>
    <div class="eval-wrap" style="position:fixed;bottom:50px;left:0;width:100%;height:90px;background:#eee;z-index:9;">
      <div style="padding:10px 5px 5px 5px;">
        <div class="eval-panel" >
          <div class="eval-panel-title text-center">整体评价</div>
          <div classs="btn-group">
            <div style="float:left;width:33%">
              <div :class="(rateJson.overallEval==='优秀')?'btn-lg btn-default text-center focus':'btn-lg btn-default text-center'"  style="margin:5px" v-on:click="overallEvalChange($event)">优秀</div>
            </div>
            <div style="float:left;width:33%">
              <div :class="(rateJson.overallEval==='合格')?'btn-lg btn-default text-center focus':'btn-lg btn-default text-center'"  style="margin:5px" v-on:click="overallEvalChange($event)">合格</div>
            </div>
            <div style="float:left;width:33%">
              <div :class="(rateJson.overallEval==='不合格')?'btn-lg btn-default text-center focus':'btn-lg btn-default text-center'" style="margin:5px" v-on:click="overallEvalChange($event)">不合格</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="eval-wrap">
      <div class="btm-btn-group">
        <div style="float:left;width:50%">
          <div class="btm-btn text-center" v-on:click="toAttendance">上一项</div>
        </div>
        <div style="float:left;width:50%">
          <div class="btm-btn text-center" v-on:click="toSummary">提交评论，下一项</div>
        </div>

      </div>
    </div>

  </div>



</template>

<script>
    import {Teachingdata} from '../assets/js/teachingJson.js'

    export default {
        name: '',
        components: {},
        data(){
            return{
                rateJson:{
                  scoreValue:[
                    {value:[0,0,0,0,0],groupScore:0},
                    {value:[0,0,0,0,0],groupScore:0},
                    {value:[0,0,0,0,0],groupScore:0},
                    {value:[0,0,0,0,0],groupScore:0}
                  ],
                  overallEval:'合格',
                  suggestion:'',
                  totalScore:0
                },//评分数据集
                TeachingJson : {},//评分项json
                eval_queryInfo:{}//轮转计划参数集
            }
        },
        created(){
          this.initRate();
        },
        methods:{
          toAttendance:function () {
            this.saveRateInfo();
            this.$router.push({
              path:'/student_attendance',
              name:'student_attendance',
              query:{

              }
            });
          },
          //跳转小结页面
          toSummary:function () {
            this.saveRateInfo();
            this.submitSuggestion();
            this.$router.push({
              path:'/student_summary',
              name:'student_summary',
              query:{

              }
            });
          },
          //评星change事件
          rateChange:function (e) {
            var evt =event.currentTarget.parentElement;
            var groupIdx = evt.getAttribute('groupidx');//星级控件组索引
            var itmIdx =  evt.getAttribute('itmidx');//星级控件项索引
            var lastRate =  evt.getAttribute('lastrate');//前一次评分
            if(lastRate){//前一次评分是1并且当前打分为1，让评分归0
              if(lastRate==='1'&&e===1){
                  e=0
              }
            }
            evt.setAttribute('lastrate',e);

            var rateArr =[];
            for(var i =0;i<this.rateJson.scoreValue.length;i++){
                rateArr.push(this.rateJson.scoreValue[i]);
            }
            rateArr[groupIdx].value[itmIdx]=e;
            var _teachingJson = this.TeachingJson.TeachingItems;
            _teachingJson[groupIdx].ItemOptions[itmIdx].SelectedGrade=e;

            this.TeachingJson.TeachingItems =_teachingJson;
            this.countTotalScore(rateArr);
          },
          //初始化评分数据
          initRate:function () {
            var eval_queryInfo=window.localStorage.getItem('eval_queryInfo');
           if(eval_queryInfo){
             var _rateJson=window.localStorage.getItem('rateJson');
             this.TeachingJson=Teachingdata;
               this.eval_queryInfo=JSON.parse(eval_queryInfo);
               if(this.eval_queryInfo.modeTag==='edit'&&!_rateJson){
                 this.getSuggestionInfo();
               }else{
                 this.showStoreRateData();
               }
           }
          },
          //计算总分
          countTotalScore:function (rateArr) {
              var total_score=0;
              for(var i=0;i<rateArr.length;i++){
                  var itmArr= rateArr[i].value;
                  var group_score=0;
                  for(var j=0;j<itmArr.length;j++){
                    group_score=group_score+Number(itmArr[j]);
                  }
                  rateArr[i].groupScore=group_score;
                  total_score = total_score+rateArr[i].groupScore;
              }
              this.rateJson.totalScore=total_score;
          },
          //评级
          overallEvalChange:function (evt) {
            var _value= evt.currentTarget.textContent;
            this.rateJson.overallEval=_value
          },
          //提交评分
          submitSuggestion:function () {
            var vueMdl = this;
            var rateJson=vueMdl.rateJson;
            var eval_queryInfo=vueMdl.eval_queryInfo;
            var teachingJson=vueMdl.TeachingJson;
            if(eval_queryInfo.CoachingId===-1||eval_queryInfo.CoachingId===null){
              vueMdl.$Toast('未被分配带教老师');
                return;
            }
            var params = {
              PlanStartDate: eval_queryInfo.PlanStartDate,////计划开始时间，用于存评价年份
              AppraisalType: 0,//学生评价老师
              UserId: eval_queryInfo.UserId,
              DepartmentId: eval_queryInfo.DepartmentId,
              TeacherId: eval_queryInfo.CoachingId,
              TeacherName: eval_queryInfo.CoachingName,
              Content:JSON.stringify(teachingJson),
              Score:rateJson.totalScore,
              OverallEval:rateJson.overallEval,
              Suggestion:rateJson.suggestion,
              guid:this.getLocalStorageValue('userinfo').guid
            }
            var url = 'rotate/submitSuggestion';
            this.$httpPost(url, params, function (err, data) {
              var status = data.status;
              if (status == 200) {
                  //window.localStorage.removeItem('rateJson');
                vueMdl.$Toast('提交成功');
              } else if (status === 401) {

              } else if (status === 201) {
                //登录失效

              } else {

              }
            }, 'json')
          },
          //请求评分、建议、评级数据
          getSuggestionInfo:function () {
            var vueMdl = this;
            var eval_queryInfo=vueMdl.eval_queryInfo;
            var params = {
              PlanStartDate: eval_queryInfo.PlanStartDate,////计划开始时间，用于评价年份查询条件
              AppraisalType: 0,
              UserId: eval_queryInfo.UserId,
              DepartmentId: eval_queryInfo.DepartmentId,
              TeacherId: eval_queryInfo.CoachingId,
              TeacherName: eval_queryInfo.CoachingName,
              guid:this.getLocalStorageValue('userinfo').guid
            }
            var url = 'rotate/getSuggestion';
            this.$httpPost(url, params, function (err, data) {
              var status = data.status;
              if (status == 200) {
                var evalData=data.data.data[0];
                if(!evalData){
                      vueMdl.showStoreRateData();
                }else{
                    vueMdl.TeachingJson=JSON.parse(evalData.Content);
                    vueMdl.rateJson.suggestion=evalData.Suggestion;
                    vueMdl.rateJson.overallEval=evalData.OverallEval;
                    var teachingItems = vueMdl.TeachingJson.TeachingItems;
                    var rateArr=[];
                    for(var i =0;i<teachingItems.length;i++){
                      var itemOptions = teachingItems[i].ItemOptions;
                      var valObj={value:[],groupScore:0};
                      for(var j=0;j<itemOptions.length;j++){
                        var selectedGrade=itemOptions[j].SelectedGrade;
                        if(selectedGrade!==-1){
                          valObj.value.push(selectedGrade);
                        }else{
                          valObj.value.push(0);
                        }

                      }
                      rateArr.push(valObj);
                    }
                    vueMdl.rateJson.scoreValue=rateArr;
                    vueMdl.countTotalScore(rateArr);
                  }
              } else if (status === 201) {
                //登录失效

              } else {

              }
            }, 'json')
          },
          showStoreRateData:function () {
            var _rateJson=window.localStorage.getItem('rateJson');
            if(_rateJson){
              this.rateJson=JSON.parse(_rateJson);
            }else{
                var rateArr=[];
                for(var i=0;i<this.TeachingJson.TeachingItems.length;i++){
                    var rateItmArr=[];
                    for(var j=0;j<this.TeachingJson.TeachingItems[i].ItemOptions.length;j++){
                      rateItmArr.push(0);
                    }
                  rateArr.push({value:rateItmArr,groupScore:0})
                }
                this.rateJson.scoreValue=rateArr;
            }
            this.countTotalScore(this.rateJson.scoreValue);
          },
          //保存用户填写建议及评分数据
          saveRateInfo:function () {
            var suggestion = this.shieldingWords(document.getElementById('adviceTextArea').value);
            this.rateJson.suggestion=suggestion;
            var _rateJson = this.rateJson;
            window.localStorage.setItem('rateJson',JSON.stringify(_rateJson))
          },
          //录入的内容进行特殊字符屏蔽操作
          shieldingWords:function(str) {
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
            str = str.replace(/select|update|delete|exec|count|insert|'|"|=|;|>|<|%/i,'*'); //屏蔽sql语句 /i意思为忽略大小写
            str = str.replace(/(^\s+)|(\s+$)/g, '');    //去除前后空格
            str = str.replace(/[\ud83c-\udfff]/g, '*'); //屏蔽表情符
            return str;
          }
        },
        activated(){
          this.initRate();
        }
    }
</script>

<style>
  body{
    background:#eee;
  }

  ul{
    padding:0px;margin:0px;
  }
  li{
    padding:0;
    list-style : none;
  }
  .top-wrap{
    position:fixed;top:40px;left:0;width:100%;z-index:9;height:55px;background:#eee;
  }
  .eval-wrap{

  }
  .eval-wrap .btm-btn-group{
    position:fixed;
    left:0;
    bottom:0;
    width:100%;
    height:50px;
    line-height:50px;
    background:#37acd3;
  }
  .eval-wrap .btm-btn-group .btm-btn{
    float:left;
    width:100%;
    color:#fff;
  }
  .eval-wrap .text-left{text-align:left;}
  .eval-wrap .text-center{text-align:center;}
  .eval-wrap .border-btm{border-bottom:1px solid #eeeeee;}
  .eval-wrap .btn-lg{
    padding: 7px 13px;
    font-size: 16px;
    line-height: 1.3333333;
    border-radius: 4px;
  }
  .eval-wrap .btn-default{
    color: #fff;
    background-color: #c0c0c0;
    border-color: #c0c0c0;
  }
  .eval-wrap .focus {
    color: #fff;
    background-color: #55d179;
    border-color: #55d179;
  }

  .eval-wrap .ul{}
  .eval-wrap .li{ float:left;width:100%;}
  .eval-wrap .li-wrap{ padding:10px;float:left;}
  .eval-wrap .li-title{float:left;padding:5px 0 0 0;width:50%;}
  .eval-wrap .li-content{float:left;padding:5px 0 0 0;width:50%;}
  .eval-wrap .ul input[type="text"]{
    border:0;width:97%;outline:none;
  }
  .eval-wrap .ul input[type="radio"]{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
  }

  .eval-wrap .top-title{
    float:left;background:#fff;width:100%;height:20px;padding:10px 0;border-radius:6px;
  }
  .eval-wrap .eval-panel{float:left;background:#fff;width:100%;border-radius:6px;}
  .eval-wrap .eval-panel-title{padding:10px 10px 0px 10px;color:#37acd3;}
  .eval-wrap .text-area{
    width:100%;overflow:hidden;height:100px;outline:none;resize:none;
  }
  .eval-wrap .el-rate__icon{
    margin-right:30px;
  }
</style>
