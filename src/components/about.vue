<template>
<div class="aboutus">
  <mt-header fixed title="关于我们" style="background-color:#37acd3;font-size:16px;">
      <router-link to="/index/userinfo" slot="left">
          <mt-button icon="back"></mt-button>
      </router-link>
  </mt-header>
  <div style="height:45px;background-color:#eee">&nbsp;</div>
  <div class="aboutus_detail">
    <mt-cell title="当前版本" value="v1.0"></mt-cell>
    <mt-cell title="服务QQ" value="400-727-8900"></mt-cell>
    <mt-cell title="免费咨询热线" value="400-727-8900"></mt-cell>
    <mt-cell title="微信公众号" value="英腾医学教育"></mt-cell>
    <mt-cell title="公司介绍" value="400-727-8900"></mt-cell>

    <div style="bottom:40px;position:fixed;font-size:14px;color:#C4C4C4;text-align: center;width:99%;">
      <p>
        广西英腾教育科技股份有限公司
      </p>
      <p>
        Copyright © 2015-2017 Yingsoft.All Rights Reserved
      </p>
    </div>
  </div>
</div>
</template>

<script>
  import store from '@/store/store'
    export default {
        name: '',
        store,
        components: {},
        created(){
        },
        activated(){
          //避免因为滑动，页面不显示在最顶部
            document.body.scrollTop=0;
            document.documentElement.scrollTop=0;
        }
    }
</script>

<style>
html,body{background-color: #eee;}
.aboutus{
  width:98%;margin:0 auto;border-radius:6px
}
.aboutus .aboutus_detail{
border-radius:6px;height:680px;background-color:white;
}
.aboutus .aboutus_detail a{
  border-radius:6px;
}
</style>
