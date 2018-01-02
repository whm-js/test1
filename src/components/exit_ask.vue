<template>
  <div>
    <mt-header fixed title="考情录入">
      <router-link to="/index/rotate_department" slot="left">
        <mt-button icon="back"></mt-button>
        <!--<mt-button @click="">关闭</mt-button>-->
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
  </div>
<!--  <div class="wrap bg-primary">
    <div class="panel border" >
      <div class="panel-content" style="padding-right:30px;">
        <div class="form-control " readonly style="padding-top:10px;" v-on:click="showPopup">
          <span class>2017-11-01至2017-11-30</span>
          <span class="btn-success btn-sm">1个月</span>
        </div>
      </div>
      <div class="panel-content">
        <span class="font-grey">2017-11-01至2017-11-30</span>
        <span class="btn-warning btn-sm">1个月</span>
      </div>
    </div>
    <div class="panel border" style="margin-top:10px;">
      <ul class="ul">
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">实际轮转起止时间</span>
            <span class="li-content text-right font-grey">2017-11-01至</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">带教老师</span>
            <span class="li-content text-right font-grey">赵四</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">轮转状态</span>
            <span class="li-content text-right font-grey">已出科</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">考核结果</span>
            <span class="li-content text-right text-success">通过</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">理论考试成绩</span>
            <span class="li-content text-right font-grey">100</span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">技能考核成绩</span>
            <span class="li-content text-right font-grey">100</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="panel border bg-primary" style="margin-top:10px;">
      <div style="width:50%;float:left;">
        <div class="btn-blue btn-lg" style="float:left;">申请出科</div>
      </div>
      <div style="width:50%;float:left;">
        <div class="btn-blue btn-lg" style="float:right;">轮转手册</div>
      </div>
    </div>
    <div class="img-stamp"></div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" style="top:170px;width:90%;">
      <ul class="ul">
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">消化内科一病区</span>
            <span class="li-content text-right font-grey">2018-02-01至2018-03-31 </span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">消化内科一病区</span>
            <span class="li-content text-right font-grey">2018-02-01至2018-03-31 </span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">消化内科一病区</span>
            <span class="li-content text-right font-grey">2018-02-01至2018-03-31 </span>
          </div>
        </li>
        <li class="li">
          <div class="li-wrap border-btm">
            <span class="li-title text-left">消化内科一病区</span>
            <span class="li-content text-right font-grey">2018-02-01至2018-03-31 </span>
          </div>
        </li>

      </ul>
    </mt-popup>
  </div>-->


</template>

<script>
    export default {
        name: '',
        components: {},
        data(){
            return{
                popupVisible:false
            }
        },
        created(){

        },
        methods:{

        }
    }
</script>

<style>
  body{
    background:#f4f4f4;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    margin: 0;
    font: inherit;
    color: inherit;
  }
  ul{
    padding:0px;margin:0px;
  }
  li{
      padding:0;
      list-style : none;
  }
  .wrap{

    padding:43px 5px 0 5px;
  }

  .font-grey{color:#ddd;}
  .text-center{text-align:center;}
  .text-right{text-align:right;}
  .text-success {
    color: #5cb85c;
  }


  .bold{font-weight:700 !important;}
  .border{  border:1px solid #eeeeee;}
  .border-btm{border-bottom:1px solid #eeeeee;}
  .btn-success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .btn-warning {
    color: #fff;
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .btn-lg{
    padding: 7px 13px;
    font-size: 16px;
    line-height: 1.3333333;
    border-radius: 4px;
  }
  .btn-sm{
    padding: 5px 10px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .btn-xs{
    padding: 1px 5px;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .btn-blue{
    color: #fff;
    background-color: #37acd3;
    border-color: #37acd3;
  }
  .btn-blue:hover {
    color: #37acd3;
    background-color: #fff;
    border-color: #37acd3;
  }
  .img-stamp{
    display:none;
    position:absolute;
    top:280px;
    right:20px;
    width:200px;
    height:200px;
    background:red;;
  }
  .ul{padding:10px;}
  .li{ float:left;width:100%;}
  .li-wrap{ padding:10px;height:30px;}
  .li-title{float:left;padding:5px 0 0 0;width:50%;}
  .li-content{float:left;padding:5px 0 0 0;width:50%;}

  .panel{float:left;background:#fff;width:100%}
  .panel-title{padding:10px;}
  .panel-sub-title{
    padding:10px;
  }

  .panel-content{padding:10px;}
  .bg-primary{
    background:#f4f4f4;
  }
  .form-control {
    display: block;
    width:100%;
    height: 30px;
    padding: 5px 10px;
    font-size: 16px;
    line-height: 1.5;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  }
  .form-control[readonly]{
    background-color: #eee;
    opacity: 1;
  }

</style>
