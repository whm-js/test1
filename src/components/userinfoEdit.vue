<template>
    <div style="width:98%;margin:0 auto;border-radius:6px">
        <mt-header fixed title="个人资料" style="background-color:#37acd3;font-size:16px;">
            <mt-button icon="back" slot="left" @click="back"></mt-button>
            <mt-button icon="" slot="right" @click="editValidator">保存</mt-button>
        </mt-header>

        <div style="height:45px;background-color:#eee">&nbsp;</div>
        <div style="text-align: center;background-color:white;;border-radius:6px 6px 0 0">
            <img src="../assets/userHeader.png" style="margin: 0 auto;" />
        </div>
        <div id="editInfo">
            <mt-field label="姓名" type="text" placeholder="请输入姓名" v-model="userinfoData.RealName"></mt-field>
            <mt-field label="性别" readonly="readonly" placeholder="">
                <label style="margin-left:10px;">
                    <input type="radio" :checked="isFullAttend===1" name="attend-radio" value="1" v-on:change="attendChange($event)" /> 男
                </label>
                <label style="margin-left:20px;">
                    <input type="radio" :checked="isFullAttend===0" name="attend-radio" value="0" v-on:change="attendChange($event)" /> 女
                </label>
            </mt-field>
            <mt-field label="手机号码" type="tel" :attr="{ maxlength: 11 }" placeholder="请输入手机号码" v-model="userinfoData.Telephone"></mt-field>
            <mt-field label="身份证号" type="text" :attr="{ maxlength: 18 }" placeholder="请输入身份证号" v-model="userinfoData.IdentityNo"></mt-field>
            <div @click="open('datePicker','birthday')" v-show="role!='科室负责人'">
                <mt-field label="出生日期" readonly="readonly" disableClear placeholder="请输入出生日期" v-model="userinfoData.Birthday"></mt-field>
            </div>
            <div v-if="role=='学员'">
                <mt-field class="stringB" label="最高学历毕业学校" type="text" placeholder="请输入最高学历毕业学校" v-model="userinfoData.GraduatedSchool"></mt-field>
                <div @click="showNation(3)">
                    <mt-field label="学历类型" readonly="readonly" disableClear placeholder="请输入学历" v-model="userinfoData.EducationType"></mt-field>
                </div>
                <mt-field label="执业证编号" type="number" :attr="{ maxlength: 27 }" placeholder="请输入执业证编号" v-model="userinfoData.PracticeCode"></mt-field>
                <mt-field class="stringB" label="工作单位" type="text" placeholder="请输入工作单位" v-model="userinfoData.WorkPlace"></mt-field>
                <mt-field label="毕业专业" type="text" placeholder="请输入毕业专业" v-model="userinfoData.Profession"></mt-field>
                <div @click="showNation(4)">
                    <mt-field label="毕业年份" type="number" disableClear readonly="readonly" placeholder="请输入毕业年份" v-model="userinfoData.GraduatedYear"></mt-field>
                </div>
                <div @click="showNation(1)">
                    <mt-field label="民族" readonly="readonly" disableClear placeholder="请输入民族" v-model="userinfoData.Nation"></mt-field>
                </div>
                <div @click="showNation(2)">
                    <mt-field label="政治面貌" readonly="readonly" disableClear placeholder="请输入政治面貌" v-model="userinfoData.PoliticalStatus"></mt-field>
                </div>
                <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="userinfoData.Email"></mt-field>
            </div>
            <div v-else-if="role=='科室负责人'">
              <div @click="showNation(5)">
                  <mt-field label="职务" disableClear readonly="readonly" placeholder="请输入职务" v-model="userinfoData.PositionName"></mt-field>
              </div>
              <div @click="showNation(6)">
                  <mt-field label="专业技术职称" disableClear readonly="readonly" placeholder="请输入专业技术职称" v-model="userinfoData.TitleName"></mt-field>
              </div>
              <mt-field class="stringB" label="最高学历毕业学校" type="text" placeholder="请输入最高学历毕业学校" v-model="userinfoData.GraduatedSchool"></mt-field>
              <div @click="showNation(1)">
                  <mt-field label="民族" readonly="readonly" disableClear placeholder="请输入民族" v-model="userinfoData.Nation"></mt-field>
              </div>
              <div @click="showNation(2)">
                    <mt-field label="政治面貌" readonly="readonly" disableClear placeholder="请输入政治面貌" v-model="userinfoData.PoliticalStatus"></mt-field>
                </div>
                <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="userinfoData.Email"></mt-field>
                <div @click="open('datePicker','jobdate')">
                    <mt-field label="参加工作时间" readonly="readonly" disableClear placeholder="请输入参加工作时间" v-model="userinfoData.JobDate"></mt-field>
                </div>
                <mt-field label="医师资格证号" type="number" :attr="{ maxlength: 27 }" placeholder="请输入医师资格证号" v-model="userinfoData.PhysicianQualificationCertificateNo"></mt-field>
            </div>
            <div v-else>
                <div @click="open('datePicker','titledate')">
                    <mt-field label="取得职称时间" readonly="readonly" disableClear placeholder="请输入取得职称时间" v-model="userinfoData.TitleDate"></mt-field>
                </div>
                <div @click="open('datePicker','jobdate')">
                    <mt-field label="参加工作时间" readonly="readonly" disableClear placeholder="请输入参加工作时间" v-model="userinfoData.JobDate"></mt-field>
                </div>
                <mt-field label="最高学历" type="text" :attr="{ maxlength: 27 }" placeholder="请输入最高学历" v-model="userinfoData.HighestEducation"></mt-field>
                <mt-field label="学位" type="text" placeholder="请输入学位" v-model="userinfoData.Degree"></mt-field>
                <mt-field class="stringB" label="最高学历毕业学校" type="text" placeholder="请输入最高学历毕业学校" v-model="userinfoData.GraduatedSchool"></mt-field>
                <div @click="showNation(4)">
                    <mt-field label="毕业年份" type="number" disableClear readonly="readonly" placeholder="请输入毕业年份" v-model="userinfoData.GraduatedYear"></mt-field>
                </div>
                <div @click="open('datePicker','occupied')">
                    <mt-field label="从事本专业时间" readonly="readonly" disableClear placeholder="请输入从事本专业时间" v-model="userinfoData.Occupied"></mt-field>
                </div>
            </div>
            <mt-popup v-model="popupVisible" position="bottom" style="width:100%;">
                <div class="picker-toolbar">
                    <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>
                    <span class="mint-datetime-action mint-datetime-confirm" @click="oktype">确定</span>
                </div>
                <mt-picker :slots="nationJson" @change="onValuesChange"></mt-picker>
            </mt-popup>

            <mt-datetime-picker ref="datePicker" type="date" :startDate="startDate" :endDate="endDate" v-model="dateValue" @confirm="handleChange">
            </mt-datetime-picker>
        </div>
    </div>
