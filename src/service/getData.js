
import fetch from '@/config/fetch'

/**
 * 登录
 */

export const userLogin = (username,password) => fetch('login',{
    username:username,
    password:password
},'post');

export const getUserInfo = (userid,guid,userrole) => fetch('info/getUserinfobyrole',{
    userid:userid,
    guid:guid,
    userrole:userrole
});

export const getDepartTeacherArr = (departmentID,guid,planStartDate) => fetch('entry/getDepartTeacher',{
    departmentID:departmentID,
    guid:guid,
    planStartDate:planStartDate
},'post');