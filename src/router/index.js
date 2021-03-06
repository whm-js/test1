import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import teacher_index from '@/components/teacher_index'
import secretary_index from '@/components/secretary_index'

import teacher_userinfo from '@/components/userinfo' //个人中心
import teacher_exit from '@/components/teacher_exit' 
import teacher_details from '@/components/teacher_details' 

import secretary_userinfo from '@/components/userinfo' //个人中心
import secretary_exit from '@/components/secretary_exit' 
import secretary_enter from '@/components/secretary_enter' 
import login from '@/components/login'

import student_attendance from '@/components/student_attendance'  //学员考勤录入
import student_evaluate from '@/components/student_evaluate'  //学员评价教师
import student_summary from '@/components/student_summary'  //学员小结
import secretary_enterpage from '@/components/secretary_enterpage'  //出科审核
import secretary_exitpage from '@/components/secretary_exitpage'  //出科审核
import exitInfo from '@/components/exitInfo'//出科详情
import exitInfo_evalute from '@/components/exitInfo_evaluate'//出科详情-评价带教老师
import exitInfo_summary from '@/components/exitInfo_summary'//出科详情-小结

import userinfo from '@/components/userinfo' //个人中心
import rotate_department from '@/components/rotate_department'//轮转科室
import rotate_plan from '@/components/rotate_plan'
import about from '@/components/about' //关于我们
import handbook_detail from '@/components/handbook_detail'
import userinfoEdit from '@/components/userinfoEdit' //个人资料-修改
import handbook_mainpage from '@/components/handbook_mainpage'
import handbook_input from '@/components/handbook_input'
import customer_service from '@/components/customer_service' //客服中心

import updatePWD from '@/components/updatePWD' //修改密码

/*
*教师端出科：填写评语、评价学员
*/
import teacher_attendance from '@/components/teacher_attendance'  //学员考勤录入
import teacher_evaluate from '@/components/teacher_evaluate'  //评价学员
import teacher_summary from '@/components/teacher_summary'  //出科评语

import eleupload from '@/components/eleupload' 

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children:[{
        path:'/index/rotate_department/',
        name:'rotate_department',
        component:rotate_department
      },{
        path: '/index/userinfo/',
        name: 'userinfo',
        component: userinfo
      },{
        path: '/index/rotate_plan/',
        name: 'rotate_plan',
        component: rotate_plan
      }]
    },{
      path: '/teacher_index',
      name: 'teacher_index',
      component: teacher_index,
      children:[{
        path:'/teacher_index/teacher_exit/',
        name:'teacher_exit',
        component:teacher_exit
      },{
        path: '/teacher_index/userinfo/',
        name: 'teacher_userinfo',
        component: teacher_userinfo
      },{
        path: '/teacher_index/teacher_details/',
        name: 'teacher_details',
        component: teacher_details
      }]
    },{
      path: '/secretary_index',
      name: 'secretary_index',
      component: secretary_index,
      children:[{
        path:'/secretary_index/secretary_exit/',
        name:'secretary_exit',
        component:secretary_exit
      },{
        path: '/secretary_index/userinfo/',
        name: 'secretary_userinfo',
        component: secretary_userinfo
      },{
        path: '/secretary_index/secretary_enter/',
        name: 'secretary_enter',
        component: secretary_enter
      }]
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/exitInfo',
      name: 'exitInfo',
      component: exitInfo
    },{
      path: '/exitInfo_evalute',
      name: 'exitInfo_evalute',
      component: exitInfo_evalute
    },{
      path: '/exitInfo_summary',
      name: 'exitInfo_summary',
      component: exitInfo_summary
    },{
      path: '/handbook_detail',
      name: 'handbook_detail',
      component: handbook_detail
    },{
      path: '/userinfoEdit',
      name: 'userinfoEdit',
      component: userinfoEdit
    },{
      path: '/handbook_mainpage',
      name: 'handbook_mainpage',
      component:handbook_mainpage
    },{
      path: '/handbook_input',
      name: 'handbook_input',
      component:handbook_input
    },{
      path: '/about',
      name: 'about',
      component: about
    },{
      path: '/customer_service',
      name: 'customer_service',
      component: customer_service
    },{
      path: '/updatePWD',
      name: 'updatePWD',
      component: updatePWD
    },{
      path: '/student_attendance',
      name: 'student_attendance',
      component: student_attendance
    },{
      path: '/student_evaluate',
      name: 'student_evaluate',
      component: student_evaluate
    },{
      path: '/student_summary',
      name: 'student_summary',
      component: student_summary
    },{
      path: '/secretary_enterpage',
      name: 'secretary_enterpage',
      component: secretary_enterpage
    },{
      path: '/secretary_exitpage',
      name: 'secretary_exitpage',
      component: secretary_exitpage
    },{
      path: '/teacher_attendance',
      name: 'teacher_attendance',
      component: teacher_attendance
    },{
      path: '/teacher_evaluate',
      name: 'teacher_evaluate',
      component: teacher_evaluate
    },{
      path: '/teacher_summary',
      name: 'teacher_summary',
      component: teacher_summary
    },
    {
      path: '/eleupload',
      name: 'eleupload',
      component: eleupload
    }
  ]
})
