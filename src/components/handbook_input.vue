<template>
<div class="handbook_input">
  <mt-header fixed :title="departmentName" style="background-color:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="goBack"></mt-button>
  </mt-header>

  <div v-for="(el,n) in tabledata">
    <mt-field :label="el.text" placeholder="" v-model="el.textValue" v-if="el.type==='text'"></mt-field>
    <mt-field :label="el.text" placeholder="" v-model="el.textValue" type="textarea" rows="4" v-else-if="el.type==='textarea'"></mt-field>
    <div v-else-if="el.type==='datetime'" @click="open('datePicker',n)">
      <mt-field :label="el.text" placeholder="" readonly="readonly" disableClear type="text" v-model="el.textValue"></mt-field>
    </div>
    <mt-field :label="el.text" placeholder="" v-else-if="el.type==='select'">
      <mt-radio
        title=""
        v-model="el.textValue"
        :options="el.option">
      </mt-radio>
    </mt-field>

  </div>

  <mt-datetime-picker
    ref="datePicker"
    type="date"
    :startDate="startDate"
    :endDate="endDate"
    v-model="dateValue"
    @confirm="handleChange">
  </mt-datetime-picker>

  <!--<div class="mint-tabbar is-fixed">-->
  <mt-button type="primary" size="large" @click.native="updateDetail">保存</mt-button>
  <!--</div>-->
</div>
</template>

