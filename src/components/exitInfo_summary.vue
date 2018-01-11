<template>
  <div>
    <mt-header fixed title="个人小结" style="background-color:#37acd3;font-size:16px;">
      <mt-button icon="back" slot="left" @click.native="backClick"></mt-button>
      <mt-button slot="right"><span style="font-weight:bold;">3</span>/3</mt-button>
    </mt-header>
    <div style="height:50px;"></div>
    <!--面板3-->
    <div id="panel3" class="exit-panel">
      <div>
        <div class="summary-panel">
          <h4 class="summary-title">个人小结：</h4>
          <div class="summary-text" v-if="this.$store.state.UserExitData.PersonalSummary">
            {{this.$store.state.UserExitData.PersonalSummary}}
          </div>
          <div class="summary-text" v-else>-</div>
        </div>

        <br/>
        <div class="summary-panel">
          <h4 class="summary-title">带教老师评语：</h4>
          <div class="summary-text" v-if="this.$store.state.UserExitData.TeacherComment">
            {{this.$store.state.UserExitData.TeacherComment}}
          </div>
          <div class="summary-text" v-else>-</div>
        </div>
      </div>
      <div style="height:100px;"></div>
      <div class="exit-footer">
        <div style="float:left;width:49%;border-right:1px solid #fff;" v-on:click="preStep()">上一项</div>
        <div style="float:left;width:50%;" v-on:click="nextStep()">返回轮转科室</div>
      </div>
    </div>

  </div>
</template>

<script>
    import store from '@/store/store'
    import { mapState,mapMutations,mapGetters } from 'vuex';
    export default {
        name: '',
        components: {},
        activated(){
          window.scrollTo(0, 0);
        },
        methods: {
          nextStep:function(){
            var path = this.$route.query.checkExitType ? '/teacher_index':'/index/rotate_department/';
            this.$router.push({
              path:path,
              name:'',
              query:{
                planDataIndex:this.$route.query.planDataIndex
              }
            });
          },
          //返回上一个页面
          preStep:function(){
            this.$router.push({
              path:'/exitInfo_evalute',
              name:'exitInfo_evalute',
              query:{
                planStartDate:this.$route.query.planStartDate,
                userId:this.$route.query.userId,
                departmentId:this.$route.query.departmentId,
                teacherId:this.$route.query.teacherId,
                teacherName:this.$route.query.teacherName,
                planDataIndex:this.$route.query.planDataIndex, //页面跳转首页索引参数
                checkExitType:this.$route.query.checkExitType //查看出科情况类型：teacher为教师查看，为空则是学生查看
              }
            });
          },
          //页面头部返回事件控制
          backClick:function(){
            var path = this.$route.query.checkExitType ? '/teacher_index':'/index/rotate_department/';
            this.$router.push({
              path:path,
              name:'',
              query:{
                planDataIndex:this.$route.query.planDataIndex
              }
            });
          }
        }
    }
</script>

<style>
  html,body{background:#eee;}
  .exit-panel{position:relative;min-height:550px;width:100%;text-align:center;}
  .exit-footer{position:fixed;bottom:0px;left:0px;width:100%;height:50px;line-height:50px;color:#fff;background:#37acd3;}

  .summary-panel{width:100%;margin: 0px auto;margin-bottom:10px;background:#fff;}
  .summary-title{height:45px;margin-top:5px;line-height:45px;text-align:center;color:#37acd3;border-bottom: 1px solid #ddd;}
  .summary-text{min-height:160px;padding:5px;text-indent: 1.5em;text-align:left;line-height:28px;overflow: hidden;word-break: break-all;}
</style>
