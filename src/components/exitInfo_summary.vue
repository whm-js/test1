<template>
  <div>
    <mt-header fixed title="个人小结" style="background-color:#37acd3">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right"><span style="font-weight:bold;">3</span>/3</mt-button>
    </mt-header>
    <div style="height:50px;"></div>
    <!--面板3-->
    <div id="panel3" class="exit-panel">
      <div>
        <div class="summary-panel">
          <h4 class="summary-title">个人小结：</h4>
          <div class="summary-text">
            {{this.$store.state.UserExitData.PersonalSummary}}
          </div>
        </div>

        <br/>
        <div class="summary-panel">
          <h4 class="summary-title">带教老师评语：</h4>
          <div class="summary-text">
            {{this.$store.state.UserExitData.TeacherComment}}
          </div>
        </div>
      </div>
      <div style="height:100px;"></div>
      <!--router-link to="/exitInfo_evalute" slot="left">
        <div class="exit-footer">
          上一项
        </div>
      </router-link-->
      <router-link to="/" slot="left">
        <div class="exit-footer">
          返回轮转科室
        </div>
      </router-link>
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
            this.$router.push({
              path:'/',
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
