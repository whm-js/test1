
<template>
<div class="handbooke-mainpage">
  <mt-header fixed :title="DepartmentName" style="background-color:#37acd3">
    <router-link to="/" slot="left">
     <mt-button icon="back"></mt-button>
    </router-link>
  </mt-header>

   <mt-cell :title="DemandNameTitle" @click.native="showChange"
   style=" background-color: #eee; color:#37acd3;min-height: 45px;" class="handbooke-mainpage-title">
   <i slot="icon" style="font-size: 16px" class="icon iconfont icon-list_icon"></i>
   </mt-cell>

  <div v-for="(el,n) in DetailData">
    <a class="mint-cell" @click="Detailpage(el,n)">
      <!--<span class="mint-cell-mask"></span>-->
      <!--<div class="mint-cell-left"></div>-->
      <div class="mint-cell-wrapper">
        <div class="mint-cell-title" v-if="el.CreateDate" style="width: calc(100% - 60px);">
          <span class="mint-cell-text">住院病历号：{{el.MedicalRecord}}</span>
          <span class="mint-cell-label sandian">病人姓名：{{el.Patient}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;操作日期：{{FDate(el.CreateDate)}}</span>
        </div>
        <div class="mint-cell-title" v-else style="width: calc(100% - 60px);">
          <span class="mint-cell-text">{{el.SpecificName}}</span>
          <span class="mint-cell-label sandian">要求完成：{{showDetailData1(el)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;完成情况：{{showDetailData2(el)}}</span>
        </div>
        <div class="mint-cell-value">
          <mt-button type="primary" v-if="el.CreateDate" @click.native.stop="deletedemand_rescue_record(n)">删除</mt-button>
        <mt-button @click.native.stop="InputDetail(el,n)" type="primary" :disabled="rotateStatus==0||rotateStatus==2" v-else>录入</mt-button>
        </div>
      </div>
      <div class="mint-cell-right"></div>
    </a>
  </div>

  <div class="mint-tabbar is-fixed">
    <mt-button type="primary" size="large" @click.native="adddemand_rescue_record" :disabled="rotateStatus==0||rotateStatus==2" v-show="DemandNameTitle==='抢救病人记录表'">新增记录</mt-button>
  </div>
    <mt-popup
        v-model="popupVisible"
        position="left">
       <div class="menu-title">选择要求</div>
      <template v-for="(el,index) in handBookData">
        <div class="menu-tip" v-if="el.childs.length>0">{{el.DemandName}}</div>
        <div class="menu-tip-no" v-else></div>
        <ul>
          <li v-if="el.childs.length==0" @click="DemandNameClick($event,index,0)" :showDemandName="el.DemandName" :DemandId="el.DemandId" :TableName="el.TableFlag" :class="{active:el.Active=='in active'&&DemandNameindex==0}">
            {{el.DemandName}}
          </li>
          <li v-else v-for="(el1,index1) in el.childs" @click="DemandNameClick($event,index,index1)" :showDemandName="el.DemandName+'-'+el1.DemandName" :DemandId="el1.DemandId" :TableName="el1.TableFlag" :class="{active:el.Active=='in active'&&DemandNameindex==index1}">
            {{el1.DemandName}}
          </li>

        </ul>
      </template>
    </mt-popup>
<div class="handbooke-mainpage1">
  <mt-popup
    v-model="popupVisible1"
    position="bottom">
    <div class="menu-title">完成情况</div>
    <mt-radio
      title=""
      v-model="selectOptionName"
      :options="OptionName">
    </mt-radio>
  </mt-popup>
</div>
  <div class="handbooke-mainpage1">
    <mt-popup
      v-model="popupVisible2">
      <div class="menu-title">完成情况</div>
      <textarea autofocus placeholder rows="4" v-model="CompletedCase" style="width: 96%;font-size: 20px;margin-left: 1.5%;"></textarea>
      <mt-button type="primary" size="large" @click.native="updateCompletedCase">完成</mt-button>
    </mt-popup>
  </div>
</div>
</template>

<script>
//  import store from '@/store/store';
var that;
var fromUrl='';
    export default {
      name: '',
      data(){
        return {
          UserID:'',
          CourseId:'',
          DepartmentId:'',
          DepartmentName:'',
          rotateStatus:-1,
          fromUrl:'',
          OptionName:[],
          selectOptionName:'',
          CompletedCase:'',
          guid:this.getGuid(),
          popupVisible: false,
          popupVisible1:false,
          popupVisible2:false,
          handBookData: {},
          DemandNameindex1:0,
          DemandNameindex:0,
          DemandNameTitle:'',
          DetailData:{},
          Detailindex:0
        }
      },
      watch: {
        // 如果 `question` 发生改变，这个函数就会运行
        selectOptionName: function (newselected) {
//          console.log(newselected);
          if(that.DetailData[that.Detailindex].ActualQuantityStringCode== newselected){
              return;
          }
          var SerialId = this.$store.state.handbookdetail.SerialId;
          var TableName = this.$store.state.handbooktable.TableFlag;
          var ActualQuantityStringCode = newselected;
          var params = {
            TableName: TableName,
            guid: that.guid,
            ActualQuantityStringCode:ActualQuantityStringCode,
            SerialId: SerialId
          };
          that.$httpPost('rotate/submitRotateRadioInput', params, function (err, json) {
//            that.DetailData = json.data.data;
            if(json.status == 200){
//                that.DetailData[that.DemandNameindex].ActualQuantityStringCode =
              that.$set(that.DetailData[that.Detailindex], 'ActualQuantityStringCode', newselected);
              that.$Toast("添加成功！");
//
            }else{
                that.$Toast("添加失败！");
            }
            that.popupVisible1 = false;
          });
        }
      },
      components: {},
      activated(){
        var isreload = this.$route.query.isreload;
          if((fromUrl==='/handbook_input'||fromUrl==='/handbook_detail')&&isreload!='true'&&this.DepartmentName!=''){
              return;
          }
        this.guid = this.getGuid();
        //刷新／激活数据写在此处,每次打开页面请求最新的数据
          var aa = this.$route.query.userId;
          if(aa){
            this.setcookie('mainpage_userid',aa);
            this.setcookie('mainpage_courseid',this.$route.query.courseId);
            this.setcookie('mainpage_departmentid',this.$route.query.departmentId);
            this.setcookie('mainpage_departmentname',this.$route.query.departmentName);
            this.setcookie('mainpage_rotatestatus',this.$route.query.rotateStatus);

              this.UserID = aa;
              this.CourseId = this.$route.query.courseId;
              this.DepartmentId = this.$route.query.departmentId;
              this.DepartmentName = this.$route.query.departmentName;
              this.rotateStatus = this.$route.query.rotateStatus;
          }else{
            this.UserID = this.getcookie('mainpage_userid');
            this.CourseId = this.getcookie('mainpage_courseid');
            this.DepartmentId = this.getcookie('mainpage_departmentid');
            this.DepartmentName = this.getcookie('mainpage_departmentname');
            this.rotateStatus = this.getcookie('mainpage_rotatestatus');
          }

        var params = {
          CourseId: this.CourseId,
          guid: this.guid,
          DepartmentId: this.DepartmentId
        };
        this.$httpPost('rotate/getRotateTabData', params, function (err, json) {
            var tablename = '';
            var demandid = '';
          if((JSON.stringify(json.data.data) == "{}")){
            that.$messagebox.alert('手册数据未配置，请联系科教科！').then(action => {
              that.$router.back(-1);
            });
            return;
          }
          that.handBookData = json.data.data;
          if(that.DemandNameindex1!=0&&fromUrl!='/index/rotate_department'){
            for(var a in that.handBookData){
              that.$set(that.handBookData[a], 'Active', '');
            }
            that.$set(that.handBookData[that.DemandNameindex1], 'Active', 'in active');

            if(that.handBookData[that.DemandNameindex1].childs.length>0){
              that.DemandNameTitle = that.handBookData[that.DemandNameindex1].DemandName + '-' + that.handBookData[that.DemandNameindex1].childs[that.DemandNameindex].DemandName;
              tablename = that.handBookData[that.DemandNameindex1].childs[that.DemandNameindex].TableFlag;
              demandid = that.handBookData[that.DemandNameindex1].childs[that.DemandNameindex].DemandId;
              that.$store.commit('updatahandbooktable',that.handBookData[that.DemandNameindex1].childs[that.DemandNameindex]);
              that.setLocalStorageValue('handbooktable',that.handBookData[that.DemandNameindex1].childs[that.DemandNameindex]);
            }else{
              that.DemandNameTitle = that.handBookData[that.DemandNameindex1].DemandName;
              tablename = that.handBookData[that.DemandNameindex1].TableFlag;
              demandid = that.handBookData[that.DemandNameindex1].DemandId;
              that.$store.commit('updatahandbooktable',that.handBookData[that.DemandNameindex1]);
              that.setLocalStorageValue('handbooktable',that.handBookData[that.DemandNameindex1]);
            }
          }else {
            for (var a in that.handBookData) {
              if (that.handBookData[a].Active == 'in active') {

                if (that.handBookData[a].childs.length > 0) {
                  that.DemandNameindex = 0;
                  that.DemandNameTitle = that.handBookData[a].DemandName + '-' + that.handBookData[a].childs[0].DemandName;
                  tablename = that.handBookData[a].childs[0].TableFlag;
                  demandid = that.handBookData[a].childs[0].DemandId;
                  that.$store.commit('updatahandbooktable', that.handBookData[a].childs[0]);
                  that.setLocalStorageValue('handbooktable', that.handBookData[a].childs[0]);
                } else {
//                      this.DemandNameindex = 0;
                  that.DemandNameTitle = that.handBookData[a].DemandName;
                  tablename = that.handBookData[a].TableFlag;
                  demandid = that.handBookData[a].DemandId;
                  that.$store.commit('updatahandbooktable', that.handBookData[a]);
                  that.setLocalStorageValue('handbooktable', that.handBookData[a]);
                }
                break;
              }
            }
          }
          var params = {
            TableName: tablename,
            guid: that.guid,
            UserId:that.UserID,
            DemandId: demandid
          };
          that.$httpPost('rotate/getRotateTableDetailData', params, function (err, json) {
            that.DetailData = json.data.data;
          });
        });

      },
      created(){
        that = this;
      },
      beforeRouteEnter(to,from,next){
        fromUrl = from.path;
        next(vm=>{
            vm.fromUrl = from.path;
        });
      },
      methods: {
        FDate: function (date) {
          var d = new Date(date);
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();

          return year + '.' + month + '.' + day;
        },
        showDetailData1:function (el) {
          switch (el.PatternType){
            case 0:
              return el.PrimaryQuantity;
                break;
            case 1:
              return el.QuantityStringCode;
                break;
            case 2:
              return el.QuantityStringCode;
                break;
            default:
              return '无';
                break;
          }
        },
        adddemand_rescue_record(){
//          this.$store.commit('updatahandbookdetail',el);
//          this.setLocalStorageValue('handbookdetail',el);
          if(this.rotateStatus==0||this.rotateStatus==2){
            this.$Toast("您尚未入科，不可录入信息！");
            return;
          }
          this.$store.commit('updatareloadMainpage','');
          this.$router.push({
            path:'handbook_input',
            name:'handbook_input'
          });
        },
        deletedemand_rescue_record(i){
          this.Detailindex = i;
          this.$messagebox.confirm('您确定要删除此记录吗?').then(action => {
            var params = {
              SerialId: this.DetailData[i].SerialId,
              guid: this.guid,
              TableName:'demand_rescue_record'
            };
            this.$httpPost('rotate/delete_record', params, function (err, json) {
//                that.detailData = json.data.data;
              if(json.status == 200){
                that.DetailData.splice(that.Detailindex,1);
                that.$Toast("删除成功！");
              }else{
                that.$Toast("删除失败！");
              }
            });
          }).catch(err => {
            if (err == 'cancel') {
            }
          });
        },
        showDetailData2:function (el) {
//          if(el.ActualQuantity==null){
//            el.ActualQuantity = '0';
//          }
//          if(el.ActualQuantityStringCode==null){
//            el.ActualQuantityStringCode = '';
//          }
          switch (el.PatternType){
            case 0:
              if(this.$store.state.handbooktable.TableFlag == 'demand_skill'){
                return el.PrimaryActualQuantity;
              }else{
                return el.ActualQuantity;
              }
//                if(el.ActualQuantity) {
//                  return el.ActualQuantity;
//                }else{
//                  return el.PrimaryQuantity;
//                }
              break;
            case 1:
              return el.ActualQuantityStringCode;
              break;
            case 2:
                if(this.$store.state.handbooktable.TableFlag == 'demand_teaching'){
                  return el.CompletedCase;
                }else{
                  return el.ActualQuantityStringCode;
                }
              break;
            default:
              return '无';
              break;
          }
        },
        onValuesChange(picker, values) {
          this.slots[2].values = this.handBookData[values[0]];
//          console.log(values[0], values[1]);
          this.pickerValue0 = values[0];
          this.pickerValue1 = values[1];
        },
        changeHandBook(){
//          console.log(this.pickerValue0, this.pickerValue1);
          this.popupVisible = false;
        },
        showChange(){
          this.popupVisible = true;
        },
        updateCompletedCase(){
//          if(this.CompletedCase == ''){
//              return;
//          }
          var SerialId = this.$store.state.handbookdetail.SerialId;
          var TableName = this.$store.state.handbooktable.TableFlag;
          var params = {
            TableName: TableName,
            guid: that.guid,
            ActualQuantityStringCode:this.encodeHtml(this.CompletedCase),
            SerialId: SerialId
          };
          params.ActualQuantityStringCode = this.decodeHtml(params.ActualQuantityStringCode);
          if(this.$store.state.handbooktable.TableFlag == 'demand_teaching'){
            params = {
              TableName: TableName,
              guid: that.guid,
              CompletedCase:this.CompletedCase,
              SerialId: SerialId
            };
          }
          that.$httpPost('rotate/submitRotateRadioInput', params, function (err, json) {
            if(json.status == 200){
              if(that.$store.state.handbooktable.TableFlag == 'demand_teaching') {
                that.$set(that.DetailData[that.Detailindex], 'CompletedCase',that.CompletedCase);
              } else{
                that.$set(that.DetailData[that.Detailindex], 'ActualQuantityStringCode',that.CompletedCase);
              }
              that.$Toast("添加成功！");
            }else{
              that.$Toast("添加失败！");
            }
            that.popupVisible2 = false;
          });
        },
        DemandNameClick(el,index,index1){
            this.DemandNameindex1 = index;
          for(var a in this.handBookData){
            this.$set(this.handBookData[a], 'Active', '');
//            console.log(this.handBookData[a].Active)
          }
//          console.log(this.handBookData)
          this.$set(this.handBookData[index], 'Active', 'in active');

          if(this.handBookData[index].childs.length>0){
            this.$store.commit('updatahandbooktable',this.handBookData[index].childs[index1]);
            this.setLocalStorageValue('handbooktable',this.handBookData[index].childs[index1]);
          }else{
            this.$store.commit('updatahandbooktable',this.handBookData[index]);
            this.setLocalStorageValue('handbooktable',this.handBookData[index]);
          }


//          console.log(this.handBookData)
          this.DemandNameindex = index1;
          this.DemandNameTitle = el.target.getAttribute('showDemandName');

          var params = {
            TableName: el.target.getAttribute('TableName'),
            guid: this.guid,
            UserId:this.UserID,
            DemandId: el.target.getAttribute('DemandId')
          };
          this.popupVisible = false;
          this.$httpPost('rotate/getRotateTableDetailData', params, function (err, json) {
            that.DetailData = json.data.data;
          });
        },
        InputDetail(el,index) {
          if(this.rotateStatus==0||this.rotateStatus==2){
            this.$Toast("您尚未入科，不可录入信息！");
            return;
          }
            this.Detailindex = index;
          switch (el.PatternType){
            case 0:
              this.$store.commit('updatahandbookdetail',el);
              this.setLocalStorageValue('handbookdetail',el);
              this.$store.commit('updatareloadMainpage','');
              this.$router.push({
                path:'handbook_input',
                name:'handbook_input'
              });
                break;
            case 1:
              this.$store.commit('updatahandbookdetail',el);
              this.setLocalStorageValue('handbookdetail',el);
                this.OptionName = el.OptionName.split('|');
                this.selectOptionName = el.ActualQuantityStringCode;
                this.popupVisible1 = true;
                break;
            case 2:
              this.$store.commit('updatahandbookdetail',el);
              this.setLocalStorageValue('handbookdetail',el);
              if(this.$store.state.handbooktable.TableFlag == 'demand_teaching'){
                this.CompletedCase = el.CompletedCase;
              }else{
                this.CompletedCase = el.ActualQuantityStringCode;
              }
              this.popupVisible2 = true;
                break;
            default:

                break;
          }
        },
        Detailpage(el,index){
            if(this.rotateStatus==0||this.rotateStatus==2){
              this.$Toast("您尚未入科，不可录入信息！");
              return;
            }
          this.Detailindex = index;
          if(el.SpecificName == '抢救病人记录'){
            this.$store.commit('updatadetaildata',el);
            this.setLocalStorageValue('detaildata',el);
            this.$router.push({
              path:'handbook_input',
              name:'handbook_input',
              query:{type:'update'}
            });
          }else {
            switch (el.PatternType) {
              case 0:
                this.$store.commit('updatahandbookdetail', el);
                this.setLocalStorageValue('handbookdetail', el);
                this.$store.commit('updatareloadMainpage', '');
                this.$router.push({
                  path: 'handbook_detail',
                  name: 'handbook_detail',
                  query: {
                    UserID: this.UserID,
                    SerialId: el.SerialId,
                    DemandId: this.$store.state.handbooktable.DemandId,
                    TableFlag: this.$store.state.handbooktable.TableFlag,
                    departmentName: this.DepartmentName,
                    SpecificName: el.SpecificName
                  }
                });
                break;
              case 1:
                this.$store.commit('updatahandbookdetail', el);
                this.setLocalStorageValue('handbookdetail', el);
                this.OptionName = el.OptionName.split('|');
                this.selectOptionName = el.ActualQuantityStringCode;
                this.popupVisible1 = true;
                break;
              case 2:
                this.$store.commit('updatahandbookdetail', el);
                this.setLocalStorageValue('handbookdetail', el);
                if (this.$store.state.handbooktable.TableFlag == 'demand_teaching') {
                  this.CompletedCase = el.CompletedCase;
                } else {
                  this.CompletedCase = el.ActualQuantityStringCode;
                }
                this.popupVisible2 = true;
                break;
              default:

                break;
            }
          }
        }
      }
    }

</script>

<style>
#app{
  margin-top: 0px;
}
body {
    margin: 0px;
   background-color: #eee;
}
.handbooke-mainpage{
  margin-top: 40px;
  margin-bottom: 55px;
}
.handbooke-mainpage .mint-popup {
  width: 60%;
  height: 100%;
  overflow: auto !important;
  border-right: 1px solid #999;
}




 .menu-tip{
    line-height: 20px;
    color: #666;
    padding: 6px 5px;
    margin: 5px;
    font-size: 16px;
    border-left: 3px solid #37acd3;
}
 .menu-tip-no{
   height: 10px;
   color: #666;
   padding: 6px 5px;
   margin: 5px;
   font-size: 16px;
 }
.menu-title{
    background-color: #eee;
    text-align: center;
    font-size: 16px;
    padding:15px;
}

.handbooke-mainpage ul{
  padding: 0px;
  margin-top: 0px;
}
.handbooke-mainpage li {
    list-style-type: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align:center;
    padding: 8px;
    background-color: #eee;
    margin: 5px 15px;
}
.handbooke-mainpage li:active{
   background-color: #ccc;
}
.handbooke-mainpage .active{
   background-color: #55d179;
   color:#fff;
}
.handbooke-mainpage .sandian {
  overflow:hidden;white-space:nowrap;text-overflow:ellipsis;
}

.handbooke-mainpage1 .mint-popup {
  border-radius: 5px;
  width: 98%;
  height: auto;
  overflow: auto;
  border-right: 1px solid #999;
}


/* Cell Component */
/* Header Component */
/* Button Component */
/* Tab Item Component */
/* Tabbar Component */
/* Navbar Component */
/* Checklist Component */
/* Radio Component */
/* z-index */
.handbooke-mainpage .mint-cell {
  background-color:#fff;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  color:inherit;
  min-height:68px;
  display:block;
  overflow:hidden;
  position:relative;
  text-decoration:none;
}
.handbooke-mainpage .mint-cell img {
  vertical-align:middle;
}
.handbooke-mainpage.mint-cell:first-child .mint-cell-wrapper {
  background-origin:border-box;
}
.handbooke-mainpage .mint-cell:last-child {
  background-image:-webkit-gradient(linear, left bottom, left top, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
  background-image:linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
  background-size:100% 1px;
  background-repeat:no-repeat;
  background-position:bottom;
  margin-top: 5px;
}
.handbooke-mainpage .mint-cell-wrapper {
  background-image:-webkit-gradient(linear, left top, left bottom, from(#d9d9d9), color-stop(50%, #d9d9d9), color-stop(50%, transparent));
  background-image:linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
  background-size: 120% 1px;
  background-repeat: no-repeat;
  background-position: top left;
  background-origin: content-box;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  line-height: 1.5;
  min-height: inherit;
  overflow: hidden;
  padding: 0 10px;
  width: 100%;
}
.handbooke-mainpage .mint-cell-mask {}
.handbooke-mainpage .mint-cell-mask::after {
  background-color:#000;
  content:" ";
  opacity:0;
  top:0;
  right:0;
  bottom:0;
  left:0;
  position:absolute;
}
.handbooke-mainpage .mint-cell-mask:active::after {
  opacity:.1;
}
.handbooke-mainpage .mint-cell-text {
  vertical-align: middle;
}
.handbooke-mainpage .mint-cell-label {
  color: #888;
  display: block;
  font-size: 12px;
  margin-top: 6px;
}
.handbooke-mainpage .mint-cell-title {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.handbooke-mainpage .mint-cell-value {
  color: #888;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.handbooke-mainpage .mint-cell-value.is-link {
  margin-right:24px;
}
.handbooke-mainpage .mint-cell-left {
  position: absolute;
  height: 100%;
  left: 0;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}
.handbooke-mainpage .mint-cell-right {
  position: absolute;
  height: 100%;
  right: 0;
  top: 0;
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
}
.handbooke-mainpage .mint-cell-allow-right::after {
  border: solid 2px #c8c8cd;
  border-bottom-width: 0;
  border-left-width: 0;
  content: " ";
  top:50%;
  right:20px;
  position: absolute;
  width:5px;
  height:5px;
  -webkit-transform: translateY(-50%) rotate(45deg);
  transform: translateY(-50%) rotate(45deg);
}
.handbooke-mainpage .bgcolor{
  width: 68px;
  height: 68px;
  background-color: #37acd3;
}
.handbooke-mainpage .mint-button--primary{
  background-color: #37acd3;
}

.handbooke-mainpage-title .mint-cell-wrapper{
  font-size: 18px;
}
</style>
