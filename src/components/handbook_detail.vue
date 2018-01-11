<template>
<div class="handbooke-detail">
  <mt-header :title="departmentName" fixed style="background-color:#37acd3;font-size:16px;">
     <mt-button icon="back" slot="left" @click.native="goBack"></mt-button>
  </mt-header>

  <!--<div style="text-align: left;font-size: 18px; margin:20px 10px;">-->
    <!--<span style="font-weight: bold;;">病种及例数要求:</span>-->
    <!--{{SpecificName}}-->
  <!--</div>-->

  <mt-cell :title="'病种及例数要求:'+SpecificName" style="background-color: #eee; color:#37acd3;min-height: 45px;margin: 0;border:0;border-radius: 0;" class="handbooke-detail-title">
    <!--<i slot="icon" style="font-size: 16px" class="icon iconfont icon-list_icon"></i>-->
  </mt-cell>

  <div v-for="(n,i) in detailData" @click="updateDetail(n)">
  <mt-cell-swipe :title="TableFlag=='demand_learning'?'内容：'+n.Content:'住院病历号:'+n.MedicalRecord"
     :label="TableFlag=='demand_learning'?'主讲人：'+(n.Patient?n.Patient:'无')+'；日期：'+FDate(n.CreateDate):'病人姓名：'+(n.Patient?n.Patient:'无')+'；操作日期：'+FDate(n.CreateDate)"
     :right="[{
             content: '取消',
             style: { background: 'gray', color: '#fff' }
            },{
            content: '删除',
            style: { background: 'red', color: '#fff' },
            handler(){leftButtonHandler(n,i)}
          }]">
   </mt-cell-swipe>
  </div>

  <div class="mint-tabbar is-fixed">
    <mt-button type="primary" size="large" style="background-color:#37acd3" @click.native="adddetaildata">新增记录</mt-button>
  </div>
</div>
</template>

<script>
  var that,fromUrl,parentQuery;
    export default {
        name: '',
        data(){
          return{
            guid: this.getGuid(),
            UserID:'',
            SerialId:'',
            DemandId:'',
            TableFlag:'',
            SpecificName:'',
            departmentName:'',
            detailindex:-1,
            detailData:[]
          }
        },
        components: {},
        created(){that = this;},
      beforeRouteEnter(to,from,next){
        fromUrl = from.path;
        parentQuery = from.query;
        if(fromUrl == '/handbook_input'){
          parentQuery.isreload = 'true'
        }else{
          parentQuery.isreload = 'false'
        }
        next(vm=>{
          vm.fromUrl = from.path;
        });
      },
      activated(){

        this.guid=this.getGuid();
        this.UserID = this.$route.query.UserID;
        this.SerialId = this.$route.query.SerialId;
        this.DemandId = this.$route.query.DemandId;
        this.SpecificName = this.$route.query.SpecificName;
        this.departmentName = this.$route.query.departmentName;
        this.TableFlag = this.$route.query.TableFlag;
        var url = '';
        switch (this.TableFlag) {
          case 'demand_clinical':
            url = 'rotate/detial_demand_clinical';
            break;
          case 'demand_disease':
            url = 'rotate/detial_demand_disease';
            break;
          case 'demand_learning':
            url = 'rotate/detial_demand_learning';
            break;
          case 'demand_rescue_record':
            url = 'rotate/detial_demand_rescue_record';
            break;
          case 'demand_skill':
            url = 'rotate/detial_demand_skill';
            break;
          case 'demand_teaching':
            //教学没有详细
            // url = '/rotate/detial_demand_teaching';
            break;
          default :
            //没有对应的表就算是故障的
            break;
        }
        var params = {
          SerialId: this.SerialId,
          guid: this.guid,
          UserId:this.UserID,
          DemandId: this.DemandId
        };
        this.$httpPost(url, params, function (err, json) {
          that.detailData = json.data.data;
        });
      },
        methods: {
          FDate(date){
              return this.$formatDate(new Date(date.replace(/-/g, '/')),'yyyy-MM-dd');
          },
          goBack(){
            this.$router.push({
              path:'handbook_mainpage',
              name:'handbook_mainpage',
              query:parentQuery
            });
          },
          leftButtonHandler(evt,i) {
              this.detailindex = i;
            this.$messagebox.confirm('您确定要删除此记录吗?').then(action => {
              var params = {
                SerialId: this.detailData[i].SerialId,
                guid: this.guid,
                TableName:this.TableFlag
              };
              this.$httpPost('rotate/delete_record', params, function (err, json) {
//                that.detailData = json.data.data;
                if(json.status == 200){
                    that.detailData.splice(that.detailindex,1);
                    parentQuery.isreload = 'true';
                    that.$Toast("删除成功！");
                }else{
                  that.$Toast("删除失败！");
                }
              });
            }).catch(err => {
              if (err == 'cancel') {
//                console.log('123');
              }
            });
          },
          updateDetail(el){
            this.$store.commit('updatadetaildata',el);
            this.setLocalStorageValue('detaildata',el);
            parentQuery.isreload = 'true';
            this.$router.push({
              path:'handbook_input',
              name:'handbook_input',
              query:{departmentName:this.departmentName}
            });
          },
          adddetaildata(){
            parentQuery.isreload = 'true';
            this.$router.push({
              path:'handbook_input',
              name:'handbook_input',
              query:{type:'add',departmentName:this.departmentName}
            });
          }
        }
    }
</script>

<style>
  .handbooke-detail{
    margin-top: 40px;
    margin-bottom: 55px;
  }
.handbooke-detail .mint-cell-wrapper{
  text-align:left;
  line-height: 23px;
  font-size: 16px;
}
.handbooke-detail .mint-cell{
  border:1px solid #999;
  border-radius: 5px;
  margin: 10px 10px;
}
  .handbooke-detail .mint-cell-title {
    width: calc(100% - 60px);
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
 .handbooke-detail .mint-cell-text {
   vertical-align: middle;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
   display: block;
   margin-top: 5px;
 }
.handbooke-detail .mint-cell-swipe-button{
  line-height: 56px;
}
  .handbooke-detail-title .mint-cell-wrapper{
    font-size: 18px;
  }
#app{
  margin-top: 0px;
}
body {
    margin: 0px;
}
</style>
