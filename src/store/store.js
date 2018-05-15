/**
 * Created by Administrator on 2017/12/6.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './types'
Vue.use(Vuex);

const state = {
  count:1,
  indexSelected:'',
  teacher_indexSelected:'',
  secretary_indexSelected:'',
  isSelect:-1,
  reloadMainpage:'',
  UserID:'007',
  AppID: 1111,
  guid:'',
  UserExitData:{},
  planData:[],
  handbooktable:{},
  handbookdetail:{},
  detaildata:{},
  summaryInfo:JSON.parse(localStorage.getItem('summaryInfo')) || {},
  teacherComment:JSON.parse(localStorage.getItem('teacherComment')) || {}
}

const mutations={
  add(state){
    state.count+=1;
  },
  updataisSelect(state,isSelect){
    state.isSelect=isSelect;
  },
  updataindexSelected(state,indexSelected){
    state.indexSelected=indexSelected;
  },
  updatateacher_indexSelected(state,indexSelected){
    state.teacher_indexSelected=indexSelected;
  },
  updatasecretary_indexSelected(state,indexSelected){
    state.secretary_indexSelected=indexSelected;
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
  },
  [types.SET_SUMMARYINFO] (state, res) {
    state.summaryInfo = res
  },
  [types.SET_TEACHERCOMMENT] (state, res) {
    state.teacherComment = res
  }
}

const getters = {
  count:function(state){
    return state.count;
  },
  isSelect:function (state) {
    return state.isSelect;
  },
  indexSelected:function (state) {
    return state.indexSelected;
  },
  teacher_indexSelected:function (state) {
    return state.teacher_indexSelected;
  },
  secretary_indexSelected:function (state) {
    return state.secretary_indexSelected;
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
  },
  summaryInfo:function (state) {
    return state.summaryInfo;
  },
  teacherComment:function (state) {
    return state.teacherComment;
  }
}

const actions = {
  setsummaryInfo ({ commit }, res) {
    localStorage.setItem('summaryInfo', JSON.stringify(res))
    commit(types.SET_SUMMARYINFO, res)
  },
  setteacherComment ({ commit }, res) {
    localStorage.setItem('teacherComment', JSON.stringify(res))
    commit(types.SET_TEACHERCOMMENT, res)
  },
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
});
