<template>
<div class="teaching-mange">
    <div class="head" @click="openPopup">
        <strong>
        <span style="float:left;margin-left:10px;">带教月份：</span>
        <span class="span-right" v-show="isShow">请选择具体带教月份</span>
        <span class="triangle-down-icn"></span>
        <div class="hasTime" v-show="showTime" disableClear>
            <span class="">{{startMonth}}</span>
            至<span class="">{{endMonth}}</span>
        </div>
      </strong>
    </div>
    <div>
        <mt-button type="default" v-bind:class="{'btntype':btndwon,'btntype-up':btnup}" @click="nowTeaching">当前带教</mt-button>
    </div>
    <div class="tab-list" style="margin-bottom:55px;">
        <div v-if="coachingDetailList.length==0" style="padding-top:20px;text-align: center;">暂无数据！</div>
        <div v-for="(item,index) in coachingDetailList" class="tab-item">
            <div class="item-list1">
                <span style="color:#219CD8;text-decoration: underline" @click="getStudentInfo(item.UserId)"><strong>{{item.RealName}}</strong></span>
                <span style="color:#219CD8;"><strong>({{item.UserName}})</strong></span>
                <div style="float:right;padding-top: 1px !important;">
                  <el-tooltip placement="bottom" effect="light" :hide-after="showtime">
                    <div slot="content">{{item.IsPracticingPhysician ? '是执业医师':'非执业医师'}}</div>
                    <span :class="item.IsPracticingPhysician ? 'flag-z':'flag-z-gray'">执</span>
                  </el-tooltip>
                  <el-tooltip placement="bottom" effect="light" :hide-after="showtime">
                    <div slot="content">{{item.IsPracticingPhysician ? '有处方权':'无处方权'}}</div>
                    <span :class="item.IsPrescriptionRight ? 'flag-c':'flag-c-gray'">处</span>
                  </el-tooltip>
                </div>
            </div>
            <div class="item-list2">
                <span style="width:35%;display:inline-block;">{{item.DepartmentName}}</span>
                <span style="width:35%;display:inline-block;">{{item.TrainingYears===1?'一年制':item.TrainingYears===2?'二年制':item.TrainingYears===3?'三年制':'-'}}</span>
            </div>
            <div  class="item-list3">
                <span>带教起止日期：{{item.StartDate}}至{{item.EndDate}}</span>
            </div>
            <div  class="item-list4">
                <span v-bind:class="{'fontB':showBeizhu}">备注：{{item.Remark?item.Remark:'-'}}</span>
                <i v-if="item.Remark.length>15"
                class="icon iconfont" 
                v-bind:class="{'icon-caret-down':icondown,'icon-caret-down-copy':iconup}"
                style="width:20px;"
                @click="showbeizhuXQ"></i>
            </div>
        </div>
    </div>
    <!--带箭头小提示窗-->
    <div class="container" v-show="isShowTip">
      <div class="content">{{tipMsg}}</div>
      <s :style="positionLeft ? 'left:50px':'left:20px'"><i></i></s>
    </div>


    <mt-popup 
    v-model="popupVisible_date" 
    position="bottom" 
    style="width:100%;"> 
        <div class="picker-toolbar">  
            <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>  
            <span class="mint-datetime-action mint-datetime-confirm" @click="selectCoachingDetail">确定</span>  
        </div>
        <mt-picker :slots="dateTime" @change="onValuesChange"></mt-picker>
    </mt-popup>
    <!--学员信息弹窗-->
    <student-info :userid="studentid" :showStudent.sync="popupVisible"></student-info>
</div>
</template>