<script>
  import {formatDate} from '../assets/js/date.js'
  var that,fromUrl,parentQuery,type;
    export default {
      name: '',
      data(){
        return{
          fromUrl:'',
          dateindex:-1,
          departmentName:'',
          endDate:new Date(),
          dateValue: new Date(),
          startDate: new Date('1900-01-01'),
          handbooktable:'',
          handbookdetail:'',
          detaildata:'',

          SpecificName:'',
          PatternType:'',
          SerialId:'',

          tabledata:'',
          TableFlag:'',
          DemandId:0,
        }
      },
      components: {},
      activated(){
        this.guid = this.getGuid();
        type = this.$route.query.type;
        this.departmentName = this.$route.query.departmentName;
        this.handbooktable = this.$store.state.handbooktable;
        if (!this.handbooktable.TableFlag) {
          this.handbooktable = this.getLocalStorageValue('handbooktable')
        }
        this.handbookdetail = this.$store.state.handbookdetail;
        if (!this.handbookdetail.PatternType) {
          this.handbookdetail = this.getLocalStorageValue('handbookdetail')
        }
        this.TableFlag = this.handbooktable.TableFlag;
        this.DemandId = this.handbooktable.DemandId;
//        var tableform = [{"text":"完成情况","type":"textarea","relation":"ActualQuantityStringCode"}];
//        if(this.TableFlag == 'demand_teaching'){
//          tableform = [{"text":"完成情况","type":"textarea","relation":"CompletedCase"}];
//        }
//        if(this.PatternType==2){
//          this.tabledata = tableform;
//        }else{
//          this.tabledata = JSON.parse(this.handbooktable.Properties).form;
//        }
        if(this.TableFlag == 'demand_rescue_record'){
          this.tabledata = [{"text": "住院病历号", "type": "text", "relation": "MedicalRecord"}, {
            "text": "病人姓名",
            "type": "text",
            "relation": "Patient"
          },
            {"text": "临床诊断", "type": "textarea", "relation": "ClinicalDiagnosis"}, {
              "text": "转归情况",
              "type": "textarea",
              "relation": "ComebackStatus"
            },
            {"text": "操作日期", "type": "datetime", "relation": "CreateDate"}];
        }else{
          this.PatternType = this.handbookdetail.PatternType;
          this.SpecificName = this.handbookdetail.SpecificName;
          this.SerialId = this.handbookdetail.SerialId;
          this.tabledata = JSON.parse(this.handbooktable.Properties).form;
        }
        for (var i = 0; i < this.tabledata.length; i++) {
          if (this.tabledata[i].type === 'select') {
            var aa = this.tabledata[i].option;
            var bb = new Array();
            for (var j = 0; j < aa.length; j++) {
              bb[j] = new Object;
              bb[j].label = aa[j];
              bb[j].value = String(j);
            }
            this.$set(this.tabledata[i], 'option', bb);
          }
          if((fromUrl == '/handbook_detail'&&type!='add')||type=='update'){
            this.detaildata = this.$store.state.detaildata;
            if (!this.detaildata.SpecificName) {
              this.detaildata = this.getLocalStorageValue('detaildata')
            }
            if(this.tabledata[i].relation=="CreateDate"){
              this.$set(this.tabledata[i], 'textValue', this.$formatDate(new Date(this.detaildata[this.tabledata[i].relation].replace(/-/g, '/')),'yyyy-MM-dd'));
            }else{
              this.$set(this.tabledata[i], 'textValue', this.detaildata[this.tabledata[i].relation]);
            }
          }else {
            if(this.tabledata[i].relation=="CreateDate"){
              this.$set(this.tabledata[i], 'textValue', this.$formatDate(new Date(),'yyyy-MM-dd'));
            }else{
              this.$set(this.tabledata[i], 'textValue', '')
            }

          }
        }
      },
      beforeRouteEnter(to,from,next){
        fromUrl = from.path;
        parentQuery = from.query;
        if(parentQuery.isreload == 'true'){
            parentQuery.isreload = 'false'
        }
        next(vm=>{
            vm.fromUrl = from.path;
        });
      },
      methods: {
        FDate(date){
            var d = new Date(date);
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();

            return year + '.' + month + '.' + day;
        },
        open: function (picker,n) {
            this.dateIndex = n;
          this.dateValue = new Date();
          this.$refs[picker].open();
        },
        handleChange: function (value) {
          this.dateValue = formatDate(value,'yyyy-MM-dd');//window.moment(value).format('YYYY-MM-DD');
          this.tabledata[this.dateIndex].textValue=this.dateValue;
        },
        goBack(){
//          this.$router.back(-1);
          if(fromUrl == '/handbook_detail'){
            this.$router.back(-1);
          }else {
            this.$router.push({
              path: 'handbook_mainpage',
              name: 'handbook_mainpage',
              query: parentQuery
            });
          }
        },
        updateDetail(){
            if((fromUrl == '/handbook_detail'&&type!='add')||type=='update'){
              var param = {
                guid: this.guid,
                SerialId: this.detaildata.SerialId,
                TableName: this.TableFlag
              }
              for (var i = 0; i < this.tabledata.length; i++) {
                eval("param." + this.tabledata[i].relation + '="'+this.encodeHtml(this.tabledata[i].textValue) + '"');
                param[this.tabledata[i].relation] = this.decodeHtml(param[this.tabledata[i].relation]);
              }
              if(param.hasOwnProperty("MedicalRecord")){
                  if(param["MedicalRecord"]==''){
                      this.$Toast("住院病历号不能为空！");
                      return;
                  }
              }
              if(param.hasOwnProperty("Content")){
                if(param["Content"]==''){
                  this.$Toast("内容不能为空！");
                  return;
                }
              }
              if(param.hasOwnProperty("CreateDate")){
                if(param["CreateDate"]==''){
                  this.$Toast("操作时间不能为空！");
                  return;
                }
              }
              var url = '';
              switch (this.TableFlag) {
                case 'demand_clinical':
                  url = 'rotate/update_demand_clinical';
                  break;
                case 'demand_disease':
                  url = 'rotate/update_demand_disease';
                  break;
                case 'demand_learning':
                  url = 'rotate/update_demand_learning';
                  break;
                case 'demand_rescue_record':
                  url = 'rotate/update_demand_rescue_record';
                  break;
                case 'demand_skill':
                  url = 'rotate/update_demand_skill';
                  break;
                case 'demand_teaching':
                  //教学没有详细的修改
                  break;
                default :
                  //没有对应的表就算是故障的
                  break;
              }
              this.$httpPost(url, param, function (err, json) {
                var aaa = json;
                if (aaa.status == 200) {
                  that.$Toast("修改成功！");
                  parentQuery.isreload = 'true';
                  if (fromUrl == '/handbook_detail') {
                    that.$router.back(-1);
                  } else {
                    that.$router.push({
                      path: 'handbook_mainpage',
                      name: 'handbook_mainpage',
                      query: parentQuery
                    });
                  }
                } else {
                  that.$Toast("修改失败！");
                }
              });
            }else {
              var param = {
                guid: this.guid,
                DemandId: this.DemandId,
                SerialId: this.SerialId,
                TableName: this.TableFlag
              }
              for (var i = 0; i < this.tabledata.length; i++) {
                eval("param." + this.tabledata[i].relation + '="'+this.encodeHtml(this.tabledata[i].textValue) + '"');
                param[this.tabledata[i].relation] = this.decodeHtml(param[this.tabledata[i].relation]);
              }
              if(param.hasOwnProperty("MedicalRecord")){
                if(param["MedicalRecord"]==''){
                  this.$Toast("住院病历号不能为空！");
                  return;
                }
              }
              if(param.hasOwnProperty("Content")){
                if(param["Content"]==''){
                  this.$Toast("内容不能为空！");
                  return;
                }
              }
              if(param.hasOwnProperty("CreateDate")){
                if(param["CreateDate"]==''){
                  this.$Toast("操作时间不能为空！");
                  return;
                }
              }
              var url = '';
              switch (this.TableFlag) {
                case 'demand_clinical':
                  url = 'rotate/submit_demand_clinical';
                  break;
                case 'demand_disease':
                  url = 'rotate/submit_demand_disease';
                  break;
                case 'demand_learning':
                  url = 'rotate/submit_demand_learning';
                  break;
                case 'demand_rescue_record':
                  url = 'rotate/submit_demand_rescue_record';
                  break;
                case 'demand_skill':
                  url = 'rotate/submit_demand_skill';
                  if (!param.OperateRole) {//如果没有角色录入，默认是手术者
                    param.OperateRole = 0;
                  }
                  break;
                case 'demand_teaching':
                  url = 'rotate/submit_demand_teaching';
                  break;
                default :
                  //没有对应的表就算是故障的
                  break;
              }
              this.$httpPost(url, param, function (err, json) {
                var aaa = json;
                if (aaa.status == 200) {
                  that.$Toast("添加成功！");
                  that.$store.commit('updatareloadMainpage', 'true');
                  parentQuery.isreload = 'true';
                  if (fromUrl == '/handbook_detail') {
                    that.$router.back(-1);
                  } else {
                    that.$router.push({
                      path: 'handbook_mainpage',
                      name: 'handbook_mainpage',
                      query: parentQuery
                    });
                  }
                } else {
                  that.$Toast("添加失败！");
                }
              });
            }
        }
      },
      created(){
        that = this;
      }
    }
</script>

<style>
.handbook_input{
  margin-top: 40px;
  margin-bottom: 50px;
}
.handbook_input .mint-field.is-textarea .mint-cell-value {
  padding-left: 10px;
}
.handbook_input .mint-cell-value {
  padding-left: 10px;
}
.handbook_input .mint-cell-value input {
  text-align: right;
  background-color: white;
}
.handbook_input .mint-cell-value textarea {
  text-align: right;
}
.handbook_input .mint-button--primary {
  background-color: #5cb85c;

  width: 80%;
  margin-left: 10%;
  margin-top: 20px;
}
.handbook_input .mint-field .mint-cell-title{
  width: auto;
}
</style>
