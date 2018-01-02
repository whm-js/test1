<template>
    <div style="width:98%;margin:0 auto;border-radius:6px">
        <mt-header fixed title="个人资料" style="background-color:#37acd3;font-size:16px;">
            <router-link to="/index/userinfo" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button icon="" slot="right" @click="editValidator">保存</mt-button>
        </mt-header>

        <div style="height:45px;background-color:#eee">&nbsp;</div>
        <div style="text-align: center;background-color:white;;border-radius:6px 6px 0 0">
            <img src="../assets/userHeader.png" style="margin: 0 auto;" />
        </div>
        <div id="editInfo">
            <mt-field label="姓名" type="text" placeholder="请输入姓名" v-model="userinfoData.RealName"></mt-field>
            <mt-field label="性别" readonly="readonly" placeholder="" >
                <!--label for="1">
                    <input type="radio" id="nan" value="1" v-model="userinfoData.Sex" />
                男</label>
                <label for="0">
                    <input type="radio" id="nv" value="0" v-model="userinfoData.Sex" style="margin-left:15px;" />
                女</label-->
                <label style="margin-left:10px;">
                    <input type="radio" :checked="isFullAttend===1" name="attend-radio"
                           value="1" v-on:change="attendChange($event)"/>
                    男</label>
                  <label  style="margin-left:20px;">
                    <input type="radio" :checked="isFullAttend===0" name="attend-radio" value="0"
                           v-on:change="attendChange($event)"/>
                    女</label>
            </mt-field>
            <mt-field label="手机号码" type="tel" :attr="{ maxlength: 11 }" placeholder="请输入手机号码" v-model="userinfoData.Telephone"></mt-field>
            <mt-field label="身份证号" type="text" :attr="{ maxlength: 18 }" placeholder="请输入身份证号" v-model="userinfoData.IdentityNo"></mt-field>
            <div @click="open('datePicker')">
                <mt-field label="出生日期" readonly="readonly" disableClear placeholder="请输入出生日期" v-model="userinfoData.Birthday"></mt-field>
            </div>
            <mt-field class="stringB" label="最高学历毕业学校" type="text" placeholder="请输入最高学历毕业学校" v-model="userinfoData.GraduatedSchool"></mt-field>
            <div @click="showNation(3)">
                <mt-field label="学历类型"  readonly="readonly" disableClear placeholder="请输入学历" v-model="userinfoData.EducationType"></mt-field>
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

            <mt-popup v-model="popupVisible" position="bottom" style="width:100%;"> 
                <div class="picker-toolbar">  
                    <span class="mint-datetime-action mint-datetime-cancel" @click="cancelHide">取消</span>  
                    <span class="mint-datetime-action mint-datetime-confirm" @click="cancelHide">确定</span>  
                </div>
                <mt-picker :slots="nationJson" @change="onValuesChange"></mt-picker>
            </mt-popup>
            <mt-datetime-picker  
              ref="datePicker"  
              type="date"  
              :startDate="startDate"  
              :endDate="endDate"  
              v-model="dateValue"  
              @confirm="handleChange">  
            </mt-datetime-picker>
        </div>
    </div>