</template>
<script>
export default {
  name: "",
  components: {},
  created() {},
  activated() {
    //避免因为滑动，页面不显示在最顶部
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.guid = this.getLocalStorageValue('userinfo').guid;
    this.role = this.getLocalStorageValue("userinfo").role; //获取用户角色
    //刷新／激活数据写在此处,每次打开页面请求最新的数据
    this.getUserInfo();
    if(this.role=='科室负责人'){
      this.getPositionList();
      this.getTitleList();
    }

  },
  data() {
    return {
      guid: this.getLocalStorageValue('userinfo').guid,
      role: "",
      userinfoData: {},
      userinfoData_once: {},
      popupVisible: false,
      Picker:'',
      poputype: 1, //默认1为民族，2为政治面貌，3为学历类型，4为年份，5为职务，6为专业技术职称
      maxlength: 20,
      nationJson: [
        {
          flex: 1,
          values: [
            "汉族",
            "蒙古族",
            "回族",
            "藏族",
            "维吾尔族",
            "苗族",
            "彝族",
            "壮族",
            "布依族",
            "朝鲜族",
            "满族",
            "侗族",
            "瑶族",
            "白族",
            "土家族",
            "哈尼族",
            "哈萨克族",
            "傣族",
            "黎族",
            "傈僳族",
            "佤族",
            "畲族",
            "高山族",
            "拉祜族",
            "水族",
            "东乡族",
            "纳西族",
            "景颇族",
            "柯尔克孜族",
            "土族",
            "达斡尔族",
            "仫佬族",
            "羌族",
            "布朗族",
            "撒拉族",
            "毛南族",
            "仡佬族",
            "锡伯族",
            "阿昌族",
            "普米族",
            "塔吉克族",
            "怒族",
            "乌孜别克族",
            "俄罗斯族",
            "鄂温克族",
            "德昂族",
            "保安族",
            "裕固族",
            "京族",
            "塔塔尔族",
            "独龙族",
            "鄂伦春族",
            "赫哲族",
            "门巴族",
            "珞巴族",
            "基诺族"
          ],
          textAlign: "center"
        }
      ],
      endDate: new Date(),
      dateValue: new Date(),
      startDate: new Date("1930-01-01"),
      isFullAttend: 1,//性别点击
      pickerchangeValue: 1,
      positionlist:[],//职务
      titleList:[],//专业技术职称
      selectNation:'',//下拉选中的民族
      selectPoliticalStatus:'',//下拉选中的政治面貌
      selectEducationType:'',//下拉选中的学历类型
      selectGraduatedYear:'',//下拉选中的毕业年份
      selectPositionName:'',//下拉选中的职务
      selectTitleName:'',//下拉选中的专业技术职称
    };
  },
  methods: {
    attendChange(event) {
      //性别点击事件
      var value = event.currentTarget.value;
      value = Number(value);
      this.isFullAttend = value;
    },
    back() {
      var path = "/index/userinfo/";
      switch (this.role) {
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
    },
    getUserInfo() {
      var that = this;
      if (!this.guid) {
        this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(
          action => {
            this.$router.push("/login");
          }
        );
        return;
      }
      var parems = {
        userid: 0,
        guid: this.guid,
        userrole: ""
      };

      this.$httpGet("info/getUserinfobyrole", parems, function(err, json) {
        if (json.status == 200) {
          for (var i in json.data[0]) {
            json.data[0][i] = that.dataProcess(json.data[0][i]);
          }
          that.userinfoData = json.data[0];
          that.userinfoData_once = json.data[0];

          that.isFullAttend = json.data[0].Sex;
        } else {
          that.$messagebox({
            title: "提示",
            message: json.msg,
            showCancelButton: true
          });
        }
      });
    },
    editValidator() {
      var that = this;
      if (!this.guid) {
        this.$messagebox("温馨提示", "登录状态无效，请重新登录！").then(
          action => {
            this.$router.push("/login");
          }
        );
        return;
      }

      if (that.userinfoData.RealName.trim() == "") {
        this.$Toast("请输入姓名");
        return;
      }
      if (!this.isrealName(that.userinfoData.RealName.trim())) {
        this.$Toast("请输入2-20位中英文、数字姓名！");
        return;
      }
      if (that.userinfoData.Telephone.trim() == "") {
        this.$Toast("请输入手机号");
        return;
      }
      if (
        that.userinfoData.Telephone.trim().length !== 11 ||
        !this.isTelphone(that.userinfoData.Telephone.trim())
      ) {
        this.$Toast("请输入正确的手机号码！");
        return;
      }
      if (that.userinfoData.IdentityNo.trim().length >= 1) {
        if (!this.isidentityNo(that.userinfoData.IdentityNo.trim())) {
          this.$Toast("请输入正确的身份证号！");
          return;
        }
      }
      if (that.userinfoData.PracticeCode.trim().length >= 1) {
        if (
          !this.ispracticeCode(that.userinfoData.PracticeCode.trim()) ||
          that.userinfoData.PracticeCode.trim().length > 27
        ) {
          this.$Toast("请输入正确的执业证编码！");
          return;
        }
      }
      if (that.userinfoData.GraduatedYear.length >= 1) {
        if (
          !this.ispracticeCode(that.userinfoData.GraduatedYear.trim()) ||
          that.userinfoData.GraduatedYear.trim().length !== 4
        ) {
          this.$Toast("请输入正确的毕业年份！");
          return;
        }
      }
      if (that.userinfoData.Email.trim().length > 0) {
        if (!this.isEmail(that.userinfoData.Email)) {
          this.$Toast("请输入正确的邮箱地址！");
          return;
        }
      }
      this.edit();
    },
    edit() {
      var that = this;
      var parems = {};
      if (this.role == "学员") {
        parems = {
          realname: this.userinfoData.RealName, //姓名
          sex: this.isFullAttend, //性别
          telphone: this.userinfoData.Telephone, //手机
          identityNo: this.userinfoData.IdentityNo, //身份证号
          graduatedschool: this.userinfoData.GraduatedSchool, //最高学历毕业学校
          educationtype: this.userinfoData.EducationType, //学历类型
          practicecode: this.userinfoData.PracticeCode, //执业证编号
          Email: this.userinfoData.Email, //邮箱
          politicalstatus: this.userinfoData.PoliticalStatus, //政治面貌
          workplace: this.userinfoData.WorkPlace, //工作单位
          profession: this.userinfoData.Profession, //毕业专业
          graduatedyear: this.userinfoData.GraduatedYear, //毕业年份
          birthday: this.userinfoData.Birthday, //出生日期
          nation: this.userinfoData.Nation, //民族
          guid: this.guid
        };
      } else if (this.role == "带教老师" || this.role == '教学秘书' || this.role == '基地导师') {
        parems = {
          realname: this.userinfoData.RealName, //姓名
          sex: this.isFullAttend, //性别
          telphone: this.userinfoData.Telephone, //手机
          identityNo: this.userinfoData.IdentityNo, //身份证号
          birthday: this.userinfoData.Birthday, //出生日期
          titledate: this.userinfoData.TitleDate, //取得职称时间
          jobdate: this.userinfoData.JobDate, //参加工作时间
          highesteducation: this.userinfoData.HighestEducation, //最高学历
          degree: this.userinfoData.Degree, //学位
          graduatedschool: this.userinfoData.GraduatedSchool, //最高学历毕业学校
          graduatedyear: this.userinfoData.GraduatedYear, //毕业年份
          occupied: this.userinfoData.Occupied, //从事本专业时间
          guid: this.guid
        };
      }else if(this.role == '科室负责人'){
        parems = {
          realname: this.userinfoData.RealName, //姓名
          sex: this.isFullAttend, //性别
          telphone: this.userinfoData.Telephone, //手机
          identityNo: this.userinfoData.IdentityNo, //身份证号
          positionid:this.userinfoData.PositionID,//职务
          titleid:this.userinfoData.TitleID,//专业技术职称
          jobdate: this.userinfoData.JobDate, //参加工作时间
          graduatedschool: this.userinfoData.GraduatedSchool, //最高学历毕业学校
          nation: this.userinfoData.Nation, //民族
          Email: this.userinfoData.Email, //邮箱
          politicalstatus: this.userinfoData.PoliticalStatus, //政治面貌
          pNo:this.userinfoData.PhysicianQualificationCertificateNo,//医师资格证号
          guid: this.guid
        };
      }
      this.$httpPost("info/updateUserInfo", parems, function(err, json) {
        if (json.status == 200) {
          that.$Toast("修改成功");
        }
      });
    },
    dataProcess(value) {
      return value == null ? "" : value == undefined ? "" : value;
    },
    //监听下拉选中的值
    onValuesChange(picker, values) {
      this.Picker=picker;
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
      switch (this.poputype){
        case 1:
          // this.userinfoData.Nation = values[0];
          this.selectNation = values[0];
          break;
        case 2:
          // this.userinfoData.PoliticalStatus = values[0];
          this.selectPoliticalStatus = values[0];
          break;
        case 3:
          // this.userinfoData.EducationType = values[0];
          this.selectEducationType = values[0];
          break;
        case 4:
          // this.userinfoData.GraduatedYear = values[0];
          this.selectGraduatedYear = values[0];
          break;
        case 5:
          // this.userinfoData.PositionName=values[0];
          this.selectPositionName = values[0];
          for(var i in this.positionlist){
            if(values[0]==this.positionlist[i].PositionName){
              this.userinfoData.PositionID=this.positionlist[i].PositionID;
            }
          }
          break;
        case 6:
          // this.userinfoData.TitleName=values[0];
          this.selectTitleName = values[0];
          for(var i in this.titleList){
            if(values[0]==this.titleList[i].TitleName){
              this.userinfoData.TitleID=this.titleList[i].TitleID;
            }
          }
          break;
      }
    },
    //显示下拉内容
    showNation(value) {
      //下拉数据展示前先清空数据，以免跟前面的数据叠加
      this.nationJson[0].values = [];
      //显示下拉框
      switch(value){
        case 1:
          this.nationJson[0].value=this.userinfoData.Nation;
          this.nationJson[0].values = ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族",
          "哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族",
          "布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族","乌孜别克族","俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族",
          "独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族"];
          this.poputype = 1;
        break;
        case 2:
          this.nationJson[0].value=this.userinfoData.PoliticalStatus;
          this.nationJson[0].values = ["群众", "团员", "党员"];
          this.poputype = 2;
        break;
        case 3:
          this.nationJson[0].value=this.userinfoData.EducationType;
          this.nationJson[0].values = ["科学型博士","专业型博士","科学型硕士","专业型硕士","本科"];
          this.poputype = 3;
        break;
        case 4:
        this.nationJson[0].value=this.userinfoData.GraduatedYear;
          // 毕业年份范围：2017-1980年
          var now = new Date();
          var n = now.getFullYear();
          for (var i = 0; i < 38; i++) {
            this.nationJson[0].values.push(n);
            n -= 1;
          }
          this.poputype = 4;
        break;
        case 5:
          this.nationJson[0].value=this.userinfoData.PositionName;
          for(var i in this.positionlist){
            this.nationJson[0].values.push(this.positionlist[i].PositionName);
          }
          this.poputype=5;
        break;
        case 6:
          this.nationJson[0].value=this.userinfoData.TitleName;
          for(var i in this.titleList){
            this.nationJson[0].values.push(this.titleList[i].TitleName);
          }
          this.poputype=6;
        break;
      }
      this.popupVisible = true;
    },
    //获取职务数据
    getPositionList(){
      var that=this;
      var parems = {
        page: 1,
        pageNum: 100000,
        guid: this.guid
      }
      this.$httpGet("info/jobpostionListInfo", parems, function(err, json) {
        if (json.status == 200) {
          that.positionlist=json.data.data;
        } else {
          that.$messagebox({
            title: "提示",
            message: json.msg,
            showCancelButton: true
          });
        }
      });
    },
    //获取专业技术职称数据
    getTitleList(){
      var that=this;
      var parems = {
        page: 1,
        pageNum: 100000,
        guid: this.guid
      }
      this.$httpGet("info/jobtileListInfo", parems, function(err, json) {
        if (json.status == 200) {
          that.titleList=json.data.data;
        } else {
          that.$messagebox({
            title: "提示",
            message: json.msg,
            showCancelButton: true
          });
        }
      });
    },
    handleChange: function(value) {
      if (this.pickerchangeValue == 1) {
        this.userinfoData.Birthday = this.$formatDate(
          new Date(value),
          "yyyy-MM-dd"
        );
      }
      if (this.pickerchangeValue == 2) {
        this.userinfoData.TitleDate = this.$formatDate(
          new Date(value),
          "yyyy-MM-dd"
        );
      }
      if (this.pickerchangeValue == 3) {
        this.userinfoData.JobDate = this.$formatDate(
          new Date(value),
          "yyyy-MM-dd"
        );
      }
      if (this.pickerchangeValue == 4) {
        this.userinfoData.Occupied = this.$formatDate(
          new Date(value),
          "yyyy-MM-dd"
        );
      }
    },
    open: function(picker, index) {
      switch (index) {
        case "birthday":
          this.dateValue = new Date(this.userinfoData.Birthday);
          this.pickerchangeValue = 1;
          break;
        case "titledate":
          this.dateValue = new Date(this.userinfoData.TitleDate);
          this.pickerchangeValue = 2;
          break;
        case "jobdate":
          this.dateValue = new Date(this.userinfoData.JobDate);
          this.pickerchangeValue = 3;
          break;
        case "occupied":
          this.dateValue = new Date(this.userinfoData.Occupied);
          this.pickerchangeValue = 4;
          break;
      }
      this.$refs[picker].open();
    },
    //点击确定
    oktype() {
      switch (this.poputype){
        case 1:
          this.userinfoData.Nation = this.selectNation;
          break;
        case 2:
          this.userinfoData.PoliticalStatus = this.selectPoliticalStatus;
          break;
        case 3:
          this.userinfoData.EducationType = this.selectEducationType;
          break;
        case 4:
          this.userinfoData.GraduatedYear = this.selectGraduatedYear;
          break;
        case 5:
          this.userinfoData.PositionName = this.selectPositionName;
          break;
        case 6:
          this.userinfoData.TitleName = this.selectTitleName;
          break;
      }
      this.popupVisible = false;
    },
    //点击取消
    cancelHide() {
      //隐藏下拉选项,默认设置第一项为选中项
      switch (this.poputype){
        case 1:
          // this.userinfoData.Nation = this.selectNation;
          if(this.userinfoData.Nation.length>1 || this.userinfoData.Nation !='null' || this.userinfoData.Nation !=undefined){
            this.Picker.setSlotValue(0, this.userinfoData.Nation);
          }else{
            this.Picker.setSlotValue(0, this.nationJson[0].values[0]);
          }
          break;
        case 2:
          // this.userinfoData.PoliticalStatus = this.selectPoliticalStatus;
          if(this.userinfoData.PoliticalStatus.length>1 || this.userinfoData.PoliticalStatus !='null' || this.userinfoData.PoliticalStatus !=undefined){
            this.Picker.setSlotValue(0, this.userinfoData.PoliticalStatus);
          }else{
            this.Picker.setSlotValue(0, this.nationJson[0].values[0]);
          }
          break;
        case 3:
          // this.userinfoData.EducationType = this.selectEducationType;
          if(this.userinfoData.PoliticalStatus.length>1 || this.userinfoData.PoliticalStatus !='null' || this.userinfoData.PoliticalStatus !=undefined){
            this.Picker.setSlotValue(0, this.userinfoData.PoliticalStatus);
          }else{
            this.Picker.setSlotValue(0, this.nationJson[0].values[0]);
          }
          break;
        case 4:
          // this.userinfoData.GraduatedYear = this.selectGraduatedYear;
          if(this.userinfoData.GraduatedYear.length>1 || this.userinfoData.GraduatedYear !='null' || this.userinfoData.GraduatedYear !=undefined){
            this.Picker.setSlotValue(0, this.userinfoData.GraduatedYear);
          }else{
            this.Picker.setSlotValue(0, this.nationJson[0].values[0]);
          }
          break;
        case 5:
          // this.userinfoData.PositionName = this.selectPositionName;
          if(this.userinfoData.PositionName.length>1 || this.userinfoData.PositionName !='null' || this.userinfoData.PositionName !=undefined){
            this.Picker.setSlotValue(0, this.userinfoData.PositionName);
          }else{
            this.Picker.setSlotValue(0, this.nationJson[0].values[0]);
          }
          break;
        case 6:
          // this.userinfoData.TitleName = this.selectTitleName;
          if(this.userinfoData.TitleName.length>1 || this.userinfoData.TitleName !='null' || this.userinfoData.TitleName !=undefined){
            this.Picker.setSlotValue(0, this.userinfoData.TitleName);
          }else{
            this.Picker.setSlotValue(0, this.nationJson[0].values[0]);
          }
          break;
      }
      this.popupVisible = false;
    },
    //剔除掉html字符
    removeHtml(str) {
      return str.replace(/[^\u4E00-\u9FA5a-zA-Z0-9_·\s]|(^\s*)|(\s*$)/g, "");
    },
    //邮箱验证
    isEmail: function(str) {
      if (str.length !== 0) {
        var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return reg.test(str);
      }
    },
    //手机号码验证
    isTelphone: function(str) {
      if (str.length !== 0) {
        var reg = /^1\d{10}$/;
        if (reg.test(str)) {
          return true;
        } else {
          return false;
        }
      }
    },
    //身份证号验证
    isidentityNo: function(str) {
      if (str.length !== 0) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(str);
      }
    },
    //姓名验证
    isrealName: function(str) {
      if (str.length !== 0) {
        var reg = /^[·0-9A-Za-z\u4e00-\u9fa5]{2,20}$/;
        return reg.test(str);
      }
    },
    //执业证编码验证
    ispracticeCode: function(str) {
      if (str.length !== 0) {
        var reg = /^[0-9]+$/;
        if (reg.test(str)) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};
</script>
<style scopted>
html,
body {
  background-color: #eee;
}
#editInfo .mint-cell-value input {
  text-align: right;
}
#editInfo .mint-cell:last-child {
  background-image: none;
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
}
#editInfo .stringB input {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#editInfo .picker-selected {
  font-weight: bold;
}
</style>