<script>
import studentInfo from "@/components/studentInfo"
export default {
  name: "",
  components: {studentInfo},
  created() {
    this.timeBind();
  },
  activated() {
    this.$store.commit("updatateacher_indexSelected", "teacher_details");
    this.role = this.getLocalStorageValue("userinfo").role; //获取用户角色
    if (this.guid !== this.getLocalStorageValue('userinfo').guid || this.userinfoData === "") {
      //刷新／激活数据写在此处,每次打开页面请求最新的数据
      this.guid = this.getLocalStorageValue('userinfo').guid;
      this.getCoachingDetail(this.type);
    }
  },
  data() {
    return {
      guid: "",
      role: "",
      coachingDetailList: [],
      userinfo: {},
      isShow:true,
      showTime:false,
      popupVisible:false, //是否展示个人信息弹窗
      StudentInfoData:{},  //学员个人信息,
      popupVisible_date:false,//是否显示日期查询控件
      type:0,//显示数据参数，0--起止时间为空，1--起止时间为当前时间所在的年份和月份，2--起止时间为选择的时间
      startMonth:'',
      endMonth:'',
      sYear:'',
      sMouth:'',
      eYear:'',
      eMouth:'',
      textLength:0,
      dateTime: [
                    {
                        flex: 1,
                        values: ['2015','2016','2017','2018'],
                        textAlign: 'center'
                    }, {    
                        content: '-' ,
                        className:''
                    },{
                        flex: 2,
                        values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
                        textAlign: 'center'
                    },{   
                        divider: true,
                        content: '至' 
                    },{
                        flex: 1,
                        values: ['2018','2017','2016','2015'],
                        textAlign: 'center'
                    }, {   
                        content: '-' 
                    },
                    {
                        flex: 2,
                        values: ['01','02','03','04','05','06','07','08','09','10','11','12'],
                        textAlign: 'center'
                    }
                ],
      showBeizhu:true,//显示/隐藏备注详细信息
      iconup:false,//可点击收缩备注的小图片
      icondown:true,//可点击展开备注的小图片
      positionLeft:'',  //tip箭头位置
      tipMsg:'',  //tip提示信息
      isShowTip:false,  //是否显示tip提示窗
      studentid:'',
      btndwon:false,//未选择日期的按钮样式
      btnup:true,//选择日期后的按钮样式
      showtime:1000,
    };
  },
  methods: {
    getCoachingDetail(type) {
      var that = this;
      if (!that.guid) {
        this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(action => {
          this.$router.push("/login");
        });
        return;
      }
      var parems = {
        startMonth:'',
        endMonth:'',
        page: 1,
        pageNum: 1000,
        guid: that.guid
      };
      //显示数据参数，0--起止时间为空，1--当前带教：起止时间为当前时间所在的年份和月份，2--起止时间为选择的时间
      switch (type){
        case 0:
          parems.startMonth='';
          parems.endMonth='';
          break;
        case 1:
          var year=new Date().getFullYear();
          var mouth=new Date().getMonth()+1;
          if(mouth<10){
            mouth='0'+mouth;
          }
          parems.startMonth=""+year+"-"+mouth+"";
          parems.endMonth=""+year+"-"+mouth+"";
          break;
        case 2:
          parems.startMonth=""+this.sYear+"-"+this.sMouth+"";
          parems.endMonth=""+this.eYear+"-"+this.eMouth+"";
          break;

      }
      console.log(parems);
      this.$httpPost("coachingDetail/getCoachingDetail", parems, function(err,json) {
        if (json.status == 200) {
            if(json.data.count>0){
                that.coachingDetailList = json.data.data;
            }else{
                that.coachingDetailList=[];
            }
          
        } else {
          this.$messagebox({
            title: "提示",
            message: json.msg,
            showCancelButton: true
          });
        }
      });
    },
    getStudentInfo(studentid) {
        this.studentid=studentid;
        this.popupVisible = true;
    },
    timeBind(){
      this.dateTime[0].values=[];
        this.dateTime[4].values=[];
        var now=new Date();
        var j=2015;
        var n=now.getFullYear();
        var k=n-j+1;
        for (var i = 0; i < k; i++) {
            this.dateTime[0].values.push(n);
            this.dateTime[4].values.push(n);
            n -= 1;
        }
    },openPopup(){
        this.popupVisible_date=true;
    },
    //关闭个人信息弹窗
    closeStudentInfo:function (){
        this.popupVisible=false;
    },
    onValuesChange(picker, values) {
        if (values[0] > values[1]) {
            picker.setSlotValue(1, values[0]);
        }
        this.sYear=values[0];
        this.sMouth=values[2];
        this.eYear=values[3];
        this.eMouth=values[5];

        this.startMonth=""+values[0]+"年"+values[2]+"月";
        this.endMonth=""+values[3]+"年"+values[5]+"月";

    },
    cancelHide(){
        this.popupVisible_date=false;
    },
    //查询
    selectCoachingDetail(){
        this.popupVisible_date=false;
        this.btndwon=false;
        this.btnup=true;
        this.type=2;

        if(this.eYear==this.sYear){
          if(this.eMouth<this.sMouth){
            this.$messagebox({
              title: "提示",
              message: '查询开始日期应早于结束日期',
              showCancelButton: false
            });
          }else{
            this.isShow=false;
            this.showTime=true;//显示带教月份
            this.startMonth=""+this.sYear+"年"+this.sMouth+"月";
            this.endMonth=""+this.eYear+"年"+this.eMouth+"月";

            this.getCoachingDetail(this.type);
          }
        }else if(this.eYear<this.sYear){
          this.$messagebox({
            title: "提示",
            message: '查询开始日期应早于结束日期',
            showCancelButton: false
          });
        } else{
          this.isShow=false;
          this.showTime=true;//显示带教月份
          this.startMonth=""+this.sYear+"年"+this.sMouth+"月";
          this.endMonth=""+this.eYear+"年"+this.eMouth+"月";

          this.getCoachingDetail(this.type);
        }
        
    },
    //当前带教
    nowTeaching(){
        this.isShow=true;
        this.showTime=false;
        this.btndwon=true;
        this.btnup=false;
        this.type=1;

        
        this.getCoachingDetail(this.type);
    },
    showbeizhuXQ(){
      //备注内容超过15个字数，就缩略显示，出现可点击的倒三角
      this.icondown!=this.icondown;
      if(this.icondown){
        this.showBeizhu=false;
        this.iconup=true;
        this.icondown=false;
      }else{
        this.showBeizhu=true;
        this.iconup=false;
        this.icondown=true;
      }
    }
  }
};
</script>