</template>
<script>
import {formatDate} from '../assets/js/date.js'
export default {
        name: '',
        components: {},
        created(){
        },
        activated(){
            //避免因为滑动，页面不显示在最顶部
            document.body.scrollTop=0;
            document.documentElement.scrollTop=0;
            this.guid=this.getGuid();
            //刷新／激活数据写在此处,每次打开页面请求最新的数据
            this.getUserInfo();
        },
        data(){ 
            return{
              guid:this.getGuid(),
              userinfoData : {
                  RealName:'',
                  Sex:'',
                  Telephone:'',
                  IdentityNo:'',
                  Birthday:'',
                  GraduatedSchool:'',
                  EducationType:'',
                  PracticeCode:'',
                  WorkPlace:'',
                  Profession:'',
                  GraduatedYear:'',
                  Nation:'',
                  PoliticalStatus:'',
                  Email:''
              },
              userinfoData_once:{},
              popupVisible:false,
              poputype:1,//默认1为民族，2为政治面貌，3为学历类型，4为年份
              maxlength:20,
              nationJson: [
                    {
                    flex: 1,
                    values: ['汉族','蒙古族','回族','藏族','维吾尔族','苗族','彝族','壮族','布依族','朝鲜族','满族','侗族','瑶族','白族','土家族',  
                        '哈尼族','哈萨克族','傣族','黎族','傈僳族','佤族','畲族','高山族','拉祜族','水族','东乡族','纳西族','景颇族','柯尔克孜族',  
                        '土族','达斡尔族','仫佬族','羌族','布朗族','撒拉族','毛南族','仡佬族','锡伯族','阿昌族','普米族','塔吉克族','怒族', '乌孜别克族',  
                        '俄罗斯族','鄂温克族','德昂族','保安族','裕固族','京族','塔塔尔族','独龙族','鄂伦春族','赫哲族','门巴族','珞巴族','基诺族'],
                    textAlign: 'center'
                    }
                ],
              dateValue: new Date(),  
              startDate: new Date('1900-01-01'),  
              endDate: new Date(),
              isFullAttend:1,
            }
        },
        methods: {
            attendChange(event){
                //性别点击事件
                var value=event.currentTarget.value;
                value=Number(value);
                this.isFullAttend=value;
            },
            getUserInfo(){
                var that=this;
                if(!this.guid){
                    this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
                        this.$router.push('/login');
                    });
                    return;
                }
                var parems={
                    userid:0,
                    guid:this.guid,
                    userrole:''
                }

                this.$httpGet('info/getUserinfobyrole', parems, function (err, json) {
                    if(json.status==200){
                        for(var i in json.data[0]){
                            json.data[0][i]=that.dataProcess(json.data[0][i]);
                        }
                        that.userinfoData= json.data[0];
                        that.userinfoData_once= json.data[0];

                        that.isFullAttend=json.data[0].Sex;
                    }else{
                        that.$messagebox({
                        title: '提示',
                        message: json.msg,
                        showCancelButton: true
                        });
                    }
                    
                });
            },
            editValidator(){
                var that=this;
                if(!this.guid){
                    this.$messagebox('温馨提示', '登录状态无效，请重新登录！').then(action => {
                        this.$router.push('/login');
                    });
                    return;
                }

                if(that.userinfoData.RealName.trim()==''){
                    this.$Toast('请输入姓名');
                    return;
                }
                if(!this.isrealName(that.userinfoData.RealName.trim())){
                    this.$Toast('请输入2-20位中英文、数字姓名！');
                    return;
                }
                if(that.userinfoData.Telephone.trim()==''){
                    this.$Toast('请输入手机号');
                    return;
                }
                if(that.userinfoData.Telephone.trim().length!==11 || !this.isTelphone(that.userinfoData.Telephone.trim())){
                    this.$Toast('请输入正确的手机号码！');
                    return;
                }
                if(that.userinfoData.IdentityNo.trim().length>=1){
                    if(!this.isidentityNo(that.userinfoData.IdentityNo.trim())){
                        this.$Toast('请输入正确的身份证号！');
                        return;
                    }
                }
                if(that.userinfoData.PracticeCode.trim().length>=1){
                    if(!this.ispracticeCode(that.userinfoData.PracticeCode.trim()) || that.userinfoData.PracticeCode.trim().length > 27){
                        this.$Toast('请输入正确的执业证编码！');
                        return;
                    }
                }
                if(that.userinfoData.GraduatedYear.length>=1){
                    if(!this.ispracticeCode(that.userinfoData.GraduatedYear.trim()) || that.userinfoData.GraduatedYear.trim().length !==4){
                        this.$Toast('请输入正确的毕业年份！');
                        return;
                    }
                }
                if(that.userinfoData.Email.trim().length>0){
                    if(!this.isEmail(that.userinfoData.Email)){
                        this.$Toast('请输入正确的邮箱地址！');
                        return;
                    }
                }
                this.edit();
            },
            edit(){
                var that=this;
                var parems={
                    realname:this.userinfoData.RealName,//姓名
                    sex:this.isFullAttend,//性别
                    telphone:this.userinfoData.Telephone,//手机
                    identityNo:this.userinfoData.IdentityNo,//身份证号
                    graduatedschool:this.userinfoData.GraduatedSchool,//最高学历毕业学校
                    educationtype:this.userinfoData.EducationType,//学历类型
                    practicecode:this.userinfoData.PracticeCode,//执业证编号
                    Email:this.userinfoData.Email,//邮箱
                    politicalstatus:this.userinfoData.PoliticalStatus,//政治面貌
                    workplace:this.userinfoData.WorkPlace,//工作单位
                    profession:this.userinfoData.Profession,//毕业专业
                    graduatedyear:this.userinfoData.GraduatedYear,//毕业年份
                    birthday:this.userinfoData.Birthday,//出生日期
                    nation:this.userinfoData.Nation,//民族
                    guid:this.guid
                };
                this.$httpPost('info/updateUserInfo', parems, function (err, json) {
                    if(json.status==200){
                        that.$Toast('修改成功');
                    }
                });
            },
            dataProcess(value){
                return value==null?'':value==undefined?'':value;
            },
            onValuesChange(picker, values) {
                if (values[0] > values[1]) {
                    picker.setSlotValue(1, values[0]);
                }
                if(this.poputype==1){
                    this.userinfoData.Nation=values[0];
                }else if(this.poputype==2){
                    this.userinfoData.PoliticalStatus=values[0];
                }else if(this.poputype==3){
                    this.userinfoData.EducationType=values[0];
                }else if(this.poputype==4){
                    this.userinfoData.GraduatedYear=values[0];
                }
                
            },
            showNation(value){
                //下拉数据展示前先清空数据，以免跟前面的数据叠加
                this.nationJson[0].values=[];
                //显示下拉框
                if(value==2){
                    this.nationJson[0].values=['群众','团员','党员'];
                    this.poputype=2;
                }else if(value==3){
                    this.nationJson[0].values=['科学型博士','专业型博士','科学型硕士','专业型硕士','本科'];
                    this.poputype=3;
                }else if(value==4){
                    //毕业年份范围：2017-1980年
                    var n=new Date().getFullYear();
                    for (var i = 0; i < 38; i++) {
                        this.nationJson[0].values.push(n);
                        n -= 1;
                    }

                    //this.nationJson[0].values=['2017','2016','2015','2014','2013'];
                    this.poputype=4;
                }else{
                    this.nationJson[0].values=['汉族','蒙古族','回族','藏族','维吾尔族','苗族','彝族','壮族','布依族','朝鲜族','满族','侗族','瑶族','白族','土家族',  
                        '哈尼族','哈萨克族','傣族','黎族','傈僳族','佤族','畲族','高山族','拉祜族','水族','东乡族','纳西族','景颇族','柯尔克孜族',  
                        '土族','达斡尔族','仫佬族','羌族','布朗族','撒拉族','毛南族','仡佬族','锡伯族','阿昌族','普米族','塔吉克族','怒族', '乌孜别克族',  
                        '俄罗斯族','鄂温克族','德昂族','保安族','裕固族','京族','塔塔尔族','独龙族','鄂伦春族','赫哲族','门巴族','珞巴族','基诺族']
                    this.poputype=1;
                }
                this.popupVisible=true;

            },
            cancelHide(){
                //隐藏民族选项
                this.popupVisible=false;
            },
            handleChange: function (value) {  
                this.userinfoData.Birthday = formatDate(value,'yyyy-MM-dd');//window.moment(value).format('YYYY-MM-DD');
            },
            open: function (picker) {  
                this.dateValue = this.userinfoData.Birthday;
                this.$refs[picker].open();  
            },
            //剔除掉html字符
            removeHtml(str){
                return str.replace(/[^\u4E00-\u9FA5a-zA-Z0-9_·\s]|(^\s*)|(\s*$)/g,'');
            },
            //邮箱验证
            isEmail:function (str) {
                if(str.length!==0){
                    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                    return reg.test(str);
                }
            },
            //手机号码验证
            isTelphone:function (str) {
                if(str.length!==0){
                    var reg=/^1\d{10}$/;
                    if(reg.test(str)){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            //身份证号验证
            isidentityNo:function (str) {
                if(str.length!==0){
                    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                    return reg.test(str);
                }
            },
            //姓名验证
            isrealName:function (str) {
                if(str.length!==0){
                    var reg = /^[·0-9A-Za-z\u4e00-\u9fa5]{2,20}$/;
                    return reg.test(str);
                }
            },
            //执业证编码验证
            ispracticeCode:function (str){
                if(str.length!==0){
                    var reg=/^[0-9]+$/;
                    if((reg.test(str))){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        }
}
</script>
<style scopted>
html,body{background-color: #eee;}
#editInfo .mint-cell-value input{
    text-align: right;
}
#editInfo .mint-cell:last-child {
    background-image:none;
    background-size:100% 1px;
    background-repeat:no-repeat;
    background-position:bottom;
}
#editInfo .stringB input{
    display: inline-block;
    overflow: hidden;        
    white-space: nowrap;
    text-overflow:ellipsis;
}
#editInfo .picker-selected{
    font-weight: bold;
}
</style>


