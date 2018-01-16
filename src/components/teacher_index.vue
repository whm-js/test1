<template>
  <div>
    <mt-header fixed :title="selectedName" style="background-color:#37acd3;font-size:16px;">
      <router-link to="" slot="left">
        <img v-show="selected!='teacher_userinfo'" width="35px;" src="../assets/user.png"/>
      </router-link>
    </mt-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <mt-tabbar fixed v-model="selected">
      <mt-tab-item id="teacher_exit">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-icon-shuchu"></i>
        </div>
          出科管理
      </mt-tab-item>
      <mt-tab-item id="teacher_details">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-duorenyonghu2"></i>
        </div>

        带教详情
      </mt-tab-item>
      <mt-tab-item id="teacher_userinfo">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-my_icon"></i>
        </div>
        个人中心
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
              return {
                  guid: this.getGuid(),
                  selected:'',
                  selectedName:''

              }
        },
        computed:{
          listenindexSelected(){
            return this.$store.state.teacher_indexSelected;
          }
        },
        created(){
          if(!this.guid){
            this.$router.push('/login')
            return;
          }
          var path = this.$route.path;
          if(path.indexOf('teacher_exit')>-1){
            this.selected = 'teacher_exit';
            this.selectedName = '出科管理'
          }else
          if(path.indexOf('teacher_details')>-1){
            this.selected = 'teacher_details';
            this.selectedName = '带教详情'
          }else
          if(path.indexOf('/userinfo')>-1){
            this.selected = 'teacher_userinfo';
            this.selectedName = '个人中心'
          }else{
            this.selected = 'exit_teacher';
            this.selectedName = '出科管理'
          }
        },
        activated(){
          var path = this.$route.path;
          if(path.indexOf('teacher_exit')>-1){
            this.selected = 'teacher_exit';
            this.selectedName = '出科管理'
          }else
          if(path.indexOf('teacher_details')>-1){
            this.selected = 'teacher_details';
            this.selectedName = '带教详情'
          }else
          if(path.indexOf('/userinfo')>-1){
            this.selected = 'teacher_userinfo';
            this.selectedName = '个人中心'
          }else{
            this.selected = 'teacher_exit';
            this.selectedName = '出科管理'
          }
        },
        methods: {
        aaa() {
          this.$router.push('/login');
        }
      },
      watch: {
        selected: function (newselected) {
          var path = this.$route.path;
          if(path.indexOf('teacher_exit')>-1&&this.selected=='teacher_exit'){
              return;
          }
            switch (newselected){
              case 'teacher_exit':
                this.selectedName = '出科管理'
                    break;
              case 'teacher_details':
                this.selectedName = '带教详情'
                break;
              case 'teacher_userinfo':
                this.selectedName = '个人中心'
                break;
            }
          this.$router.push({
            path:newselected,
            name:newselected,
            query:{id:321}
          });
        },
        listenindexSelected:function(newData){
          if(newData!==this.selected){
            switch (newData){
              case 'teacher_exit':
                this.selectedName = '出科管理'
                    break;
              case 'teacher_details':
                this.selectedName = '带教详情'
                break;
              case 'teacher_userinfo':
                this.selectedName = '个人中心'
                break;
            }
            this.selected = newData;
          }
        }
      },
    }
</script>

<style>

</style>