<style>
html,body {background-color:#eee;}
.teaching-mange {width:100%;margin-top:55px;}
.teaching-mange .head {width: 96%;height: 35px;margin: 0px auto;text-align: center;line-height: 35px;background: #fff;font-size: 16px}
.teaching-mange .time-span {color:#219cd8;}
.teaching-mange .span-right{display:inline-block;position: absolute;right:30px;margin-right: 20px;color:#ccc;}
.teaching-mange .triangle-down-icn{position:absolute;right: 25px;top:60px;width:17px;height:30px;background:url('../assets/triangle-down-icn.png') 0 10px no-repeat;background-size: 14px;}
.teaching-mange .hasTime{float:right;padding-right: 40px;}

.teaching-mange .tab-list{width:97%;margin:0px auto;overflow-y:auto;overflow-x:hidden;font-size:16px;}
.teaching-mange .tab-list i{font-size: 16px;}
.teaching-mange .tab-list .item-list1,.item-list2 span{font-size: 16px !important;margin-bottom: 5px;}
.teaching-mange .tab-list .item-list3,.item-list4 span{font-size: 14px !important;}
.teaching-mange .tab-head{background-color: white;height: 40px;border-radius: 6px;line-height: 40px;}
.teaching-mange .tab-item{border: 1px solid #eee;background-color: white;border-radius: 6px;padding: 10px;margin-top: 10px;}
.teaching-mange .tab-item div{padding-top:5px;}
.teaching-mange .tab-item .item-list2 .fontZ{display:inline-block;margin-right:10px;border-radius: 6px;width: 30px;text-align: center;}
.teaching-mange .tab-item .item-list2 .fontC{display:inline-block;margin-right:10px;border-radius: 6px;width: 30px;text-align: center;}

.teaching-mange .flag-z {padding: 3px 6px;font-size: 16px;border-radius: 6px;margin-right: 10px;color: #fff;font-weight: bold;background: #f0ad4e;}
.teaching-mange .flag-z-gray {padding: 3px 6px;font-size: 16px;border-radius: 6px;color: #fff;font-weight: bold;background: #ccc;margin-right: 10px;}
.teaching-mange .flag-c {padding: 3px 6px;font-size: 16px;border-radius: 6px;color: #fff;font-weight: bold;background: #5cb85c;}
.teaching-mange .flag-c-gray {padding: 3px 6px;font-size: 16px;border-radius: 6px;color: #fff;font-weight: bold;background: #ccc;}

.teaching-mange ul,.teaching-mange ul li{list-style: none;margin:0px;padding:0px;}

.teaching-mange .popup{width:300px;line-height: 28px;text-align: center;overflow-x: hidden;overflow-y: auto;}
.teaching-mange .popup .close{position: absolute;right:0px;top:1px;width:30px;height:30px;float:right;color:#333;text-align: center;}
.teaching-mange .popup .close img{width:20px;margin-top:2px;}
.teaching-mange .popup ul li{height:30px;line-height: 30px;}
.teaching-mange .popup ul li:nth-of-type(odd){background: #eee;} /*奇数行样式*/
.teaching-mange .popup ul li > div:nth-child(1){float:left;width:43%;padding-left:20px;text-align: left;}
.teaching-mange .popup ul li > div:nth-child(2){float:right;width:40%;padding-right:20px;text-align: right;}

.teaching-mange .picker-item{padding: 1px;}
.teaching-mange .fontColor{color: #37acd3;}
/*当前带教按钮样式*/
.teaching-mange .btntype {background-color:#37acd3;color:white;width:90px;float:right;height:30px !important;margin-top:10px;font-size: 16px;margin-right: 15px;}
.teaching-mange .btntype-up{border: 1px solid black;color: black;background-color: #eee;width:90px;float:right;height:30px !important;margin-top:10px;font-size: 16px;margin-right: 15px;}

.teaching-mange .fontB{max-width:300px;display: inline-block;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;}

div.container{position:absolute;top:30%;right:40px;font-size:9pt;display:block;height:15px;width:65px;background-color:transparent;*border:1px solid #666}
div.container s{position:absolute;top:-20px;*top:-22px;left:20px;display:block;height:0;width:0;font-size:0;line-height:0;border-color:transparent transparent #666 transparent;border-style:dashed dashed solid dashed;border-width:10px}
div.container i{position:absolute;top:-9px;*top:-9px;left:-10px;display:block;height:0;width:0;font-size:0;line-height:0;border-color:transparent transparent #fff transparent;border-style:dashed dashed solid dashed;border-width:10px}
.content{border:1px solid #666;-moz-border-radius:3px;-webkit-border-radius:3px;position:absolute;background-color:#fff;width:100%;height:100%;padding:5px;*top:-2px;*border-top:1px solid #666;*border-top:1px solid #666;*border-left:none;*border-right:0;*height:102px;box-shadow:3px 3px 4px #999;-moz-box-shadow:3px 3px 4px #999;-webkit-box-shadow:3px 3px 4px #999;filter:progid:DXImageTransform.Microsoft.Shadow(Strength=4,Direction=135,Color='#999999');-ms-filter:"progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#999999')"}
</style>
