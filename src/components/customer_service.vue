<template>
    <div class="customer">
        <mt-header fixed title="客服中心" style="background-color:#37acd3;font-size:16px;">
            <mt-button slot="left" icon="back" @click="back"></mt-button>
        </mt-header>
        <div style="height:45px;background-color:#eee">&nbsp;</div>
        <div class="customer_detail">
            <div style="text-align: center;padding-top:45px;">
                <img src="../assets/customer_service.png" style="margin: 0 auto;" />
            </div>
            <div>

                <mt-cell title="免费咨询热线" value="400-727-8900"></mt-cell>

                <mt-cell title="客服QQ" value="400-727-8900"></mt-cell>
            </div>
            <div style="text-align: center;padding-top:50px;font-size: 16px">
                <span>
                    客服电话的服务时间为每天的
                    <span style="color:#37acd3;">8:00-21:00</span>
                </span>
            </div>
        </div>

    </div>
</template>

<script>
import store from "@/store/store";
export default {
  name: "",
  store,
  components: {},
  created() {},
  activated() {
    //避免因为滑动，页面不显示在最顶部
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  methods: {
    back() {
      var path = "/index/userinfo/";
      var role = this.getLocalStorageValue("userinfo").role;
      switch (role) {
        case "学员":
          path = "/index/userinfo/";
          break;
        case "带教老师":
          path = "/teacher_index/userinfo/";
          break;
        case "基地导师":
          path = "/teacher_index/userinfo/";
          break;
        case "教学秘书":
          path = "/secretary_index/userinfo/";
          break;
        case "科室负责人":
          path = "/secretary_index/userinfo/";
          break;
      }
      this.$router.push({
        path: path,
        name: ""
      });
    }
  }
};
</script>

<style>
html,
body {
  background-color: #eee;
}
.customer {
  width: 98%;
  margin: 0 auto;
  border-radius: 6px;
}
.customer .customer_detail {
  border-radius: 6px;
  height: 680px;
  background-color: white;
}
</style>
