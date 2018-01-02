/**
 * Created by Administrator on 2017/12/6.
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
  count:1,
  isSelect:-1,
  reloadMainpage:'',
  UserID:'007',
  AppID: 1111,
  guid:'',
  UserExitData:{},
  planData:[],
  handbooktable:{},
  handbookdetail:{},
  detaildata:{}
}

const mutations={
  add(state){
    state.count+=1;
  },
  updataisSelect(state,isSelect){
    state.isSelect=isSelect;
  },
  updatareloadMainpage(state,reloadMainpage){
    state.reloadMainpage=reloadMainpage;
  },
  reduce(state){
    state.count-=1;
  },
  updataAppID(state,AppID){
    state.AppID=AppID;
  },
  updataguid(state,guid){
    state.guid=guid;
  },
  updataUserExitData(state,UserExitData){
    state.UserExitData=UserExitData;
  },
  updataPlanData(state,planData){
    state.planData=planData;
  },
  updatahandbooktable(state,handbooktable){
    state.handbooktable=handbooktable;
  },
  updatahandbookdetail(state,handbookdetail){
    state.handbookdetail=handbookdetail;
  },
  updatadetaildata(state,detaildata){
    state.detaildata=detaildata;
  }
}

const getters = {
  count:function(state){
    return state.count;
  },
  isSelect:function (state) {
    return state.isSelect;
  },
  reloadMainpage:function (state) {
    return state.reloadMainpage;
  },
  UserID:function(state){
    return state.UserID;
  },
  AppID:function(state){
    return state.AppID;
  },
  guid:function(state){
    return state.guid;
  },
  planData:function (state) {
    return state.planData;
  },
  handbooktable:function (state) {
    return state.handbooktable;
  },
  handbookdetail:function (state) {
    return state.handbookdetail;
  },
  detaildata:function (state) {
    return state.detaildata;
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters
});
