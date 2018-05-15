<template>
  <div>
    <mt-header fixed :title="selectedName" style="background-color:#37acd3;font-size:16px;">
      <router-link to="" slot="left">
        <img v-show="selected!='secretary_userinfo'" style="width:35px;" src="../assets/user.png" />
      </router-link>
    </mt-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <mt-tabbar fixed v-model="selected">
      <mt-tab-item id="secretary_enter">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-icon-shuru"></i>
        </div>
        入科管理
      </mt-tab-item>
      <mt-tab-item id="secretary_exit">
        <div class="mint-tab-item-icon">
          <i class="icon iconfont icon-icon-shuchu"></i>
        </div>

        出科管理
      </mt-tab-item>
      <mt-tab-item id="secretary_userinfo">
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
  name: "",
  components: {},
  data() {
    return {
      guid: "",
      selected: "",
      selectedName: ""
    };
  },
  computed: {
    listenindexSelected() {
      return this.$store.state.secretary_indexSelected;
    }
  },
  created() {
    var userinfo = this.getLocalStorageValue("userinfo");
    if (!userinfo) {
      this.$router.push("/login");
      return;
    }
    this.guid = userinfo.guid;
    if (!this.guid) {
      this.$router.push("/login");
      return;
    }
    var path = this.$route.path;
    if (path.indexOf("secretary_exit") > -1) {
      this.selected = "secretary_exit";
      this.selectedName = "出科管理";
    } else if (path.indexOf("secretary_enter") > -1) {
      this.selected = "secretary_enter";
      this.selectedName = "入科管理";
    } else if (path.indexOf("/userinfo") > -1) {
      this.selected = "secretary_userinfo";
      this.selectedName = "个人中心";
    } else {
      this.selected = "secretary_enter";
      this.selectedName = "入科管理";
    }
    this.$router.push({
      path: "secretary_enter",
      name: "secretary_enter",
      query: { id: 1 }
    });
  },
  beforeRouteUpdate(to, from, next) {
    var fromUrl = from.path;
    // console.log(fromUrl);
    next(vm => {
      vm.selected = "";
    });
  },
  activated() {
    var path = this.$route.path;
    if (path.indexOf("secretary_exit") > -1) {
      this.selected = "secretary_exit";
      this.selectedName = "出科管理";
    } else if (path.indexOf("secretary_enter") > -1) {
      this.selected = "secretary_enter";
      this.selectedName = "入科管理";
    } else if (path.indexOf("/userinfo") > -1) {
      this.selected = "secretary_userinfo";
      this.selectedName = "个人中心";
    } else {
      this.selected = "secretary_enter";
      this.selectedName = "入科管理";
    }
  },
  methods: {
    aaa() {
      this.$router.push("/login");
    }
  },
  watch: {
    selected: function(newselected) {
      var path = this.$route.path;
      if (
        path.indexOf("secretary_enter") > -1 &&
        this.selected == "secretary_enter"
      ) {
        return;
      }
      switch (newselected) {
        case "secretary_exit":
          this.selectedName = "出科管理";
          break;
        case "secretary_enter":
          this.selectedName = "入科管理";
          break;
        case "secretary_userinfo":
          this.selectedName = "个人中心";
          break;
      }
      this.$router.push({
        path: newselected,
        name: newselected,
        query: { id: 321 }
      });
    },
    listenindexSelected: function(newData) {
      if (newData !== this.selected) {
        switch (newData) {
          case "secretary_exit":
            this.selectedName = "出科管理";
            break;
          case "secretary_enter":
            this.selectedName = "入科管理";
            break;
          case "secretary_userinfo":
            this.selectedName = "个人中心";
            break;
        }
        this.selected = newData;
      }
    }
  }
};
</script>

<style>

</style>
