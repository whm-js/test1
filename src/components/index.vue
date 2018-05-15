<template>
  <div>
    <mt-header fixed :title="selectedName" style="background-color:#37acd3;font-size:16px;">
      <router-link to="" slot="left">
        <!--i class="icon iconfont icon-my_icon"></i-->
        <img v-show="selected!='userinfo'" style="width:35px;" src="../assets/user.png" />
      </router-link>
    </mt-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  
    <mt-tabbar fixed v-model="selected">
      <mt-tab-item id="rotate_department">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-address_icon"></i>
        </div>
        轮转科室
      </mt-tab-item>
      <mt-tab-item id="rotate_plan">
        <!--<img slot="icon" src="">-->
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-icon-p_dangqianmrpweidu"></i>
        </div>
  
        轮转计划
      </mt-tab-item>
      <mt-tab-item id="userinfo">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-my_icon"></i>
        </div>
        个人中心
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  //  import {testjson} from '../assets/js/testjson.js' //注意路径
  //import { MessageBox } from  'mint-ui';
  export default {
    name: '',
    components: {},
    data() {
      return {
        guid: '',
        selected: '',
        selectedName: '',
        role: ''
      }
    },
    computed: {
      listenshowpage() {
        return this.$store.state.isSelect;
      },
      listenindexSelected() {
        return this.$store.state.indexSelected;
      }
    },
    created() {
      var userinfo = this.getLocalStorageValue('userinfo')
      if(!userinfo){
        this.$router.push('/login')
        return;
      }
      this.guid = userinfo.guid;
      if (!this.guid) {
        this.$router.push('/login')
        return;
      }
      
      this.role = userinfo.role;
      switch (this.role) {
        case '学员':
  
          break;
        case '基地导师':
          this.$router.push('/teacher_index')
          return;
          break;
        case '带教老师':
          this.$router.push('/teacher_index')
          return;
          break;
        case '教学秘书':
          this.$router.push('/secretary_index')
          return;
          break;
        case '科室负责人':
          this.$router.push('/secretary_index')
          return;
          break;
      }
      
      var path = this.$route.path;
      if (path.indexOf('rotate_department') > -1) {
        this.selected = 'rotate_department';
        this.selectedName = '轮转科室'
      } else
      if (path.indexOf('rotate_plan') > -1) {
        this.selected = 'rotate_plan';
        this.selectedName = '轮转计划'
      } else
      if (path.indexOf('userinfo') > -1) {
        this.selected = 'userinfo';
        this.selectedName = '个人中心'
      } else {
        this.selected = 'rotate_department';
        this.selectedName = '轮转科室'
      }
    },
    activated() {
      var userinfo = this.getLocalStorageValue('userinfo')
      if(!userinfo){
        this.$router.push('/login')
        return;
      }
      this.role = userinfo.role;
      switch (this.role) {
        case '学员':
  
          break;
        case '基地导师':
          this.$router.push('/teacher_index')
          return;
          break;
        case '带教老师':
          this.$router.push('/teacher_index')
          return;
          break;
        case '教学秘书':
          this.$router.push('/secretary_index')
          return;
          break;
        case '科室负责人':
          this.$router.push('/secretary_index')
          return;
          break;
      }
      var path = this.$route.path;
      if (path.indexOf('rotate_department') > -1) {
        this.selected = 'rotate_department';
        this.selectedName = '轮转科室'
      } else
      if (path.indexOf('rotate_plan') > -1) {
        this.selected = 'rotate_plan';
        this.selectedName = '轮转计划'
      } else
      if (path.indexOf('userinfo') > -1) {
        this.selected = 'userinfo';
        this.selectedName = '个人中心'
      } else {
        this.selected = 'rotate_department';
        this.selectedName = '轮转科室'
      }
      this.$router.push({
        path: this.selected,
        name: this.selected,
        query: {
          id: 123
        }
      });
    },
    methods: {
      aaa() {
        this.$router.push('/login');
      }
    },
    watch: {
      // 如果 `question` 发生改变，这个函数就会运行
      selected: function(newselected) {
        var path = this.$route.path;
        if (path.indexOf('rotate_department') > -1 && this.selected == 'rotate_department') {
          return;
        }
        switch (newselected) {
          case 'rotate_department':
            this.selectedName = '轮转科室'
            break;
          case 'rotate_plan':
            this.selectedName = '轮转计划'
            break;
          case 'userinfo':
            this.selectedName = '个人中心'
            break;
        }
        this.$router.push({
          path: newselected,
          name: newselected,
          query: {
            id: 123
          }
        });
        this.$store.commit('updataisSelect', -1);
      },
      listenshowpage: function(newData) {
        if (newData !== -1) {
          this.selected = 'rotate_department';
          this.selectedName = '轮转科室'
          this.$router.push({
            path: 'rotate_department',
            name: 'rotate_department',
            query: {
              planDataIndex: newData
            }
          });
        }
      },
      listenindexSelected: function(newData) {
        if (this.$store.state.isSelect !== -1) {
          return
        }
        if (newData !== this.selected) {
          switch (newData) {
            case 'rotate_department':
              this.selectedName = '轮转科室'
              break;
            case 'rotate_plan':
              this.selectedName = '轮转计划'
              break;
            case 'userinfo':
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
