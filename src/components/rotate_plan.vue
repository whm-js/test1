<template>
<div class="rotate_plan">
  <!--<mt-spinner :type="2"></mt-spinner>-->
  <!--<span>{{aaa}}</span>-->
  <mt-cell title="暂无您的轮转计划，请联系科教科。" v-show="planData.length==0">
  </mt-cell>
  <div v-for="(el,n) in planData" @click="DepartmentNameClick(n)">
  <mt-cell :title="showDepartmentName(el)" :label="FDate(el)" is-link>
    <span class="mint-cell-label" style="font-size: 16px;" v-bind:class="{ color0: el.RotateStatusName=='未申请出科',color1: el.RotateStatusName=='已出科',color2: el.RotateStatusName=='未出科'}">{{el.RotateStatusName}}</span>
  </mt-cell>
  </div>
</div>
</template>

<script>
  import store from '@/store/store'
  import { mapState,mapMutations,mapGetters } from 'vuex';
  var that;
    export default {
      name: '',
      data() {
        return {
          guid: this.getGuid(),
          planData: []
        }
      },
      store,
      components: {},
      methods: {
        FDate: function (el) {
            var date1 = el.PlanStartDate.replace(/-/g, '/');
            var date2 = el.PlanEndDate.replace(/-/g, '/');
            var name = el.RotateStatusName;
//          var d = new Date(date1);
//          var year = d.getFullYear();
//          var month = d.getMonth() + 1;
//          var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();

//          var d1 = new Date(date2);
//          var year1 = d1.getFullYear();
//          var month1 = d1.getMonth() + 1;
//          var day1 = d1.getDate() < 10 ? '0' + d1.getDate() : '' + d1.getDate();
          var state = name=='已出科'?'实际：':'计划：';
          var start=this.$formatDate(new Date(date1),'yyyy-MM-dd')
          var end=this.$formatDate(new Date(date2),'yyyy-MM-dd')
          return state + start+'至'+end + ' (' + el.PlanDuration + '个月)';
//          return date1;
        },
        showDepartmentName(el){
            if(el.ResearchArea!=''){
                return el.DepartmentName + '（' + el.ResearchArea + '）'
            }else{
                return el.DepartmentName
            }
        },
        DepartmentNameClick:function (index) {
//          this.$router.push({
//            path:'/',
//            name:'index',
//            query:{planDataIndex:index}
//          });
          this.$store.commit('updataisSelect',index);
        }
      },
      filters: {
          showrotateplanstate:function (id) {
            switch (id){
              case 0:
                return '未审批';
                break;
              case 1:
                return '未入科';
                break;
              case 2:
                return '未入科';
                break;
              case 3:
                return '未入科';
                break;
              case 100:
                return '未申请出科';
                break;
              case 101:
                return '老师未填写评语';
                break;
              case 102:
                return '科主任未审核';
                break;
              case 114:
                return '考核未通过';
                break;
              case 200:
                return '已出科';
                break;
              default:
                return '未知';
                break;
            }
          }
      },
      activated(){
          this.guid = this.getGuid();
        document.body.scrollTop=0;
        document.documentElement.scrollTop=0;
        that.planData=this.$store.state.planData;
        if(that.planData.length==0) {
          var params = {
            page: 1,
            guid: this.guid,
            pageNum: 1000
          };
          this.$httpPost('rotate/getQueryinfo', params, function (err, json) {
            that.planData = json.data.data;
          });
        }
      },
      created(){
        that = this;

//        that.planData=this.$store.state.planData;
//        if(that.planData) {
//          var params = {
//            page: 1,
//            guid: this.guid,
//            pageNum: 1000
//          };
//          this.$httpPost('rotate/getQueryinfo', params, function (err, json) {
//            that.planData = json.data.data;
//          });
//        }
      }
    }
</script>

<style>
.color0{
  color:#FF0000;
}
.color1{
  color:#00B050;
}
.color2{
  color:#888;
}

.rotate_plan{
  margin-top: 40px;
  margin-bottom: 55px;
}

.rotate_plan .mint-cell-wrapper{
  font-size: 16px;
  line-height: 1.5;
}
.rotate_plan .mint-cell{
  min-height: 68px;
}
</style>
